'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Receipt, Upload, Download, RotateCcw, ChevronDown, FileSpreadsheet, FileText, Info, X, AlertTriangle, Calendar } from 'lucide-react';
import { TrackerData } from '../lib/tracker-types';
import { downloadExcelTemplate, parseAndValidateExcel } from '../lib/excel-utils';
import { formatCurrency } from '../lib/currency-utils';
import { t } from '../lib/i18n';

interface TrackerSummaryProps {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  onAddEnvelope: () => void;
  onAddExpense: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onReset: () => void;
  envelopesCount: number;
  expensesCount: number;
  onImportData: (data: TrackerData) => void;
  budgetPeriod?: string;
  onChangeBudgetPeriod?: (val: string) => void;
  backupReminderInterval?: string;
  onChangeBackupReminderInterval?: (val: string) => void;
  mainCurrency?: string;
  language?: string;
}

export const TrackerSummary: React.FC<TrackerSummaryProps> = ({
  totalAllocated,
  totalSpent,
  totalRemaining,
  onAddEnvelope,
  onAddExpense,
  onExportPDF,
  onExportExcel,
  onReset,
  envelopesCount,
  expensesCount,
  onImportData,
  budgetPeriod = '',
  onChangeBudgetPeriod,
  backupReminderInterval = '7',
  onChangeBackupReminderInterval,
  mainCurrency = 'USD',
  language = 'en',
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showFormatInfo, setShowFormatInfo] = useState(false);

  const [isImporting, setIsImporting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [pendingImportData, setPendingImportData] = useState<TrackerData | null>(null);
  const [showConfirmReplace, setShowConfirmReplace] = useState(false);

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const formatInfoRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const percentSpent = totalAllocated > 0 ? Math.min(Math.round((totalSpent / totalAllocated) * 100), 100) : 0;
  const isOverBudget = totalRemaining < 0;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setIsExportOpen(false);
      }
      if (formatInfoRef.current && !formatInfoRef.current.contains(e.target as Node)) {
        setShowFormatInfo(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationErrors([]);
    setPendingImportData(null);
    setShowConfirmReplace(false);
    setIsImporting(true);

    try {
      const result = await parseAndValidateExcel(file);
      if (!result.success || !result.data) {
        setValidationErrors(result.errors || ['Unknown validation error']);
      } else {
        setPendingImportData(result.data);
        setShowConfirmReplace(true);
      }
    } catch (err: any) {
      setValidationErrors(['Error reading file: ' + err.message]);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg p-5 sm:p-6 lg:p-8 space-y-6">
      {/* Top Title & Quick Actions Header */}
      <div className="space-y-4 border-b-4 border-[#141414] pb-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#141414] flex flex-wrap items-center gap-2 uppercase tracking-tight">
              <span>{t('budgetOverview', language)}</span>
              {isOverBudget && (
                <span className="text-xs px-2.5 py-1 bg-[#D15F47] text-white border-2 border-[#141414] font-sans uppercase font-bold tracking-wider shrink-0">
                  {t('overBudget', language)}
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[#141414]/80 font-bold tracking-wide mt-1">
              {t('realTimeCalcSubtitle', language)}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onAddEnvelope}
              className="px-3 sm:px-3.5 py-2 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t('newEnvelope', language)}</span>
            </button>

            <button
              type="button"
              onClick={onAddExpense}
              className="px-3 sm:px-3.5 py-2 bg-[#D15F47] hover:bg-[#b84d37] text-white neo-button text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shrink-0"
            >
              <Receipt className="w-4 h-4" />
              <span>{t('logExpense', language)}</span>
            </button>

            {/* Import Group */}
            <div className="relative flex items-center shrink-0" ref={formatInfoRef}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
                aria-label="Upload Excel budget file"
              />

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleImportClick}
                  disabled={isImporting}
                  className="px-3 sm:px-3.5 py-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button text-xs font-bold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5 text-[#8A9A5B]" />
                  <span>{isImporting ? '...' : t('import', language)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFormatInfo((prev) => !prev)}
                  className="p-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button cursor-pointer flex items-center justify-center ml-1"
                  title="View accepted Excel format"
                  aria-label="Format Info"
                >
                  <Info className="w-3.5 h-3.5 text-[#5C768D]" />
                </button>
              </div>

              {showFormatInfo && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 p-4 bg-[#FCFAF7] border-3 border-[#141414] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 text-xs text-[#141414] space-y-2">
                  <div className="font-bold text-sm uppercase tracking-tight border-b-2 border-[#141414] pb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-[#8A9A5B]" />
                      {t('excelFormatNoticeTitle', language)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowFormatInfo(false)}
                      className="text-[#141414] hover:text-red-600 font-bold p-0.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#141414]/90 font-medium leading-relaxed">
                    {t('excelFormatNoticeDesc', language)}
                  </p>
                  <div className="p-2 bg-white border-2 border-[#141414] font-mono text-[11px] space-y-1">
                    <div>• <strong>Sheet 1: Envelopes</strong> (Name, Allocated, Category)</div>
                    <div>• <strong>Sheet 2: Expenses</strong> (Envelope Name, Amount, Note, Date)</div>
                  </div>
                </div>
              )}
            </div>

            {/* Export Dropdown */}
            <div className="relative shrink-0" ref={exportDropdownRef}>
              <button
                type="button"
                onClick={() => setIsExportOpen((prev) => !prev)}
                className="px-3 sm:px-3.5 py-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button text-xs font-bold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <Download className="w-3.5 h-3.5 text-[#5C768D]" />
                <span>{t('export', language)}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#141414] transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#FCFAF7] border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-30 p-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportOpen(false);
                      onExportPDF();
                    }}
                    className="w-full px-3 py-2 hover:bg-[#8A9A5B]/15 hover:border-[#141414] border-2 border-transparent text-[#141414] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors text-left uppercase tracking-wider"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#5C768D]" />
                    <span>{t('exportPdf', language)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExportOpen(false);
                      onExportExcel();
                    }}
                    className="w-full px-3 py-2 hover:bg-[#8A9A5B]/15 hover:border-[#141414] border-2 border-transparent text-[#141414] font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors text-left uppercase tracking-wider"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    <span>{t('exportExcel', language)}</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onReset}
              className="px-2.5 sm:px-3 py-2 bg-transparent hover:bg-red-50 text-red-600 border-2 border-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-wider shrink-0"
              title="Reset All Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('reset', language)}</span>
            </button>
          </div>
        </div>

        {/* Dedicated Row: Budget Period & Backup Reminder Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t-2 border-[#141414]/15">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label htmlFor="budgetPeriodInput" className="text-xs font-bold text-[#141414] uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5C768D]" />
              {t('budgetPeriodLabel', language)}
            </label>
            <input
              id="budgetPeriodInput"
              type="text"
              value={budgetPeriod}
              onChange={(e) => onChangeBudgetPeriod?.(e.target.value)}
              placeholder={t('budgetPeriodPlaceholder', language)}
              className="px-2.5 py-1.5 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden w-full sm:w-56 placeholder:text-[#141414]/40 placeholder:font-normal"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label htmlFor="backupReminderSelect" className="text-xs font-bold text-[#141414] uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#8A9A5B]" />
              {t('remindLabel', language)}
            </label>
            <select
              id="backupReminderSelect"
              value={backupReminderInterval}
              onChange={(e) => onChangeBackupReminderInterval?.(e.target.value)}
              className="px-2.5 py-1.5 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden cursor-pointer w-full sm:w-auto"
            >
              <option value="3">{t('every3days', language)}</option>
              <option value="7">{t('weeklyDefault', language)}</option>
              <option value="14">{t('every2weeks', language)}</option>
              <option value="30">{t('monthly', language)}</option>
              <option value="never">{t('never', language)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Allocated */}
        <div className="bg-[#8A9A5B] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[#141414]">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            {t('totalAllocated', language)}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-black">
            {formatCurrency(totalAllocated, mainCurrency)}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            {t('sumAllocated', language)}
          </span>
        </div>

        {/* Total Spent */}
        <div className="bg-[#D15F47] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            {t('totalSpent', language)}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-black">
            {formatCurrency(totalSpent, mainCurrency)}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            {t('sumSpent', language)}
          </span>
        </div>

        {/* Total Remaining */}
        <div className="bg-[#5C768D] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            {t('totalRemaining', language)}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-black">
            {formatCurrency(totalRemaining, mainCurrency)}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            {isOverBudget ? t('overAllocated', language) : t('availCash', language)}
          </span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#141414] uppercase tracking-wider">
          <span>{t('budgetUtilization', language)}</span>
          <span>{percentSpent}% {t('used', language)} ({formatCurrency(totalSpent, mainCurrency)} / {formatCurrency(totalAllocated, mainCurrency)})</span>
        </div>
        <div className="w-full h-8 bg-[#E4E3E0] border-4 border-[#141414]">
          <div
            className={`h-full border-r-4 border-[#141414] transition-all duration-300 ${isOverBudget ? 'bg-[#D15F47]' : 'bg-[#8A9A5B]'}`}
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
