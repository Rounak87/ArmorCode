import React from 'react';

const CodeMetrics = ({ result }) => {
  if (!result || !result.features) return null;

  return (
    <div className="bg-slate-800/30 rounded-2xl p-6 border border-gray-600/30">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Code Analysis Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-300">{result.features[0]}</div>
          <div className="text-gray-400 text-sm">Characters</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-300">{result.features[1]}</div>
          <div className="text-gray-400 text-sm">Lines</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-300">{result.features[9]}</div>
          <div className="text-gray-400 text-sm">Functions</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-300">{result.features.slice(20).reduce((a, b) => a + b, 0)}</div>
          <div className="text-gray-400 text-sm">Risk Patterns</div>
        </div>
      </div>
    </div>
  );
};

export default CodeMetrics;
