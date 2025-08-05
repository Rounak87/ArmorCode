from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import subprocess
import json
import tempfile
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your pretrained model (.pkl path)
# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'rf_vuln_model.pkl')
model = joblib.load(model_path)

def extract_features_from_code(code_text):
    """Extract features from JavaScript code for ML model"""
    features = []
    
    # Basic code metrics
    features.append(len(code_text))  # Code length
    features.append(code_text.count('\n'))  # Number of lines
    features.append(len(code_text.split()))  # Number of words
    features.append(code_text.count('{'))  # Number of opening braces
    features.append(code_text.count('}'))  # Number of closing braces
    features.append(code_text.count('('))  # Number of opening parentheses
    features.append(code_text.count(')'))  # Number of closing parentheses
    features.append(code_text.count(';'))  # Number of semicolons
    features.append(code_text.count('='))  # Number of assignments
    features.append(code_text.count('function'))  # Number of function declarations
    features.append(code_text.count('var'))  # Number of var declarations
    features.append(code_text.count('let'))  # Number of let declarations
    features.append(code_text.count('const'))  # Number of const declarations
    features.append(code_text.count('if'))  # Number of if statements
    features.append(code_text.count('for'))  # Number of for loops
    features.append(code_text.count('while'))  # Number of while loops
    features.append(code_text.count('return'))  # Number of return statements
    features.append(code_text.count('try'))  # Number of try blocks
    features.append(code_text.count('catch'))  # Number of catch blocks
    features.append(code_text.count('throw'))  # Number of throw statements
    
    # Vulnerability indicators
    dangerous_patterns = [
        r'\beval\s*\(',
        r'\bdocument\.write\s*\(',
        r'\binnerHTML\s*=',
        r'\bouterHTML\s*=',
        r'\bsetTimeout\s*\(',
        r'\bsetInterval\s*\(',
        r'\bFunction\s*\(',
        r'\.call\s*\(',
        r'\.apply\s*\(',
        r'\$\{.*\}',  # Template literals
        r'javascript:',
        r'on\w+\s*=',  # Event handlers
        r'window\.',   # Window object access
        r'document\.',  # Document object access
        r'location\.',  # Location object access
    ]
    
    for pattern in dangerous_patterns:
        matches = len(re.findall(pattern, code_text, re.IGNORECASE))
        features.append(matches)
    
    return features

def calculate_enhanced_risk_score(features, ml_prediction, vulnerabilities):
    """Calculate enhanced risk score combining ML model, rule-based analysis, and heuristics"""
    
    # Get base ML score
    base_ml_score = float(ml_prediction) * 100
    
    # Rule-based vulnerability scoring
    vulnerability_score = 0
    high_risk_patterns = ['eval', 'Function', 'document.write', 'innerHTML', 'outerHTML']
    medium_risk_patterns = ['setTimeout', 'setInterval', 'javascript:', 'location.', 'window.']
    
    for vuln in vulnerabilities:
        rule_id = vuln.get('ruleId', '').lower()
        if any(pattern in rule_id for pattern in high_risk_patterns):
            vulnerability_score += 25
        elif any(pattern in rule_id for pattern in medium_risk_patterns):
            vulnerability_score += 15
        else:
            vulnerability_score += 10
    
    # Feature-based heuristic scoring
    heuristic_score = 0
    
    # Check for dangerous pattern counts from features (last 15 features are vulnerability indicators)
    danger_indicators = features[-15:]
    total_danger_patterns = sum(danger_indicators)
    
    if total_danger_patterns > 0:
        heuristic_score += min(total_danger_patterns * 20, 60)  # Cap at 60%
    
    # Code complexity indicators
    code_length = features[0]
    num_functions = features[9]
    
    if code_length > 500 and total_danger_patterns > 0:
        heuristic_score += 10  # Complex code with vulnerabilities is riskier
    
    # Combine scores with weights
    # Give more weight to rule-based and heuristic analysis since ML model seems undertrained
    final_score = (
        base_ml_score * 0.3 +          # 30% ML model
        vulnerability_score * 0.5 +    # 50% Rule-based
        heuristic_score * 0.2          # 20% Heuristics
    )
    
    # Ensure score is between 0-100
    final_score = min(max(final_score, 0), 100)
    
    return round(final_score, 1)

