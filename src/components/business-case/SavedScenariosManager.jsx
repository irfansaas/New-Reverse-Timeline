import React, { useState } from 'react';
import { Save, Trash2, Eye, Calendar, Users, DollarSign, TrendingUp, Copy, ArrowLeft } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/business-case/cost-calculator';

export default function SavedScenariosManager({ scenarios, onLoad, onDelete, onClose }) {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareScenarios, setCompareScenarios] = useState([]);

  const handleLoad = (scenario) => {
    onLoad(scenario.id);
    if (onClose) onClose();
  };

  const handleDelete = (scenarioId, scenarioName) => {
    if (window.confirm(`Are you sure you want to delete "${scenarioName}"?`)) {
      onDelete(scenarioId);
      if (selectedScenario?.id === scenarioId) {
        setSelectedScenario(null);
      }
    }
  };

  const toggleCompare = (scenario) => {
    if (compareScenarios.find(s => s.id === scenario.id)) {
      setCompareScenarios(compareScenarios.filter(s => s.id !== scenario.id));
    } else if (compareScenarios.length < 3) {
      setCompareScenarios([...compareScenarios, scenario]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (scenarios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Save size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Saved Scenarios</h3>
        <p className="text-gray-600 mb-4">
          Complete a business case analysis and click "Save Scenario" to save it for later.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create New Business Case
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2">
              Saved Scenarios
            </h2>
            <p className="text-gray-600">
              {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="flex gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareScenarios([]);
              }}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                compareMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Copy size={20} />
              {compareMode ? 'Exit Compare Mode' : 'Compare Scenarios'}
            </button>
          </div>
        </div>

        {compareMode && compareScenarios.length > 0 && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-purple-900">
                {compareScenarios.length} scenario{compareScenarios.length !== 1 ? 's' : ''} selected (max 3)
              </div>
              {compareScenarios.length >= 2 && (
                <button
                  onClick={() => {
                    document.getElementById('comparison-view')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  View Comparison Below ↓
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const calc = scenario.calculations;
          const isSelected = selectedScenario?.id === scenario.id;
          const isInCompare = compareScenarios.find(s => s.id === scenario.id);

          return (
            <div
              key={scenario.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 ring-2 ring-purple-200'
                  : isInCompare
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-gray-300'
              } ${compareMode ? '' : 'cursor-pointer'}`}
              onClick={() => !compareMode && setSelectedScenario(scenario)}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                <h3 className="font-bold text-lg mb-1 truncate">{scenario.name}</h3>
                <p className="text-sm text-purple-100 truncate">
                  {calc.customerProfile.companyName}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} />
                    <span className="text-sm">Users</span>
                  </div>
                  <span className="font-semibold">
                    {calc.customerProfile.totalUsers.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={16} />
                    <span className="text-sm">3Y Savings</span>
                  </div>
                  <span className={`font-semibold ${
                    calc.tcoAnalysis.savings.total > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(calc.tcoAnalysis.savings.total)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp size={16} />
                    <span className="text-sm">Year 1 ROI</span>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {calc.roiAnalysis.roi.year1.toFixed(0)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">Payback</span>
                  </div>
                  <span className="font-semibold">
                    {calc.roiAnalysis.investment.paybackPeriod.months.toFixed(1)}mo
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Saved: {formatDate(scenario.savedAt)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                {compareMode ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(scenario);
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold ${
                      isInCompare
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : compareScenarios.length >= 3
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    disabled={!isInCompare && compareScenarios.length >= 3}
                  >
                    <Copy size={16} />
                    {isInCompare ? 'Selected' : 'Select'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoad(scenario);
                      }}
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <Eye size={16} />
                      Load
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(scenario.id, scenario.name);
                      }}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison View */}
      {compareMode && compareScenarios.length >= 2 && (
        <div id="comparison-view" className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            📊 Scenario Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-700 sticky left-0 bg-white">Metric</th>
                  {compareScenarios.map((scenario) => (
                    <th key={scenario.id} className="text-left p-3 font-semibold text-purple-600 min-w-[200px]">
                      {scenario.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">Company</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3">
                      {scenario.calculations.customerProfile.companyName}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Users</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3">
                      {scenario.calculations.customerProfile.totalUsers.toLocaleString()}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">Current Platform</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3 uppercase">
                      {scenario.calculations.currentState.platform}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-gray-50">3-Year TCO Savings</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className={`p-3 font-semibold ${
                      scenario.calculations.tcoAnalysis.savings.total > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(scenario.calculations.tcoAnalysis.savings.total)}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">Savings %</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3 font-semibold">
                      {formatPercentage(scenario.calculations.tcoAnalysis.savings.percentage)}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Payback Period</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3 font-semibold">
                      {scenario.calculations.roiAnalysis.investment.paybackPeriod.months.toFixed(1)} months
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">Year 1 ROI</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3 font-semibold text-purple-600">
                      {scenario.calculations.roiAnalysis.roi.year1.toFixed(0)}%
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Total Annual Value</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3 font-semibold">
                      {formatCurrency(scenario.calculations.roiAnalysis.annualValue.totalAnnual)}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">Implementation Cost</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3">
                      {formatCurrency(scenario.calculations.implementationCost.totalCost)}
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-gray-50">Implementation Timeline</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3">
                      {scenario.calculations.implementationCost.durationWeeks} weeks
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-700 sticky left-0 bg-white">Net Present Value</td>
                  {compareScenarios.map((scenario) => (
                    <td key={scenario.id} className="p-3 font-semibold text-green-600">
                      {formatCurrency(scenario.calculations.roiAnalysis.netPresentValue)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
