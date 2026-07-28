'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Envelope, Expense, TrackerData, Category, CATEGORIES, INITIAL_STORAGE_KEY, DEFAULT_INITIAL_DATA } from '../lib/tracker-types';
import { generatePDFSummary, PDFTemplateStyle } from '../lib/pdf-utils';
import { exportToExcel } from '../lib/excel-utils';
import { convertCurrency, fetchLiveExchangeRates } from '../lib/currency-utils';

import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { WebViewShowcase } from '../components/WebViewShowcase';
import { BudgetGuideSection } from '../components/BudgetGuideSection';
import { FaqSection } from '../components/FaqSection';
import { TrackerSummary } from '../components/TrackerSummary';
import { EnvelopeCard } from '../components/EnvelopeCard';
import { EnvelopeModal } from '../components/EnvelopeModal';
import { ExpenseModal } from '../components/ExpenseModal';
import { TransactionLedger } from '../components/TransactionLedger';
import { ResetModal } from '../components/ResetModal';
import { DataLossWarningModal } from '../components/DataLossWarningModal';
import { PdfTemplateModal } from '../components/PdfTemplateModal';
import { Footer } from '../components/Footer';
import { GoogleTranslateScript } from '../components/GoogleTranslateScript';

import { Search, Plus, Filter, Wallet, FileText, Download } from 'lucide-react';

