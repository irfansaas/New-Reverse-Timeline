import React, { useState } from 'react';
import {
  calculateComprehensiveROI,
  getImplementationCost,
  calculateCarbonFootprint
} from '../utils/business-case/roi-calculator';
import { formatCurrency, formatPercentage } from '../utils/business-case/cost-calculator';

export default function ROICalculatorTest() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runTest = () => {
    try {
      const userCount = 1000;
      const infrastructureSavings = 100000; // $100k annual infrastructure savings
      
      // Get implementation cost
      const implCost = getImplementationCost(userCount);
      
      // Calculate comprehensive ROI
      const roiAnalysis = calculateComprehensiveROI({
        userCount,
        infrastructureSavings,
        implementationCost: implCost.totalCost,
        timeHorizonYears: 3
      });

      // Calculate carbon footprint
      const carbonData = calculateCarbonFootprint({
        currentVMs: 150,
        optimizedVMs: 88,
        hoursRunning: 8760 // Full year
      });

      setResults({
        roiAnalysis,
        implCost,
        carbonData,
        userCount
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">
        Enhanced ROI Calculator Test
      </h2>

      <button
        onClick={runTest}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold mb-6"
      >
        Run Comprehensive ROI Analysis
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* ROI Summary */}
          <div className="border-2 border-green-500 bg-green-50 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              📊 ROI Summary
            </h3>
            <div className="bg-white rounded p-4 mb-4">
              <p className="text-gray-700">{results.roiAnalysis.summary}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Payback Period</p>
                <p className="text-3xl font-bold text-green-600">
                  {results.roiAnalysis.investment.paybackPeriod.months.toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">months</p>
              </div>
              <div className="bg-white rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Year 1 ROI</p>
                <p className="text-3xl font-bold text-blue-600">
                  {results.roiAnalysis.roi.year1.toFixed(0)}%
                </p>
              </div>
              <div className="bg-white rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">3-Year ROI</p>
                <p className="text-3xl font-bold text-purple-600">
                  {results.roiAnalysis.roi.year3.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Annual Value Breakdown */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              💰 Annual Value Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-medium">Infrastructure Savings</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(results.roiAnalysis.annualValue.infrastructureSavings)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-medium">Operational Savings</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(results.roiAnalysis.annualValue.operationalSavings)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="font-medium">Productivity Gains</span>
                <span className="text-lg font-bold text-purple-600">
                  {formatCurrency(results.roiAnalysis.annualValue.productivityGains)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="font-medium">Security & Compliance Value</span>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(results.roiAnalysis.annualValue.securityValue)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-green-50 rounded border-2 border-green-300">
                <span className="text-lg font-bold">Total Annual Value</span>
                <span className="text-2xl font-bold text-green-700">
                  {formatCurrency(results.roiAnalysis.annualValue.totalAnnual)}
                </span>
              </div>
            </div>
          </div>

          {/* Operational Savings Detail */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              ⚙️ Operational Efficiency Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Admin Time Savings</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.roiAnalysis.detailedBreakdown.operational.adminTimeSavings)}
                </p>
                <p className="text-xs text-gray-500">
                  {results.roiAnalysis.detailedBreakdown.operational.breakdown.adminHoursPerYear} hours/year
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Auto-Scaling Savings</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.roiAnalysis.detailedBreakdown.operational.autoScalingSavings)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Image Management Savings</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.roiAnalysis.detailedBreakdown.operational.imageManagementSavings)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Support Ticket Reduction</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.roiAnalysis.detailedBreakdown.operational.supportTicketSavings)}
                </p>
                <p className="text-xs text-gray-500">
                  {results.roiAnalysis.detailedBreakdown.operational.breakdown.supportTicketsReduced} tickets reduced
                </p>
              </div>
            </div>
          </div>

          {/* Productivity Gains Detail */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              📈 Business Productivity Impact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Faster Login Times</p>
                <p className="text-lg font-semibold text-purple-600">
                  {formatCurrency(results.roiAnalysis.detailedBreakdown.productivity.loginTimeSavings)}
                </p>
                <p className="text-xs text-gray-500">
                  {results.roiAnalysis.detailedBreakdown.productivity.breakdown.secondsSavedPerUserPerDay} seconds saved per user/day
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reduced Downtime</p>
                <p className="text-lg font-semibold text-purple-600">
                  {formatCurrency(results.roiAnalysis.detailedBreakdown.productivity.downtimeSavings)}
                </p>
                <p className="text-xs text-gray-500">
                  {results.roiAnalysis.detailedBreakdown.productivity.breakdown.downtimeHoursAvoided} hours avoided
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Performance Improvement Gains</p>
                <p className="text-lg font-semibold text-purple-600">
                  {formatCurrency(results.roiAnalysis.detailedBreakdown.productivity.performanceGain)}
                </p>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="border border-green-200 bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              🌱 Environmental Impact
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">CO₂ Reduction</p>
                <p className="text-2xl font-bold text-green-600">
                  {results.carbonData.reductionTons.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">tons/year</p>
              </div>
              <div className="bg-white rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Equivalent Trees</p>
                <p className="text-2xl font-bold text-green-600">
                  {results.carbonData.equivalentTrees}
                </p>
                <p className="text-xs text-gray-500">trees planted</p>
              </div>
              <div className="bg-white rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Equivalent Cars</p>
                <p className="text-2xl font-bold text-green-600">
                  {results.carbonData.equivalentCars}
                </p>
                <p className="text-xs text-gray-500">cars off road</p>
              </div>
              <div className="bg-white rounded p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Reduction</p>
                <p className="text-2xl font-bold text-green-600">
                  {results.carbonData.reductionPercent.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Details */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              🚀 Implementation Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Implementation Cost</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(results.implCost.totalCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="text-xl font-bold text-gray-800">
                  {results.implCost.durationWeeks} weeks
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PM Hours</p>
                <p className="text-lg font-semibold">{results.implCost.projectManagementHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Architect Hours</p>
                <p className="text-lg font-semibold">{results.implCost.architectHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Engineer Hours</p>
                <p className="text-lg font-semibold">{results.implCost.engineerHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Present Value (3yr)</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(results.roiAnalysis.netPresentValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
