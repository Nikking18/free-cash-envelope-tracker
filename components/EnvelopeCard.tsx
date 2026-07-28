'use client';

import React from 'react';
import { Envelope, CATEGORY_COLORS } from '../lib/tracker-types';
import { formatCurrency } from '../lib/currency-utils';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { t } from '../lib/i18n';

interface EnvelopeCardProps {
  envelope: Envelope;
  spent: number;
  onAddExpense: (envelopeId: string) => void;
  onEditEnvelope: (envelope: Envelope) => void;
  onDeleteEnvelope: (envelopeId: string) => void;
  mainCurrency?: string;
  language?: string;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({
  envelope,
  spent,
  onAddExpense,
  onEditEnvelope,
  onDeleteEnvelope,
  mainCurrency = 'USD',
  language = 'en',
}) => {
  const envCurrency = envelope.currency || mainCurrency;
  const remaining = envelope.allocated - spent;
  const isOverBudget = spent > envelope.allocated;
  const percentUsed = envelope.allocated > 0 ? Math.min(Math.round((spent / envelope.allocated) * 100), 100) : 0;
  const overageAmount = spent - envelope.allocated;

  return (
    <div
      className={`bg-white border-4 border-[#141414] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4 relative transition-transform ${
        isOverBudget ? 'border-l-[#D15F47] border-l-[12px]' : ''
      }`}
    >
      {/* Top Header: Category Badge, Allocated Ratio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-white text-[10px] px-2 py-1 font-bold uppercase tracking-widest inline-block border-2 border-[#141414] shrink-0"
            style={{ backgroundColor: CATEGORY_COLORS[envelope.category] || '#5C768D' }}
          >
            {t(`cat${envelope.category}`, language).toUpperCase()}
          </span>

          <span className="font-serif font-bold text-xs sm:text-sm text-[#141414] bg-[#FCFAF7] px-2 py-0.5 border-2 border-[#141414] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0 truncate max-w-[60%] text-right">
            {formatCurrency(spent, envCurrency)} / {formatCurrency(envelope.allocated, envCurrency)}
          </span>
        </div>

        {/* Envelope Title and Color Box */}
        <div className="flex items-center gap-2 pt-1">
          <div
            className="w-3.5 h-3.5 border-2 border-[#141414] shrink-0"
            style={{ backgroundColor: envelope.color || '#8A9A5B' }}
          />
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#141414] leading-tight break-words">
            {envelope.name}
          </h3>
        </div>

        {/* Remaining / Over budget alert */}
        {isOverBudget ? (
          <div className="p-2.5 bg-red-100 border-2 border-[#D15F47] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D15F47] flex items-center gap-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Alert: {t('overBudget', language)}
            </span>
            <span className="font-serif font-bold text-sm text-[#D15F47]">
              -{formatCurrency(overageAmount, envCurrency)}
            </span>
          </div>
        ) : (
          <div className="p-2.5 bg-[#FCFAF7] border-2 border-[#141414] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#141414]/70">
              {t('remainingLabel', language)}
            </span>
            <span className="font-serif font-bold text-sm text-[#8A9A5B]">
              {formatCurrency(remaining, envCurrency)}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#141414]/80">
            <span>{t('progressLabel', language)}</span>
            <span>{percentUsed}%</span>
          </div>
          <div className="w-full h-8 bg-[#E4E3E0] border-4 border-[#141414]">
            <div
              className={`h-full border-r-4 border-[#141414] transition-all duration-300 ${
                isOverBudget ? 'bg-[#D15F47]' : 'bg-[#8A9A5B]'
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t-2 border-[#141414]">
        <button
          onClick={() => onAddExpense(envelope.id)}
          className="flex-1 px-3 py-2 bg-[#8A9A5B] text-white neo-button text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          {t('addExpenseBtn', language)}
        </button>

        <button
          onClick={() => onEditEnvelope(envelope)}
          className="p-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button cursor-pointer"
          title="Edit Envelope"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDeleteEnvelope(envelope.id)}
          className="p-2 bg-transparent hover:bg-red-50 text-red-600 border-2 border-red-600 font-bold cursor-pointer transition-colors"
          title="Delete Envelope"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