export default function CashEnvelopeTrackerPage() {
  const [data, setData] = useState<TrackerData>(DEFAULT_INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Currency & Language State
  const [mainCurrency, setMainCurrency] = useState<string>('USD');
  const [language, setLanguage] = useState<string>('en');

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [envelopeSearch, setEnvelopeSearch] = useState('');

  // Modals
  const [isEnvelopeModalOpen, setIsEnvelopeModalOpen] = useState(false);
  const [editingEnvelope, setEditingEnvelope] = useState<Envelope | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedEnvelopeForExpense, setSelectedEnvelopeForExpense] = useState<string>('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDataLossModalOpen, setIsDataLossModalOpen] = useState(true);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Backup Reminder State
  const [lastExportedAt, setLastExportedAt] = useState<string | null>(null);
  const [backupReminderInterval, setBackupReminderInterval] = useState<string>('7');
  const [isReminderDismissed, setIsReminderDismissed] = useState<boolean>(false);

  // Initialize data and backup reminder state on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      queueMicrotask(() => {
        try {
          const saved = localStorage.getItem(INITIAL_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.envelopes) && Array.isArray(parsed.expenses)) {
              setData(parsed);
              if (parsed.mainCurrency) setMainCurrency(parsed.mainCurrency);
              if (parsed.language) setLanguage(parsed.language);
            }
          }
        } catch (e) {
          console.error('Failed to parse localStorage:', e);
        }

        const savedExportTime = localStorage.getItem('lastExportedAt');
        const savedInterval = localStorage.getItem('backupReminderInterval') || '7';
        const sessionDismissed = sessionStorage.getItem('dismissedBackupReminder') === 'true';

        let firstLoad = localStorage.getItem('appFirstLoadedAt');
        if (!firstLoad) {
          firstLoad = new Date().toISOString();
          localStorage.setItem('appFirstLoadedAt', firstLoad);
        }

        setLastExportedAt(savedExportTime);
        setBackupReminderInterval(savedInterval);
        setIsReminderDismissed(sessionDismissed);

        // Fetch real-time live exchange rates
        fetchLiveExchangeRates().then(() => {
          // Force a state refresh so conversions recalculate with live market rates
          setData((prev) => ({ ...prev }));
        });
      });
    }
  }, []);

  const handleChangeBackupReminderInterval = (val: string) => {
    setBackupReminderInterval(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('backupReminderInterval', val);
    }
  };

  const recordExportTimestamp = useCallback(() => {
    const nowStr = new Date().toISOString();
    setLastExportedAt(nowStr);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastExportedAt', nowStr);
    }
  }, []);

  const handleDismissReminder = () => {
    setIsReminderDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dismissedBackupReminder', 'true');
    }
  };

  const [overdueState, setOverdueState] = useState({ isBackupOverdue: false, daysSinceLastExport: 0 });

  useEffect(() => {
    if (backupReminderInterval === 'never') {
      queueMicrotask(() => {
        setOverdueState({ isBackupOverdue: false, daysSinceLastExport: 0 });
      });
      return;
    }

    const now = Date.now();
    let baseTime: number;
    if (lastExportedAt) {
      baseTime = new Date(lastExportedAt).getTime();
    } else {
      const firstLoad = typeof window !== 'undefined' ? localStorage.getItem('appFirstLoadedAt') : null;
      baseTime = firstLoad ? new Date(firstLoad).getTime() : now;
    }

    const diffMs = now - baseTime;
    const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const requiredInterval = parseInt(backupReminderInterval || '7', 10);

    queueMicrotask(() => {
      setOverdueState({
        isBackupOverdue: days >= requiredInterval,
        daysSinceLastExport: days,
      });
    });
  }, [lastExportedAt, backupReminderInterval]);

  const { isBackupOverdue, daysSinceLastExport } = overdueState;

  const showReminderBanner = isBackupOverdue && !isReminderDismissed;

  // Native beforeunload event listener warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Mark as loaded on client mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((newData: TrackerData) => {
    const updatedData: TrackerData = {
      ...newData,
      mainCurrency: newData.mainCurrency || mainCurrency,
      language: newData.language || language,
    };
    setData(updatedData);
    try {
      localStorage.setItem(INITIAL_STORAGE_KEY, JSON.stringify(updatedData));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }, [mainCurrency, language]);

  const handleChangeMainCurrency = (newCurrency: string) => {
    setMainCurrency(newCurrency);
    saveToStorage({ ...data, mainCurrency: newCurrency });
  };

  const handleChangeLanguage = (newLang: string) => {
    setLanguage(newLang);
    saveToStorage({ ...data, language: newLang });
  };

  // Spent calculations (converting foreign expenses to target envelope currency & main currency)
  const envelopeSpentMap = useMemo(() => {
    const map = new Map<string, number>();
    data.envelopes.forEach((env) => map.set(env.id, 0));

    data.expenses.forEach((exp) => {
      const current = map.get(exp.envelopeId) || 0;
      const env = data.envelopes.find((e) => e.id === exp.envelopeId);
      const envCurrency = env?.currency || mainCurrency;
      const convertedAmt = convertCurrency(exp.amount, exp.currency || mainCurrency, envCurrency);
      map.set(exp.envelopeId, current + convertedAmt);
    });

    return map;
  }, [data.envelopes, data.expenses, mainCurrency]);

  const totalAllocated = useMemo(() => {
    return data.envelopes.reduce((acc, e) => {
      return acc + convertCurrency(e.allocated, e.currency || mainCurrency, mainCurrency);
    }, 0);
  }, [data.envelopes, mainCurrency]);

  const totalSpent = useMemo(() => {
    return data.expenses.reduce((acc, exp) => {
      return acc + convertCurrency(exp.amount, exp.currency || mainCurrency, mainCurrency);
    }, 0);
  }, [data.expenses, mainCurrency]);

  const totalRemaining = totalAllocated - totalSpent;

  // Filtered envelopes
  const filteredEnvelopes = useMemo(() => {
    return data.envelopes.filter((env) => {
      const matchesCategory = selectedCategory === 'all' || env.category === selectedCategory;
      const matchesSearch = !envelopeSearch.trim() || env.name.toLowerCase().includes(envelopeSearch.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [data.envelopes, selectedCategory, envelopeSearch]);

  // Handlers
  const scrollToTracker = () => {
    const el = document.getElementById('tracker');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveEnvelope = (envelopeInput: { name: string; allocated: number; category: Category; color: string; currency?: string; id?: string }) => {
    if (envelopeInput.id) {
      // Edit
      const updated = data.envelopes.map((env) => (env.id === envelopeInput.id ? { ...env, ...envelopeInput } : env));
      saveToStorage({ ...data, envelopes: updated });
    } else {
      // Create
      const newEnv: Envelope = {
        id: `env_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: envelopeInput.name,
        allocated: envelopeInput.allocated,
        category: envelopeInput.category,
        color: envelopeInput.color,
        currency: envelopeInput.currency || mainCurrency,
      };
      saveToStorage({ ...data, envelopes: [...data.envelopes, newEnv] });
    }
    setEditingEnvelope(null);
  };

  const handleDeleteEnvelope = (envelopeId: string) => {
    const env = data.envelopes.find((e) => e.id === envelopeId);
    if (!env) return;

    if (confirm(`Delete envelope "${env.name}"? Matching expenses will also be removed.`)) {
      const updatedEnvelopes = data.envelopes.filter((e) => e.id !== envelopeId);
      const updatedExpenses = data.expenses.filter((exp) => exp.envelopeId !== envelopeId);
      saveToStorage({ envelopes: updatedEnvelopes, expenses: updatedExpenses });
    }
  };

  const handleSaveExpense = (expenseInput: { envelopeId: string; amount: number; note: string; date: string; currency?: string; id?: string }) => {
    if (expenseInput.id) {
      // Edit
      const updated = data.expenses.map((exp) => (exp.id === expenseInput.id ? { ...exp, ...expenseInput } : exp));
      saveToStorage({ ...data, expenses: updated });
    } else {
      // Create
      const newExp: Expense = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        envelopeId: expenseInput.envelopeId,
        amount: expenseInput.amount,
        note: expenseInput.note,
        date: expenseInput.date,
        currency: expenseInput.currency || mainCurrency,
      };
      saveToStorage({ ...data, expenses: [newExp, ...data.expenses] });
    }
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Delete this expense transaction?')) {
      const updatedExpenses = data.expenses.filter((exp) => exp.id !== expenseId);
      saveToStorage({ ...data, expenses: updatedExpenses });
    }
  };

  const handleImportExcelData = (importedData: TrackerData) => {
    saveToStorage(importedData);
  };

  const handleConfirmReset = () => {
    saveToStorage({ envelopes: [], expenses: [] });
  };

  const handleExportPDF = () => {
    setIsPdfModalOpen(true);
  };

  const handleSelectPdfTemplate = async (style: PDFTemplateStyle) => {
    setIsPdfModalOpen(false);
    try {
      await generatePDFSummary(
        data.envelopes,
        data.expenses,
        style,
        data.budgetPeriod || '',
        data.notes || '',
        mainCurrency,
        language
      );
      recordExportTimestamp();
    } catch (err: any) {
      alert('Failed to generate PDF: ' + err.message);
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportToExcel(data.envelopes, data.expenses);
      recordExportTimestamp();
    } catch (err: any) {
      alert('Failed to export Excel file: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#18181B] flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          onScrollToTracker={scrollToTracker}
          mainCurrency={mainCurrency}
          onChangeMainCurrency={handleChangeMainCurrency}
          language={language}
          onChangeLanguage={handleChangeLanguage}
        />

        {/* Backup Reminder Banner */}
        {showReminderBanner && (
          <div className="bg-[#FFFBEB] border-b-4 border-[#141414] px-4 py-3 sm:px-6 shadow-md relative z-40">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#141414]">
                <Download className="w-5 h-5 text-[#D15F47] shrink-0" />
                <span>
                  It&apos;s been <strong className="underline text-black">{daysSinceLastExport} day{daysSinceLastExport === 1 ? '' : 's'}</strong> since your last backup — export a PDF or Excel copy now?
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    scrollToTracker();
                    setIsPdfModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Export Backup Now
                </button>
                <button
                  type="button"
                  onClick={handleDismissReminder}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#141414] neo-border text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Remind Me Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <HeroSection
          onStartBudgeting={scrollToTracker}
          language={language}
        />

        {/* How It Works Section */}
        <HowItWorksSection language={language} />

        {/* Web View Showcase Section */}
        <WebViewShowcase language={language} />

        {/* Budget Guide & SEO Keywords Section */}
        <BudgetGuideSection language={language} />

        {/* Main Budget Tracker App Workspace */}
        <section id="tracker" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t-4 border-[#141414] pt-12">
          {/* Tracker Overview Header */}
          <TrackerSummary
            totalAllocated={totalAllocated}
            totalSpent={totalSpent}
            totalRemaining={totalRemaining}
            budgetPeriod={data.budgetPeriod || ''}
            onChangeBudgetPeriod={(val) => saveToStorage({ ...data, budgetPeriod: val })}
            backupReminderInterval={backupReminderInterval}
            onChangeBackupReminderInterval={handleChangeBackupReminderInterval}
            mainCurrency={mainCurrency}
            language={language}
            onAddEnvelope={() => {
              setEditingEnvelope(null);
              setIsEnvelopeModalOpen(true);
            }}
            onAddExpense={() => {
              setEditingExpense(null);
              setSelectedEnvelopeForExpense(data.envelopes.length > 0 ? data.envelopes[0].id : '');
              setIsExpenseModalOpen(true);
            }}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onReset={() => setIsResetModalOpen(true)}
            envelopesCount={data.envelopes.length}
            expensesCount={data.expenses.length}
            onImportData={handleImportExcelData}
          />

          {/* Envelopes Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-[#141414] text-2xl uppercase tracking-tight flex items-center gap-2 font-black">
                  <Wallet className="w-6 h-6 text-[#8A9A5B]" />
                  {t('cashEnvelopes', language)} ({data.envelopes.length})
                </h2>
                <p className="text-xs sm:text-sm text-[#141414]/70 font-bold uppercase tracking-wider">
                  {t('envelopesSubtitle', language)}
                </p>
              </div>

              {/* Category Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                <div className="flex flex-wrap items-center neo-border bg-white p-0.5 max-w-full overflow-x-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${selectedCategory === 'all' ? 'bg-[#141414] text-[#FCFAF7]' : 'text-[#141414] hover:bg-gray-100'}`}
                  >
                    {t('allCategories', language)}
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${selectedCategory === cat ? 'bg-[#141414] text-[#FCFAF7]' : 'text-[#141414] hover:bg-gray-100'}`}
                    >
                      {t(`cat${cat}`, language).toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-48 shrink-0">
                  <Search className="w-3.5 h-3.5 text-[#141414]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={envelopeSearch}
                    onChange={(e) => setEnvelopeSearch(e.target.value)}
                    placeholder={t('searchEnvelopes', language)}
                    className="pl-8 pr-2.5 py-1 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden w-full"
                  />
                </div>
              </div>
            </div>

            {/* Envelopes Grid */}
            {filteredEnvelopes.length === 0 ? (
              <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 text-center space-y-4">
                <div className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
                  {t('noEnvelopesFound', language)}
                </div>
                <p className="text-xs sm:text-sm text-[#141414]/80 font-bold max-w-md mx-auto">
                  {data.envelopes.length === 0
                    ? 'Get started by creating your first cash envelope.'
                    : 'No envelopes match your search or category filter.'}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setEditingEnvelope(null);
                      setIsEnvelopeModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#8A9A5B] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    + {t('createEnvelopeTitle', language)}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnvelopes.map((env) => (
                  <EnvelopeCard
                    key={env.id}
                    envelope={env}
                    spent={envelopeSpentMap.get(env.id) || 0}
                    mainCurrency={mainCurrency}
                    language={language}
                    onAddExpense={(envId) => {
                      setEditingExpense(null);
                      setSelectedEnvelopeForExpense(envId);
                      setIsExpenseModalOpen(true);
                    }}
                    onEditEnvelope={(envToEdit) => {
                      setEditingEnvelope(envToEdit);
                      setIsEnvelopeModalOpen(true);
                    }}
                    onDeleteEnvelope={handleDeleteEnvelope}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Transaction Ledger Section */}
          <TransactionLedger
            expenses={data.expenses}
            envelopes={data.envelopes}
            mainCurrency={mainCurrency}
            language={language}
            onEditExpense={(expToEdit) => {
              setEditingExpense(expToEdit);
              setIsExpenseModalOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
          />

          {/* Notes & Budget Reminders Section */}
          <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg p-5 sm:p-6 lg:p-8 space-y-3">
            <div className="flex items-center justify-between border-b-4 border-[#141414] pb-3">
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#141414] uppercase tracking-tight flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#8A9A5B]" />
                {t('notesRemindersTitle', language)} <span className="text-xs font-sans font-normal text-[#141414]/60 lowercase">{t('optionalLabel', language)}</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#141414]/80 font-bold leading-relaxed">
              {t('notesRemindersDesc', language)}
            </p>
            <textarea
              rows={3}
              value={data.notes || ''}
              onChange={(e) => saveToStorage({ ...data, notes: e.target.value })}
              placeholder={t('notesRemindersPlaceholder', language)}
              className="w-full p-3 bg-white neo-border text-xs sm:text-sm font-medium text-[#141414] focus:outline-hidden resize-y min-h-[90px] placeholder:text-[#141414]/40"
            />
          </div>
        </section>

        {/* SEO FAQ & Guide Section */}
        <FaqSection language={language} />
      </div>

      {/* Footer */}
      <Footer language={language} />

      {/* Google Translate Integration */}
      <GoogleTranslateScript />

      {/* Modals */}
      <EnvelopeModal
        isOpen={isEnvelopeModalOpen}
        onClose={() => {
          setIsEnvelopeModalOpen(false);
          setEditingEnvelope(null);
        }}
        onSave={handleSaveEnvelope}
        editingEnvelope={editingEnvelope}
        mainCurrency={mainCurrency}
        language={language}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        envelopes={data.envelopes}
        selectedEnvelopeId={selectedEnvelopeForExpense}
        editingExpense={editingExpense}
        mainCurrency={mainCurrency}
        language={language}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
        language={language}
      />

      <DataLossWarningModal
        isOpen={isDataLossModalOpen}
        onDismiss={() => setIsDataLossModalOpen(false)}
        language={language}
      />

      <PdfTemplateModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onSelectTemplate={handleSelectPdfTemplate}
        language={language}
      />
    </div>
  );
}
