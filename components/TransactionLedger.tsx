'use client';

import React, { useState, useMemo } from 'react';
import { Envelope, Expense } from '../lib/tracker-types';
import { formatCurrency, convertCurrency } from '../lib/currency-utils';
import { Search, Filter, ArrowUpDown, Trash2, Edit2, Receipt } from 'lucide-react';

interface TransactionLedgerProps {
  expenses: Expense[];
  envelopes: Envelope[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  mainCurrency?: string;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  expenses,
  envelopes,
  onEditExpense,
  onDeleteExpense,
  mainCurrency = 'USD',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnvelopeFilter, setSelectedEnvelopeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const envelopeMap = useMemo(() => {
    const map = new Map<string, Envelope>();
    envelopes.forEach((e) => map.set(e.id, e));
    return map;
  }, [envelopes]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const env = envelopeMap.get(exp.envelopeId);
      const envName = env ? env.name.toLowerCase() : '';
      const noteText = exp.note.toLowerCase();
      const dateText = exp.date.toLowerCase();
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch = !search || envName.includes(search) || noteText.includes(search) || dateText.includes(search);
      const matchesEnv = selectedEnvelopeFilter === 'all' || exp.envelopeId === selectedEnvelopeFilter;

      return matchesSearch && matchesEnv;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [expenses, envelopeMap, searchTerm, selectedEnvelopeFilter, sortBy]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => {
      const converted = convertCurrency(curr.amount, curr.currency || mainCurrency, mainCurrency);
      return acc + converted;
    }, 0);
  }, [filteredExpenses, mainCurrency]);

  return (
    <div className="bg-white border-4 border-[#141414] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#141414] pb-4">
        <div>
          <h2 className="font-serif font-black text-2xl text-[#141414] flex items-center gap-2 uppercase tracking-tight">
            <Receipt className="w-6 h-6 text-[#5C768D]" />
            Recent Ledger
          </h2>
          <p className="text-xs sm:text-sm text-[#141414]/70 font-bold tracking-wide mt-1">
            Search, filter, and audit all expense logs
          </p>
        </div>

        <div className="px-3 py-1.5 bg-[#5C768D] text-white border-2 border-[#141414] text-xs font-bold uppercase tracking-wider">
          {filteredExpenses.length} Logs ({formatCurrency(totalFilteredAmount, mainCurrency)})
        </div>
      </div>

      {/* Search & Filter Controls Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-[#141414]/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search note, vendor, envelope..."
            aria-label="Search ledger transactions"
            className="w-full pl-9 pr-3 py-2 bg-[#FCFAF7] neo-border text-xs font-bold focus:outline-hidden"
          />
        </div>

        {/* Envelope Filter */}
        <div className="sm:col-span-4 relative">
          <select
            value={selectedEnvelopeFilter}
            onChange={(e) => setSelectedEnvelopeFilter(e.target.value)}
            aria-label="Filter ledger by envelope"
            className="w-full px-3 py-2 bg-[#FCFAF7] neo-border text-xs font-bold focus:outline-hidden uppercase tracking-wider"
          >
            <option value="all">All Envelopes ({envelopes.length})</option>
            {envelopes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort ledger transactions"
            className="w-full px-3 py-2 bg-[#FCFAF7] neo-border text-xs font-bold focus:outline-hidden uppercase tracking-wider"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto neo-border">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#141414] text-[#FCFAF7] text-[10px] font-bold uppercase tracking-widest">
              <th className="p-3">Date</th>
              <th className="p-3">Envelope</th>
              <th className="p-3">Note / Vendor</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#141414] bg-white text-xs font-bold text-[#141414]">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#141414]/60 font-serif font-bold">
                  No expenses match your search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => {
                const env = envelopeMap.get(exp.envelopeId);
                return (
                  <tr key={exp.id} className="hover:bg-[#FCFAF7] transition-colors border-b-2 border-[#141414]">
                    <td className="p-3 font-mono">{exp.date}</td>
                    <td className="p-3">
                      {env ? (
                        <span
                          className="inline-block px-2 py-0.5 border-2 border-[#141414] text-[10px] font-bold uppercase tracking-widest text-white"
                          style={{ backgroundColor: env.color || '#8A9A5B' }}
                        >
                          {env.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">Deleted Envelope</span>
                      )}
                    </td>
                    <td className="p-3 text-[#141414]/80 italic">{exp.note || '—'}</td>
                    <td className="p-3 text-right font-serif font-black text-[#D15F47] text-base">
                      {formatCurrency(exp.amount, exp.currency || mainCurrency)}
                      {exp.currency && exp.currency !== mainCurrency && (
                        <div className="text-[10px] font-sans font-bold text-[#141414]/60">
                          (~{formatCurrency(convertCurrency(exp.amount, exp.currency, mainCurrency), mainCurrency)})
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1.5 hover:bg-[#F2EFE9] neo-border cursor-pointer"
                          title="Edit Expense"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#141414]" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1.5 hover:bg-red-50 border-2 border-red-600 text-red-600 cursor-pointer"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
