import React, { useState } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ResultsPanel from './components/ResultsPanel';

export default function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }
      const data = await response.json();

      setResult({
        eslintFindings: data.vulnerabilities || [],
        mlRiskScore: data.riskScore || 0,
        riskLevel: data.riskLevel || 'MINIMAL',
        eslintIssues: data.eslintIssues || 0,
        features: data.features || [],
        mlModelScore: data.mlModelScore || 0,
        analysisMethod: data.analysisMethod || 'AI-Powered Analysis'
      });
    } catch (error) {
      setResult({
        eslintFindings: [],
        mlRiskScore: null,
        riskLevel: 'MINIMAL',
        eslintIssues: 0,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-bounce"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-bounce delay-75"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        <Header />
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Code Input */}
          <div className="space-y-4">
            <CodeInput 
              code={code} 
              setCode={setCode} 
              onSubmit={handleSubmit} 
              loading={loading} 
            />
            
            {/* Quick Examples */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="text-lg font-semibold text-white mb-3">📚 Quick Test Examples</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCode(`// Critical security vulnerabilities - Multiple attack vectors
function executeUserCode(input) {
  // Direct code execution - EXTREMELY DANGEROUS
  return eval(input);
}

function processUserData(data) {
  // XSS vulnerability - script injection
  document.write('<script>' + data + '</script>');
  
  // Dynamic function creation - code injection
  const userFunc = new Function(data);
  userFunc();
  
  // Unsafe innerHTML with scripts
  document.body.innerHTML = '<div>' + data + '</div>';
  
  // Command execution vulnerability
  setTimeout(data, 100);
}

// SQL injection style concatenation
const query = "SELECT * FROM users WHERE id = '" + userInput + "'";
eval("window." + userProperty + " = " + userValue);`)}
                  className="w-full text-left p-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <div className="text-red-300 font-medium text-sm">🔴 Medium Risk Example</div>
                  <div className="text-gray-400 text-xs">Multiple critical vulnerabilities</div>
                </button>
                
                <button
                  onClick={() => setCode(`// Medium risk security issues
function updatePageContent(userContent) {
  // XSS via innerHTML
  document.getElementById('content').innerHTML = userContent;
  
  // Unsafe timeout with string
  setTimeout("processData('" + userContent + "')", 1000);
  
  // Direct DOM manipulation without sanitization
  const div = document.createElement('div');
  div.innerHTML = userContent;
  document.body.appendChild(div);
  
  // Potential prototype pollution
  const config = {};
  config[userContent] = 'value';
  
  // Unsafe regex that could cause ReDoS
  const pattern = new RegExp(userContent);
  return pattern.test(someString);
}`)}
                  className="w-full text-left p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors"
                >
                  <div className="text-yellow-300 font-medium text-sm">🟡 Low Risk Example</div>
                  <div className="text-gray-400 text-xs">innerHTML, setTimeout vulnerabilities</div>
                </button>
                
                <button
                  onClick={() => setCode(`function secureFunction(input) {
  const sanitized = input.replace(/[<>"'&]/g, '');
  const element = document.getElementById('output');
  element.textContent = sanitized;
  return sanitized;
}`)}
                  className="w-full text-left p-2 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <div className="text-green-300 font-medium text-sm">🟢 Secure Example</div>
                  <div className="text-gray-400 text-xs">Proper input sanitization</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4">
            {result ? (
              <ResultsPanel result={result} />
            ) : (
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Ready for Analysis</h3>
                <p className="text-gray-400 mb-6">
                  Paste your JavaScript code in the editor and click "Analyze Code Security" to get instant AI-powered security insights.
                </p>
                <div className="text-sm text-gray-500">
                  <p>✨ Real-time vulnerability detection</p>
                  <p>🤖 AI-enhanced risk scoring</p>
                  <p>📊 Detailed code metrics</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-8 text-center">
        <div className="border-t border-gray-700/50 pt-8">
          <p className="text-gray-400 text-sm">
            &copy; 2025 ArmorCode AI - Advanced JavaScript Security Analysis Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
