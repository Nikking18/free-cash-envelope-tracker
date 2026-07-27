'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Receipt, Upload, Download, RotateCcw, ChevronDown, FileSpreadsheet, FileText, Info, X, AlertTriangle, Calendar } from 'lucide-react';
import { TrackerData } from '../lib/tracker-types';
import { downloadExcelTemplate, parseAndValidateExcel } from '../lib/excel-utils';

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

  // Handle outside click to close Export dropdown and Format Info popover
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
              <span>Budget Overview</span>
              {isOverBudget && (
                <span className="text-xs px-2.5 py-1 bg-[#D15F47] text-white border-2 border-[#141414] font-sans uppercase font-bold tracking-wider shrink-0">
                  Over Budget
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[#141414]/80 font-bold tracking-wide mt-1">
              Real-time calculation across all active envelopes and expenses
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
              <span>New Envelope</span>
            </button>

            <button
              type="button"
              onClick={onAddExpense}
              className="px-3 sm:px-3.5 py-2 bg-[#D15F47] hover:bg-[#b84d37] text-white neo-button text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shrink-0"
            >
              <Receipt className="w-4 h-4" />
              <span>Log Expense</span>
            </button>

            {/* Import Group with Info Icon & Popover */}
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
                  <span>{isImporting ? 'Validating...' : 'Import'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFormatInfo((prev) => !prev)}
                  onMouseEnter={() => setShowFormatInfo(true)}
                  className="p-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button cursor-pointer flex items-center justify-center ml-1"
                  title="View accepted Excel format"
                  aria-label="Format Info"
                >
                  <Info className="w-3.5 h-3.5 text-[#5C768D]" />
                </button>
              </div>

              {/* Format Info Popover */}
              {showFormatInfo && (
                <div className="absolute right-0 sm:left-0 top-full mt-2 w-72 sm:w-80 p-4 bg-[#FCFAF7] border-3 border-[#141414] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-40 text-xs text-[#141414] space-y-3">
                  <div className="font-bold text-sm uppercase tracking-tight border-b-2 border-[#141414] pb-1.5 flex items-center justify-between">
                    <span>Accepted Excel Format</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFormatInfo(false);
                      }}
                      className="text-[#141414] hover:text-red-600 font-bold p-0.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-bold">Your Excel file needs two sheets:</p>
                  <div className="space-y-1.5 font-mono text-[11px] bg-white p-2.5 border-2 border-[#141414]">
                    <div>
                      <strong className="text-[#8A9A5B] font-bold">&apos;Envelopes&apos;</strong> with columns:
                      <br />
                      <span className="text-[10px] font-semibold text-[#141414]">Envelope Name, Allocated Amount, Category</span>
                    </div>
                    <div>
                      <strong className="text-[#D15F47] font-bold">&apos;Expenses&apos;</strong> with columns:
                      <br />
                      <span className="text-[10px] font-semibold text-[#141414]">Envelope Name, Amount, Note, Date (YYYY-MM-DD)</span>
                    </div>
                  </div>

                  <p className="text-[11px] font-bold leading-relaxed text-[#141414]/90">
                    Envelope Names in the Expenses sheet must match names in the Envelopes sheet. Not sure? Download the template first and fill it in.
                  </p>

                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      setShowFormatInfo(false);
                      try {
                        await downloadExcelTemplate();
                      } catch (err: any) {
                        alert('Failed to download template: ' + err.message);
                      }
                    }}
                    className="w-full py-2 bg-[#5C768D] text-white font-bold text-xs uppercase tracking-wider neo-button cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#4a6175]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Template
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
                <span>Export</span>
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
                    <span>Export as PDF</span>
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
                    <span>Export as Excel</span>
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
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dedicated Row: Budget Period & Backup Reminder Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t-2 border-[#141414]/15">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label htmlFor="budgetPeriodInput" className="text-xs font-bold text-[#141414] uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5C768D]" />
              Budget Period:
            </label>
            <input
              id="budgetPeriodInput"
              type="text"
              value={budgetPeriod}
              onChange={(e) => onChangeBudgetPeriod?.(e.target.value)}
              placeholder="e.g. August 2026 or Jul 26 – Aug 9"
              className="px-2.5 py-1.5 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden w-full sm:w-56 placeholder:text-[#141414]/40 placeholder:font-normal"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <label htmlFor="backupReminderSelect" className="text-xs font-bold text-[#141414] uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#8A9A5B]" />
              Remind me to back up:
            </label>
            <select
              id="backupReminderSelect"
              value={backupReminderInterval}
              onChange={(e) => onChangeBackupReminderInterval?.(e.target.value)}
              className="px-2.5 py-1.5 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden cursor-pointer w-full sm:w-auto"
            >
              <option value="3">Every 3 days</option>
              <option value="7">Weekly (default)</option>
              <option value="14">Every 2 weeks</option>
              <option value="30">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Validation Errors Modal */}
      {validationErrors.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-2">
              <div className="font-bold text-sm text-red-900 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Excel Validation Errors ({validationErrors.length})
              </div>
              <button
                type="button"
                onClick={() => setValidationErrors([])}
                className="p-1 hover:bg-[#F2EFE9] neo-border cursor-pointer"
              >
                <X className="w-4 h-4 text-[#141414]" />
              </button>
            </div>
            <ul className="text-xs text-red-800 list-disc list-inside space-y-1 max-h-60 overflow-y-auto font-mono bg-red-50 p-3 border-2 border-red-300">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setValidationErrors([])}
              className="w-full py-2.5 bg-[#141414] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Replace-All Modal */}
      {showConfirmReplace && pendingImportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-4 relative">
            <div className="flex items-center gap-2 border-b-2 border-[#141414] pb-2 text-[#141414] font-serif font-black text-lg uppercase tracking-tight">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              Confirm Replace-All Import
            </div>
            <p className="text-xs sm:text-sm text-[#141414] font-bold leading-relaxed">
              This import file contains <strong>{pendingImportData.envelopes.length} envelopes</strong> and <strong>{pendingImportData.expenses.length} expenses</strong>.
            </p>
            <p className="text-xs text-red-700 bg-red-50 p-3 border-2 border-red-300 font-bold leading-relaxed">
              Warning: Importing will replace your current {envelopesCount} envelopes and {expensesCount} expenses. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmReplace(false);
                  setPendingImportData(null);
                }}
                className="px-4 py-2.5 bg-white text-[#141414] neo-border font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onImportData(pendingImportData);
                  setPendingImportData(null);
                  setShowConfirmReplace(false);
                }}
                className="px-4 py-2.5 bg-red-600 text-white neo-button font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-red-700"
              >
                Yes, Replace & Import Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Allocated */}
        <div className="bg-[#8A9A5B] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[#141414]">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Total Allocated
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-black">
            ${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            Sum of envelope targets
          </span>
        </div>

        {/* Total Spent */}
        <div className="bg-[#D15F47] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Total Spent
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-black">
            ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            Sum of recorded expenses
          </span>
        </div>

        {/* Total Remaining */}
        <div className="bg-[#5C768D] border-4 border-[#141414] p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider mb-1">
            Total Remaining
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-black">
            {isOverBudget ? '-' : ''}${Math.abs(totalRemaining).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold opacity-80 mt-1">
            {isOverBudget ? 'Over allocated target' : 'Available cash balance'}
          </span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#141414] uppercase tracking-wider">
          <span>Overall Budget Utilization</span>
          <span>{percentSpent}% Used (${totalSpent.toFixed(2)} / ${totalAllocated.toFixed(2)})</span>
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
