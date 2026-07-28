'use client';

import React, { useState } from 'react';
import { Envelope, Expense } from '../lib/tracker-types';
import { getSupportedCurrencies } from '../lib/currency-utils';
import { X, Receipt } from 'lucide-react';
import { t } from '../lib/i18n';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: { envelopeId: string; amount: number; note: string; date: string; currency?: string; id?: string }) => void;
  envelopes: Envelope[];
  selectedEnvelopeId?: string;
  editingExpense?: Expense | null;
  mainCurrency?: string;
  language?: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  envelopes,
  selectedEnvelopeId,
  editingExpense,
  mainCurrency = 'USD',
  language = 'en',
}) => {
  const [envelopeId, setEnvelopeId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const [prevEditingExpense, setPrevEditingExpense] = useState<Expense | null | undefined>(undefined);
  const [prevSelectedEnvId, setPrevSelectedEnvId] = useState<string | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (isOpen !== prevIsOpen || editingExpense !== prevEditingExpense || selectedEnvelopeId !== prevSelectedEnvId) {
    setPrevIsOpen(isOpen);
    setPrevEditingExpense(editingExpense);
    setPrevSelectedEnvId(selectedEnvelopeId);

    if (editingExpense) {
      setEnvelopeId(editingExpense.envelopeId);
      setAmount(editingExpense.amount.toString());
      setCurrency(editingExpense.currency || mainCurrency);
      setNote(editingExpense.note);
      setDate(editingExpense.date);
    } else {
      setEnvelopeId(selectedEnvelopeId || (envelopes.length > 0 ? envelopes[0].id : ''));
      setAmount('');
      setCurrency(mainCurrency);
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!envelopeId) {
      setError('Please select an envelope');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Expense amount must be greater than 0');
      return;
    }

    onSave({
      envelopeId,
      amount: numAmount,
      currency,
      note: note.trim(),
      date,
      id: editingExpense ? editingExpense.id : undefined,
    });
    onClose();
  };

  const selectedEnvelopeObj = envelopes.find((e) => e.id === envelopeId);
  const targetEnvelopeCurrency = selectedEnvelopeObj?.currency || mainCurrency;
  const isForeignCurrency = currency !== targetEnvelopeCurrency;

  const supportedCurrencies = getSupportedCurrencies();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-4 relative">
        <div className="flex items-center justify-between border-b-4 border-[#141414] pb-3">
          <div className="flex items-center gap-2 text-[#141414] font-serif font-black text-xl uppercase tracking-tight">
            <Receipt className="w-5 h-5 text-[#D15F47]" />
            <span>{editingExpense ? t('editExpenseTitle', language) : t('logExpenseTitle', language)}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#F2EFE9] neo-border cursor-pointer"
          >
            <X className="w-5 h-5 text-[#141414]" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border-2 border-red-600 text-red-800 text-xs font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Envelope Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('selectEnvelopeLabel', language)} *
            </label>
            <select
              value={envelopeId}
              onChange={(e) => setEnvelopeId(e.target.value)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
            >
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name} ({env.category}) — [{env.currency || mainCurrency}]
                </option>
              ))}
            </select>
          </div>

          {/* Expense Amount & Currency */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('expenseAmountLabel', language)} &amp; {t('expenseCurrencyLabel', language)} *
            </label>
            <div className="flex items-center gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-28 px-2 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden cursor-pointer"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 45.50"
                className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
                autoFocus
              />
            </div>
            {isForeignCurrency && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-bold text-[#5C768D]">
                  ℹ️ {t('autoConversionNotice', language)} ({targetEnvelopeCurrency})
                </p>
                <div className="p-2.5 bg-red-50 border-2 border-[#D15F47] text-xs font-bold text-[#D15F47] leading-tight">
                  ⚠️ {t('currencyWarningNote', language)}
                </div>
              </div>
            )}
          </div>

          {/* Note / Vendor */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('vendorNoteLabel', language)}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('vendorNotePlaceholder', language)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('expenseDateLabel', language)}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#141414]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {t('cancelBtn', language)}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#D15F47] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {editingExpense ? t('saveChangesBtn', language) : t('saveExpenseBtn', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
