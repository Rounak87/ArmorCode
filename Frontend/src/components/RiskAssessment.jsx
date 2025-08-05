import React from 'react';

const RiskAssessment = ({ result }) => {
  if (!result) return null;

  return (
    <div className={`rounded-2xl p-6 border-2 transition-all duration-700 transform hover:scale-[1.02] ${
      result.riskLevel === 'HIGH' ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-400/50' :
      result.riskLevel === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50' :
      result.riskLevel === 'LOW' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/50' :
      'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center ${
          result.riskLevel === 'HIGH' ? 'text-red-300' :
          result.riskLevel === 'MEDIUM' ? 'text-yellow-300' :
          result.riskLevel === 'LOW' ? 'text-blue-300' :
          'text-green-300'
        }`}>
          <div className="w-6 h-6 mr-3 rounded-full bg-current opacity-20"></div>
          AI Security Assessment
        </h3>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
          result.riskLevel === 'HIGH' ? 'bg-red-500/30 text-red-200' :
          result.riskLevel === 'MEDIUM' ? 'bg-yellow-500/30 text-yellow-200' :
          result.riskLevel === 'LOW' ? 'bg-blue-500/30 text-blue-200' :
          'bg-green-500/30 text-green-200'
        }`}>
          {result.riskLevel} RISK
        </span>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className={`text-4xl font-bold ${
          result.riskLevel === 'HIGH' ? 'text-red-300' :
          result.riskLevel === 'MEDIUM' ? 'text-yellow-300' :
          result.riskLevel === 'LOW' ? 'text-blue-300' :
          'text-green-300'
        }`}>
          {result.mlRiskScore !== null ? `${result.mlRiskScore}%` : 'N/A'}
        </div>
        <div className="flex-1">
          <div className="bg-gray-700/50 rounded-full h-4 overflow-hidden mb-2">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                result.riskLevel === 'HIGH' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                result.riskLevel === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                result.riskLevel === 'LOW' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(result.mlRiskScore || 0, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-300 text-sm">
            Model detected {result.eslintIssues} security {result.eslintIssues === 1 ? 'issue' : 'issues'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
