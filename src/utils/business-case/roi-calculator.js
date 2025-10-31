/**
 * Nerdio Business Case - ROI Calculator with Value Metrics
 * 
 * This module calculates comprehensive ROI including:
 * - Infrastructure cost savings
 * - Operational efficiency gains
 * - Administrative time savings
 * - Business productivity improvements
 * - Security and compliance value
 * - Environmental impact
 * 
 * @module roi-calculator
 */

import valueMetrics from '../../data/nerdio-value-metrics.json';

/**
 * Calculate comprehensive ROI with all Nerdio value metrics
 * @param {Object} params - ROI calculation parameters
 * @param {number} params.userCount - Total number of users
 * @param {number} params.infrastructureSavings - Annual infrastructure cost savings
 * @param {number} params.implementationCost - One-time implementation cost
 * @param {Object} params.currentState - Current state information
 * @param {number} params.timeHorizonYears - Analysis period in years
 * @returns {Object} Comprehensive ROI analysis
 */
export function calculateComprehensiveROI(params) {
  const {
    userCount,
    infrastructureSavings,
    implementationCost,
    currentState = {},
    timeHorizonYears = 3
  } = params;

  // Calculate all value components
  const operationalSavings = calculateOperationalSavings(userCount);
  const productivityGains = calculateProductivityGains(userCount);
  const securityValue = calculateSecurityValue(userCount);
  const environmentalImpact = calculateEnvironmentalImpact(userCount);

  // Total annual value
  const totalAnnualValue = 
    infrastructureSavings +
    operationalSavings.totalAnnual +
    productivityGains.totalAnnual +
    securityValue.totalAnnual;

  // Calculate payback and ROI
  const paybackMonths = implementationCost / (totalAnnualValue / 12);
  const netPresentValue = calculateNPV(totalAnnualValue, implementationCost, timeHorizonYears);
  
  const roi = {
    year1: ((totalAnnualValue - implementationCost) / implementationCost) * 100,
    year3: ((totalAnnualValue * 3 - implementationCost) / implementationCost) * 100,
    year5: ((totalAnnualValue * 5 - implementationCost) / implementationCost) * 100
  };

  return {
    investment: {
      implementation: implementationCost,
      paybackPeriod: {
        months: paybackMonths,
        years: paybackMonths / 12
      }
    },
    annualValue: {
      infrastructureSavings,
      operationalSavings: operationalSavings.totalAnnual,
      productivityGains: productivityGains.totalAnnual,
      securityValue: securityValue.totalAnnual,
      totalAnnual: totalAnnualValue
    },
    detailedBreakdown: {
      operational: operationalSavings,
      productivity: productivityGains,
      security: securityValue,
      environmental: environmentalImpact
    },
    roi,
    netPresentValue,
    breakEven: {
      months: paybackMonths,
      quarterlySavings: calculateQuarterlySavings(totalAnnualValue, timeHorizonYears)
    },
    summary: generateROISummary(roi, paybackMonths, totalAnnualValue)
  };
}

/**
 * Calculate operational efficiency savings
 */
