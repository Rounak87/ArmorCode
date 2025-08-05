const express = require('express');
const cors = require('cors');
const { ESLint } = require('eslint');
const { analyzeModule } = require('typhonjs-escomplex');

// For Node.js v18+, global fetch exists. Otherwise, fallback to node-fetch
let fetch = global.fetch;
if (!fetch) fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Extract feature vector from raw JS code using escomplex
function extractFeaturesFromCode(code) {
  const result = analyzeModule(code);
  const metrics = result.aggregate;

  // Map metrics to array in order expected by your ML model
  // Adjust or extend this list to match your actual model features exactly
  return [
    metrics.cyclomatic || 0,
    metrics.halstead.difficulty || 0,
    metrics.halstead.volume || 0,
    metrics.halstead.effort || 0,
    metrics.halstead.bugs || 0,
    metrics.halstead.time || 0,
    metrics.loc.physical || 0,
    metrics.sloc.physical || 0,
    metrics.params || 0,
    // Add any missing features your model needs here
  ];
}

// Call the ML API passing extracted features, get risk score
async function getMLRiskScore(features) {
  try {
    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
    });
    const data = await res.json();
    return data.riskScore || null;
  } catch (err) {
    console.error('ML API error:', err);
    return null;
  }
}

app.post('/analyze', async (req, res) => {
  const userCode = req.body.code;

  try {
    // Run ESLint analysis
    const eslint = new ESLint();
    const results = await eslint.lintText(userCode, { filePath: 'input.js' });
    const findings = [];
    for (const result of results) {
      for (const msg of result.messages) {
        findings.push({
          line: msg.line,
          message: msg.message,
          rule: msg.ruleId,
          severity: msg.severity,
        });
      }
    }

    // Extract features for ML model
    const features = extractFeaturesFromCode(userCode);

    // Get ML risk score prediction
    const mlRiskScore = await getMLRiskScore(features);

    // Send combined results
    res.json({ eslintFindings: findings, mlRiskScore });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});
