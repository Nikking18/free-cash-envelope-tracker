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

/** Detect active language from passed param, Google Translate cookie, or html lang element */
function getEffectiveLanguage(passedLang?: string): string {
  if (passedLang && ['en', 'es', 'fr', 'de'].includes(passedLang)) {
    return passedLang;
  }
  if (typeof window !== 'undefined') {
    try {
      const cookies = document.cookie.split(';');
      for (const c of cookies) {
        const trimmed = c.trim();
        if (trimmed.startsWith('googtrans=')) {
          const match = trimmed.match(/\/en\/([a-z]{2})/i);
          if (match && match[1]) {
            const code = match[1].toLowerCase();
            if (['en', 'es', 'fr', 'de'].includes(code)) return code;
          }
        }
      }
      const htmlLang = document.documentElement.lang;
      if (htmlLang) {
        const code = htmlLang.substring(0, 2).toLowerCase();
        if (['en', 'es', 'fr', 'de'].includes(code)) return code;
      }
    } catch (e) {
      console.error('Failed to detect language from cookies/DOM:', e);
    }
  }
  return 'en';
}

/** Detect if an expense record is a cash addition (negative amount or type='addCash') */
function isAddCash(exp: Expense): boolean {
  return exp.type === 'addCash' || exp.amount < 0;
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
  const effectiveLang = getEffectiveLanguage(language);

  if (style === 'minimal-bw') {
    return generateMinimalBwPDF(envelopes, expenses, budgetPeriod, notes, mainCurrency, effectiveLang);
  }
  return generateClassicPDF(envelopes, expenses, budgetPeriod, notes, mainCurrency, effectiveLang);
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
  doc.setFontSize(7);

  let displayString = envName;
  const maxBadgeWidth = maxColWidth - 5;

  if (doc.getTextWidth(displayString) + 5 > maxBadgeWidth) {
    while (displayString.length > 3 && doc.getTextWidth(displayString + '...') + 5 > maxBadgeWidth) {
      displayString = displayString.slice(0, -1);
    }
    displayString = displayString + '...';
  }

  const textWidth = doc.getTextWidth(displayString);
  const badgeWidth = Math.max(textWidth + 5, 14);
  const badgeHeight = 4.2;
  const badgeY = rowY + (rowHeight - badgeHeight) / 2;
  const badgeX = startX + 2.5;

  doc.setFillColor(r, g, b);
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.3);
  doc.rect(badgeX, badgeY, badgeWidth, badgeHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(displayString, badgeX + badgeWidth / 2, badgeY + 3.0, { align: 'center' });
}

