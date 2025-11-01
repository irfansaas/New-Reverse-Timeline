import * as XLSX from 'xlsx';
import { formatCurrency, formatPercentage } from '../business-case/cost-calculator';

/**
 * Generate comprehensive Excel workbook from business case calculations
 */
export function generateBusinessCaseExcel(calculations) {
  const { customerProfile, currentState, futureState, tcoAnalysis, roiAnalysis, implementationCost } = calculations;
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Sheet 1: Executive Summary
  const summarySheet = createExecutiveSummarySheet(calculations);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');
  
  // Sheet 2: Current State Costs
  const currentStateSheet = createCurrentStateSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, currentStateSheet, 'Current State');
  
  // Sheet 3: Future State Costs
  const futureStateSheet = createFutureStateSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, futureStateSheet, 'Future State');
  
  // Sheet 4: 3-Year Analysis
  const threeYearSheet = createThreeYearAnalysisSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, threeYearSheet, '3-Year Analysis');
  
  // Sheet 5: ROI Calculations
  const roiSheet = createROISheet(calculations);
  XLSX.utils.book_append_sheet(workbook, roiSheet, 'ROI Metrics');
  
  // Sheet 6: Value Breakdown
  const valueSheet = createValueBreakdownSheet(calculations);
  XLSX.utils.book_append_sheet(workbook, valueSheet, 'Value Breakdown');
  
  return workbook;
}

/**
 * Sheet 1: Executive Summary
 */
function createExecutiveSummarySheet(calculations) {
  const { customerProfile, tcoAnalysis, roiAnalysis, implementationCost } = calculations;
  
  const data = [
    ['BUSINESS CASE EXECUTIVE SUMMARY'],
    [''],
    ['Customer:', customerProfile.companyName],
    ['Date:', new Date().toLocaleDateString()],
    ['Total Users:', customerProfile.totalUsers],
    [''],
    ['KEY METRICS'],
    ['3-Year Total Savings:', tcoAnalysis.savings.total, formatCurrency(tcoAnalysis.savings.total)],
    ['Annual Savings:', tcoAnalysis.savings.annual, formatCurrency(tcoAnalysis.savings.annual)],
    ['Cost Reduction %:', tcoAnalysis.savings.percentage, formatPercentage(tcoAnalysis.savings.percentage)],
    [''],
    ['ROI METRICS'],
    ['Payback Period (months):', (roiAnalysis.investment.paybackPeriod.months || 0).toFixed(1)],
    ['Year 1 ROI:', (roiAnalysis.roi.year1 || 0).toFixed(1) + '%'],
    ['Year 2 ROI:', (roiAnalysis.roi.year2 || 0).toFixed(1) + '%'],
    ['Year 3 ROI:', (roiAnalysis.roi.year3 || 0).toFixed(1) + '%'],
    ['Net Present Value:', roiAnalysis.netPresentValue, formatCurrency(roiAnalysis.netPresentValue)],
    [''],
    ['INVESTMENT'],
    ['Implementation Cost:', implementationCost.totalCost, formatCurrency(implementationCost.totalCost)],
    ['Duration (weeks):', implementationCost.durationWeeks],
    [''],
    ['ANNUAL VALUE'],
    ['Infrastructure Savings:', roiAnalysis.annualValue.infrastructureSavings, formatCurrency(roiAnalysis.annualValue.infrastructureSavings)],
    ['Operational Savings:', roiAnalysis.annualValue.operationalSavings, formatCurrency(roiAnalysis.annualValue.operationalSavings)],
    ['Productivity Gains:', roiAnalysis.annualValue.productivityGains, formatCurrency(roiAnalysis.annualValue.productivityGains)],
    ['Security Value:', roiAnalysis.annualValue.securityValue, formatCurrency(roiAnalysis.annualValue.securityValue)],
    ['TOTAL ANNUAL VALUE:', roiAnalysis.annualValue.totalAnnual, formatCurrency(roiAnalysis.annualValue.totalAnnual)]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }];
  return ws;
}

/**
 * Sheet 2: Current State Costs
 */
