import React, { useState } from 'react';
import {
  calculateAVDInfrastructureCost,
  calculateCurrentStateCost,
  calculateTCO,
  formatCurrency,
  formatPercentage
} from '../utils/business-case/cost-calculator';

export default function CostCalculatorTest() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runTest = () => {
    try {
      // Test 1: Calculate AVD Infrastructure Cost
      const avdCost = calculateAVDInfrastructureCost({
        userCount: 1000,
        userProfile: 'medium',
        storageType: 'premiumSSD',
        storagePerUserGB: 100,
        includeNerdio: true
      });

      // Test 2: Calculate Current State Cost (Citrix)
      const currentCost = calculateCurrentStateCost({
        platform: 'citrix',
        userCount: 1000,
        serverCount: 15
      });

      // Test 3: Calculate TCO
      const tcoAnalysis = calculateTCO(currentCost, avdCost, 3);

      setResults({
        avdCost,
        currentCost,
        tcoAnalysis
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">
        Cost Calculator Test
      </h2>

      <button
        onClick={runTest}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold mb-6"
      >
        Run Cost Calculations
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* AVD Infrastructure Costs */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              AVD Infrastructure Costs (Future State)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">VMs Needed</p>
                <p className="text-lg font-semibold">{results.avdCost.infrastructure.vms.count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">VM SKU</p>
                <p className="text-lg font-semibold">{results.avdCost.infrastructure.vms.sku}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly VM Cost</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(results.avdCost.infrastructure.vms.monthlyCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage (GB)</p>
                <p className="text-lg font-semibold">{results.avdCost.infrastructure.storage.totalGB}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Auto-Scaling Savings</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.avdCost.infrastructure.autoScaling.monthlySavings)}/mo
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nerdio Cost</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.avdCost.software.nerdioManager.monthlyCost)}/mo
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Monthly Cost:</span>
                <span className="text-2xl font-bold text-purple-600">
                  {formatCurrency(results.avdCost.totals.monthlyNet)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Per User/Month:</span>
                <span className="text-lg font-semibold text-gray-700">
                  {formatCurrency(results.avdCost.totals.perUserMonthly)}
                </span>
              </div>
            </div>
          </div>

          {/* Current State Costs */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Current State Costs (Citrix)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="text-lg font-semibold capitalize">{results.currentCost.platform}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(results.currentCost.costs.monthly)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Cost</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(results.currentCost.costs.annual)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Per User/Month</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(results.currentCost.costs.perUserMonthly)}
                </p>
              </div>
            </div>
          </div>

          {/* TCO Analysis */}
          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              3-Year TCO Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current State (3 years):</span>
                <span className="text-lg font-semibold text-red-600">
                  {formatCurrency(results.tcoAnalysis.currentState.totalCost)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Future State with Nerdio (3 years):</span>
                <span className="text-lg font-semibold text-blue-600">
                  {formatCurrency(results.tcoAnalysis.futureState.totalCost)}
                </span>
              </div>
              <div className="pt-3 border-t border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Savings:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.tcoAnalysis.savings.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium">Savings Percentage:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatPercentage(results.tcoAnalysis.savings.percentage)}
                  </span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded border border-green-300">
                <p className="text-sm font-semibold text-gray-700">
                  💡 Recommendation:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {results.tcoAnalysis.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
