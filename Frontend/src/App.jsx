import React, { useState } from 'react';

export default function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulate backend analysis for now
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult({
        eslintFindings: [
          {
            line: 3,
            message: 'Avoid using eval()',
            rule: 'no-eval'
          },
          {
            line: 5,
            message: 'Unsanitized input detected',
            rule: 'no-unsanitized'
          }
        ],
        mlRiskScore: 87.5
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6 mt-12">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">JS Vulnerability Analyzer</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={12}
            placeholder="Paste your JavaScript or React code here"
            className="border border-blue-200 rounded px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white font-semibold px-4 py-2 rounded ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-teal-700">Analysis Results</h2>
            <div className="bg-gray-100 rounded px-4 py-3 mb-4">
              <h3 className="font-medium mb-1">ESLint Findings:</h3>
              {result.eslintFindings.length === 0 ? (
                <p className="text-green-600">No security issues detected 🚀</p>
              ) : (
                <ul className="list-disc ml-6 text-red-600">
                  {result.eslintFindings.map((finding, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">Line {finding.line}: </span>
                      {finding.message} <span className="italic text-gray-600">({finding.rule})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-gray-100 rounded px-4 py-3">
              <h3 className="font-medium mb-1">ML Model Risk Score:</h3>
              <span
                className={`font-bold ${
                  result.mlRiskScore >= 80
                    ? 'text-red-700'
                    : result.mlRiskScore >= 40
                    ? 'text-yellow-600'
                    : 'text-green-700'
                }`}
              >
                {result.mlRiskScore}% vulnerable risk
              </span>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} JS Vulnerability Analyzer Demo
      </footer>
    </div>
  );
}
