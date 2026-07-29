'use client';

import React, { useState } from 'react';
import { Envelope, Expense } from '../lib/tracker-types';
import { getSupportedCurrencies } from '../lib/currency-utils';
import { X, Receipt, PlusCircle, MinusCircle } from 'lucide-react';
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
  const [txType, setTxType] = useState<'expense' | 'add_cash'>('expense');
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
      setAmount(Math.abs(editingExpense.amount).toString());
      setTxType(editingExpense.amount < 0 ? 'add_cash' : 'expense');
      setCurrency(editingExpense.currency || mainCurrency);
      setNote(editingExpense.note);
      setDate(editingExpense.date);
    } else {
      setEnvelopeId(selectedEnvelopeId || (envelopes.length > 0 ? envelopes[0].id : ''));
      setAmount('');
      setTxType('expense');
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
      setError('Amount must be greater than 0');
      return;
    }

    const finalAmount = txType === 'add_cash' ? -Math.abs(numAmount) : Math.abs(numAmount);

    onSave({
      envelopeId,
      amount: finalAmount,
      currency,
      note: note.trim(),
      date,
      id: editingExpense ? editingExpense.id : undefined,
    });
    onClose();
  };

  const supportedCurrencies = getSupportedCurrencies();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-[#141414] pb-3">
          <div className="flex items-center gap-2 text-[#141414] font-serif font-black text-lg sm:text-xl uppercase tracking-tight">
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
          {/* Transaction Type Toggle Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('transactionTypeLabel', language)}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTxType('expense')}
                className={`py-2 px-2 text-xs font-bold neo-button flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
                  txType === 'expense'
                    ? 'bg-[#D15F47] text-white border-2 border-[#141414]'
                    : 'bg-white text-[#141414] hover:bg-gray-100'
                }`}
              >
                <MinusCircle className="w-4 h-4" />
                <span>{t('transactionTypeExpense', language)}</span>
              </button>

              <button
                type="button"
                onClick={() => setTxType('add_cash')}
                className={`py-2 px-2 text-xs font-bold neo-button flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
                  txType === 'add_cash'
                    ? 'bg-[#8A9A5B] text-white border-2 border-[#141414]'
                    : 'bg-white text-[#141414] hover:bg-gray-100'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('transactionTypeAddCash', language)}</span>
              </button>
            </div>
          </div>

          {/* Target Envelope Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('selectEnvelopeLabel', language)} *
            </label>
            <select
              value={envelopeId}
              onChange={(e) => setEnvelopeId(e.target.value)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden cursor-pointer"
            >
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name} ({env.category}) — [{env.currency || mainCurrency}]
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Currency */}
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
            {currency !== mainCurrency && (
              <div className="mt-2 p-2.5 bg-red-50 border-2 border-red-600 text-red-700 text-[11px] font-bold leading-snug">
                {t('mixedCurrencyWarning', language)}
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

          {/* Action Buttons: Cancel and single dynamic Submit Button */}
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
              className={`px-5 py-2 text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
                txType === 'add_cash' ? 'bg-[#8A9A5B] hover:bg-[#7a8a4b]' : 'bg-[#D15F47] hover:bg-[#b84d37]'
              }`}
            >
              {txType === 'add_cash' ? (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('addCashBtn', language)}</span>
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  <span>{editingExpense ? t('saveChangesBtn', language) : t('saveExpenseBtn', language)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
