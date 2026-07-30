import { Envelope, Expense, Category, CATEGORIES, PRESET_COLORS } from './tracker-types';
import { t } from './i18n';
import { formatCurrency } from './currency-utils';

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

export async function downloadExcelTemplate(language: string = 'en', mainCurrency: string = 'USD') {
  const XLSX = await import('xlsx');

  const colEnvName = t('excelColEnvName', language);
  const colAllocated = t('excelColAllocated', language);
  const colCashAdded = t('excelColCashAdded', language);
  const colCategory = t('excelColCategory', language);
  const colCurrency = t('excelColCurrency', language);
  const colBalance = t('excelColBalance', language);
  const colAmount = t('excelColAmount', language);
  const colNote = t('excelColNote', language);
  const colDate = t('excelColDate', language);
  const colType = t('excelColType', language);
  const currencyNote = t('excelCurrencyNote', language);

  const catEssential = t('catEssential', language);
  const catDiscretionary = t('catDiscretionary', language);
  const catSavings = t('catSavings', language);

  const sampleGroceries = language === 'es' ? 'Comestibles' : language === 'fr' ? 'Courses' : language === 'de' ? 'Lebensmittel' : 'Groceries';
  const sampleDining = language === 'es' ? 'Restaurantes' : language === 'fr' ? 'Restos' : language === 'de' ? 'Restaurant' : 'Dining Out';
  const sampleSavings = language === 'es' ? 'Ahorro de Emergencia' : language === 'fr' ? 'Épargne de Secours' : language === 'de' ? 'Notfall-Sparen' : 'Emergency Savings';
  const sampleNote1 = language === 'es' ? 'Supermercado' : language === 'fr' ? 'Supermarché' : language === 'de' ? 'Supermarkt' : 'Supermarket run';
  const sampleNote2 = language === 'es' ? 'Almuerzo con amigo' : language === 'fr' ? 'Déjeuner ami' : language === 'de' ? 'Mittagessen' : 'Lunch with friend';
  const sampleNote3 = language === 'es' ? 'Depósito de salario' : language === 'fr' ? 'Salaire déposé' : language === 'de' ? 'Gehaltseingang' : 'Salary deposit';
  const typeExpense = t('pdfTypeExpense', language);
  const typeAddCash = t('pdfTypeAddCash', language);

  const envelopesData = [
    {
      [colEnvName]: sampleGroceries,
      [colAllocated]: formatCurrency(400, mainCurrency),
      [colCashAdded]: formatCurrency(100, mainCurrency),
      [colCategory]: catEssential,
      [colCurrency]: mainCurrency,
      [colBalance]: formatCurrency(447.70, mainCurrency),
    },
    {
      [colEnvName]: sampleDining,
      [colAllocated]: formatCurrency(150, mainCurrency),
      [colCashAdded]: formatCurrency(0, mainCurrency),
      [colCategory]: catDiscretionary,
      [colCurrency]: mainCurrency,
      [colBalance]: formatCurrency(131.50, mainCurrency),
    },
    {
      [colEnvName]: sampleSavings,
      [colAllocated]: formatCurrency(200, mainCurrency),
      [colCashAdded]: formatCurrency(0, mainCurrency),
      [colCategory]: catSavings,
      [colCurrency]: mainCurrency,
      [colBalance]: formatCurrency(200.00, mainCurrency),
    },
    {
      [colEnvName]: currencyNote,
      [colAllocated]: '',
      [colCashAdded]: '',
      [colCategory]: '',
      [colCurrency]: '',
      [colBalance]: '',
    }
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const expensesData = [
    {
      [colEnvName]: sampleGroceries,
      [colType]: typeExpense,
      [colAmount]: `-${formatCurrency(52.30, mainCurrency)}`,
      [colCurrency]: mainCurrency,
      [colNote]: sampleNote1,
      [colDate]: todayStr,
    },
    {
      [colEnvName]: sampleDining,
      [colType]: typeExpense,
      [colAmount]: `-${formatCurrency(18.50, mainCurrency)}`,
      [colCurrency]: mainCurrency,
      [colNote]: sampleNote2,
      [colDate]: todayStr,
    },
    {
      [colEnvName]: sampleGroceries,
      [colType]: typeAddCash,
      [colAmount]: `+${formatCurrency(100.00, mainCurrency)}`,
      [colCurrency]: mainCurrency,
      [colNote]: sampleNote3,
      [colDate]: todayStr,
    },
    {
      [colEnvName]: currencyNote,
      [colType]: '',
      [colAmount]: '',
      [colCurrency]: '',
      [colNote]: '',
      [colDate]: '',
    }
  ];

  const wb = XLSX.utils.book_new();

  const wsEnvelopes = XLSX.utils.json_to_sheet(envelopesData);
  const wsExpenses = XLSX.utils.json_to_sheet(expensesData);

  // Set column widths for clean readability
  wsEnvelopes['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 18 }];
  wsExpenses['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];

  const sheetEnvelopesName = t('excelSheetEnvelopes', language);
  const sheetExpensesName = t('excelSheetExpenses', language);

  XLSX.utils.book_append_sheet(wb, wsEnvelopes, sheetEnvelopesName);
  XLSX.utils.book_append_sheet(wb, wsExpenses, sheetExpensesName);

  XLSX.writeFile(wb, `cash_envelope_budget_template_${language}.xlsx`);
}

export async function exportToExcel(
  envelopes: Envelope[],
  expenses: Expense[],
  language: string = 'en',
  mainCurrency: string = 'USD'
) {
  const XLSX = await import('xlsx');

  const envelopeMap = new Map<string, Envelope>();
  envelopes.forEach(e => envelopeMap.set(e.id, e));

  const colEnvName = t('excelColEnvName', language);
  const colAllocated = t('excelColAllocated', language);
  const colCategory = t('excelColCategory', language);
  const colCashAdded = t('excelColCashAdded', language);
  const colCurrency = t('excelColCurrency', language);
  const colBalance = t('excelColBalance', language);
  const colAmount = t('excelColAmount', language);
  const colNote = t('excelColNote', language);
  const colDate = t('excelColDate', language);
  const colType = t('excelColType', language);
  const currencyNote = t('excelCurrencyNote', language);

  // Compute per-envelope cash added and balance
  const envelopeSpentMap = new Map<string, number>();
  const envelopeCashAddedMap = new Map<string, number>();
  envelopes.forEach(e => { envelopeSpentMap.set(e.id, 0); envelopeCashAddedMap.set(e.id, 0); });
  expenses.forEach(exp => {
    if (exp.amount < 0 || exp.type === 'addCash') {
      envelopeCashAddedMap.set(exp.envelopeId, (envelopeCashAddedMap.get(exp.envelopeId) || 0) + Math.abs(exp.amount));
    } else {
      envelopeSpentMap.set(exp.envelopeId, (envelopeSpentMap.get(exp.envelopeId) || 0) + exp.amount);
    }
  });

  const typeExpenseLabel = t('pdfTypeExpense', language);
  const typeAddCashLabel = t('pdfTypeAddCash', language);

  const envelopesExport = envelopes.map(e => {
    const cashAdded = envelopeCashAddedMap.get(e.id) || 0;
    const spent = envelopeSpentMap.get(e.id) || 0;
    const balance = e.allocated + cashAdded - spent;
    const envCurrency = e.currency || mainCurrency;

    return {
      [colEnvName]: sanitizeFormulaInjection(e.name),
      [colAllocated]: formatCurrency(e.allocated, envCurrency),
      [colCashAdded]: cashAdded > 0 ? `+${formatCurrency(cashAdded, envCurrency)}` : formatCurrency(0, envCurrency),
      [colCategory]: sanitizeFormulaInjection(t(`cat${e.category}`, language)),
      [colCurrency]: envCurrency,
      [colBalance]: balance < 0 ? `-${formatCurrency(Math.abs(balance), envCurrency)}` : formatCurrency(balance, envCurrency),
    };
  });

  envelopesExport.push({
    [colEnvName]: currencyNote,
    [colAllocated]: '',
    [colCashAdded]: '',
    [colCategory]: '',
    [colCurrency]: '',
    [colBalance]: '',
  });

  const expensesExport = expenses.map(e => {
    const env = envelopeMap.get(e.envelopeId);
    const expCurrency = e.currency || env?.currency || mainCurrency;
    const addCash = e.amount < 0 || e.type === 'addCash';
    const formattedAmt = formatCurrency(Math.abs(e.amount), expCurrency);

    return {
      [colEnvName]: sanitizeFormulaInjection(env?.name || 'Unknown Envelope'),
      [colType]: addCash ? typeAddCashLabel : typeExpenseLabel,
      [colAmount]: addCash ? `+${formattedAmt}` : `-${formattedAmt}`,
      [colCurrency]: expCurrency,
      [colNote]: sanitizeFormulaInjection(e.note || ''),
      [colDate]: e.date,
    };
  });

  expensesExport.push({
    [colEnvName]: currencyNote,
    [colType]: '',
    [colAmount]: '',
    [colCurrency]: '',
    [colNote]: '',
    [colDate]: '',
  });

  const wb = XLSX.utils.book_new();

  const wsEnvelopes = XLSX.utils.json_to_sheet(envelopesExport);
  const wsExpenses = XLSX.utils.json_to_sheet(expensesExport);

  wsEnvelopes['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 18 }];
  wsExpenses['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 25 }, { wch: 15 }];

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
      const rowNum = idx + 2; // header is row 1
      const rawName = row['Envelope Name'] || row['Nombre del Sobre'] || row['Nom de l\'Enveloppe'] || row['Umschlagname'] || row['envelope name'] || row['Name'] || row['name'];
      const rawAllocated = row['Allocated Amount'] || row['Monto Asignado'] || row['Budget Alloué'] || row['Zielbudget'] || row['allocated amount'] || row['Allocated'] || row['allocated'];
      const rawCategory = row['Category'] || row['Categoría'] || row['Catégorie'] || row['Kategorie'] || row['category'];
      const rawCurrency = row['Currency'] || row['Moneda'] || row['Devise'] || row['Währung'] || row['currency'];

      if (!rawName || String(rawName).trim() === '') {
        // Skip note rows
        if (rawAllocated === undefined && rawCategory === undefined) return;
        errors.push(`Row ${rowNum} in Envelopes sheet: Envelope Name cannot be empty.`);
        return;
      }

      const nameClean = desanitizeFormulaInjection(String(rawName).trim());

      // Ignore disclaimer note row
      if (nameClean.startsWith('*') || nameClean.toLowerCase().includes('note:')) return;

      const nameLower = nameClean.toLowerCase();

      if (seenEnvelopeNames.has(nameLower)) {
        errors.push(`Row ${rowNum} in Envelopes sheet: Duplicate envelope name "${nameClean}". Envelope names must be unique.`);
        return;
      }
      seenEnvelopeNames.add(nameLower);

      let allocatedNum = 0;
      if (typeof rawAllocated === 'number') {
        allocatedNum = Math.abs(rawAllocated);
      } else if (typeof rawAllocated === 'string') {
        const cleanedStr = rawAllocated.replace(/[^0-9.-]/g, '').trim();
        allocatedNum = Math.abs(parseFloat(cleanedStr));
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

      let envCurrency = 'USD';
      if (rawCurrency && typeof rawCurrency === 'string' && rawCurrency.trim() !== '') {
        envCurrency = rawCurrency.trim().toUpperCase();
      }

      const envId = `env_imp_${Date.now()}_${idx}`;
      envelopeNameToId.set(nameLower, envId);

      const color = PRESET_COLORS[idx % PRESET_COLORS.length];

      newEnvelopes.push({
        id: envId,
        name: nameClean,
        allocated: allocatedNum,
        category,
        color,
        currency: envCurrency,
      });
    });

    const newExpenses: Expense[] = [];

    // Look for Expenses sheet in any supported language
    const expSheetName = wb.SheetNames.find(s => ['Expenses', 'Gastos', 'Dépenses', 'Ausgaben'].some(valid => s.toLowerCase().includes(valid.toLowerCase())));

    if (expSheetName && wb.Sheets[expSheetName]) {
      const wsExpenses = wb.Sheets[expSheetName];
      const expensesRaw: any[] = XLSX.utils.sheet_to_json(wsExpenses);

      expensesRaw.forEach((row, idx) => {
        const rowNum = idx + 2;
        const rawEnvName = row['Envelope Name'] || row['Nombre del Sobre'] || row['Nom de l\'Enveloppe'] || row['Umschlagname'] || row['envelope name'] || row['Envelope'] || row['envelope'];
        const rawType = row['Transaction Type'] || row['Type'] || row['Tipo'] || row['Typ'] || '';
        const rawAmount = row['Amount'] || row['Monto'] || row['Montant'] || row['Betrag'] || row['amount'];
        const rawCurrency = row['Currency'] || row['Moneda'] || row['Devise'] || row['Währung'] || row['currency'];
        const rawNote = row['Note / Vendor'] || row['Nota / Proveedor'] || row['Note / Commerçant'] || row['Notiz / Händler'] || row['Note'] || row['Nota'] || row['note'] || '';
        const rawDate = row['Date'] || row['Fecha'] || row['Datum'] || row['date'];

        if (!rawEnvName || String(rawEnvName).trim() === '') {
          return;
        }

        const envNameClean = desanitizeFormulaInjection(String(rawEnvName).trim());

        // Skip disclaimer note row
        if (envNameClean.startsWith('*') || envNameClean.toLowerCase().includes('note:')) return;

        const envId = envelopeNameToId.get(envNameClean.toLowerCase());

        if (!envId) {
          errors.push(`Row ${rowNum} in Expenses sheet: Referenced envelope "${envNameClean}" does not exist in the Envelopes sheet.`);
          return;
        }

        let isAddCashTx = false;
        if (rawType && typeof rawType === 'string') {
          const typeClean = desanitizeFormulaInjection(rawType.trim()).toLowerCase();
          if (['add cash', 'cash in', 'ingreso', 'entrée', 'einzahlung', 'cash added'].includes(typeClean)) {
            isAddCashTx = true;
          }
        }

        let amountNum = 0;
        if (typeof rawAmount === 'number') {
          amountNum = Math.abs(rawAmount);
        } else if (typeof rawAmount === 'string') {
          if (rawAmount.includes('+')) isAddCashTx = true;
          const cleaned = rawAmount.replace(/[^0-9.-]/g, '').trim();
          amountNum = Math.abs(parseFloat(cleaned));
        }

        if (isNaN(amountNum) || amountNum <= 0) {
          errors.push(`Row ${rowNum} in Expenses sheet ("${envNameClean}"): Amount must be a valid number.`);
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

        let expCurrency = undefined;
        if (rawCurrency && typeof rawCurrency === 'string' && rawCurrency.trim() !== '') {
          expCurrency = rawCurrency.trim().toUpperCase();
        }

        const finalAmount = isAddCashTx ? -Math.abs(amountNum) : Math.abs(amountNum);

        newExpenses.push({
          id: `exp_imp_${Date.now()}_${idx}`,
          envelopeId: envId,
          amount: finalAmount,
          note: desanitizeFormulaInjection(String(rawNote).trim()),
          date: dateStr,
          currency: expCurrency,
          type: isAddCashTx ? 'addCash' : 'expense'
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