def run_eslint_analysis(code_text):
    """Run ESLint analysis on JavaScript code"""
    vulnerabilities = []
    lines = code_text.split('\n')
    
    # Define vulnerability patterns with their descriptions and severity
    vuln_patterns = {
        # High severity patterns
        r'\beval\s*\(': {
            "message": "Use of eval() is extremely dangerous and can lead to code injection attacks",
            "severity": "error",
            "risk_weight": 30
        },
        r'\bFunction\s*\(': {
            "message": "Function constructor can be dangerous like eval() and should be avoided",
            "severity": "error", 
            "risk_weight": 25
        },
        r'\bdocument\.write\s*\(': {
            "message": "document.write() can be vulnerable to XSS attacks and is deprecated",
            "severity": "error",
            "risk_weight": 20
        },
        r'\binnerHTML\s*=': {
            "message": "innerHTML assignment can be vulnerable to XSS attacks if user input is not sanitized",
            "severity": "error",
            "risk_weight": 20
        },
        r'\bouterHTML\s*=': {
            "message": "outerHTML assignment can be vulnerable to XSS attacks",
            "severity": "error",
            "risk_weight": 20
        },
        r'javascript:': {
            "message": "javascript: URLs can be vulnerable to XSS and should be avoided",
            "severity": "error",
            "risk_weight": 25
        },
        
        # Medium severity patterns
        r'\bsetTimeout\s*\(\s*["\']': {
            "message": "setTimeout with string argument can be vulnerable to code injection",
            "severity": "warning",
            "risk_weight": 15
        },
        r'\bsetInterval\s*\(\s*["\']': {
            "message": "setInterval with string argument can be vulnerable to code injection", 
            "severity": "warning",
            "risk_weight": 15
        },
        r'location\s*\.\s*href\s*=': {
            "message": "Direct location.href assignment with user input can lead to open redirect",
            "severity": "warning", 
            "risk_weight": 15
        },
        r'window\s*\.\s*location': {
            "message": "Direct window.location manipulation can be dangerous with user input",
            "severity": "warning",
            "risk_weight": 15
        },
        r'on\w+\s*=\s*["\'][^"\']*["\']': {
            "message": "Inline event handlers can be vulnerable to XSS if containing dynamic content",
            "severity": "warning",
            "risk_weight": 12
        },
        
        # Additional dangerous patterns
        r'\.call\s*\(': {
            "message": "Function.call() usage should be reviewed for potential security issues",
            "severity": "info",
            "risk_weight": 8
        },
        r'\.apply\s*\(': {
            "message": "Function.apply() usage should be reviewed for potential security issues", 
            "severity": "info",
            "risk_weight": 8
        },
        r'document\s*\.\s*cookie': {
            "message": "Direct cookie manipulation should be done carefully to avoid security issues",
            "severity": "warning",
            "risk_weight": 10
        },
        r'localStorage\s*\.\s*setItem': {
            "message": "Storing sensitive data in localStorage can be a security risk",
            "severity": "info",
            "risk_weight": 5
        }
    }
    
    for line_num, line in enumerate(lines, 1):
        for pattern, info in vuln_patterns.items():
            if re.search(pattern, line, re.IGNORECASE):
                match = re.search(pattern, line, re.IGNORECASE)
                vulnerabilities.append({
                    "line": line_num,
                    "column": match.start() + 1 if match else 0,
                    "message": info["message"],
                    "ruleId": pattern.replace('\\b', '').replace('\\s*\\(', '').replace('\\', ''),
                    "severity": info["severity"],
                    "risk_weight": info["risk_weight"]
                })
    
    return vulnerabilities

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = data.get('features')
    if features is None:
        return jsonify({"error": "No features provided"}), 400
    risk_score = float(model.predict_proba([features])[0][1]) * 100  # Positive class probability
    return jsonify({'riskScore': risk_score})

@app.route('/analyze', methods=['POST'])
def analyze_code():
    """Analyze JavaScript code for vulnerabilities using both ESLint and ML model"""
    try:
        data = request.json
        if not data or 'code' not in data:
            return jsonify({"error": "No JavaScript code provided"}), 400
        
        js_code = data['code']
        
        # Run ESLint analysis
        eslint_results = run_eslint_analysis(js_code)
        
        # Extract features for ML model
        features = extract_features_from_code(js_code)
        
        # Get ML model prediction
        try:
            ml_prediction = model.predict_proba([features])[0][1]
        except Exception as e:
            # Fallback if ML model fails
            ml_prediction = 0.05  # Default low risk
        
        # Calculate enhanced risk score
        enhanced_risk_score = calculate_enhanced_risk_score(features, ml_prediction, eslint_results)
        
        # Format ESLint results for frontend
        vulnerabilities = []
        for issue in eslint_results:
            vulnerabilities.append({
                "line": issue.get("line", 0),
                "column": issue.get("column", 0),
                "message": issue.get("message", ""),
                "ruleId": issue.get("ruleId", ""),
                "severity": issue.get("severity", "warning")
            })
        
        # Calculate risk level
        if enhanced_risk_score >= 70:
            risk_level = "HIGH"
        elif enhanced_risk_score >= 40:
            risk_level = "MEDIUM"
        elif enhanced_risk_score >= 15:
            risk_level = "LOW"
        else:
            risk_level = "MINIMAL"
        
        return jsonify({
            'riskScore': enhanced_risk_score,
            'riskLevel': risk_level,
            'vulnerabilities': vulnerabilities,
            'eslintIssues': len(vulnerabilities),
            'features': features,
            'mlModelScore': float(ml_prediction) * 100,  # Show original ML score for comparison
            'analysisMethod': 'Enhanced (ML + Rules + Heuristics)'
        })
        
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000)