export function calculateOperationalSavings(userCount) {
  const ops = valueMetrics.operationalEfficiency;
  const admin = valueMetrics.administrativeSavings;
  const defaults = valueMetrics.calculationDefaults;

  // Determine admin count based on user count
  let adminCount = 1;
  if (userCount < 500) adminCount = 0.5;
  else if (userCount < 2000) adminCount = 1;
  else if (userCount < 5000) adminCount = 2;
  else adminCount = 3;

  // Administrative time savings
  const adminTimeSavings = 
    admin.reducedAdminTime.hoursPerWeekSaved * 
    defaults.workingWeeksPerYear * 
    defaults.averageAdminHourlyRate * 
    adminCount;

  // Auto-scaling management time savings
  const autoScalingSavings = 
    ops.autoScaling.timeSavingsHoursPerWeek * 
    defaults.workingWeeksPerYear * 
    defaults.averageAdminHourlyRate;

  // Image management time savings
  const imageManagementSavings = 
    ops.imageManagement.timeSavingsHoursPerWeek * 
    defaults.workingWeeksPerYear * 
    defaults.averageAdminHourlyRate;

  // Monitoring time savings
  const monitoringSavings = 
    ops.monitoring.timeSavingsHoursPerWeek * 
    defaults.workingWeeksPerYear * 
    defaults.averageAdminHourlyRate;

  // Support ticket reduction
  const supportTicketSavings = 
    (admin.reducedTier1Support.ticketReductionPercent / 100) *
    admin.reducedTier1Support.avgTicketsPerMonth *
    12 *
    admin.reducedTier1Support.costPerTicket;

  const totalAnnual = 
    adminTimeSavings +
    autoScalingSavings +
    imageManagementSavings +
    monitoringSavings +
    supportTicketSavings;

  return {
    adminTimeSavings,
    autoScalingSavings,
    imageManagementSavings,
    monitoringSavings,
    supportTicketSavings,
    totalAnnual,
    breakdown: {
      adminHoursPerYear: admin.reducedAdminTime.hoursPerWeekSaved * defaults.workingWeeksPerYear * adminCount,
      automationHoursPerYear: (ops.autoScaling.timeSavingsHoursPerWeek + ops.imageManagement.timeSavingsHoursPerWeek + ops.monitoring.timeSavingsHoursPerWeek) * defaults.workingWeeksPerYear,
      supportTicketsReduced: Math.round((admin.reducedTier1Support.ticketReductionPercent / 100) * admin.reducedTier1Support.avgTicketsPerMonth * 12)
    }
  };
}

/**
 * Calculate business productivity gains
 */
export function calculateProductivityGains(userCount) {
  const productivity = valueMetrics.businessProductivity;
  const defaults = valueMetrics.calculationDefaults;

  // Faster login times = productivity gain
  const loginTimeSavings = 
    (productivity.fasterLoginTimes.secondsSavedPerLogin / 3600) * // Convert to hours
    productivity.fasterLoginTimes.loginsPerUserPerDay *
    defaults.workingDaysPerYear *
    userCount *
    defaults.averageUserHourlyWage;

  // Reduced downtime value
  const downtimeSavings = productivity.reducedDowntime.annualSavings;

  // Performance improvement productivity gain
  const performanceGain = 
    userCount *
    defaults.averageUserHourlyWage *
    defaults.workingDaysPerYear *
    defaults.workingHoursPerDay *
    (productivity.improvedPerformance.productivityGainPercent / 100);

  const totalAnnual = loginTimeSavings + downtimeSavings + performanceGain;

  return {
    loginTimeSavings,
    downtimeSavings,
    performanceGain,
    totalAnnual,
    breakdown: {
      secondsSavedPerUserPerDay: productivity.fasterLoginTimes.secondsSavedPerLogin * productivity.fasterLoginTimes.loginsPerUserPerDay,
      hoursGainedPerUserPerYear: (productivity.fasterLoginTimes.secondsSavedPerLogin / 3600) * productivity.fasterLoginTimes.loginsPerUserPerDay * defaults.workingDaysPerYear,
      downtimeHoursAvoided: productivity.reducedDowntime.hoursDowntimeReduced
    }
  };
}

/**
 * Calculate security and compliance value
 */
export function calculateSecurityValue(userCount) {
  const security = valueMetrics.securityCompliance;

  // Automated compliance savings
  const complianceSavings = security.automatedCompliance.annualSavings;

  // Risk reduction value (conservative estimate)
  const riskReductionValue = 
    security.reducedSecurityRisk.potentialBreachCost *
    (security.reducedSecurityRisk.riskReductionPercent / 100) *
    0.1; // Only count 10% of risk reduction as tangible annual value

  const totalAnnual = complianceSavings + riskReductionValue;

  return {
    complianceSavings,
    riskReductionValue,
    totalAnnual,
    breakdown: {
      auditHoursSaved: security.automatedCompliance.hoursPerAudit * security.automatedCompliance.auditsPerYear * (security.automatedCompliance.auditTimeReductionPercent / 100),
      riskReductionPercent: security.reducedSecurityRisk.riskReductionPercent
    }
  };
}

/**
 * Calculate environmental impact
 */