// ---------------------------------------------------------------------------
// CLASSIC MINIMAL TEMPLATE (Color Accents, 4 Metric Cards, Envelope Breakdown, Transactions, Notes)
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
  const contentWidth = pageWidth - margin * 2; // 180mm

  let y = 12;

  // --- 1. HEADER BANNER ---
  doc.setLineWidth(0.8);
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(252, 250, 247);
  doc.rect(margin, y, contentWidth, 18, 'FD');

  doc.setLineWidth(0.3);
  doc.rect(margin + 1, y + 1, contentWidth - 2, 16, 'S');

  const titlePart1 = t('pdfDocTitle', language).toUpperCase();
  const titlePart2 = `${t('pdfDocSubtitle', language)}`;
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text(titlePart1, margin + 5, y + 8);

  const titleWidth = doc.getTextWidth(titlePart1);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(209, 95, 71);
  doc.text(titlePart2, margin + 7 + titleWidth, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);

  const dateLocale = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-US';
  const todayStr = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const periodStr = budgetPeriod && budgetPeriod.trim().length > 0 ? budgetPeriod.trim() : '___________________';
  doc.text(`${t('pdfDateLabel', language)}: ${todayStr}   |   ${t('pdfPeriodLabel', language)}: ${periodStr}`, margin + 5, y + 13.5);

  y += 18 + 5;

  // Calculate Totals
  const totalAllocated = envelopes.reduce((acc, e) =>
    acc + convertCurrency(e.allocated, e.currency || mainCurrency, mainCurrency), 0);

  const envelopeSpentMap = new Map<string, number>();
  const envelopeCashAddedMap = new Map<string, number>();
  envelopes.forEach((e) => {
    envelopeSpentMap.set(e.id, 0);
    envelopeCashAddedMap.set(e.id, 0);
  });

  expenses.forEach((exp) => {
    const env = envelopes.find((e) => e.id === exp.envelopeId);
    const envCurr = env?.currency || mainCurrency;
    const rawAmt = Math.abs(exp.amount);
    const convertedAmt = convertCurrency(rawAmt, exp.currency || mainCurrency, envCurr);

    if (isAddCash(exp)) {
      const current = envelopeCashAddedMap.get(exp.envelopeId) || 0;
      envelopeCashAddedMap.set(exp.envelopeId, current + convertedAmt);
    } else {
      const current = envelopeSpentMap.get(exp.envelopeId) || 0;
      envelopeSpentMap.set(exp.envelopeId, current + convertedAmt);
    }
  });

  const totalSpent = expenses
    .filter(exp => !isAddCash(exp))
    .reduce((acc, exp) => acc + convertCurrency(Math.abs(exp.amount), exp.currency || mainCurrency, mainCurrency), 0);

  const totalCashAdded = expenses
    .filter(exp => isAddCash(exp))
    .reduce((acc, exp) => acc + convertCurrency(Math.abs(exp.amount), exp.currency || mainCurrency, mainCurrency), 0);

  const totalRemaining = totalAllocated + totalCashAdded - totalSpent;

  // --- 2. KEY SUMMARY METRIC CARDS (4 cards) ---
  const cardWidth = (contentWidth - 9) / 4; // ~42.75mm
  const cardHeight = 15;

  // Card 1: Total Allocated
  doc.setLineWidth(0.6);
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(margin, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(92, 118, 141);
  doc.rect(margin, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfAllocatedCard', language), margin + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(totalAllocated, mainCurrency), margin + 3, y + 12.5);

  // Card 2: Total Cash Added
  const card2X = margin + cardWidth + 3;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card2X, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(5, 150, 105);
  doc.rect(card2X, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfCashAddedCard', language), card2X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.setTextColor(5, 150, 105);
  doc.text(`+${formatPdfCurrency(totalCashAdded, mainCurrency)}`, card2X + 3, y + 12.5);

  // Card 3: Total Spent
  const card3X = card2X + cardWidth + 3;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card3X, y, cardWidth, cardHeight, 'FD');
  doc.setFillColor(209, 95, 71);
  doc.rect(card3X, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfSpentCard', language), card3X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.setTextColor(209, 95, 71);
  doc.text(`-${formatPdfCurrency(totalSpent, mainCurrency)}`, card3X + 3, y + 12.5);

  // Card 4: Total Remaining
  const card4X = card3X + cardWidth + 3;
  doc.setDrawColor(20, 20, 20);
  doc.setFillColor(244, 241, 234);
  doc.rect(card4X, y, cardWidth, cardHeight, 'FD');
  const remColorRGB = totalRemaining < 0 ? [209, 95, 71] : [138, 154, 91];
  doc.setFillColor(remColorRGB[0], remColorRGB[1], remColorRGB[2]);
  doc.rect(card4X, y, cardWidth, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfRemainingCard', language), card4X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.setTextColor(remColorRGB[0], remColorRGB[1], remColorRGB[2]);
  doc.text(formatPdfCurrency(totalRemaining, mainCurrency), card4X + 3, y + 12.5);

  y += cardHeight + 5;

  // --- 3. ENVELOPES BREAKDOWN SECTION ---
  // Columns: Envelope Name (36), Category (28), Allocated (26), Cash Added (27), Spent (24), Available Balance (39)
  const envColX = [margin, margin + 36, margin + 64, margin + 90, margin + 117, margin + 141];

  const drawEnvTableHeader = (startY: number) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(margin, startY, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(t('pdfEnvNameHeader', language), envColX[0] + 2.5, startY + 3.8);
    doc.text(t('pdfCategoryHeader', language), envColX[1] + 2.5, startY + 3.8);
    doc.text(t('pdfAllocatedHeader', language), envColX[2] + 2.5, startY + 3.8);
    doc.text(t('pdfCashAddedHeader', language), envColX[3] + 2.5, startY + 3.8);
    doc.text(t('pdfSpentHeader', language), envColX[4] + 2.5, startY + 3.8);
    doc.text(t('pdfRemainingHeader', language), envColX[5] + 2.5, startY + 3.8);
  };

  if (y + 15 > 275) { doc.addPage(); y = 12; }

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfEnvelopesSection', language), margin, y);
  y += 4;

  drawEnvTableHeader(y);
  y += 5.5;

  envelopes.forEach((env, index) => {
    if (y + 5.5 > 275) { doc.addPage(); y = 12; drawEnvTableHeader(y); y += 5.5; }

    const spent = envelopeSpentMap.get(env.id) || 0;
    const cashAdded = envelopeCashAddedMap.get(env.id) || 0;
    const remaining = env.allocated + cashAdded - spent;

    if (index % 2 === 0) {
      doc.setFillColor(250, 248, 245);
      doc.rect(margin, y, contentWidth, 5.5, 'F');
    }

    doc.setLineWidth(0.2);
    doc.setDrawColor(180, 180, 180);
    doc.rect(margin, y, contentWidth, 5.5, 'S');
    envColX.slice(1).forEach((xPos) => { doc.line(xPos, y, xPos, y + 5.5); });

    drawEnvelopeBadge(doc, env.name, env.color, envColX[0], y, 5.5, 36);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(t(`cat${env.category}`, language), envColX[1] + 2.5, y + 3.8);

    const envCurrency = env.currency || mainCurrency;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(formatPdfCurrency(env.allocated, envCurrency), envColX[2] + 2.5, y + 3.8);

    doc.setTextColor(5, 150, 105);
    doc.text(cashAdded > 0 ? `+${formatPdfCurrency(cashAdded, envCurrency)}` : '—', envColX[3] + 2.5, y + 3.8);

    doc.setTextColor(209, 95, 71);
    doc.text(spent > 0 ? `-${formatPdfCurrency(spent, envCurrency)}` : '—', envColX[4] + 2.5, y + 3.8);

    if (remaining < 0) {
      doc.setTextColor(209, 95, 71);
      doc.text(`-${formatPdfCurrency(Math.abs(remaining), envCurrency)}`, envColX[5] + 2.5, y + 3.8);
    } else {
      doc.setTextColor(138, 154, 91);
      doc.setFont('helvetica', 'normal');
      doc.text(formatPdfCurrency(remaining, envCurrency), envColX[5] + 2.5, y + 3.8);
    }
    y += 5.5;
  });

  y += 5;

  // --- 4. TRANSACTION HISTORY SECTION ---
  // Columns: Date (24), Envelope (36), Type (22), Note/Vendor (60), Amount (38)
  const txColX = [margin, margin + 24, margin + 60, margin + 82, margin + 142];

  const drawTxTableHeader = (startY: number) => {
    doc.setFillColor(20, 20, 20);
    doc.rect(margin, startY, contentWidth, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text(t('pdfDateHeader', language), txColX[0] + 2.5, startY + 3.8);
    doc.text(t('pdfEnvNameHeader', language), txColX[1] + 2.5, startY + 3.8);
    doc.text(t('pdfTypeHeader', language), txColX[2] + 2.5, startY + 3.8);
    doc.text(t('pdfDescHeader', language), txColX[3] + 2.5, startY + 3.8);
    doc.text(t('pdfAmountHeader', language), txColX[4] + 2.5, startY + 3.8);
  };

  if (y + 15 > 275) { doc.addPage(); y = 12; }

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(t('pdfTxSection', language), margin, y);
  y += 4;

  drawTxTableHeader(y);
  y += 5.5;

  const envObjMap = new Map<string, Envelope>();
  envelopes.forEach((e) => envObjMap.set(e.id, e));

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedExpenses.length === 0) {
    doc.setLineWidth(0.2);
    doc.setDrawColor(180, 180, 180);
    doc.rect(margin, y, contentWidth, 5.5, 'S');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text('—', margin + 3, y + 3.8);
    y += 5.5;
  } else {
    sortedExpenses.forEach((exp, index) => {
      if (y + 5.5 > 275) { doc.addPage(); y = 12; drawTxTableHeader(y); y += 5.5; }

      if (index % 2 === 0) {
        doc.setFillColor(250, 248, 245);
        doc.rect(margin, y, contentWidth, 5.5, 'F');
      }

      doc.setLineWidth(0.2);
      doc.setDrawColor(180, 180, 180);
      doc.rect(margin, y, contentWidth, 5.5, 'S');
      txColX.slice(1).forEach((xPos) => { doc.line(xPos, y, xPos, y + 5.5); });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(20, 20, 20);
      doc.text(exp.date, txColX[0] + 2.5, y + 3.8);

      const env = envObjMap.get(exp.envelopeId);
      const envName = env?.name || 'Unknown';
      const envColor = env?.color || '#8A9A5B';
      drawEnvelopeBadge(doc, envName, envColor, txColX[1], y, 5.5, 36);

      const addCash = isAddCash(exp);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      if (addCash) {
        doc.setTextColor(5, 150, 105);
        doc.text(t('pdfTypeAddCash', language), txColX[2] + 2.5, y + 3.8);
      } else {
        doc.setTextColor(209, 95, 71);
        doc.text(t('pdfTypeExpense', language), txColX[2] + 2.5, y + 3.8);
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(20, 20, 20);
      let noteDisplay = exp.note || '-';
      if (noteDisplay.length > 32) noteDisplay = noteDisplay.substring(0, 29) + '...';
      doc.text(noteDisplay, txColX[3] + 2.5, y + 3.8);

      doc.setFont('helvetica', 'bold');
      const displayAmt = formatPdfCurrency(Math.abs(exp.amount), exp.currency || mainCurrency);
      if (addCash) {
        doc.setTextColor(5, 150, 105);
        doc.text(`+${displayAmt}`, txColX[4] + 2.5, y + 3.8);
      } else {
        doc.setTextColor(209, 95, 71);
        doc.text(`-${displayAmt}`, txColX[4] + 2.5, y + 3.8);
      }

      y += 5.5;
    });
  }

  y += 5;

  // --- 5. NOTES & BUDGET REMINDERS SECTION ---
  const hasNotes = notes && notes.trim().length > 0;

  const notesTitleText = `${t('notesRemindersTitle', language)} ${t('optionalLabel', language)}`;
  const subtitlePrompt = hasNotes ? t('notesRemindersDesc', language) : t('pdfHandwritingText', language);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  const splitSubLines = doc.splitTextToSize(subtitlePrompt, contentWidth);
  const subtitleHeight = splitSubLines.length * 3.5 + 2;

  const splitNotesLines = hasNotes ? doc.splitTextToSize(notes.trim(), contentWidth - 8) : [];
  const notesBoxHeight = hasNotes ? Math.max(splitNotesLines.length * 5 + 6, 24) : 24;

  const totalNotesSectionHeight = 5 + subtitleHeight + notesBoxHeight;

  if (y + totalNotesSectionHeight > 275) {
    doc.addPage();
    y = 12;
  }

  // Section Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(notesTitleText, margin, y);
  y += 4;

  // Subtitle / Instruction Text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(90, 90, 90);
  splitSubLines.forEach((subLine: string) => {
    doc.text(subLine, margin, y);
    y += 3.5;
  });
  y += 1.5;

  // Render Box
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.setDrawColor(20, 20, 20);
  doc.rect(margin, y, contentWidth, notesBoxHeight, 'FD');

  if (hasNotes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(20, 20, 20);
    splitNotesLines.forEach((lineText: string, lIdx: number) => {
      doc.text(lineText, margin + 4, y + 5 + lIdx * 5);
    });
  } else {
    doc.setLineWidth(0.15);
    doc.setDrawColor(200, 200, 200);
    for (let lineY = y + 6; lineY < y + notesBoxHeight - 2; lineY += 6) {
      doc.line(margin + 4, lineY, margin + contentWidth - 4, lineY);
    }
  }

  doc.save(`cash_envelope_budget_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ---------------------------------------------------------------------------
// MINIMAL B&W TEMPLATE (Pure Black & White, 4 Metric Cards, Per-Envelope Bordered Ledgers, Notes)
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
  const contentWidth = pageWidth - margin * 2; // 180mm

  let y = 12;

  doc.setFillColor(255, 255, 255);

  // --- 1. HEADER BANNER ---
  doc.setLineWidth(0.8);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, contentWidth, 18, 'S');

  doc.setLineWidth(0.2);
  doc.rect(margin + 1, y + 1, contentWidth - 2, 16, 'S');

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  const bwTitle = t('pdfDocTitle', language).toUpperCase();
  doc.text(bwTitle, margin + 5, y + 8);

  const bwTitleWidth = doc.getTextWidth(bwTitle);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.text(`${t('pdfDocSubtitle', language)}`, margin + 7 + bwTitleWidth, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  const dateLocale = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-US';
  const todayStr = new Date().toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const periodStr = budgetPeriod && budgetPeriod.trim().length > 0 ? budgetPeriod.trim() : '___________________';
  doc.text(`${t('pdfDateLabel', language)}: ${todayStr}   |   ${t('pdfPeriodLabel', language)}: ${periodStr}`, margin + 5, y + 13.5);

  y += 18 + 5;

  // Calculate Totals
  const totalAllocated = envelopes.reduce((acc, e) =>
    acc + convertCurrency(e.allocated, e.currency || mainCurrency, mainCurrency), 0);

  const envelopeSpentMap = new Map<string, number>();
  const envelopeCashAddedMap = new Map<string, number>();
  envelopes.forEach((e) => {
    envelopeSpentMap.set(e.id, 0);
    envelopeCashAddedMap.set(e.id, 0);
  });

  expenses.forEach((exp) => {
    const env = envelopes.find((e) => e.id === exp.envelopeId);
    const envCurr = env?.currency || mainCurrency;
    const rawAmt = Math.abs(exp.amount);
    const convertedAmt = convertCurrency(rawAmt, exp.currency || mainCurrency, envCurr);
    if (isAddCash(exp)) {
      const current = envelopeCashAddedMap.get(exp.envelopeId) || 0;
      envelopeCashAddedMap.set(exp.envelopeId, current + convertedAmt);
    } else {
      const current = envelopeSpentMap.get(exp.envelopeId) || 0;
      envelopeSpentMap.set(exp.envelopeId, current + convertedAmt);
    }
  });

  const totalSpent = expenses
    .filter(exp => !isAddCash(exp))
    .reduce((acc, exp) => acc + convertCurrency(Math.abs(exp.amount), exp.currency || mainCurrency, mainCurrency), 0);

  const totalCashAdded = expenses
    .filter(exp => isAddCash(exp))
    .reduce((acc, exp) => acc + convertCurrency(Math.abs(exp.amount), exp.currency || mainCurrency, mainCurrency), 0);

  const totalRemaining = totalAllocated + totalCashAdded - totalSpent;

  // --- 2. KEY SUMMARY METRIC CARDS (4 cards, B&W) ---
  const cardWidth = (contentWidth - 9) / 4;
  const cardHeight = 15;

  // Card 1: Total Allocated
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text(t('pdfAllocatedCard', language), margin + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(totalAllocated, mainCurrency), margin + 3, y + 12.5);

  // Card 2: Total Cash Added
  const card2X = margin + cardWidth + 3;
  doc.rect(card2X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text(t('pdfCashAddedCard', language), card2X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(`+${formatPdfCurrency(totalCashAdded, mainCurrency)}`, card2X + 3, y + 12.5);

  // Card 3: Total Spent
  const card3X = card2X + cardWidth + 3;
  doc.rect(card3X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text(t('pdfSpentCard', language), card3X + 3, y + 6);
  doc.setFontSize(9.5);
  doc.text(`-${formatPdfCurrency(totalSpent, mainCurrency)}`, card3X + 3, y + 12.5);

  // Card 4: Total Remaining
  const card4X = card3X + cardWidth + 3;
  doc.rect(card4X, y, cardWidth, cardHeight, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text(t('pdfRemainingCard', language), card4X + 3, y + 6);
  doc.setFontSize(9.5);
  const remText = totalRemaining < 0
    ? `-${formatPdfCurrency(Math.abs(totalRemaining), mainCurrency)}`
    : formatPdfCurrency(totalRemaining, mainCurrency);
  doc.text(remText, card4X + 3, y + 12.5);

  y += cardHeight + 5;

  // --- 3. PER-ENVELOPE BORDERED LEDGER BOXES ---
  if (y + 20 > 275) { doc.addPage(); y = 12; }

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(t('pdfEnvelopeLedgers', language), margin, y);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text(t('pdfEnvelopeLedgersSubtitle', language), margin, y + 4);

  y += 7;

  const displayEnvelopes = envelopes.length > 0 ? envelopes : [
    { id: 'default_1', name: 'Groceries', allocated: 200, category: 'Essential' as const, color: '#000000' },
    { id: 'default_2', name: 'Utilities', allocated: 150, category: 'Essential' as const, color: '#000000' },
  ];

  displayEnvelopes.forEach((env) => {
    const envExpenses = expenses
      .filter((exp) => exp.envelopeId === env.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const envCurrency = env.currency || mainCurrency;
    let currentBalance = env.allocated;

    const txRows = envExpenses.map((exp) => {
      const rawAmt = Math.abs(exp.amount);
      const convertedAmt = convertCurrency(rawAmt, exp.currency || mainCurrency, envCurrency);
      if (isAddCash(exp)) {
        currentBalance += convertedAmt;
      } else {
        currentBalance -= convertedAmt;
      }
      return {
        ...exp,
        convertedAmt,
        runningBalance: currentBalance
      };
    });

    const isBlankTable = txRows.length === 0;
    const rowCount = isBlankTable ? 2 : txRows.length;
    const boxHeight = 5.5 + 5 + (rowCount * 5);

    if (y + Math.min(boxHeight, 20) > 275) { doc.addPage(); y = 12; }

    // Envelope Box Header Bar
    doc.setLineWidth(0.4);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 5.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const catLabel = t(`cat${env.category}`, language);
    doc.text(`${t('pdfCategoryHeader', language)}: ${catLabel.toUpperCase()} | ${env.name.toUpperCase()}`, margin + 3, y + 3.8);

    const allocText = `${t('pdfAllocatedHeader', language)}: ${formatPdfCurrency(env.allocated, envCurrency)}`;
    const allocWidth = doc.getTextWidth(allocText);
    doc.text(allocText, margin + contentWidth - 3 - allocWidth, y + 3.8);

    y += 5.5;

    // Table Column Header Bar: Date (28), Note/Vendor (72), Amount (38), Available Balance (42)
    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 0, 0);
    doc.rect(margin, y, contentWidth, 5, 'S');

    const colX = [margin, margin + 28, margin + 100, margin + 138];
    colX.slice(1).forEach((xPos) => { doc.line(xPos, y, xPos, y + 5); });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(0, 0, 0);
    doc.text(t('pdfDateHeader', language), colX[0] + 2.5, y + 3.5);
    doc.text(t('pdfDescHeader', language), colX[1] + 2.5, y + 3.5);
    doc.text(t('pdfAmountHeader', language), colX[2] + 2.5, y + 3.5);
    doc.text(t('pdfRemainingHeader', language), colX[3] + 2.5, y + 3.5);

    y += 5;

    if (isBlankTable) {
      for (let i = 0; i < 2; i++) {
        if (y + 5 > 275) { doc.addPage(); y = 12; }
        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, y, contentWidth, 5, 'S');
        colX.slice(1).forEach((xPos) => { doc.line(xPos, y, xPos, y + 5); });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text('—', colX[0] + 2.5, y + 3.5);
        y += 5;
      }
    } else {
      txRows.forEach((tx) => {
        if (y + 5 > 275) {
          doc.addPage();
          y = 12;
          doc.setLineWidth(0.3);
          doc.setDrawColor(0, 0, 0);
          doc.rect(margin, y, contentWidth, 5, 'S');
          colX.slice(1).forEach((xPos) => { doc.line(xPos, y, xPos, y + 5); });
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(0, 0, 0);
          doc.text(t('pdfDateHeader', language), colX[0] + 2.5, y + 3.5);
          doc.text(t('pdfDescHeader', language), colX[1] + 2.5, y + 3.5);
          doc.text(t('pdfAmountHeader', language), colX[2] + 2.5, y + 3.5);
          doc.text(t('pdfRemainingHeader', language), colX[3] + 2.5, y + 3.5);
          y += 5;
        }

        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, y, contentWidth, 5, 'S');
        colX.slice(1).forEach((xPos) => { doc.line(xPos, y, xPos, y + 5); });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
        doc.text(tx.date, colX[0] + 2.5, y + 3.5);

        let noteStr = tx.note || '-';
        if (noteStr.length > 40) noteStr = noteStr.substring(0, 37) + '...';
        doc.text(noteStr, colX[1] + 2.5, y + 3.5);

        doc.setFont('helvetica', 'bold');
        const addCash = isAddCash(tx);
        const dispAmt = formatPdfCurrency(tx.convertedAmt, envCurrency);
        if (addCash) {
          doc.text(`+${dispAmt}`, colX[2] + 2.5, y + 3.5);
        } else {
          doc.text(`-${dispAmt}`, colX[2] + 2.5, y + 3.5);
        }

        doc.setFont('helvetica', 'normal');
        doc.text(formatPdfCurrency(tx.runningBalance, envCurrency), colX[3] + 2.5, y + 3.5);

        y += 5;
      });
    }

    y += 5;
  });

  // --- 4. NOTES & BUDGET REMINDERS SECTION ---
  const hasNotes = notes && notes.trim().length > 0;

  const notesTitleText = `${t('notesRemindersTitle', language)} ${t('optionalLabel', language)}`;
  const subtitlePrompt = hasNotes ? t('notesRemindersDesc', language) : t('pdfHandwritingText', language);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  const splitSubLines = doc.splitTextToSize(subtitlePrompt, contentWidth);
  const subtitleHeight = splitSubLines.length * 3.5 + 2;

  const splitNotesLines = hasNotes ? doc.splitTextToSize(notes.trim(), contentWidth - 8) : [];
  const notesBoxHeight = hasNotes ? Math.max(splitNotesLines.length * 5 + 6, 24) : 24;

  const totalNotesSectionHeight = 5 + subtitleHeight + notesBoxHeight;

  if (y + totalNotesSectionHeight > 275) {
    doc.addPage();
    y = 12;
  }

  // Section Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(notesTitleText, margin, y);
  y += 4;

  // Subtitle / Instruction Text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  splitSubLines.forEach((subLine: string) => {
    doc.text(subLine, margin, y);
    y += 3.5;
  });
  y += 1.5;

  // Render Box
  doc.setLineWidth(0.4);
  doc.setDrawColor(0, 0, 0);
  doc.rect(margin, y, contentWidth, notesBoxHeight, 'S');

  if (hasNotes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    splitNotesLines.forEach((lineText: string, lIdx: number) => {
      doc.text(lineText, margin + 4, y + 5 + lIdx * 5);
    });
  } else {
    doc.setLineWidth(0.15);
    doc.setDrawColor(180, 180, 180);
    for (let lineY = y + 6; lineY < y + notesBoxHeight - 2; lineY += 6) {
      doc.line(margin + 4, lineY, margin + contentWidth - 4, lineY);
    }
  }

  doc.save(`cash_envelope_budget_bw_${new Date().toISOString().split('T')[0]}.pdf`);
}
