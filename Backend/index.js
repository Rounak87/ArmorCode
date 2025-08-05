const express = require('express');
const cors = require('cors');
const { ESLint } = require('eslint');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.post('/analyze', async (req, res) => {
  const userCode = req.body.code;

  try {
    
    const eslint = new ESLint();

    const results = await eslint.lintText(userCode, { filePath: 'input.js' });

    const findings = [];
    for (const result of results) {
      for (const msg of result.messages) {
        findings.push({
          line: msg.line,
          message: msg.message,
          rule: msg.ruleId,
          severity: msg.severity
        });
      }
    }

    res.json({ eslintFindings: findings });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});
