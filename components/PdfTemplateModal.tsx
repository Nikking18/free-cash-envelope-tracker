'use client';

import React, { useRef, useEffect } from 'react';
import { X, Check, FileText, Printer, Sun } from 'lucide-react';
import { PDFTemplateStyle } from '../lib/pdf-utils';
import { t } from '../lib/i18n';

interface PdfTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (style: PDFTemplateStyle) => void;
  language?: string;
}

export const PdfTemplateModal: React.FC<PdfTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  language = 'en',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus / escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className="bg-[#FCFAF7] neo-border-thick neo-shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 relative"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b-4 border-[#141414] pb-3">
          <div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#141414] uppercase tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#5C768D]" />
              {t('selectPdfTemplateTitle', language)}
            </h2>
            <p className="text-xs text-[#141414]/80 font-bold tracking-wide mt-0.5">
              {t('selectPdfTemplateSubtitle', language)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#F2EFE9] neo-border cursor-pointer transition-colors text-[#141414]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Classic Minimal Template Card */}
          <div className="bg-white neo-border neo-shadow p-3.5 sm:p-4 flex flex-col justify-between space-y-3 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#8A9A5B]/20 text-[#141414] border-2 border-[#141414] flex items-center gap-1">
                  <Sun className="w-3 h-3 text-[#8A9A5B]" />
                  Light / Classic
                </span>
                <span className="text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">
                  Style 1
                </span>
              </div>

              <div>
                <h3 className="font-serif font-black text-base text-[#141414] uppercase tracking-tight">
                  {t('classicTemplateTitle', language)}
                </h3>
                <p className="text-xs text-[#141414]/80 font-medium leading-snug mt-1">
                  {t('classicTemplateDesc', language)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTemplate('classic')}
              className="w-full py-2.5 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              {t('generatePdfBtn', language)}
            </button>
          </div>

          {/* Minimal B&W Template Card */}
          <div className="bg-white neo-border neo-shadow p-3.5 sm:p-4 flex flex-col justify-between space-y-3 hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-200 text-[#141414] border-2 border-[#141414] flex items-center gap-1">
                  <Printer className="w-3 h-3 text-[#141414]" />
                  Print-Friendly
                </span>
                <span className="text-[10px] font-bold text-[#141414]/50 uppercase tracking-widest">
                  Style 2
                </span>
              </div>

              <div>
                <h3 className="font-serif font-black text-base text-[#141414] uppercase tracking-tight">
                  {t('bwTemplateTitle', language)}
                </h3>
                <p className="text-xs text-[#141414]/80 font-medium leading-snug mt-1">
                  {t('bwTemplateDesc', language)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTemplate('minimal-bw')}
              className="w-full py-2.5 bg-[#141414] hover:bg-black text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors border-2 border-[#141414]"
            >
              <Check className="w-4 h-4" />
              {t('generatePdfBtn', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
