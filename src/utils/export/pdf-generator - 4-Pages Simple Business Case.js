import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPercentage } from '../business-case/cost-calculator';

export function generateBusinessCasePDF(calculations) {
  const doc = new jsPDF('p', 'mm', 'letter');
  
  // Manually attach autoTable to the doc instance
  if (autoTable && typeof doc.autoTable === 'undefined') {
    doc.autoTable = (options) => autoTable(doc, options);
  }
  
  const { customerProfile, currentState, futureState, tcoAnalysis, roiAnalysis, implementationCost } = calculations;
  
  const colors = {
    nerdio: [88, 28, 135],
    success: [34, 197, 94],
    danger: [239, 68, 68],
    info: [59, 130, 246],
    dark: [31, 41, 55]
  };

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // PAGE 1: EXECUTIVE SUMMARY
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('BUSINESS CASE SUMMARY', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text(customerProfile.companyName, pageWidth / 2, 30, { align: 'center' });
  
  y = 50;
  
  // Giant savings box
  doc.setFillColor(...colors.success);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 35, 5, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('3-YEAR TOTAL SAVINGS', pageWidth / 2, y + 12, { align: 'center' });
  doc.setFontSize(28);
  doc.text(formatCurrency(tcoAnalysis.savings.total), pageWidth / 2, y + 28, { align: 'center' });
  
  y += 45;
  
  // Key metrics boxes
  const boxWidth = 50;
  const boxHeight = 30;
  const startX = (pageWidth - (3 * boxWidth + 16)) / 2;
  
  // Payback
  doc.setFillColor(...colors.info);
  doc.roundedRect(startX, y, boxWidth, boxHeight, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('PAYBACK PERIOD', startX + boxWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(20);
  doc.text(roiAnalysis.investment.paybackPeriod.months.toFixed(1) + ' mo', startX + boxWidth / 2, y + 20, { align: 'center' });
  
  // ROI
  doc.setFillColor(...colors.nerdio);
  doc.roundedRect(startX + boxWidth + 8, y, boxWidth, boxHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text('YEAR 1 ROI', startX + boxWidth + 8 + boxWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(20);
  doc.text(roiAnalysis.roi.year1.toFixed(0) + '%', startX + boxWidth + 8 + boxWidth / 2, y + 20, { align: 'center' });
  
  // Savings %
  doc.setFillColor(...colors.success);
  doc.roundedRect(startX + 2 * (boxWidth + 8), y, boxWidth, boxHeight, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text('COST REDUCTION', startX + 2 * (boxWidth + 8) + boxWidth / 2, y + 8, { align: 'center' });
  doc.setFontSize(20);
  doc.text(formatPercentage(tcoAnalysis.savings.percentage), startX + 2 * (boxWidth + 8) + boxWidth / 2, y + 20, { align: 'center' });
  
  y += 40;
  
  // Summary text
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  const summary = doc.splitTextToSize(roiAnalysis.summary, pageWidth - 2 * margin);
  doc.text(summary, margin, y);
  
  y += summary.length * 5 + 10;
  
  // Quick stats
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Users:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(customerProfile.totalUsers.toLocaleString(), margin + 40, y);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Value:', margin + 90, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(roiAnalysis.annualValue.totalAnnual), margin + 130, y);
  
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Implementation:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(implementationCost.durationWeeks + ' weeks', margin + 40, y);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Net Present Value:', margin + 90, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(roiAnalysis.netPresentValue), margin + 130, y);
  
  // PAGE 2: TCO COMPARISON
  doc.addPage();
  y = margin;
  
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('TOTAL COST OF OWNERSHIP', margin, 15);
  
  y = 35;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.text('Current State (' + tcoAnalysis.timeHorizon.years + ' years):', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(tcoAnalysis.currentState.totalCost), pageWidth - margin, y, { align: 'right' });
  
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Future State (' + tcoAnalysis.timeHorizon.years + ' years):', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(tcoAnalysis.futureState.totalCost), pageWidth - margin, y, { align: 'right' });
  
  y += 12;
  doc.setFillColor(...colors.success);
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('TOTAL SAVINGS:', margin + 5, y + 3);
  doc.text(formatCurrency(tcoAnalysis.savings.total), pageWidth - margin - 5, y + 3, { align: 'right' });
  
  y += 20;
  
  // Value breakdown table
  doc.autoTable({
    startY: y,
    head: [['Value Category', 'Annual Amount']],
    body: [
      ['Infrastructure Savings', formatCurrency(roiAnalysis.annualValue.infrastructureSavings)],
      ['Operational Savings', formatCurrency(roiAnalysis.annualValue.operationalSavings)],
      ['Productivity Gains', formatCurrency(roiAnalysis.annualValue.productivityGains)],
      ['Security & Compliance', formatCurrency(roiAnalysis.annualValue.securityValue)],
      ['TOTAL ANNUAL VALUE', formatCurrency(roiAnalysis.annualValue.totalAnnual)]
    ],
    headStyles: { fillColor: colors.nerdio },
    footStyles: { fillColor: colors.success, fontStyle: 'bold' },
    margin: { left: margin, right: margin }
  });
  
  // PAGE 3: IMPLEMENTATION
  doc.addPage();
  y = margin;
  
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('IMPLEMENTATION PLAN', margin, 15);
  
  y = 40;
  doc.setTextColor(...colors.dark);
  doc.setFontSize(14);
  doc.text('Timeline: ' + implementationCost.durationWeeks + ' weeks', margin, y);
  
  y += 10;
  doc.setFontSize(12);
  doc.text('Investment: ' + formatCurrency(implementationCost.totalCost) + ' one-time', margin, y);
  
  y += 15;
  
  // Resources table
  doc.autoTable({
    startY: y,
    head: [['Resource', 'Hours', 'Cost']],
    body: [
      ['Project Management', implementationCost.projectManagementHours.toString(), formatCurrency(implementationCost.projectManagementHours * 150)],
      ['Solution Architect', implementationCost.architectHours.toString(), formatCurrency(implementationCost.architectHours * 200)],
      ['Engineering', implementationCost.engineerHours.toString(), formatCurrency(implementationCost.engineerHours * 150)],
      ['TOTAL', (implementationCost.projectManagementHours + implementationCost.architectHours + implementationCost.engineerHours).toString(), formatCurrency(implementationCost.totalCost)]
    ],
    headStyles: { fillColor: colors.nerdio },
    footStyles: { fillColor: [243, 244, 246], textColor: colors.dark, fontStyle: 'bold' },
    margin: { left: margin, right: margin }
  });
  
  // PAGE 4: CALL TO ACTION
  doc.addPage();
  y = margin;
  
  doc.setFillColor(...colors.success);
  doc.rect(0, 0, pageWidth, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('NEXT STEPS', margin, 15);
  
  y = 50;
  
  // Decision Summary Box
  doc.setFillColor(...colors.nerdio);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 60, 5, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DECISION SUMMARY', pageWidth / 2, y + 12, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(255, 255, 255);
  doc.line(margin + 40, y + 16, pageWidth - margin - 40, y + 16);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Invest: ' + formatCurrency(implementationCost.totalCost) + ' one-time', pageWidth / 2, y + 24, { align: 'center' });
  doc.text('Save: ' + formatCurrency(tcoAnalysis.savings.annual) + '/year', pageWidth / 2, y + 32, { align: 'center' });
  doc.text('Payback: ' + roiAnalysis.investment.paybackPeriod.months.toFixed(1) + ' months', pageWidth / 2, y + 40, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('>> This is a no-brainer investment <<', pageWidth / 2, y + 52, { align: 'center' });
  
  y += 70;
  
  // Contact section
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.text('Ready to get started?', margin, y);
  y += 7;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Contact your Nerdio representative to schedule your 30-day Proof of Value.', margin, y);
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFillColor(...colors.nerdio);
  doc.rect(0, footerY, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('Powered by Nerdio', pageWidth / 2, footerY + 10, { align: 'center' });
  doc.setFontSize(9);
  doc.text('www.getnerdio.com', pageWidth / 2, footerY + 16, { align: 'center' });
  
  return doc;
}