import React from 'react';

const CodeInput = ({ code, setCode, onSubmit, loading }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-lg font-semibold text-white mb-3">
            JavaScript Code Analysis
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            placeholder="function example(userInput) {
  return userInput;
}"
            className="w-full bg-slate-900/50 border border-gray-600 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 font-mono text-sm backdrop-blur-sm resize-none"
            required
          />
          <div className="absolute top-2 right-4 text-xs text-gray-400 bg-slate-800/80 px-2 py-1 rounded">
            JavaScript
          </div>
        </div>
        
        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform ${
            loading 
              ? 'opacity-70 cursor-not-allowed scale-95' 
              : 'hover:scale-105 hover:shadow-xl hover:from-blue-500 hover:to-purple-500'
          } relative overflow-hidden`}
          disabled={loading}
        >
          {loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 animate-pulse"></div>
          )}
          <div className="relative flex items-center justify-center space-x-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing with AI...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Analyze Code Security</span>
              </>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default CodeInput;
