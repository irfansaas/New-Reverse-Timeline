import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPercentage } from '../business-case/cost-calculator';

export function generateBusinessCasePDF(calculations) {
  const doc = new jsPDF('p', 'mm', 'letter');
  
  // Manually attach autoTable
  if (autoTable && typeof doc.autoTable === 'undefined') {
    doc.autoTable = (options) => autoTable(doc, options);
  }
  
  const { customerProfile, currentState, futureState, tcoAnalysis, roiAnalysis, implementationCost } = calculations;
  
  // Brand colors (RGB) - Psychology-driven color scheme
  const colors = {
    nerdio: [88, 28, 135],      // Purple - Premium/Brand
    success: [34, 197, 94],      // Green - Savings/Benefits/Go
    danger: [239, 68, 68],       // Red - Current state/Problems
    warning: [234, 179, 8],      // Yellow - Caution/Attention
    info: [59, 130, 246],        // Blue - Trust/Stability
    dark: [31, 41, 55],          // Dark gray - Text
    light: [243, 244, 246],      // Light gray - Backgrounds
    environment: [16, 185, 129]  // Teal - Environmental
  };

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;

  // Helper function to add new page
  const addPage = () => {
    doc.addPage();
    currentY = margin;
  };

  // Helper function to draw colored box with text
  const drawBox = (x, y, width, height, color, title, value, subtitle = null) => {
    doc.setFillColor(...color);
    doc.roundedRect(x, y, width, height, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x + width / 2, y + 10, { align: 'center' });
    
    if (value) {
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(value, x + width / 2, y + 22, { align: 'center' });
    }
    
    if (subtitle) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, x + width / 2, y + height - 5, { align: 'center' });
    }
  };

  // ============================================
  // PAGE 1: EXECUTIVE SUMMARY - THE HOOK
  // ============================================
  
  // Header with brand colors
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('BUSINESS CASE SUMMARY', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(customerProfile.companyName, pageWidth / 2, 30, { align: 'center' });
  
  currentY = 50;
  
  // Giant savings callout box - THE HOOK
  const savingsBox = {
    x: margin,
    y: currentY,
    width: pageWidth - 2 * margin,
    height: 40
  };
  
  doc.setFillColor(...colors.success);
  doc.roundedRect(savingsBox.x, savingsBox.y, savingsBox.width, savingsBox.height, 5, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('3-YEAR TOTAL SAVINGS', pageWidth / 2, currentY + 12, { align: 'center' });
  
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  const savingsText = formatCurrency(tcoAnalysis.savings.total);
  doc.text(savingsText, pageWidth / 2, currentY + 30, { align: 'center' });
  
  currentY += 50;
  
  // Three key metrics boxes
  const boxWidth = 50;
  const boxHeight = 32;
  const spacing = 8;
  const startX = (pageWidth - (3 * boxWidth + 2 * spacing)) / 2;
  
  // Payback box
  drawBox(
    startX, 
    currentY, 
    boxWidth, 
    boxHeight, 
    colors.info,
    'PAYBACK',
    roiAnalysis.investment.paybackPeriod.months.toFixed(1) + ' mo'
  );
  
  // ROI box
  drawBox(
    startX + boxWidth + spacing, 
    currentY, 
    boxWidth, 
    boxHeight, 
    colors.nerdio,
    'YEAR 1 ROI',
    roiAnalysis.roi.year1.toFixed(0) + '%'
  );
  
  // Savings % box
  drawBox(
    startX + 2 * (boxWidth + spacing), 
    currentY, 
    boxWidth, 
    boxHeight, 
    colors.success,
    'COST CUT',
    formatPercentage(tcoAnalysis.savings.percentage)
  );
  
  currentY += boxHeight + 15;
  
  // Executive summary text
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(roiAnalysis.summary, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, currentY);
  
  currentY += summaryLines.length * 6 + 12;
  
  // Quick stats grid
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.dark);
  
  const stats = [
    ['Total Users:', customerProfile.totalUsers.toLocaleString()],
    ['Annual Value:', formatCurrency(roiAnalysis.annualValue.totalAnnual)],
    ['Implementation:', implementationCost.durationWeeks + ' weeks'],
    ['Net Present Value:', formatCurrency(roiAnalysis.netPresentValue)]
  ];
  
  const statsY = currentY;
  stats.forEach((stat, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = margin + col * (pageWidth / 2 - margin);
    const y = statsY + row * 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text(stat[0], x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(stat[1], x + 50, y);
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Nerdio Value Engineering Analysis', pageWidth / 2, pageHeight - 10, { align: 'center' });
  const today = new Date();
  doc.text('Generated: ' + today.toLocaleDateString(), pageWidth / 2, pageHeight - 6, { align: 'center' });
  
  // ============================================
  // PAGE 2: THE CHALLENGE - CREATE URGENCY
  // ============================================
  addPage();
  
  // Page header - RED for pain
  doc.setFillColor(...colors.danger);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CURRENT STATE CHALLENGES', margin, 15);
  
  currentY = 35;
  
  // Current platform info
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Current Infrastructure:', margin, currentY);
  
  currentY += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Platform: ' + currentState.platform.toUpperCase(), margin + 5, currentY);
  doc.text('Users: ' + customerProfile.totalUsers.toLocaleString(), margin + 5, currentY + 7);
  
  currentY += 20;
  
  // Current cost box (RED - pain)
  const costBoxHeight = 38;
  doc.setFillColor(...colors.danger);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, costBoxHeight, 5, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ANNUAL COST', pageWidth / 2, currentY + 14, { align: 'center' });
  
  doc.setFontSize(30);
  doc.text(formatCurrency(currentState.costs.annual), pageWidth / 2, currentY + 30, { align: 'center' });
  
  currentY += costBoxHeight + 15;
  
  // Key pain points with warning symbols
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Pain Points:', margin, currentY);
  
  currentY += 10;
  
  const painPoints = [
    'High infrastructure and operational costs',
    'Manual management creates overhead',
    'Limited scalability and flexibility',
    'Security and compliance concerns',
    'Inconsistent user experience'
  ];
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  painPoints.forEach((point) => {
    doc.setTextColor(...colors.danger);
    doc.text('!', margin, currentY);
    doc.setTextColor(...colors.dark);
    doc.text(point, margin + 8, currentY);
    currentY += 7;
  });
  
  currentY += 8;
  
  // Cost breakdown table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.dark);
  doc.text('Cost Breakdown:', margin, currentY);
  
  currentY += 6;
  
  doc.autoTable({
    startY: currentY,
    head: [['Category', 'Annual Cost', 'Per User/Month']],
    body: [
      ['Infrastructure', formatCurrency(currentState.costs.annual * 0.4), formatCurrency(currentState.costs.perUserMonthly * 0.4)],
      ['Software Licenses', formatCurrency(currentState.costs.annual * 0.35), formatCurrency(currentState.costs.perUserMonthly * 0.35)],
      ['Operations', formatCurrency(currentState.costs.annual * 0.25), formatCurrency(currentState.costs.perUserMonthly * 0.25)],
      ['TOTAL', formatCurrency(currentState.costs.annual), formatCurrency(currentState.costs.perUserMonthly)]
    ],
    headStyles: { fillColor: colors.danger, textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: colors.light, textColor: colors.dark, fontStyle: 'bold' },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 }
  });
  
  // Continue in next message due to length...
  
// ============================================
  // PAGE 3: THE SOLUTION - SHOW THE PROMISE
  // ============================================
  addPage();
  
  // Page header - GREEN for solution
  doc.setFillColor(...colors.success);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('THE NERDIO SOLUTION', margin, 15);
  
  currentY = 35;
  
  // Solution intro
  doc.setTextColor(...colors.dark);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Azure Virtual Desktop + Nerdio Manager for Enterprise', margin, currentY);
  
  currentY += 15;
  
  // Future cost box (GREEN - gain)
  const futureCostBoxHeight = 45;
  doc.setFillColor(...colors.success);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, futureCostBoxHeight, 5, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NEW ANNUAL COST', pageWidth / 2, currentY + 12, { align: 'center' });
  
  doc.setFontSize(30);
  doc.text(formatCurrency(futureState.totals.annualNet), pageWidth / 2, currentY + 28, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('DOWN ' + formatPercentage(tcoAnalysis.savings.percentage), pageWidth / 2, currentY + 40, { align: 'center' });
  
  currentY += futureCostBoxHeight + 15;
  
  // Key benefits with checkmarks
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Benefits:', margin, currentY);
  
  currentY += 10;
  
  const benefits = [
    formatPercentage(tcoAnalysis.savings.percentage) + ' cost reduction through optimization',
    '35+ admin hours saved per week with automation',
    'Auto-scaling reduces waste and improves performance',
    'Enterprise-grade security and compliance built-in',
    'Improved user experience and productivity'
  ];
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  benefits.forEach((benefit) => {
    doc.setTextColor(...colors.success);
    doc.text('>', margin, currentY);
    doc.setTextColor(...colors.dark);
    doc.text(benefit, margin + 8, currentY);
    currentY += 7;
  });
  
  currentY += 10;
  
  // Visual cost comparison
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.dark);
  doc.text('Cost Comparison:', margin, currentY);
  
  currentY += 12;
  
  // Bar chart visualization
  const maxCost = Math.max(currentState.costs.annual, futureState.totals.annualNet);
  const scale = (pageWidth - 2 * margin - 50) / maxCost;
  
  // Current state bar (RED)
  doc.setFillColor(...colors.danger);
  doc.rect(margin + 50, currentY, currentState.costs.annual * scale, 18, 'F');
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Current:', margin, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(currentState.costs.annual), margin + 55 + currentState.costs.annual * scale, currentY + 12);
  
  currentY += 25;
  
  // Future state bar (GREEN)
  doc.setFillColor(...colors.success);
  doc.rect(margin + 50, currentY, futureState.totals.annualNet * scale, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Future:', margin, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(futureState.totals.annualNet), margin + 55 + futureState.totals.annualNet * scale, currentY + 12);
  
  currentY += 30;
  
  // Savings callout
  doc.setFillColor(...colors.success);
  doc.setDrawColor(...colors.success);
  doc.setLineWidth(1);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 22, 3, 3, 'FD');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('ANNUAL SAVINGS: ' + formatCurrency(tcoAnalysis.savings.annual), pageWidth / 2, currentY + 14, { align: 'center' });
  
  // ============================================
  // PAGE 4: FINANCIAL IMPACT - PROVE THE VALUE
  // ============================================
  addPage();
  
  // Page header
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('3-YEAR FINANCIAL IMPACT', margin, 15);
  
  currentY = 35;
  
  // TCO Summary
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Cost of Ownership:', margin, currentY);
  
  currentY += 12;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Current state
  doc.setTextColor(...colors.danger);
  doc.text('*', margin, currentY);
  doc.setTextColor(...colors.dark);
  doc.text('Current State (' + tcoAnalysis.timeHorizon.years + ' years):', margin + 5, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(tcoAnalysis.currentState.totalCost), pageWidth - margin, currentY, { align: 'right' });
  
  currentY += 8;
  
  // Future state
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.success);
  doc.text('*', margin, currentY);
  doc.setTextColor(...colors.dark);
  doc.text('Future State (' + tcoAnalysis.timeHorizon.years + ' years):', margin + 5, currentY);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(tcoAnalysis.futureState.totalCost), pageWidth - margin, currentY, { align: 'right' });
  
  currentY += 12;
  
  // Line separator
  doc.setDrawColor(...colors.dark);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  
  currentY += 10;
  
  // Total savings
  doc.setFillColor(...colors.success);
  doc.rect(margin, currentY - 6, pageWidth - 2 * margin, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL SAVINGS:', margin + 5, currentY + 4);
  doc.text(formatCurrency(tcoAnalysis.savings.total), pageWidth - margin - 5, currentY + 4, { align: 'right' });
  
  currentY += 20;
  
  // Annual Value Breakdown
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Value Breakdown:', margin, currentY);
  
  currentY += 8;
  
  // Value categories table
  doc.autoTable({
    startY: currentY,
    head: [['Value Category', 'Annual Amount']],
    body: [
      ['Infrastructure Savings', formatCurrency(roiAnalysis.annualValue.infrastructureSavings)],
      ['Operational Savings', formatCurrency(roiAnalysis.annualValue.operationalSavings)],
      ['Productivity Gains', formatCurrency(roiAnalysis.annualValue.productivityGains)],
      ['Security & Compliance', formatCurrency(roiAnalysis.annualValue.securityValue)],
      ['TOTAL ANNUAL VALUE', formatCurrency(roiAnalysis.annualValue.totalAnnual)]
    ],
    headStyles: { fillColor: colors.nerdio, textColor: [255, 255, 255], fontStyle: 'bold' },
    bodyStyles: { textColor: colors.dark },
    footStyles: { fillColor: colors.success, textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
    columnStyles: {
      1: { halign: 'right', fontStyle: 'bold' }
    },
    styles: { fontSize: 10 }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;
  
  // ROI Metrics boxes
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.dark);
  doc.text('Key ROI Metrics:', margin, currentY);
  
  currentY += 10;
  
  const metricsBoxWidth = (pageWidth - 2 * margin - 16) / 3;
  const metricsBoxHeight = 28;
  
  // Payback Period
  drawBox(
    margin, 
    currentY, 
    metricsBoxWidth, 
    metricsBoxHeight, 
    colors.info, 
    'Payback Period', 
    roiAnalysis.investment.paybackPeriod.months.toFixed(1) + ' months'
  );
  
  // Year 1 ROI
  drawBox(
    margin + metricsBoxWidth + 8, 
    currentY, 
    metricsBoxWidth, 
    metricsBoxHeight, 
    colors.nerdio, 
    'Year 1 ROI', 
    roiAnalysis.roi.year1.toFixed(0) + '%'
  );
  
  // 3-Year NPV
  const npvAmount = roiAnalysis.netPresentValue / 1000000;
  drawBox(
    margin + 2 * (metricsBoxWidth + 8), 
    currentY, 
    metricsBoxWidth, 
    metricsBoxHeight, 
    colors.success, 
    '3-Year NPV', 
    '$' + npvAmount.toFixed(1) + 'M'
  );
  
  // ============================================
  // PAGE 5: OPERATIONAL TRANSFORMATION
  // ============================================
  addPage();
  
  // Page header
  doc.setFillColor(...colors.info);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('OPERATIONAL EFFICIENCY GAINS', margin, 15);
  
  currentY = 35;
  
  // Time savings callout
  doc.setFillColor(230, 240, 255);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 32, 5, 5, 'F');
  
  doc.setTextColor(...colors.info);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Admin Time Saved:', margin + 5, currentY + 12);
  
  doc.setFontSize(26);
  doc.text(roiAnalysis.detailedBreakdown.operational.breakdown.adminHoursPerWeek + '+ Hours/Week', pageWidth / 2, currentY + 24, { align: 'center' });
  
  currentY += 42;
  
  // Operational savings breakdown
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Productivity Improvements:', margin, currentY);
  
  currentY += 8;
  
  doc.autoTable({
    startY: currentY,
    head: [['Efficiency Gain', 'Annual Value', 'Benefit']],
    body: [
      ['Auto-Scaling', formatCurrency(roiAnalysis.detailedBreakdown.operational.autoScalingSavings), 'Automated VM management'],
      ['Image Management', formatCurrency(roiAnalysis.detailedBreakdown.operational.imageManagementSavings), 'Golden image automation'],
      ['Admin Time Savings', formatCurrency(roiAnalysis.detailedBreakdown.operational.adminTimeSavings), roiAnalysis.detailedBreakdown.operational.breakdown.adminHoursPerYear + ' hrs/year'],
      ['Support Reduction', formatCurrency(roiAnalysis.detailedBreakdown.operational.supportTicketSavings), roiAnalysis.detailedBreakdown.operational.breakdown.supportTicketsReduced + ' tickets reduced']
    ],
    headStyles: { fillColor: colors.info, textColor: [255, 255, 255], fontStyle: 'bold' },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;
  
  // User experience improvements
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.dark);
  doc.text('User Experience Improvements:', margin, currentY);
  
  currentY += 10;
  
  const uxBenefits = [
    '* 40% faster login times',
    '* 99.9% uptime SLA',
    '> Instant scaling on demand',
    '* Enhanced security posture',
    '* Multi-device support'
  ];
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  uxBenefits.forEach((benefit) => {
    doc.text(benefit, margin + 5, currentY);
    currentY += 7;
  });
  
  // ============================================
  // PAGE 6: ENVIRONMENTAL IMPACT - BONUS VALUE
  // ============================================
  addPage();
  
  // Page header
  doc.setFillColor(...colors.environment);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ENVIRONMENTAL IMPACT', margin, 15);
  
  currentY = 35;
  
  // Sustainability intro
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const envText = 'Moving to Azure with Nerdio optimization provides significant environmental benefits through reduced energy consumption and commitment to sustainability.';
  const envLines = doc.splitTextToSize(envText, pageWidth - 2 * margin);
  doc.text(envLines, margin, currentY);
  
  currentY += envLines.length * 6 + 15;
  
  // CO2 and trees boxes
  const envBoxWidth = (pageWidth - 2 * margin - 10) / 2;
  const envBoxHeight = 38;
  
  // CO2 Reduction
  doc.setFillColor(...colors.environment);
  doc.roundedRect(margin, currentY, envBoxWidth, envBoxHeight, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CO2 REDUCTION', margin + envBoxWidth / 2, currentY + 14, { align: 'center' });
  doc.setFontSize(28);
  doc.text(roiAnalysis.detailedBreakdown.environmental.co2ReductionTons.toFixed(1) + ' tons', margin + envBoxWidth / 2, currentY + 30, { align: 'center' });
  
  // Trees Equivalent
  const treesEquiv = Math.round(roiAnalysis.detailedBreakdown.environmental.co2ReductionTons * 16);
  doc.setFillColor(22, 163, 74);
  doc.roundedRect(margin + envBoxWidth + 10, currentY, envBoxWidth, envBoxHeight, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TREES PLANTED', margin + envBoxWidth + 10 + envBoxWidth / 2, currentY + 14, { align: 'center' });
  doc.setFontSize(28);
  doc.text(treesEquiv.toString(), margin + envBoxWidth + 10 + envBoxWidth / 2, currentY + 30, { align: 'center' });
  
  currentY += envBoxHeight + 15;
  
  // Azure sustainability commitments
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Azure Sustainability Commitments:', margin, currentY);
  
  currentY += 10;
  
  const azureSustainability = [
    '* Carbon negative by 2030',
    '* 100% renewable energy by 2025',
    '* Water positive datacenters',
    '* Real-time sustainability insights',
    '* Energy-efficient infrastructure'
  ];
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  azureSustainability.forEach((item) => {
    doc.text(item, margin + 5, currentY);
    currentY += 7;
  });
  
  currentY += 10;
  
  // Carbon credit value
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 22, 3, 3, 'F');
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Estimated Carbon Credit Value:', margin + 5, currentY + 10);
  doc.text(formatCurrency(roiAnalysis.detailedBreakdown.environmental.carbonCreditValue) + '/year', pageWidth - margin - 5, currentY + 10, { align: 'right' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Additional ESG value for sustainability reporting', margin + 5, currentY + 17);
  
  // ============================================
  // PAGE 7: IMPLEMENTATION ROADMAP
  // ============================================
  addPage();
  
  // Page header
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPLEMENTATION ROADMAP', margin, 15);
  
  currentY = 35;
  
  // Timeline overview
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Implementation Timeline: ' + implementationCost.durationWeeks + ' Weeks', margin, currentY);
  
  currentY += 15;
  
  // Phase breakdown with colored boxes
  const phases = [
    { name: 'Planning & Design', weeks: Math.round(implementationCost.durationWeeks * 0.25), color: colors.info },
    { name: 'Build & Configure', weeks: Math.round(implementationCost.durationWeeks * 0.35), color: colors.nerdio },
    { name: 'Testing & Migration', weeks: Math.round(implementationCost.durationWeeks * 0.25), color: colors.warning },
    { name: 'Go-Live & Optimize', weeks: Math.round(implementationCost.durationWeeks * 0.15), color: colors.success }
  ];
  
  const timelineWidth = pageWidth - 2 * margin;
  const phaseHeight = 28;
  let phaseX = margin;
  
  phases.forEach((phase) => {
    const phaseWidth = (phase.weeks / implementationCost.durationWeeks) * timelineWidth;
    
    doc.setFillColor(...phase.color);
    doc.rect(phaseX, currentY, phaseWidth - 2, phaseHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const phaseName = doc.splitTextToSize(phase.name, phaseWidth - 4);
    doc.text(phaseName, phaseX + phaseWidth / 2, currentY + 12, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text(phase.weeks + 'w', phaseX + phaseWidth / 2, currentY + 20, { align: 'center' });
    
    phaseX += phaseWidth;
  });
  
  currentY += phaseHeight + 20;
  
  // Investment required
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Required:', margin, currentY);
  
  currentY += 10;
  
  // Investment box
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 42, 5, 5, 'F');
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('One-Time Implementation Cost:', margin + 5, currentY + 14);
  
  doc.setFontSize(26);
  doc.setTextColor(...colors.nerdio);
  doc.text(formatCurrency(implementationCost.totalCost), pageWidth / 2, currentY + 32, { align: 'center' });
  
  currentY += 52;
  
  // Resource breakdown
  doc.autoTable({
    startY: currentY,
    head: [['Resource', 'Hours', 'Cost']],
    body: [
      ['Project Management', implementationCost.projectManagementHours.toString(), formatCurrency(implementationCost.projectManagementHours * 150)],
      ['Solution Architect', implementationCost.architectHours.toString(), formatCurrency(implementationCost.architectHours * 200)],
      ['Engineering', implementationCost.engineerHours.toString(), formatCurrency(implementationCost.engineerHours * 150)],
      ['TOTAL', (implementationCost.projectManagementHours + implementationCost.architectHours + implementationCost.engineerHours).toString(), formatCurrency(implementationCost.totalCost)]
    ],
    headStyles: { fillColor: colors.nerdio, textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: colors.light, fontStyle: 'bold' },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;
  
  // Success metrics
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Success Metrics:', margin, currentY);
  
  currentY += 10;
  
  const successMetrics = [
    '> User adoption rate: >95%',
    '> Performance: <2s average login time',
    '> Cost savings: >30% infrastructure reduction',
    '> Uptime SLA: 99.9%',
    '> User satisfaction: >4.5/5'
  ];
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  successMetrics.forEach((metric) => {
    doc.setTextColor(...colors.success);
    doc.text(metric.substring(0, 1), margin, currentY);
    doc.setTextColor(...colors.dark);
    doc.text(metric.substring(2), margin + 5, currentY);
    currentY += 7;
  });
  
  // ============================================
  // PAGE 8: CALL TO ACTION - CLOSE THE DEAL
  // ============================================
  addPage();
  
  // Page header
  doc.setFillColor(...colors.success);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMMENDED NEXT STEPS', margin, 15);
  
  currentY = 35;
  
  // Phase 1: PoV
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 50, 5, 5, 'F');
  
  doc.setTextColor(...colors.success);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('> PHASE 1: 30-Day Proof of Value', margin + 5, currentY + 12);
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const povSteps = [
    '- Small pilot deployment with 50-100 users',
    '- Validate cost and performance assumptions',
    '- Experience Nerdio automation firsthand',
    '- Gather user feedback and metrics'
  ];
  
  let povY = currentY + 20;
  povSteps.forEach((step) => {
    doc.text(step, margin + 10, povY);
    povY += 7;
  });
  
  currentY += 60;
  
  // Phase 2: Full Deployment
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 38, 5, 5, 'F');
  
  doc.setTextColor(...colors.success);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('> PHASE 2: Full Deployment', margin + 5, currentY + 12);
  
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const fullSteps = [
    '- Based on successful PoV results',
    '- Phased user migration approach',
    '- Continuous optimization and tuning'
  ];
  
  let fullY = currentY + 20;
  fullSteps.forEach((step) => {
    doc.text(step, margin + 10, fullY);
    fullY += 7;
  });
  
  currentY += 48;
  
  // Decision summary box (THE CLOSER)
  doc.setFillColor(...colors.nerdio);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 58, 5, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DECISION SUMMARY', pageWidth / 2, currentY + 12, { align: 'center' });
  
  // Decorative line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(margin + 40, currentY + 16, pageWidth - margin - 40, currentY + 16);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const decisionY = currentY + 24;
  doc.text('Invest: ' + formatCurrency(implementationCost.totalCost) + ' one-time', pageWidth / 2, decisionY, { align: 'center' });
  doc.text('Save: ' + formatCurrency(tcoAnalysis.savings.annual) + '/year', pageWidth / 2, decisionY + 8, { align: 'center' });
  doc.text('Payback: ' + roiAnalysis.investment.paybackPeriod.months.toFixed(1) + ' months', pageWidth / 2, decisionY + 16, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('>> This is a no-brainer investment <<', pageWidth / 2, decisionY + 28, { align: 'center' });
  
  currentY += 68;
  
  // Contact info
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to get started?', margin, currentY);
  
  currentY += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Contact your Nerdio representative to schedule your', margin, currentY);
  currentY += 6;
  doc.text('30-day Proof of Value and begin your transformation.', margin, currentY);
  
  // Footer with branding
  const footerY = pageHeight - 20;
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, footerY, pageWidth, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Powered by Nerdio', pageWidth / 2, footerY + 10, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('www.getnerdio.com', pageWidth / 2, footerY + 16, { align: 'center' });
  
  return doc;
}