export function calculateEnvironmentalImpact(userCount) {
  const env = valueMetrics.environmentalImpact;
  
  // Estimate VMs based on user count (rough calculation)
  const estimatedVMs = Math.ceil((userCount * 0.7) / 8); // 70% concurrency, 8 users per VM
  
  const co2Reduction = estimatedVMs * env.carbonFootprint.co2ReductionPerVMPerYear;
  const carbonCreditValue = co2Reduction * env.carbonFootprint.carbonCreditValue;

  return {
    co2ReductionTons: co2Reduction,
    carbonCreditValue,
    vmsOptimized: estimatedVMs,
    description: "Annual CO2 reduction from optimized resource usage"
  };
}

/**
 * Calculate Net Present Value (NPV)
 */
function calculateNPV(annualValue, implementationCost, years) {
  const discountRate = valueMetrics.calculationDefaults.discountRate;
  let npv = -implementationCost;

  for (let year = 1; year <= years; year++) {
    npv += annualValue / Math.pow(1 + discountRate, year);
  }

  return npv;
}

/**
 * Calculate quarterly savings breakdown
 */
function calculateQuarterlySavings(annualValue, years) {
  const quarterly = [];
  const quarterlyValue = annualValue / 4;

  for (let year = 0; year < years; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      quarterly.push({
        period: `Y${year + 1}Q${quarter}`,
        value: quarterlyValue,
        cumulative: quarterlyValue * ((year * 4) + quarter)
      });
    }
  }

  return quarterly;
}

/**
 * Generate ROI summary text
 */
function generateROISummary(roi, paybackMonths, annualValue) {
  let summary = '';

  if (paybackMonths < 12) {
    summary = `Outstanding ROI with payback in ${Math.round(paybackMonths)} months. `;
  } else if (paybackMonths < 24) {
    summary = `Strong ROI with payback in ${(paybackMonths / 12).toFixed(1)} years. `;
  } else {
    summary = `Moderate ROI with payback in ${(paybackMonths / 12).toFixed(1)} years. `;
  }

  if (roi.year1 > 100) {
    summary += `First year ROI exceeds 100% (${Math.round(roi.year1)}%).`;
  } else if (roi.year1 > 50) {
    summary += `Strong first year ROI of ${Math.round(roi.year1)}%.`;
  } else {
    summary += `First year ROI of ${Math.round(roi.year1)}%.`;
  }

  summary += ` Annual value of ${formatCurrency(annualValue)} includes infrastructure savings, operational efficiency, and productivity gains.`;

  return summary;
}

/**
 * Calculate carbon footprint reduction
 */
export function calculateCarbonFootprint(params) {
  const { currentVMs, optimizedVMs, hoursRunning } = params;
  
  const co2PerVMPerHour = 0.00012; // tons (estimated)
  const currentAnnualCO2 = currentVMs * hoursRunning * co2PerVMPerHour;
  const optimizedAnnualCO2 = optimizedVMs * hoursRunning * co2PerVMPerHour;
  const reduction = currentAnnualCO2 - optimizedAnnualCO2;
  const reductionPercent = (reduction / currentAnnualCO2) * 100;

  return {
    currentAnnualCO2Tons: currentAnnualCO2,
    optimizedAnnualCO2Tons: optimizedAnnualCO2,
    reductionTons: reduction,
    reductionPercent,
    equivalentTrees: Math.round(reduction * 16), // 1 ton CO2 = ~16 trees per year
    equivalentCars: (reduction / 4.6).toFixed(1) // Average car = 4.6 tons CO2/year
  };
}

/**
 * Get implementation cost estimate
 */
export function getImplementationCost(userCount) {
  const impl = valueMetrics.implementationFactors.typicalImplementationCost;

  if (userCount < 500) {
    return impl.small_under500;
  } else if (userCount < 2000) {
    return impl.medium_500to2000;
  } else if (userCount < 5000) {
    return impl.large_2000to5000;
  } else {
    return impl.enterprise_5000plus;
  }
}

/**
 * Format currency helper
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Export all functions
 */
export default {
  calculateComprehensiveROI,
  calculateOperationalSavings,
  calculateProductivityGains,
  calculateSecurityValue,
  calculateEnvironmentalImpact,
  calculateCarbonFootprint,
  getImplementationCost
};
