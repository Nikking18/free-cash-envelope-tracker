'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Receipt, Upload, Download, RotateCcw, ChevronDown, FileSpreadsheet, FileText, Info, X, Calendar } from 'lucide-react';
import { TrackerData } from '../lib/tracker-types';
import { downloadExcelTemplate, parseAndValidateExcel } from '../lib/excel-utils';
import { formatCurrency } from '../lib/currency-utils';
import { t } from '../lib/i18n';

interface TrackerSummaryProps {
  totalAllocated: number;
  totalCashAdded?: number;
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
  totalCashAdded = 0,
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const formatInfoRef = useRef<HTMLDivElement>(null);

  const totalEffectiveFunds = totalAllocated + totalCashAdded;
  const isOverBudget = totalSpent > totalEffectiveFunds;
  const percentSpent = totalEffectiveFunds > 0 ? Math.min(Math.round((totalSpent / totalEffectiveFunds) * 100), 100) : 0;

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
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsImporting(true);

    try {
      const result = await parseAndValidateExcel(file);
      if (result.success && result.data) {
        onImportData(result.data);
        alert(`Successfully imported ${result.data.envelopes.length} envelopes and ${result.data.expenses.length} expenses from Excel!`);
      } else if (result.errors && result.errors.length > 0) {
        alert(`Import Error:\n\n` + result.errors.join('\n'));
      }
    } catch (err: any) {
      alert('Failed to import Excel file: ' + (err.message || 'Unknown error'));
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div id="tracker" className="bg-[#FCFAF7] border-4 border-[#141414] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
      {/* Top Controls & Title */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#141414] pb-4">
          <div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#141414] uppercase tracking-tight flex items-center gap-2">
              {t('budgetOverview', language)}
            </h1>
            <p className="text-xs sm:text-sm text-[#141414]/70 font-bold tracking-wide mt-0.5">
              {t('realTimeCalcSubtitle', language)}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
                  className="p-2 ml-1 bg-white hover:bg-gray-100 neo-border cursor-pointer flex items-center justify-center"
                  title="View Excel Import Format Instructions"
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
                    <div>• <strong>Sheet 1: {t('excelSheetEnvelopes', language)}</strong> ({t('excelColEnvName', language)}, {t('excelColAllocated', language)}, {t('excelColCategory', language)})</div>
                    <div>• <strong>Sheet 2: {t('excelSheetExpenses', language)}</strong> ({t('excelColEnvName', language)}, {t('excelColAmount', language)}, {t('excelColNote', language)}, {t('excelColDate', language)})</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadExcelTemplate(language)}
                    className="w-full py-2 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('downloadSampleTemplateBtn', language)}</span>
                  </button>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Allocated */}
        <div className="bg-[#8A9A5B] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[#141414]">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            {t('totalAllocated', language)}
          </span>
          <span className="text-2xl font-serif font-black truncate">
            {formatCurrency(totalAllocated, mainCurrency)}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            {t('sumAllocated', language)}
          </span>
        </div>

        {/* Total Cash Added */}
        <div className="bg-[#059669] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            {t('totalCashAdded', language)}
          </span>
          <span className="text-2xl font-serif font-black truncate">
            +{formatCurrency(totalCashAdded, mainCurrency)}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            {t('sumCashAdded', language)}
          </span>
        </div>

        {/* Total Spent */}
        <div className="bg-[#D15F47] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            {t('totalSpent', language)}
          </span>
          <span className="text-2xl font-serif font-black truncate">
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
          <span className="text-2xl font-serif font-black truncate">
            {formatCurrency(totalRemaining, mainCurrency)}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            {isOverBudget ? t('overAllocated', language) : t('availCash', language)}
          </span>
        </div>
      </div>

      {/* Overall Multi-Colored Stacked Progress Bar */}
      {(() => {
        const totalCapacity = Math.max(totalEffectiveFunds, totalSpent);
        const spentPct = totalCapacity > 0 ? (totalSpent / totalCapacity) * 100 : 0;
        const availablePct = totalCapacity > 0 ? (Math.max(0, totalRemaining) / totalCapacity) * 100 : 0;
        const cashAddedPct = totalCapacity > 0 ? (totalCashAdded / totalCapacity) * 100 : 0;

        return (
          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap items-center justify-between text-xs font-bold text-[#141414] uppercase tracking-wider gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span>{t('budgetUtilization', language)}</span>
                <span className="text-[#D15F47] flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D15F47] inline-block border border-[#141414]" />
                  Spent ({Math.round(spentPct)}%)
                </span>
                <span className="text-[#8A9A5B] flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A9A5B] inline-block border border-[#141414]" />
                  Available ({Math.round(availablePct)}%)
                </span>
                {totalCashAdded > 0 && (
                  <span className="text-[#059669] flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#059669] inline-block border border-[#141414]" />
                    Cash Added (+{formatCurrency(totalCashAdded, mainCurrency)})
                  </span>
                )}
              </div>
              <span>{percentSpent}% {t('used', language)} ({formatCurrency(totalSpent, mainCurrency)} / {formatCurrency(totalEffectiveFunds, mainCurrency)})</span>
            </div>

            <div className="w-full h-8 bg-[#E4E3E0] border-4 border-[#141414] flex overflow-hidden">
              {/* Spent Segment (Terracotta Red) */}
              {spentPct > 0 && (
                <div
                  className="h-full bg-[#D15F47] border-r-2 border-[#141414] transition-all duration-300"
                  style={{ width: `${Math.min(spentPct, 100)}%` }}
                  title={`Spent: ${formatCurrency(totalSpent, mainCurrency)} (${Math.round(spentPct)}%)`}
                />
              )}

              {/* Available Segment (Olive Green) */}
              {availablePct > 0 && (
                <div
                  className="h-full bg-[#8A9A5B] border-r-2 border-[#141414] transition-all duration-300"
                  style={{ width: `${Math.min(availablePct, 100)}%` }}
                  title={`Available: ${formatCurrency(totalRemaining, mainCurrency)} (${Math.round(availablePct)}%)`}
                />
              )}

              {/* Cash Added Segment (Emerald Green) */}
              {cashAddedPct > 0 && (
                <div
                  className="h-full bg-[#059669] transition-all duration-300"
                  style={{ width: `${Math.min(cashAddedPct, 100)}%` }}
                  title={`Cash Added: +${formatCurrency(totalCashAdded, mainCurrency)} (${Math.round(cashAddedPct)}%)`}
                />
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
