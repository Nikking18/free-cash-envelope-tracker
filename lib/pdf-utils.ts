import { Envelope, Expense } from './tracker-types';
import { formatCurrency, convertCurrency } from './currency-utils';

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
  mainCurrency: string = 'USD'
) {
  if (style === 'minimal-bw') {
    return generateMinimalBwPDF(envelopes, expenses, budgetPeriod, notes, mainCurrency);
  }
  return generateClassicPDF(envelopes, expenses, budgetPeriod, notes, mainCurrency);
}

// Helper to render a solid filled neobrutalist badge for envelope name in Classic template
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
  const badgeWidth = Math.max(textWidth + 6, 16); // minimum 16mm width
  const badgeHeight = 4.8;
  const badgeY = rowY + (rowHeight - badgeHeight) / 2;
  const badgeX = startX + 3;

  // Solid background fill + solid black border
  doc.setFillColor(r, g, b);
  doc.setDrawColor(20, 20, 20); // crisp neobrutalist border
  doc.setLineWidth(0.3);
  doc.rect(badgeX, badgeY, badgeWidth, badgeHeight, 'FD');

  // Centered bold white text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(displayString, badgeX + badgeWidth / 2, badgeY + 3.4, { align: 'center' });
}

// ---------------------------------------------------------------------------
// CLASSIC MINIMAL TEMPLATE (Elegant Cash Envelope Ledger Style)
// ---------------------------------------------------------------------------
async function generateClassicPDF(
  envelopes: Envelope[],
  expenses: Expense[],
  budgetPeriod: string = '',
  notes: string = '',
  mainCurrency: string = 'USD'
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

  // Inner frame line
  doc.setLineWidth(0.3);
  doc.rect(margin + 1.2, y + 1.2, contentWidth - 2.4, 19.6, 'S');

  // Title: "CASH ENVELOPE" in Times Bold + " Tracker" in Times Italic
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text('CASH ENVELOPE', margin + 6, y + 10);

  const titleWidth = doc.getTextWidth('CASH ENVELOPE');
  doc.setFont('times', 'italic');
  doc.setFontSize(16);
  doc.setTextColor(209, 95, 71); // Terracotta accent
  doc.text(' Tracker', margin + 6 + titleWidth, y + 10);

  // Subtitle / Date & Budget Period
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const periodStr = budgetPeriod && budgetPeriod.trim().length > 0 ? budgetPeriod.trim() : '___________________';
  doc.text(`Date: ${todayStr}   |   Budget Period: ${periodStr}`, margin + 6, y + 16.5);

  y += 22 + 7; // Header height + gap

  // Calculate Totals in Main Currency
  const totalAllocated = envelopes.reduce((acc, e) => {
    return acc + convertCurrency(e.allocated, e.currency || mainCurrency, mainCurrency);
  }, 0);

  const envelopeSpentMap = new Map<string, number>();
  envelopes.forEach((e) => envelopeSpentMap.set(e.id, 0));

  expenses.forEach((exp) => {
    const current = envelopeSpentMap.get(exp.envelopeId) || 0;
    const env = envelopes.find((e) => e.id === exp.envelopeId);
    const envCurr = env?.currency || mainCurrency;
    const convertedAmt = convertCurrency(exp.amount, exp.currency || mainCurrency, envCurr);
    envelopeSpentMap.set(exp.envelopeId, current + convertedAmt);
  });

  const totalSpent = envelopes.reduce((acc, env) => {
    const spentInEnvCurr = envelopeSpentMap.get(env.id) || 0;
    return acc + convertCurrency(spentInEnvCurr, env.currency || mainCurrency, mainCurrency);
  }, 0);

  const totalRemaining = totalAllocated - totalSpent;

  // --- 2. KEY SUMMARY METRIC CARDS ---
  const cardWidth = (contentWidth - 8) / 3;
  const cardHeight = 17;

  // Card 1: Total Allocated
  doc.setLineWidth(0.8);
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(margin, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(92, 118, 141); // Slate Blue accent
  doc.rect(margin, y, cardWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 20, 20);
  doc.text('TOTAL ALLOCATED', margin + 4, y + 7);
  doc.setFontSize(11);
  doc.text(formatCurrency(totalAllocated, mainCurrency), margin + 4, y + 14);

  // Card 2: Total Spent
  const card2X = margin + cardWidth + 4;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card2X, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(209, 95, 71); // Terracotta accent
  doc.rect(card2X, y, cardWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 20, 20);
  doc.text('TOTAL SPENT', card2X + 4, y + 7);
  doc.setFontSize(11);
  doc.setTextColor(209, 95, 71);
  doc.text(formatCurrency(totalSpent, mainCurrency), card2X + 4, y + 14);

  // Card 3: Total Remaining
  const card3X = card2X + cardWidth + 4;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card3X, y, cardWidth, cardHeight, 'FD');
  const remColorRGB = totalRemaining < 0 ? [209, 95, 71] : [138, 154, 91];
  doc.setFillColor(remColorRGB[0], remColorRGB[1], remColorRGB[2]);
  doc.rect(card3X, y, cardWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 20, 20);
  doc.text('REMAINING BALANCE', card3X + 4, y + 7);
  doc.setFontSize(11);
  doc.setTextColor(remColorRGB[0], remColorRGB[1], remColorRGB[2]);
  doc.text(formatCurrency(totalRemaining, mainCurrency), card3X + 4, y + 14);

  y += cardHeight + 10; // Dynamic spacing to next section

  // --- 3. ENVELOPES BREAKDOWN SECTION ---
  const envColX = [margin, margin + 55, margin + 85, margin + 115, margin + 145];

  const drawEnvTableHeader = (startY: number) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(margin, startY, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('ENVELOPE NAME', envColX[0] + 3, startY + 4.5);
    doc.text('CATEGORY', envColX[1] + 3, startY + 4.5);
    doc.text('ALLOCATED', envColX[2] + 3, startY + 4.5);
    doc.text('SPENT', envColX[3] + 3, startY + 4.5);
    doc.text('REMAINING', envColX[4] + 3, startY + 4.5);
  };

  // Dynamic height check before section start
  if (y + 20 > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('ENVELOPES BREAKDOWN', margin, y);
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

    const spent = envelopeSpentMap.get(env.id) || 0;
    const remaining = env.allocated - spent;

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

    // Solid badge for Envelope Name
    drawEnvelopeBadge(doc, env.name, env.color, envColX[0], y, 8, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(env.category, envColX[1] + 3, y + 5.2);

    const envCurrency = env.currency || mainCurrency;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(formatCurrency(env.allocated, envCurrency), envColX[2] + 3, y + 5.2);

    doc.setTextColor(209, 95, 71);
    doc.text(formatCurrency(spent, envCurrency), envColX[3] + 3, y + 5.2);

    if (remaining < 0) {
      doc.setTextColor(209, 95, 71);
      doc.setFont('helvetica', 'bold');
      doc.text(`-${formatCurrency(Math.abs(remaining), envCurrency)} (OVER)`, envColX[4] + 3, y + 5.2);
    } else {
      doc.setTextColor(138, 154, 91);
      doc.setFont('helvetica', 'normal');
      doc.text(formatCurrency(remaining, envCurrency), envColX[4] + 3, y + 5.2);
    }

    y += 8;
  });

  y += 10; // Dynamic gap after Envelopes Breakdown section

  // --- 4. TRANSACTION HISTORY SECTION ---
  const txColX = [margin, margin + 30, margin + 75, margin + 145];

  const drawTxTableHeader = (startY: number) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(margin, startY, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('DATE', txColX[0] + 3, startY + 4.5);
    doc.text('ENVELOPE', txColX[1] + 3, startY + 4.5);
    doc.text('NOTE / DESCRIPTION', txColX[2] + 3, startY + 4.5);
    doc.text('AMOUNT', txColX[3] + 3, startY + 4.5);
  };

  if (y + 20 > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('TRANSACTION HISTORY', margin, y);
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
    doc.text('No transaction expenses logged yet.', margin + 3, y + 4.8);
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
      doc.setFontSize(8);
      doc.setTextColor(20, 20, 20);
      doc.text(exp.date, txColX[0] + 3, y + 4.8);

      const env = envObjMap.get(exp.envelopeId);
      const envName = env?.name || 'Unknown';
      const envColor = env?.color || '#8A9A5B';

      // Solid badge for Envelope Name in Transaction Table
      drawEnvelopeBadge(doc, envName, envColor, txColX[1], y, 7, 45);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(20, 20, 20);
      let noteDisplay = exp.note || '-';
      if (noteDisplay.length > 32) noteDisplay = noteDisplay.substring(0, 29) + '...';
      doc.text(noteDisplay, txColX[2] + 3, y + 4.8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(209, 95, 71);
      doc.text(formatCurrency(exp.amount, exp.currency || mainCurrency), txColX[3] + 3, y + 4.8);

      y += 7;
    });
  }

  y += 10; // Dynamic gap after Transaction History section

  // --- 5. NOTES & BUDGET REMINDERS SECTION ---
  const hasNotes = notes && notes.trim().length > 0;
  const notesBoxHeight = 32;
  const requiredNotesHeight = 15 + notesBoxHeight;

  if (y + requiredNotesHeight > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text('NOTES & BUDGET REMINDERS', margin, y);

  if (!hasNotes) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text('You can print this page and write in your own notes and reminders by hand.', margin, y + 4.5);
    y += 8;
  } else {
    y += 5;
  }

  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.setDrawColor(20, 20, 20);
  doc.rect(margin, y, contentWidth, notesBoxHeight, 'FD');

  if (hasNotes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);
    const splitNotes = doc.splitTextToSize(notes.trim(), contentWidth - 8);
    const maxLines = 5;
    const linesToDraw = splitNotes.slice(0, maxLines);
    linesToDraw.forEach((lineText: string, lIdx: number) => {
      doc.text(lineText, margin + 4, y + 5.5 + lIdx * 5.5);
    });
  } else {
    doc.setLineWidth(0.15);
    doc.setDrawColor(200, 200, 200);
    for (let lineY = y + 8; lineY < y + notesBoxHeight; lineY += 8) {
      doc.line(margin + 4, lineY, margin + contentWidth - 4, lineY);
    }
  }

  doc.save(`cash_envelope_budget_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ---------------------------------------------------------------------------
// MINIMAL B&W TEMPLATE (Pure Black & White Household Print Friendly)
// ---------------------------------------------------------------------------
async function generateMinimalBwPDF(
  envelopes: Envelope[],
  expenses: Expense[],
  budgetPeriod: string = '',
  notes: string = '',
  mainCurrency: string = 'USD'
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

  // Enforce pure white fill default across jsPDF canvas
  doc.setFillColor(255, 255, 255);

  // --- 1. HEADER BANNER (Stroke Only) ---
  doc.setLineWidth(0.8);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, contentWidth, 22, 'S');

  // Inner frame line
  doc.setLineWidth(0.2);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin + 1.2, y + 1.2, contentWidth - 2.4, 19.6, 'S');

  // Title: Serif Caps "CASH ENVELOPE" + Cursive/Italics Accent " Tracker"
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('CASH ENVELOPE', margin + 6, y + 10);

  const titleWidth = doc.getTextWidth('CASH ENVELOPE');
  doc.setFont('times', 'italic');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(' Tracker', margin + 6 + titleWidth, y + 10);

  // Subtitle / Date & Budget Period
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const periodStr = budgetPeriod && budgetPeriod.trim().length > 0 ? budgetPeriod.trim() : '___________________';
  doc.text(`Date: ${todayStr}   |   Budget Period: ${periodStr}`, margin + 6, y + 16.5);

  y += 22 + 8; // Header height + gap

  // Calculate Totals in Main Currency
  const totalAllocated = envelopes.reduce((acc, e) => {
    return acc + convertCurrency(e.allocated, e.currency || mainCurrency, mainCurrency);
  }, 0);

  const envelopeSpentMap = new Map<string, number>();
  envelopes.forEach((e) => envelopeSpentMap.set(e.id, 0));

  expenses.forEach((exp) => {
    const current = envelopeSpentMap.get(exp.envelopeId) || 0;
    const env = envelopes.find((e) => e.id === exp.envelopeId);
    const envCurr = env?.currency || mainCurrency;
    const convertedAmt = convertCurrency(exp.amount, exp.currency || mainCurrency, envCurr);
    envelopeSpentMap.set(exp.envelopeId, current + convertedAmt);
  });

  const totalSpent = envelopes.reduce((acc, env) => {
    const spentInEnvCurr = envelopeSpentMap.get(env.id) || 0;
    return acc + convertCurrency(spentInEnvCurr, env.currency || mainCurrency, mainCurrency);
  }, 0);

  const totalRemaining = totalAllocated - totalSpent;

  // --- 2. KEY SUMMARY METRIC CARDS (PURE B&W STROKE ONLY) ---
  const cardWidth = (contentWidth - 8) / 3;
  const cardHeight = 16;

  // Card 1: Total Allocated
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL ALLOCATED', margin + 4, y + 6);
  doc.setFontSize(11);
  doc.text(formatCurrency(totalAllocated, mainCurrency), margin + 4, y + 13);

  // Card 2: Total Spent
  const card2X = margin + cardWidth + 4;
  doc.rect(card2X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('TOTAL SPENT', card2X + 4, y + 6);
  doc.setFontSize(11);
  doc.text(formatCurrency(totalSpent, mainCurrency), card2X + 4, y + 13);

  // Card 3: Total Remaining
  const card3X = card2X + cardWidth + 4;
  doc.rect(card3X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('REMAINING BALANCE', card3X + 4, y + 6);
  doc.setFontSize(11);
  const remText = totalRemaining < 0
    ? `-${formatCurrency(Math.abs(totalRemaining), mainCurrency)} (OVER)`
    : formatCurrency(totalRemaining, mainCurrency);
  doc.text(remText, card3X + 4, y + 13);

  y += cardHeight + 10; // Dynamic spacing to next section

  // --- 3. PER-ENVELOPE BORDERED LEDGER BOXES ---
  if (y + 25 > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('ENVELOPE LEDGERS', margin, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Individual envelope tracking boxes with chronological transactions and running balance calculation.', margin, y + 4.5);

  y += 8;

  const displayEnvelopes = envelopes.length > 0 ? envelopes : [
    { id: 'default_1', name: 'Groceries', allocated: 200, category: 'Essential' as const, color: '#000000' },
    { id: 'default_2', name: 'Utilities', allocated: 150, category: 'Essential' as const, color: '#000000' },
  ];

  displayEnvelopes.forEach((env) => {
    // Filter and sort transactions for this envelope chronologically (oldest date first)
    const envExpenses = expenses
      .filter((exp) => exp.envelopeId === env.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Compute running balance starting from allocated amount
    let currentBalance = env.allocated;
    const txRows = envExpenses.map((exp) => {
      currentBalance -= exp.amount;
      return {
        ...exp,
        runningBalance: currentBalance,
      };
    });

    const isBlankTable = txRows.length === 0;
    const rowCount = isBlankTable ? 3 : txRows.length;
    const boxHeight = 7 + 6 + (rowCount * 6.5);

    // Dynamic page break check before rendering envelope box
    if (y + Math.min(boxHeight, 25) > 270) {
      doc.addPage();
      y = 15;
    }

    // Envelope Box Header Bar (Mapping: CATEGORY -> Envelope Name, TOTAL BALANCE -> Allocated Amount)
    doc.setLineWidth(0.4);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 7, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`CATEGORY / ENVELOPE: ${env.name.toUpperCase()} (${env.category.toUpperCase()})`, margin + 3, y + 4.8);

    const envCurrency = env.currency || mainCurrency;
    const allocText = `TOTAL BALANCE: ${formatCurrency(env.allocated, envCurrency)}`;
    const allocWidth = doc.getTextWidth(allocText);
    doc.text(allocText, margin + contentWidth - 3 - allocWidth, y + 4.8);

    y += 7;

    // Table Column Header Bar
    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 6, 'S');

    const colX = [margin, margin + 30, margin + 110, margin + 145];
    colX.slice(1).forEach((xPos) => {
      doc.line(xPos, y, xPos, y + 6);
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text('DATE', colX[0] + 3, y + 4.2);
    doc.text('DESCRIPTION / NOTE', colX[1] + 3, y + 4.2);
    doc.text('AMOUNT (-)', colX[2] + 3, y + 4.2);
    doc.text('RUNNING BALANCE', colX[3] + 3, y + 4.2);

    y += 6;

    // Table Rows (Ruled blank lines if 0 transactions, otherwise chronological txs with running balance)
    if (isBlankTable) {
      for (let i = 0; i < 3; i++) {
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

          // Redraw table header on new page
          doc.setLineWidth(0.3);
          doc.setDrawColor(0, 0, 0);
          doc.rect(margin, y, contentWidth, 6, 'S');
          colX.slice(1).forEach((xPos) => {
            doc.line(xPos, y, xPos, y + 6);
          });
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(0, 0, 0);
          doc.text('DATE', colX[0] + 3, y + 4.2);
          doc.text('DESCRIPTION / NOTE', colX[1] + 3, y + 4.2);
          doc.text('AMOUNT (-)', colX[2] + 3, y + 4.2);
          doc.text('RUNNING BALANCE', colX[3] + 3, y + 4.2);
          y += 6;
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
        doc.text(formatCurrency(tx.amount, tx.currency || envCurrency), colX[2] + 3, y + 4.5);

        // Running balance
        doc.text(formatCurrency(tx.runningBalance, envCurrency), colX[3] + 3, y + 4.5);

        y += 6.5;
      });
    }

    y += 8; // Gap between envelope ledger boxes
  });

  // --- 4. NOTES & BUDGET REMINDERS SECTION ---
  const hasNotes = notes && notes.trim().length > 0;
  const notesBoxHeight = 30;
  const requiredNotesHeight = 15 + notesBoxHeight;

  if (y + requiredNotesHeight > 270) {
    doc.addPage();
    y = 15;
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('NOTES & BUDGET REMINDERS', margin, y);

  if (!hasNotes) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    doc.text('You can print this page and write in your own notes and reminders by hand.', margin, y + 4.5);
    y += 8;
  } else {
    y += 5;
  }

  doc.setLineWidth(0.4);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, contentWidth, notesBoxHeight, 'S');

  if (hasNotes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    const splitNotes = doc.splitTextToSize(notes.trim(), contentWidth - 8);
    const maxLines = 5;
    const linesToDraw = splitNotes.slice(0, maxLines);
    linesToDraw.forEach((lineText: string, lIdx: number) => {
      doc.text(lineText, margin + 4, y + 5.5 + lIdx * 5.5);
    });
  } else {
    doc.setLineWidth(0.15);
    doc.setDrawColor(180, 180, 180);
    for (let lineY = y + 7.5; lineY < y + notesBoxHeight; lineY += 7.5) {
      doc.line(margin + 4, lineY, margin + contentWidth - 4, lineY);
    }
  }

  doc.save(`cash_envelope_budget_bw_${new Date().toISOString().split('T')[0]}.pdf`);
}

