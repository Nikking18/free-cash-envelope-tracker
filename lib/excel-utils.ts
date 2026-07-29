import { Envelope, Expense, Category, CATEGORIES, PRESET_COLORS } from './tracker-types';
import { t } from './i18n';

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

export async function downloadExcelTemplate(language: string = 'en') {
  const XLSX = await import('xlsx');

  const colEnvName = t('excelColEnvName', language);
  const colAllocated = t('excelColAllocated', language);
  const colCategory = t('excelColCategory', language);
  const colAmount = t('excelColAmount', language);
  const colNote = t('excelColNote', language);
  const colDate = t('excelColDate', language);

  const catEssential = t('catEssential', language);
  const catDiscretionary = t('catDiscretionary', language);
  const catSavings = t('catSavings', language);

  const sampleGroceries = language === 'es' ? 'Comestibles' : language === 'fr' ? 'Courses' : language === 'de' ? 'Lebensmittel' : 'Groceries';
  const sampleDining = language === 'es' ? 'Restaurantes' : language === 'fr' ? 'Restos' : language === 'de' ? 'Restaurant' : 'Dining Out';
  const sampleSavings = language === 'es' ? 'Ahorro de Emergencia' : language === 'fr' ? 'Épargne de Secours' : language === 'de' ? 'Notfall-Sparen' : 'Emergency Savings';
  
  const sampleNote1 = language === 'es' ? 'Supermercado' : language === 'fr' ? 'Supermarché' : language === 'de' ? 'Supermarkt' : 'Supermarket run';
  const sampleNote2 = language === 'es' ? 'Depósito de Efectivo Extra' : language === 'fr' ? 'Dépôt d’argent liquide' : language === 'de' ? 'Bargeld-Einzahlung' : 'Extra Cash Deposit';
  const sampleNote3 = language === 'es' ? 'Almuerzo con amigo' : language === 'fr' ? 'Déjeuner ami' : language === 'de' ? 'Mittagessen' : 'Lunch with friend';

  const envelopesData = [
    { [colEnvName]: sampleGroceries, [colAllocated]: 400, [colCategory]: catEssential },
    { [colEnvName]: sampleDining, [colAllocated]: 150, [colCategory]: catDiscretionary },
    { [colEnvName]: sampleSavings, [colAllocated]: 200, [colCategory]: catSavings }
  ];

  const expensesData = [
    { [colEnvName]: sampleGroceries, [colAmount]: 52.30, [colNote]: sampleNote1, [colDate]: new Date().toISOString().split('T')[0] },
    { [colEnvName]: sampleGroceries, [colAmount]: -50.00, [colNote]: sampleNote2, [colDate]: new Date().toISOString().split('T')[0] },
    { [colEnvName]: sampleDining, [colAmount]: 18.50, [colNote]: sampleNote3, [colDate]: new Date().toISOString().split('T')[0] }
  ];

  const wb = XLSX.utils.book_new();

  const wsEnvelopes = XLSX.utils.json_to_sheet(envelopesData);
  const wsExpenses = XLSX.utils.json_to_sheet(expensesData);

  wsEnvelopes['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 18 }];
  wsExpenses['!cols'] = [{ wch: 25 }, { wch: 14 }, { wch: 30 }, { wch: 15 }];

  const sheetEnvelopesName = t('excelSheetEnvelopes', language);
  const sheetExpensesName = t('excelSheetExpenses', language);

  XLSX.utils.book_append_sheet(wb, wsEnvelopes, sheetEnvelopesName);
  XLSX.utils.book_append_sheet(wb, wsExpenses, sheetExpensesName);

  XLSX.writeFile(wb, `cash_envelope_budget_template_${language}.xlsx`);
}

export async function exportToExcel(envelopes: Envelope[], expenses: Expense[], language: string = 'en') {
  const XLSX = await import('xlsx');

  const envelopeMap = new Map<string, string>();
  envelopes.forEach(e => envelopeMap.set(e.id, e.name));

  const envelopeStatsMap = new Map<string, { spent: number; cashAdded: number }>();
  envelopes.forEach((e) => envelopeStatsMap.set(e.id, { spent: 0, cashAdded: 0 }));

  expenses.forEach((exp) => {
    const current = envelopeStatsMap.get(exp.envelopeId) || { spent: 0, cashAdded: 0 };
    if (exp.amount < 0) {
      envelopeStatsMap.set(exp.envelopeId, { ...current, cashAdded: current.cashAdded + Math.abs(exp.amount) });
    } else {
      envelopeStatsMap.set(exp.envelopeId, { ...current, spent: current.spent + exp.amount });
    }
  });

  const colEnvName = t('excelColEnvName', language);
  const colAllocated = t('excelColAllocated', language);
  const colCategory = t('excelColCategory', language);
  const colCashAdded = t('labelCashAdded', language);
  const colSpent = t('labelSpent', language);
  const colAvailable = t('labelAvailable', language);

  const colAmount = t('excelColAmount', language);
  const colNote = t('excelColNote', language);
  const colDate = t('excelColDate', language);

  const envelopesExport = envelopes.map(e => {
    const stats = envelopeStatsMap.get(e.id) || { spent: 0, cashAdded: 0 };
    const available = e.allocated + stats.cashAdded - stats.spent;
    return {
      [colEnvName]: sanitizeFormulaInjection(e.name),
      [colAllocated]: e.allocated,
      [colCashAdded]: stats.cashAdded,
      [colSpent]: stats.spent,
      [colAvailable]: available,
      [colCategory]: sanitizeFormulaInjection(t(`cat${e.category}`, language))
    };
  });

  const expensesExport = expenses.map(e => ({
    [colEnvName]: sanitizeFormulaInjection(envelopeMap.get(e.envelopeId) || 'Unknown Envelope'),
    [colAmount]: e.amount,
    [colNote]: sanitizeFormulaInjection(e.note || ''),
    [colDate]: e.date
  }));

  const wb = XLSX.utils.book_new();

  const wsEnvelopes = XLSX.utils.json_to_sheet(envelopesExport);
  const wsExpenses = XLSX.utils.json_to_sheet(expensesExport);

  wsEnvelopes['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }];
  wsExpenses['!cols'] = [{ wch: 25 }, { wch: 14 }, { wch: 30 }, { wch: 15 }];

  const sheetEnvelopesName = t('excelSheetEnvelopes', language);
  const sheetExpensesName = t('excelSheetExpenses', language);

  XLSX.utils.book_append_sheet(wb, wsEnvelopes, sheetEnvelopesName);
  XLSX.utils.book_append_sheet(wb, wsExpenses, sheetExpensesName);

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `cash_envelope_budget_${todayStr}_${language}.xlsx`);
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

    // Look for Envelopes sheet in any supported language
    const envSheetName = wb.SheetNames.find(s => ['Envelopes', 'Sobres', 'Enveloppes', 'Umschläge'].some(valid => s.toLowerCase().includes(valid.toLowerCase()))) || wb.SheetNames[0];

    if (!envSheetName || !wb.Sheets[envSheetName]) {
      return {
        success: false,
        errors: ['Invalid Excel format: Missing "Envelopes" sheet. Please use the official template.']
      };
    }

    const wsEnvelopes = wb.Sheets[envSheetName];
    const envelopesRaw: any[] = XLSX.utils.sheet_to_json(wsEnvelopes);

    if (!envelopesRaw || envelopesRaw.length === 0) {
      errors.push('The "Envelopes" sheet is empty. You must define at least one envelope.');
    }

    const newEnvelopes: Envelope[] = [];
    const envelopeNameToId = new Map<string, string>();
    const seenEnvelopeNames = new Set<string>();

    envelopesRaw.forEach((row, idx) => {
      const rowNum = idx + 2;
      const rawName = row['Envelope Name'] || row['Nombre del Sobre'] || row['Nom de l\'Enveloppe'] || row['Umschlagname'] || row['envelope name'] || row['Name'] || row['name'];
      const rawAllocated = row['Allocated Amount'] || row['Monto Asignado'] || row['Budget Alloué'] || row['Zielbudget'] || row['allocated amount'] || row['Allocated'] || row['allocated'];
      const rawCategory = row['Category'] || row['Categoría'] || row['Catégorie'] || row['Kategorie'] || row['category'];

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
        const catClean = desanitizeFormulaInjection(rawCategory.trim()).toLowerCase();
        if (['essential', 'esencial', 'essentiel', 'essentiell'].includes(catClean)) category = 'Essential';
        else if (['discretionary', 'discrecional', 'loisirs', 'freizeit'].includes(catClean)) category = 'Discretionary';
        else if (['savings', 'ahorro', 'épargne', 'sparen'].includes(catClean)) category = 'Savings';
        else if (['debt', 'deuda', 'dette', 'schulden'].includes(catClean)) category = 'Debt';
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

    const expSheetName = wb.SheetNames.find(s => ['Expenses', 'Gastos', 'Dépenses', 'Ausgaben'].some(valid => s.toLowerCase().includes(valid.toLowerCase())));

    if (expSheetName && wb.Sheets[expSheetName]) {
      const wsExpenses = wb.Sheets[expSheetName];
      const expensesRaw: any[] = XLSX.utils.sheet_to_json(wsExpenses);

      expensesRaw.forEach((row, idx) => {
        const rowNum = idx + 2;
        const rawEnvName = row['Envelope Name'] || row['Nombre del Sobre'] || row['Nom de l\'Enveloppe'] || row['Umschlagname'] || row['envelope name'] || row['Envelope'] || row['envelope'];
        const rawAmount = row['Amount'] || row['Monto'] || row['Montant'] || row['Betrag'] || row['amount'];
        const rawNote = row['Note / Vendor'] || row['Nota / Proveedor'] || row['Note / Commerçant'] || row['Notiz / Händler'] || row['Note'] || row['Nota'] || row['note'] || '';
        const rawDate = row['Date'] || row['Fecha'] || row['Datum'] || row['date'];

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

        if (isNaN(amountNum) || amountNum === 0) {
          errors.push(`Row ${rowNum} in Expenses sheet ("${envNameClean}"): Expense amount must be a non-zero number.`);
          return;
        }

        let dateStr = new Date().toISOString().split('T')[0];
        if (rawDate) {
          if (typeof rawDate === 'string' && rawDate.trim() !== '') {
            dateStr = rawDate.trim();
          } else if (typeof rawDate === 'number') {
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
