import { Envelope, Expense } from './tracker-types';
import { formatPdfCurrency, convertCurrency } from './currency-utils';
import { t } from './i18n';

export type PDFTemplateStyle = 'classic' | 'minimal-bw';

function hexToRgb(hex: string): [number, number, number] {
  if (!hex) return [138, 154, 91];
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return [138, 154, 91];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export async function generatePDFSummary(
  envelopes: Envelope[],
  expenses: Expense[],
  style: PDFTemplateStyle = 'classic',
  budgetPeriod: string = '',
  notes: string = '',
  mainCurrency: string = 'USD',
  language: string = 'en'
) {
  if (style === 'minimal-bw') {
    return generateMinimalBwPDF(envelopes, expenses, budgetPeriod, notes, mainCurrency, language);
  }
  return generateClassicPDF(envelopes, expenses, budgetPeriod, notes, mainCurrency, language);
}

function drawEnvelopeBadge(
  doc: any,
  envName: string,
  envColor: string,
  startX: number,
  rowY: number,
  rowHeight: number,
  maxColWidth: number
) {
  const [r, g, b] = hexToRgb(envColor || '#8A9A5B');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  let displayString = envName;
  const maxBadgeWidth = maxColWidth - 6;

  if (doc.getTextWidth(displayString) + 6 > maxBadgeWidth) {
    while (displayString.length > 3 && doc.getTextWidth(displayString + '...') + 6 > maxBadgeWidth) {
      displayString = displayString.slice(0, -1);
    }
    displayString = displayString + '...';
  }

  const textWidth = doc.getTextWidth(displayString);
  const badgeWidth = Math.max(textWidth + 6, 16);
  const badgeHeight = 4.8;
  const badgeY = rowY + (rowHeight - badgeHeight) / 2;
  const badgeX = startX + 3;

  doc.setFillColor(r, g, b);
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.3);
  doc.rect(badgeX, badgeY, badgeWidth, badgeHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(displayString, badgeX + badgeWidth / 2, badgeY + 3.4, { align: 'center' });
}

// ---------------------------------------------------------------------------
// CLASSIC MINIMAL TEMPLATE
// ---------------------------------------------------------------------------
async function generateClassicPDF(
  envelopes: Envelope[],
  expenses: Expense[],
  budgetPeriod: string = '',
  notes: string = '',
  mainCurrency: string = 'USD',
  language: string = 'en'
) {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = 15;

  // --- 1. HEADER BANNER ---
  doc.setLineWidth(1);
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(252, 250, 247);
  doc.rect(margin, y, contentWidth, 22, 'FD');

  doc.setLineWidth(0.3);
  doc.rect(margin + 1.2, y + 1.2, contentWidth - 2.4, 19.6, 'S');

  const titlePart1 = t('pdfTitle', language).toUpperCase();
  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  doc.text(titlePart1, margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const periodStr = budgetPeriod && budgetPeriod.trim().length > 0 ? budgetPeriod.trim() : '___________';
  doc.text(`${t('pdfGeneratedOn', language)}: ${todayStr}   |   ${t('budgetPeriod', language)}: ${periodStr}`, margin + 6, y + 16.5);

  y += 22 + 7;

  // Calculations in Main Currency
  const totalAllocated = envelopes.reduce((acc, e) => {
    return acc + convertCurrency(e.allocated, e.currency || mainCurrency, mainCurrency);
  }, 0);

  const envelopeStatsMap = new Map<string, { spent: number; cashAdded: number }>();
  envelopes.forEach((e) => envelopeStatsMap.set(e.id, { spent: 0, cashAdded: 0 }));

  let totalSpent = 0;
  let totalCashAdded = 0;

  expenses.forEach((exp) => {
    const env = envelopes.find((e) => e.id === exp.envelopeId);
    const envCurr = env?.currency || mainCurrency;
    const convertedAmt = convertCurrency(exp.amount, exp.currency || mainCurrency, envCurr);
    const mainConverted = convertCurrency(Math.abs(exp.amount), exp.currency || mainCurrency, mainCurrency);
    const current = envelopeStatsMap.get(exp.envelopeId) || { spent: 0, cashAdded: 0 };

    if (exp.amount < 0) {
      totalCashAdded += mainConverted;
      envelopeStatsMap.set(exp.envelopeId, { ...current, cashAdded: current.cashAdded + Math.abs(convertedAmt) });
    } else {
      totalSpent += convertCurrency(exp.amount, exp.currency || mainCurrency, mainCurrency);
      envelopeStatsMap.set(exp.envelopeId, { ...current, spent: current.spent + convertedAmt });
    }
  });

  const totalRemaining = totalAllocated + totalCashAdded - totalSpent;

  // --- 2. KEY SUMMARY METRIC CARDS (4 CARDS) ---
  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 17;

  // Card 1: Allocated
  doc.setLineWidth(0.8);
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(margin, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(92, 118, 141);
  doc.rect(margin, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(20, 20, 20);
  doc.text(t('totalAllocated', language).toUpperCase(), margin + 3, y + 6.5);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(totalAllocated, mainCurrency), margin + 3, y + 13.5);

  // Card 2: Cash Added
  const card2X = margin + cardWidth + 3;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card2X, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(5, 150, 105);
  doc.rect(card2X, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(20, 20, 20);
  doc.text(t('labelTotalCashAdded', language).toUpperCase(), card2X + 3, y + 6.5);
  doc.setFontSize(9.5);
  doc.setTextColor(5, 150, 105);
  doc.text(`+${formatPdfCurrency(totalCashAdded, mainCurrency)}`, card2X + 3, y + 13.5);

  // Card 3: Spent
  const card3X = card2X + cardWidth + 3;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card3X, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(209, 95, 71);
  doc.rect(card3X, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(20, 20, 20);
  doc.text(t('totalSpent', language).toUpperCase(), card3X + 3, y + 6.5);
  doc.setFontSize(9.5);
  doc.setTextColor(209, 95, 71);
  doc.text(formatPdfCurrency(totalSpent, mainCurrency), card3X + 3, y + 13.5);

  // Card 4: Remaining
  const card4X = card3X + cardWidth + 3;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card4X, y, cardWidth, cardHeight, 'FD');
  const remColorRGB = totalRemaining < 0 ? [209, 95, 71] : [138, 154, 91];
  doc.setFillColor(remColorRGB[0], remColorRGB[1], remColorRGB[2]);
  doc.rect(card4X, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(20, 20, 20);
  doc.text(t('totalRemaining', language).toUpperCase(), card4X + 3, y + 6.5);
  doc.setFontSize(9.5);
  doc.setTextColor(remColorRGB[0], remColorRGB[1], remColorRGB[2]);
  doc.text(formatPdfCurrency(totalRemaining, mainCurrency), card4X + 3, y + 13.5);

  y += cardHeight + 10;

  // --- 3. ENVELOPES BREAKDOWN SECTION ---
  const envColX = [margin, margin + 45, margin + 72, margin + 98, margin + 126, margin + 152];

  const drawEnvTableHeader = (startY: number) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(margin, startY, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(t('pdfColEnvelope', language).toUpperCase(), envColX[0] + 3, startY + 4.5);
    doc.text(t('pdfColCategory', language).toUpperCase(), envColX[1] + 3, startY + 4.5);
    doc.text(t('pdfColAllocated', language).toUpperCase(), envColX[2] + 3, startY + 4.5);
    doc.text(t('pdfColCashAdded', language).toUpperCase(), envColX[3] + 3, startY + 4.5);
    doc.text(t('pdfColSpent', language).toUpperCase(), envColX[4] + 3, startY + 4.5);
    doc.text(t('pdfColRemaining', language).toUpperCase(), envColX[5] + 3, startY + 4.5);
  };

  if (y + 20 > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfEnvelopeBreakdown', language), margin, y);
  y += 5;

  drawEnvTableHeader(y);
  y += 6.5;

  envelopes.forEach((env, index) => {
    if (y + 8 > 270) {
      doc.addPage();
      y = 15;
      drawEnvTableHeader(y);
      y += 6.5;
    }

    const stats = envelopeStatsMap.get(env.id) || { spent: 0, cashAdded: 0 };
    const effectiveAlloc = env.allocated + stats.cashAdded;
    const remaining = effectiveAlloc - stats.spent;

    if (index % 2 === 0) {
      doc.setFillColor(250, 248, 245);
      doc.rect(margin, y, contentWidth, 8, 'F');
    }

    doc.setLineWidth(0.2);
    doc.setDrawColor(180, 180, 180);
    doc.rect(margin, y, contentWidth, 8, 'S');
    envColX.slice(1).forEach((xPos) => {
      doc.line(xPos, y, xPos, y + 8);
    });

    drawEnvelopeBadge(doc, env.name, env.color, envColX[0], y, 8, 45);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(t(`cat${env.category}`, language), envColX[1] + 3, y + 5.2);

    const envCurrency = env.currency || mainCurrency;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(formatPdfCurrency(env.allocated, envCurrency), envColX[2] + 3, y + 5.2);

    doc.setTextColor(5, 150, 105);
    doc.text(stats.cashAdded > 0 ? `+${formatPdfCurrency(stats.cashAdded, envCurrency)}` : '—', envColX[3] + 3, y + 5.2);

    doc.setTextColor(209, 95, 71);
    doc.text(formatPdfCurrency(stats.spent, envCurrency), envColX[4] + 3, y + 5.2);

    if (remaining < 0) {
      doc.setTextColor(209, 95, 71);
      doc.setFont('helvetica', 'bold');
      doc.text(`-${formatPdfCurrency(Math.abs(remaining), envCurrency)}`, envColX[5] + 3, y + 5.2);
    } else {
      doc.setTextColor(138, 154, 91);
      doc.setFont('helvetica', 'normal');
      doc.text(formatPdfCurrency(remaining, envCurrency), envColX[5] + 3, y + 5.2);
    }

    y += 8;
  });

  y += 10;

  // --- 4. TRANSACTION HISTORY SECTION ---
  const txColX = [margin, margin + 28, margin + 70, margin + 140];

  const drawTxTableHeader = (startY: number) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(margin, startY, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(t('excelColDate', language).toUpperCase(), txColX[0] + 3, startY + 4.5);
    doc.text(t('pdfColEnvelope', language).toUpperCase(), txColX[1] + 3, startY + 4.5);
    doc.text(t('excelColNote', language).toUpperCase(), txColX[2] + 3, startY + 4.5);
    doc.text(t('excelColAmount', language).toUpperCase(), txColX[3] + 3, startY + 4.5);
  };

  if (y + 20 > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfTransactionHistory', language), margin, y);
  y += 5;

  drawTxTableHeader(y);
  y += 6.5;

  const envObjMap = new Map<string, Envelope>();
  envelopes.forEach((e) => envObjMap.set(e.id, e));

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedExpenses.length === 0) {
    doc.setLineWidth(0.2);
    doc.setDrawColor(180, 180, 180);
    doc.rect(margin, y, contentWidth, 7, 'S');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('No transaction records logged.', margin + 3, y + 4.8);
    y += 7;
  } else {
    sortedExpenses.forEach((exp, index) => {
      if (y + 7 > 270) {
        doc.addPage();
        y = 15;
        drawTxTableHeader(y);
        y += 6.5;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 248, 245);
        doc.rect(margin, y, contentWidth, 7, 'F');
      }

      doc.setLineWidth(0.2);
      doc.setDrawColor(180, 180, 180);
      doc.rect(margin, y, contentWidth, 7, 'S');
      txColX.slice(1).forEach((xPos) => {
        doc.line(xPos, y, xPos, y + 7);
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(20, 20, 20);
      doc.text(exp.date, txColX[0] + 3, y + 4.8);

      const env = envObjMap.get(exp.envelopeId);
      const envName = env?.name || 'Unknown';
      const envColor = env?.color || '#8A9A5B';

      drawEnvelopeBadge(doc, envName, envColor, txColX[1], y, 7, 42);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(20, 20, 20);
      let noteDisplay = exp.note || '-';
      if (noteDisplay.length > 35) noteDisplay = noteDisplay.substring(0, 32) + '...';
      doc.text(noteDisplay, txColX[2] + 3, y + 4.8);

      doc.setFont('helvetica', 'bold');
      if (exp.amount < 0) {
        doc.setTextColor(5, 150, 105);
        doc.text(`+${formatPdfCurrency(Math.abs(exp.amount), exp.currency || mainCurrency)}`, txColX[3] + 3, y + 4.8);
      } else {
        doc.setTextColor(209, 95, 71);
        doc.text(formatPdfCurrency(exp.amount, exp.currency || mainCurrency), txColX[3] + 3, y + 4.8);
      }

      y += 7;
    });
  }

  doc.save(`cash_envelope_budget_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ---------------------------------------------------------------------------
// MINIMAL B&W TEMPLATE
// ---------------------------------------------------------------------------
async function generateMinimalBwPDF(
  envelopes: Envelope[],
  expenses: Expense[],
  budgetPeriod: string = '',
  notes: string = '',
  mainCurrency: string = 'USD',
  language: string = 'en'
) {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = 15;

  doc.setFillColor(255, 255, 255);

  // --- 1. HEADER BANNER ---
  doc.setLineWidth(0.8);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, contentWidth, 22, 'S');

  doc.setLineWidth(0.2);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin + 1.2, y + 1.2, contentWidth - 2.4, 19.6, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0);
  doc.text(t('pdfTitle', language).toUpperCase(), margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const periodStr = budgetPeriod && budgetPeriod.trim().length > 0 ? budgetPeriod.trim() : '___________';
  doc.text(`${t('pdfGeneratedOn', language)}: ${todayStr}   |   ${t('budgetPeriod', language)}: ${periodStr}`, margin + 6, y + 16.5);

  y += 22 + 8;

  // Calculations
  const totalAllocated = envelopes.reduce((acc, e) => {
    return acc + convertCurrency(e.allocated, e.currency || mainCurrency, mainCurrency);
  }, 0);

  const envelopeStatsMap = new Map<string, { spent: number; cashAdded: number }>();
  envelopes.forEach((e) => envelopeStatsMap.set(e.id, { spent: 0, cashAdded: 0 }));

  let totalSpent = 0;
  let totalCashAdded = 0;

  expenses.forEach((exp) => {
    const env = envelopes.find((e) => e.id === exp.envelopeId);
    const envCurr = env?.currency || mainCurrency;
    const convertedAmt = convertCurrency(exp.amount, exp.currency || mainCurrency, envCurr);
    const mainConverted = convertCurrency(Math.abs(exp.amount), exp.currency || mainCurrency, mainCurrency);
    const current = envelopeStatsMap.get(exp.envelopeId) || { spent: 0, cashAdded: 0 };

    if (exp.amount < 0) {
      totalCashAdded += mainConverted;
      envelopeStatsMap.set(exp.envelopeId, { ...current, cashAdded: current.cashAdded + Math.abs(convertedAmt) });
    } else {
      totalSpent += convertCurrency(exp.amount, exp.currency || mainCurrency, mainCurrency);
      envelopeStatsMap.set(exp.envelopeId, { ...current, spent: current.spent + convertedAmt });
    }
  });

  const totalRemaining = totalAllocated + totalCashAdded - totalSpent;

  // --- 2. KEY SUMMARY METRIC CARDS (4 CARDS B&W) ---
  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 16;

  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);

  // Card 1
  doc.rect(margin, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text(t('totalAllocated', language).toUpperCase(), margin + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(totalAllocated, mainCurrency), margin + 3, y + 13);

  // Card 2
  const card2X = margin + cardWidth + 3;
  doc.rect(card2X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text(t('labelTotalCashAdded', language).toUpperCase(), card2X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(`+${formatPdfCurrency(totalCashAdded, mainCurrency)}`, card2X + 3, y + 13);

  // Card 3
  const card3X = card2X + cardWidth + 3;
  doc.rect(card3X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text(t('totalSpent', language).toUpperCase(), card3X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(totalSpent, mainCurrency), card3X + 3, y + 13);

  // Card 4
  const card4X = card3X + cardWidth + 3;
  doc.rect(card4X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text(t('totalRemaining', language).toUpperCase(), card4X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(totalRemaining, mainCurrency), card4X + 3, y + 13);

  y += cardHeight + 10;

  // --- 3. PER-ENVELOPE BORDERED LEDGER BOXES ---
  if (y + 25 > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(t('pdfEnvelopeBreakdown', language), margin, y);
  y += 6;

  const displayEnvelopes = envelopes.length > 0 ? envelopes : [];

  displayEnvelopes.forEach((env) => {
    const envExpenses = expenses
      .filter((exp) => exp.envelopeId === env.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentBalance = env.allocated;
    const txRows = envExpenses.map((exp) => {
      if (exp.amount < 0) {
        currentBalance += Math.abs(exp.amount);
      } else {
        currentBalance -= exp.amount;
      }
      return {
        ...exp,
        runningBalance: currentBalance,
      };
    });

    const isBlankTable = txRows.length === 0;
    const rowCount = isBlankTable ? 2 : txRows.length;
    const boxHeight = 7 + 6 + (rowCount * 6.5);

    if (y + Math.min(boxHeight, 25) > 270) {
      doc.addPage();
      y = 15;
    }

    doc.setLineWidth(0.4);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`${t('pdfColCategory', language).toUpperCase()}: ${t(`cat${env.category}`, language).toUpperCase()}  |  ${env.name.toUpperCase()}`, margin + 3, y + 4.8);

    const envCurrency = env.currency || mainCurrency;
    const allocText = `${t('pdfColAllocated', language).toUpperCase()}: ${formatPdfCurrency(env.allocated, envCurrency)}`;
    const allocWidth = doc.getTextWidth(allocText);
    doc.text(allocText, margin + contentWidth - 3 - allocWidth, y + 4.8);

    y += 7;

    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 6, 'S');

    const colX = [margin, margin + 28, margin + 110, margin + 145];
    colX.slice(1).forEach((xPos) => {
      doc.line(xPos, y, xPos, y + 6);
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(t('excelColDate', language).toUpperCase(), colX[0] + 3, y + 4.2);
    doc.text(t('excelColNote', language).toUpperCase(), colX[1] + 3, y + 4.2);
    doc.text(t('excelColAmount', language).toUpperCase(), colX[2] + 3, y + 4.2);
    doc.text(t('pdfColRemaining', language).toUpperCase(), colX[3] + 3, y + 4.2);

    y += 6;

    if (isBlankTable) {
      for (let i = 0; i < 2; i++) {
        if (y + 6.5 > 270) {
          doc.addPage();
          y = 15;
        }

        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, y, contentWidth, 6.5, 'S');
        colX.slice(1).forEach((xPos) => {
          doc.line(xPos, y, xPos, y + 6.5);
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text('—', colX[0] + 3, y + 4.5);

        y += 6.5;
      }
    } else {
      txRows.forEach((tx) => {
        if (y + 6.5 > 270) {
          doc.addPage();
          y = 15;
        }

        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, y, contentWidth, 6.5, 'S');
        colX.slice(1).forEach((xPos) => {
          doc.line(xPos, y, xPos, y + 6.5);
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(0, 0, 0);
        doc.text(tx.date, colX[0] + 3, y + 4.5);

        let noteStr = tx.note || '-';
        if (noteStr.length > 45) noteStr = noteStr.substring(0, 42) + '...';
        doc.text(noteStr, colX[1] + 3, y + 4.5);

        doc.setFont('helvetica', 'bold');
        if (tx.amount < 0) {
          doc.text(`+${formatPdfCurrency(Math.abs(tx.amount), tx.currency || envCurrency)}`, colX[2] + 3, y + 4.5);
        } else {
          doc.text(formatPdfCurrency(tx.amount, tx.currency || envCurrency), colX[2] + 3, y + 4.5);
        }

        doc.text(formatPdfCurrency(tx.runningBalance, envCurrency), colX[3] + 3, y + 4.5);

        y += 6.5;
      });
    }

    y += 8;
  });

  doc.save(`cash_envelope_budget_bw_${new Date().toISOString().split('T')[0]}.pdf`);
}
