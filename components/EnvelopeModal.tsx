'use client';

import React, { useState } from 'react';
import { Envelope, Category, CATEGORIES, PRESET_COLORS } from '../lib/tracker-types';
import { getSupportedCurrencies } from '../lib/currency-utils';
import { X, FolderPlus } from 'lucide-react';
import { t } from '../lib/i18n';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (envelopeData: { name: string; allocated: number; category: Category; color: string; currency?: string; id?: string }) => void;
  editingEnvelope?: Envelope | null;
  mainCurrency?: string;
  language?: string;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEnvelope,
  mainCurrency = 'USD',
  language = 'en',
}) => {
  const [name, setName] = useState('');
  const [allocated, setAllocated] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState<Category>('Essential');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  const [prevEditingEnvelope, setPrevEditingEnvelope] = useState<Envelope | null | undefined>(undefined);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (isOpen !== prevIsOpen || editingEnvelope !== prevEditingEnvelope) {
    setPrevIsOpen(isOpen);
    setPrevEditingEnvelope(editingEnvelope);
    if (editingEnvelope) {
      setName(editingEnvelope.name);
      setAllocated(editingEnvelope.allocated.toString());
      setCurrency(editingEnvelope.currency || mainCurrency);
      setCategory(editingEnvelope.category);
      setColor(editingEnvelope.color || PRESET_COLORS[0]);
    } else {
      setName('');
      setAllocated('');
      setCurrency(mainCurrency);
      setCategory('Essential');
      setColor(PRESET_COLORS[0]);
    }
    setError('');
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Envelope name is required');
      return;
    }
    const numAllocated = parseFloat(allocated);
    if (isNaN(numAllocated) || numAllocated < 0) {
      setError('Allocated amount must be a non-negative number');
      return;
    }

    onSave({
      name: name.trim(),
      allocated: numAllocated,
      category,
      color,
      currency,
      id: editingEnvelope ? editingEnvelope.id : undefined,
    });
    onClose();
  };

  const supportedCurrencies = getSupportedCurrencies();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-4 relative">
        <div className="flex items-center justify-between border-b-4 border-[#141414] pb-3">
          <div className="flex items-center gap-2 text-[#141414] font-serif font-black text-xl uppercase tracking-tight">
            <FolderPlus className="w-5 h-5 text-[#8A9A5B]" />
            <span>{editingEnvelope ? t('editEnvelopeTitle', language) : t('createEnvelopeTitle', language)}</span>
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
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('envNameLabel', language)} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('envNamePlaceholder', language)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* Allocated Amount & Currency */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('allocatedLabel', language)} &amp; {t('currencyLabel', language)} *
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
                min="0"
                value={allocated}
                onChange={(e) => setAllocated(e.target.value)}
                placeholder="e.g., 400.00"
                className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
              />
            </div>
            {currency !== mainCurrency && (
              <div className="p-2 bg-red-50 border-2 border-[#D15F47] text-xs font-bold text-[#D15F47] leading-tight mt-1.5">
                ⚠️ {t('currencyWarningNote', language)}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('categoryLabel', language)}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden uppercase tracking-wider"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`cat${cat}`, language).toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Color Swatch Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              {t('colorLabel', language)}
            </label>
            <div className="flex items-center gap-2 pt-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 neo-border cursor-pointer transition-transform ${color === c ? 'scale-110 ring-2 ring-[#141414]' : 'opacity-80 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
              className="px-5 py-2 bg-[#8A9A5B] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {editingEnvelope ? t('saveChangesBtn', language) : t('saveEnvelopeBtn', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
