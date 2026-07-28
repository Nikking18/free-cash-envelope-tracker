'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { t } from '../lib/i18n';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  language?: string;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  language = 'en',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-md p-6 space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-red-600 pb-3">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-serif font-black text-xl uppercase tracking-tight">
              {t('confirmResetTitle', language)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F2EFE9] neo-border cursor-pointer"
          >
            <X className="w-5 h-5 text-[#141414]" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-[#141414] leading-relaxed">
            {t('confirmResetDesc', language)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#141414]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            {t('cancelBtn', language)}
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-5 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-wider neo-border hover:bg-red-700 cursor-pointer"
          >
            {t('confirmResetBtn', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
