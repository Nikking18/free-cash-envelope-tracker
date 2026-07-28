'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { t } from '../lib/i18n';

interface DataLossWarningModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  language?: string;
}

export const DataLossWarningModal: React.FC<DataLossWarningModalProps> = ({
  isOpen,
  onDismiss,
  language = 'en',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-loss-warning-title"
    >
      <div
        ref={modalRef}
        className="bg-[#FCFAF7] border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg p-6 sm:p-8 space-y-6 relative my-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b-4 border-[#141414] pb-4">
          <div className="p-2 bg-[#D15F47] text-white border-2 border-[#141414] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2
            id="data-loss-warning-title"
            className="font-serif font-black text-xl sm:text-2xl text-[#141414] uppercase tracking-tight"
          >
            {t('dataLossModalTitle', language)}
          </h2>
        </div>

        {/* Body Copy */}
        <p className="text-xs sm:text-sm text-[#141414] font-bold leading-relaxed bg-amber-50 p-4 border-2 border-[#141414]">
          {t('dataLossModalDesc', language)}
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-3.5 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-sm font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {t('dataLossModalBtn', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
