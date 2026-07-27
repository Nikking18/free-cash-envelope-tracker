'use client';

import React, { useState } from 'react';
import { Envelope, Expense } from '../lib/tracker-types';
import { X, Receipt } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: { envelopeId: string; amount: number; note: string; date: string; id?: string }) => void;
  envelopes: Envelope[];
  selectedEnvelopeId?: string;
  editingExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  envelopes,
  selectedEnvelopeId,
  editingExpense,
}) => {
  const [envelopeId, setEnvelopeId] = useState('');
  const [amount, setAmount] = useState('');
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
      setNote(editingExpense.note);
      setDate(editingExpense.date);
    } else {
      setEnvelopeId(selectedEnvelopeId || (envelopes.length > 0 ? envelopes[0].id : ''));
      setAmount('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setError('');
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!envelopeId) {
      setError('Please select an envelope.');
      return;
    }

    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      setError('Expense amount must be a positive number.');
      return;
    }

    if (!date) {
      setError('Date is required.');
      return;
    }

    onSave({
      id: editingExpense?.id,
      envelopeId,
      amount: amtNum,
      note: note.trim(),
      date,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#D15F47]" />
            <h2 className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
              {editingExpense ? 'Edit Expense' : 'Log Expense'}
            </h2>
          </div>
          <button
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
          {/* Target Envelope */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Target Envelope *
            </label>
            <select
              value={envelopeId}
              onChange={(e) => setEnvelopeId(e.target.value)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden uppercase tracking-wider"
            >
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name} (${env.allocated.toFixed(2)} target)
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Spent Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 42.50"
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Note / Vendor (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Trader Joe's, Gas station, Dinner"
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Transaction Date *
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#D15F47] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {editingExpense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
