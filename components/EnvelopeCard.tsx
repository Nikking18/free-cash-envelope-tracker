'use client';

import React from 'react';
import { Envelope, CATEGORY_COLORS } from '../lib/tracker-types';
import { formatCurrency } from '../lib/currency-utils';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { t } from '../lib/i18n';

interface EnvelopeCardProps {
  envelope: Envelope;
  spent: number;
  cashAdded?: number;
  onAddExpense: (envelopeId: string) => void;
  onEditEnvelope: (envelope: Envelope) => void;
  onDeleteEnvelope: (envelopeId: string) => void;
  mainCurrency?: string;
  language?: string;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({
  envelope,
  spent,
  cashAdded = 0,
  onAddExpense,
  onEditEnvelope,
  onDeleteEnvelope,
  mainCurrency = 'USD',
  language = 'en',
}) => {
  const envCurrency = envelope.currency || mainCurrency;
  const effectiveBudget = envelope.allocated + cashAdded;
  const remaining = effectiveBudget - spent;
  const isOverBudget = spent > effectiveBudget;
  const overageAmount = spent - effectiveBudget;

  const totalCapacity = Math.max(effectiveBudget, spent);

  const spentPct = totalCapacity > 0 ? (spent / totalCapacity) * 100 : 0;
  const availablePct = totalCapacity > 0 ? (Math.max(0, remaining) / totalCapacity) * 100 : 0;
  const cashAddedPct = totalCapacity > 0 ? (cashAdded / totalCapacity) * 100 : 0;

  return (
    <div
      className={`bg-white border-4 border-[#141414] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4 relative transition-transform ${
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
            {formatCurrency(spent, envCurrency)} / {formatCurrency(effectiveBudget, envCurrency)}
          </span>
        </div>

        {/* Envelope Title and Color Badge */}
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

        {/* Real-Time Breakdown Info Box (No pie chart graphic) */}
        <div className="p-2.5 bg-[#FCFAF7] border-2 border-[#141414] space-y-1 text-[11px] font-bold uppercase">
          <div className="flex items-center justify-between text-[#8A9A5B]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8A9A5B] border border-[#141414] inline-block" />
              Available
            </span>
            <span>{Math.round(availablePct)}% ({formatCurrency(Math.max(0, remaining), envCurrency)})</span>
          </div>

          <div className="flex items-center justify-between text-[#D15F47]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D15F47] border border-[#141414] inline-block" />
              Spent
            </span>
            <span>{Math.round(spentPct)}% ({formatCurrency(spent, envCurrency)})</span>
          </div>

          {cashAdded > 0 && (
            <div className="flex items-center justify-between text-[#059669]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] border border-[#141414] inline-block" />
                Cash Added
              </span>
              <span>+{formatCurrency(cashAdded, envCurrency)}</span>
            </div>
          )}
        </div>

        {/* Multi-Colored Stacked Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#141414]/80">
            <span>{t('progressLabel', language)}</span>
            <span>{Math.min(Math.round(spentPct), 100)}% Spent</span>
          </div>

          <div className="w-full h-7 bg-[#E4E3E0] border-4 border-[#141414] flex overflow-hidden">
            {/* Spent Segment (Terracotta Red) */}
            {spentPct > 0 && (
              <div
                className="h-full bg-[#D15F47] border-r-2 border-[#141414] transition-all duration-300"
                style={{ width: `${Math.min(spentPct, 100)}%` }}
                title={`Spent: ${formatCurrency(spent, envCurrency)} (${Math.round(spentPct)}%)`}
              />
            )}

            {/* Available Segment (Olive Green) */}
            {availablePct > 0 && (
              <div
                className="h-full bg-[#8A9A5B] border-r-2 border-[#141414] transition-all duration-300"
                style={{ width: `${Math.min(availablePct, 100)}%` }}
                title={`Available: ${formatCurrency(remaining, envCurrency)} (${Math.round(availablePct)}%)`}
              />
            )}

            {/* Cash Added Segment (Emerald Green) */}
            {cashAddedPct > 0 && (
              <div
                className="h-full bg-[#059669] transition-all duration-300"
                style={{ width: `${Math.min(cashAddedPct, 100)}%` }}
                title={`Cash Added: +${formatCurrency(cashAdded, envCurrency)} (${Math.round(cashAddedPct)}%)`}
              />
            )}
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
          <span>{t('addExpenseBtn', language)}</span>
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
