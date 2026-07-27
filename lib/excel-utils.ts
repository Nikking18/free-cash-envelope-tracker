import { Envelope, Expense, Category, CATEGORIES, PRESET_COLORS } from './tracker-types';

/**
 * Sanitizes cell text to prevent CSV / Excel Formula Injection (DDE attacks).
 * If a string begins with '=', '+', '-', '@', '\t', or '\r', it prefixes it
 * with a single quote (') so Excel/Spreadsheets treat it as a literal string.
 */
export function sanitizeFormulaInjection(val: any): any {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${val}`;
  }
  return val;
}

/**
 * Desanitizes cell text when importing from an Excel file.
 * If a string starts with a single quote followed by a formula character (=, +, -, @, \t, \r),
 * we strip that single quote so the internal application state holds the clean value.
 */
export function desanitizeFormulaInjection(val: any): any {
  if (typeof val !== 'string') return val;
  if (val.startsWith("'") && val.length > 1) {
    const remaining = val.slice(1);
    if (/^[=+\-@\t\r]/.test(remaining)) {
      return remaining;
    }
  }
  return val;
}

export async function downloadExcelTemplate() {
  const XLSX = await import('xlsx');

  const envelopesData = [
    { 'Envelope Name': 'Groceries', 'Allocated Amount': 400, 'Category': 'Essential' },
    { 'Envelope Name': 'Dining Out', 'Allocated Amount': 150, 'Category': 'Discretionary' },
    { 'Envelope Name': 'Emergency Savings', 'Allocated Amount': 200, 'Category': 'Savings' }
  ];

  const expensesData = [
    { 'Envelope Name': 'Groceries', 'Amount': 52.30, 'Note': 'Supermarket run', 'Date': new Date().toISOString().split('T')[0] },
    { 'Envelope Name': 'Dining Out', 'Amount': 18.50, 'Note': 'Lunch with friend', 'Date': new Date().toISOString().split('T')[0] }
  ];

  const wb = XLSX.utils.book_new();

  const wsEnvelopes = XLSX.utils.json_to_sheet(envelopesData);
  const wsExpenses = XLSX.utils.json_to_sheet(expensesData);

  // Set column widths for clean readability
  wsEnvelopes['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }];
  wsExpenses['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 25 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, wsEnvelopes, 'Envelopes');
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses');

  XLSX.writeFile(wb, 'cash_envelope_budget_template.xlsx');
}

export async function exportToExcel(envelopes: Envelope[], expenses: Expense[]) {
  const XLSX = await import('xlsx');

  const envelopeMap = new Map<string, string>();
  envelopes.forEach(e => envelopeMap.set(e.id, e.name));

  const envelopesExport = envelopes.map(e => ({
    'Envelope Name': sanitizeFormulaInjection(e.name),
    'Allocated Amount': e.allocated,
    'Category': sanitizeFormulaInjection(e.category)
  }));

  const expensesExport = expenses.map(e => ({
    'Envelope Name': sanitizeFormulaInjection(envelopeMap.get(e.envelopeId) || 'Unknown Envelope'),
    'Amount': e.amount,
    'Note': sanitizeFormulaInjection(e.note || ''),
    'Date': e.date
  }));

  const wb = XLSX.utils.book_new();

  const wsEnvelopes = XLSX.utils.json_to_sheet(envelopesExport);
  const wsExpenses = XLSX.utils.json_to_sheet(expensesExport);

  wsEnvelopes['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }];
  wsExpenses['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 25 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, wsEnvelopes, 'Envelopes');
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `cash_envelope_budget_${todayStr}.xlsx`);
}

export async function parseAndValidateExcel(file: File): Promise<{
  success: boolean;
  errors: string[];
  data?: { envelopes: Envelope[]; expenses: Expense[] };
}> {
  const XLSX = await import('xlsx');
  const errors: string[] = [];

  try {
    const arrayBuffer = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: 'array' });

    if (!wb.SheetNames.includes('Envelopes')) {
      return {
        success: false,
        errors: ['Invalid Excel format: Missing "Envelopes" sheet. Please use the official template.']
      };
    }

    const wsEnvelopes = wb.Sheets['Envelopes'];
    const envelopesRaw: any[] = XLSX.utils.sheet_to_json(wsEnvelopes);

    if (!envelopesRaw || envelopesRaw.length === 0) {
      errors.push('The "Envelopes" sheet is empty. You must define at least one envelope.');
    }

    const newEnvelopes: Envelope[] = [];
    const envelopeNameToId = new Map<string, string>();
    const seenEnvelopeNames = new Set<string>();

    envelopesRaw.forEach((row, idx) => {
      const rowNum = idx + 2; // header is row 1
      const rawName = row['Envelope Name'] || row['envelope name'] || row['Name'] || row['name'];
      const rawAllocated = row['Allocated Amount'] || row['allocated amount'] || row['Allocated'] || row['allocated'];
      const rawCategory = row['Category'] || row['category'];

      if (!rawName || String(rawName).trim() === '') {
        errors.push(`Row ${rowNum} in Envelopes sheet: Envelope Name cannot be empty.`);
        return;
      }

      const nameClean = desanitizeFormulaInjection(String(rawName).trim());
      const nameLower = nameClean.toLowerCase();

      if (seenEnvelopeNames.has(nameLower)) {
        errors.push(`Row ${rowNum} in Envelopes sheet: Duplicate envelope name "${nameClean}". Envelope names must be unique.`);
        return;
      }
      seenEnvelopeNames.add(nameLower);

      let allocatedNum = 0;
      if (typeof rawAllocated === 'number') {
        allocatedNum = rawAllocated;
      } else if (typeof rawAllocated === 'string') {
        const cleanedStr = rawAllocated.replace(/[\$,]/g, '').trim();
        allocatedNum = parseFloat(cleanedStr);
      }

      if (isNaN(allocatedNum) || allocatedNum < 0) {
        errors.push(`Row ${rowNum} in Envelopes sheet ("${nameClean}"): Allocated Amount must be a non-negative number.`);
        return;
      }

      let category: Category = 'Essential';
      if (rawCategory && typeof rawCategory === 'string') {
        const catClean = desanitizeFormulaInjection(rawCategory.trim());
        const matched = CATEGORIES.find(c => c.toLowerCase() === catClean.toLowerCase());
        if (matched) {
          category = matched;
        }
      }

      const envId = `env_imp_${Date.now()}_${idx}`;
      envelopeNameToId.set(nameLower, envId);

      const color = PRESET_COLORS[idx % PRESET_COLORS.length];

      newEnvelopes.push({
        id: envId,
        name: nameClean,
        allocated: allocatedNum,
        category,
        color
      });
    });

    const newExpenses: Expense[] = [];

    if (wb.SheetNames.includes('Expenses')) {
      const wsExpenses = wb.Sheets['Expenses'];
      const expensesRaw: any[] = XLSX.utils.sheet_to_json(wsExpenses);

      expensesRaw.forEach((row, idx) => {
        const rowNum = idx + 2;
        const rawEnvName = row['Envelope Name'] || row['envelope name'] || row['Envelope'] || row['envelope'];
        const rawAmount = row['Amount'] || row['amount'];
        const rawNote = row['Note'] || row['note'] || '';
        const rawDate = row['Date'] || row['date'];

        if (!rawEnvName || String(rawEnvName).trim() === '') {
          errors.push(`Row ${rowNum} in Expenses sheet: Envelope Name is required.`);
          return;
        }

        const envNameClean = desanitizeFormulaInjection(String(rawEnvName).trim());
        const envId = envelopeNameToId.get(envNameClean.toLowerCase());

        if (!envId) {
          errors.push(`Row ${rowNum} in Expenses sheet: Referenced envelope "${envNameClean}" does not exist in the Envelopes sheet.`);
          return;
        }

        let amountNum = 0;
        if (typeof rawAmount === 'number') {
          amountNum = rawAmount;
        } else if (typeof rawAmount === 'string') {
          const cleaned = rawAmount.replace(/[\$,]/g, '').trim();
          amountNum = parseFloat(cleaned);
        }

        if (isNaN(amountNum) || amountNum <= 0) {
          errors.push(`Row ${rowNum} in Expenses sheet ("${envNameClean}"): Expense amount must be a positive number.`);
          return;
        }

        let dateStr = new Date().toISOString().split('T')[0];
        if (rawDate) {
          if (typeof rawDate === 'string' && rawDate.trim() !== '') {
            dateStr = rawDate.trim();
          } else if (typeof rawDate === 'number') {
            // Excel serial date number
            const dateObj = XLSX.SSF.parse_date_code(rawDate);
            if (dateObj) {
              const yyyy = dateObj.y;
              const mm = String(dateObj.m).padStart(2, '0');
              const dd = String(dateObj.d).padStart(2, '0');
              dateStr = `${yyyy}-${mm}-${dd}`;
            }
          }
        }

        newExpenses.push({
          id: `exp_imp_${Date.now()}_${idx}`,
          envelopeId: envId,
          amount: amountNum,
          note: desanitizeFormulaInjection(String(rawNote).trim()),
          date: dateStr
        });
      });
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return {
      success: true,
      errors: [],
      data: {
        envelopes: newEnvelopes,
        expenses: newExpenses
      }
    };
  } catch (err: any) {
    return {
      success: false,
      errors: [`Failed to parse Excel file: ${err.message || 'Unknown error'}`]
    };
  }
}