function createCurrentStateSheet(calculations) {
  const { currentState, customerProfile } = calculations;
  
  const data = [
    ['CURRENT STATE COST ANALYSIS'],
    [''],
    ['Platform:', currentState.platform.toUpperCase()],
    ['Users:', customerProfile.totalUsers],
    [''],
    ['COST BREAKDOWN'],
    ['Category', 'Annual Cost', 'Monthly Cost', 'Per User/Month'],
    ['Infrastructure', currentState.costs.annual * 0.4, currentState.costs.annual * 0.4 / 12, currentState.costs.perUserMonthly * 0.4],
    ['Software Licenses', currentState.costs.annual * 0.35, currentState.costs.annual * 0.35 / 12, currentState.costs.perUserMonthly * 0.35],
    ['Operations', currentState.costs.annual * 0.25, currentState.costs.annual * 0.25 / 12, currentState.costs.perUserMonthly * 0.25],
    [''],
    ['TOTAL', currentState.costs.annual, currentState.costs.annual / 12, currentState.costs.perUserMonthly]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  return ws;
}

/**
 * Sheet 3: Future State Costs
 */
function createFutureStateSheet(calculations) {
  const { futureState, customerProfile } = calculations;
  
  const data = [
    ['FUTURE STATE COST ANALYSIS'],
    [''],
    ['Azure Virtual Desktop + Nerdio Manager for Enterprise'],
    ['Users:', customerProfile.totalUsers],
    [''],
    ['MONTHLY COSTS'],
    ['Category', 'Monthly Cost', 'Annual Cost', 'Per User/Month'],
    ['Azure Compute', futureState.costs.compute.monthly, futureState.costs.compute.monthly * 12, futureState.costs.compute.monthly / customerProfile.totalUsers],
    ['Azure Storage', futureState.costs.storage.monthly, futureState.costs.storage.monthly * 12, futureState.costs.storage.monthly / customerProfile.totalUsers],
    ['Azure Networking', futureState.costs.networking.monthly, futureState.costs.networking.monthly * 12, futureState.costs.networking.monthly / customerProfile.totalUsers],
    ['Microsoft Licenses', futureState.costs.licenses.monthly, futureState.costs.licenses.monthly * 12, futureState.costs.licenses.monthly / customerProfile.totalUsers],
    ['Nerdio Manager', futureState.costs.nerdio.monthly, futureState.costs.nerdio.monthly * 12, futureState.costs.nerdio.monthly / customerProfile.totalUsers],
    [''],
    ['SUBTOTAL', futureState.totals.monthlyGross, futureState.totals.annualGross, futureState.totals.monthlyGross / customerProfile.totalUsers],
    [''],
    ['NERDIO OPTIMIZATIONS'],
    ['Auto-Scaling', -futureState.costs.autoScalingSavings.monthly, -futureState.costs.autoScalingSavings.monthly * 12, -futureState.costs.autoScalingSavings.monthly / customerProfile.totalUsers],
    [''],
    ['TOTAL (Net)', futureState.totals.monthlyNet, futureState.totals.annualNet, futureState.totals.monthlyNet / customerProfile.totalUsers]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  return ws;
}

/**
 * Sheet 4: 3-Year Analysis
 */
function createThreeYearAnalysisSheet(calculations) {
  const { tcoAnalysis, currentState, futureState } = calculations;
  
  const data = [
    ['3-YEAR TOTAL COST OF OWNERSHIP ANALYSIS'],
    [''],
    ['ANNUAL COSTS'],
    ['Year', 'Current State', 'Future State', 'Annual Savings'],
    ['Year 1', currentState.costs.annual, futureState.totals.annualNet, tcoAnalysis.savings.annual],
    ['Year 2', currentState.costs.annual, futureState.totals.annualNet, tcoAnalysis.savings.annual],
    ['Year 3', currentState.costs.annual, futureState.totals.annualNet, tcoAnalysis.savings.annual],
    [''],
    ['TOTAL', tcoAnalysis.currentState.totalCost, tcoAnalysis.futureState.totalCost, tcoAnalysis.savings.total]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
  return ws;
}

/**
 * Sheet 5: ROI Metrics
 */
function createROISheet(calculations) {
  const { roiAnalysis, implementationCost } = calculations;
  
  const data = [
    ['ROI & INVESTMENT ANALYSIS'],
    [''],
    ['Implementation Cost:', implementationCost.totalCost],
    ['Payback Period:', (roiAnalysis.investment.paybackPeriod.months || 0).toFixed(1) + ' months'],
    [''],
    ['ROI BY YEAR'],
    ['Year 1:', (roiAnalysis.roi.year1 || 0).toFixed(1) + '%'],
    ['Year 2:', (roiAnalysis.roi.year2 || 0).toFixed(1) + '%'],
    ['Year 3:', (roiAnalysis.roi.year3 || 0).toFixed(1) + '%'],
    [''],
    ['Net Present Value:', roiAnalysis.netPresentValue]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 25 }];
  return ws;
}

/**
 * Sheet 6: Value Breakdown
 */
function createValueBreakdownSheet(calculations) {
  const { roiAnalysis } = calculations;
  
  const data = [
    ['ANNUAL VALUE BREAKDOWN'],
    [''],
    ['Category', 'Annual Value'],
    ['Infrastructure Savings', roiAnalysis.annualValue.infrastructureSavings],
    ['Operational Savings', roiAnalysis.annualValue.operationalSavings],
    ['Productivity Gains', roiAnalysis.annualValue.productivityGains],
    ['Security Value', roiAnalysis.annualValue.securityValue],
    [''],
    ['TOTAL', roiAnalysis.annualValue.totalAnnual]
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 20 }];
  return ws;
}

/**
 * Main export function
 */
export function exportBusinessCaseToExcel(calculations, filename) {
  const workbook = generateBusinessCaseExcel(calculations);
  const defaultFilename = filename || `${calculations.customerProfile.companyName.replace(/\s+/g, '_')}_Business_Case_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, defaultFilename);
}
