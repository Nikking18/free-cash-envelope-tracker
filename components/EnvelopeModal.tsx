'use client';

import React, { useState } from 'react';
import { Envelope, Category, CATEGORIES, PRESET_COLORS } from '../lib/tracker-types';
import { X, FolderPlus } from 'lucide-react';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (envelopeData: { name: string; allocated: number; category: Category; color: string; id?: string }) => void;
  editingEnvelope?: Envelope | null;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEnvelope,
}) => {
  const [name, setName] = useState('');
  const [allocated, setAllocated] = useState('');
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
      setCategory(editingEnvelope.category);
      setColor(editingEnvelope.color || PRESET_COLORS[0]);
    } else {
      setName('');
      setAllocated('');
      setCategory('Essential');
      setColor(PRESET_COLORS[0]);
    }
    setError('');
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Envelope name is required.');
      return;
    }

    const allocNum = parseFloat(allocated);
    if (isNaN(allocNum) || allocNum < 0) {
      setError('Allocated amount must be a non-negative number.');
      return;
    }

    onSave({
      id: editingEnvelope?.id,
      name: name.trim(),
      allocated: allocNum,
      category,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[#8A9A5B]" />
            <h2 className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
              {editingEnvelope ? 'Edit Envelope' : 'Create New Envelope'}
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
          {/* Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Envelope Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Groceries, Rent, Vacation"
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* Allocated Amount */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Allocated Target Amount ($) *
            </label>
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

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Category Tag
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 bg-white neo-border font-bold text-sm text-[#141414] focus:outline-hidden uppercase tracking-wider"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Color Swatch Selector */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-[#141414] tracking-wider">
              Color Accent
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
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#8A9A5B] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {editingEnvelope ? 'Save Changes' : 'Create Envelope'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
