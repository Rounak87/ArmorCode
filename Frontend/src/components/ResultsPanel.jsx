import React from 'react';
import RiskAssessment from './RiskAssessment';
import VulnerabilityList from './VulnerabilityList';
import CodeMetrics from './CodeMetrics';

const ResultsPanel = ({ result }) => {
  if (!result) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-4 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        Security Analysis Results
      </h2>

      <RiskAssessment result={result} />
      <VulnerabilityList result={result} />
      <CodeMetrics result={result} />

      {result.error && (
        <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 text-red-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Analysis Error: {result.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
