'use client';

import React, { useRef, useEffect } from 'react';
import { X, Check, FileText, Printer, Sun } from 'lucide-react';
import { PDFTemplateStyle } from '../lib/pdf-utils';

interface PdfTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (style: PDFTemplateStyle) => void;
}

export const PdfTemplateModal: React.FC<PdfTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
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
              Choose PDF Style
            </h2>
            <p className="text-xs text-[#141414]/80 font-bold tracking-wide mt-0.5">
              Select a visual template layout for your budget report
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

        {/* Template Cards Grid (Stacks vertically on mobile, 2 columns on sm+) */}
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
                  Classic Minimal
                </h3>
                <p className="text-xs text-[#141414]/80 font-medium leading-snug mt-1">
                  Dark header bar with color-coded metric cards (#8A9A5B, #D15F47, #5C768D).
                </p>
              </div>

              {/* Cropped Header Snippet: Classic Minimal */}
              <div className="border-2 border-[#141414] bg-[#FCFAF7] p-2 rounded-none space-y-1.5 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] group-hover:border-[#8A9A5B] transition-colors">
                <div className="bg-[#18181B] text-[#FCFAF7] p-1.5 flex items-center justify-between">
                  <div className="text-[8px] font-black uppercase tracking-wider font-serif">FREE CASH ENVELOPE BUDGET</div>
                  <div className="text-[6px] opacity-70">July 2026</div>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <div className="bg-[#F4F1EA] border border-[#141414] border-t-2 border-t-[#5C768D] p-1 text-[6px]">
                    <div className="font-bold text-[#141414]">ALLOCATED</div>
                    <div className="font-black text-[#141414] text-[7.5px]">$1,850</div>
                  </div>
                  <div className="bg-[#F4F1EA] border border-[#141414] border-t-2 border-t-[#D15F47] p-1 text-[6px]">
                    <div className="font-bold text-[#141414]">SPENT</div>
                    <div className="font-black text-[#D15F47] text-[7.5px]">$620</div>
                  </div>
                  <div className="bg-[#F4F1EA] border border-[#141414] border-t-2 border-t-[#8A9A5B] p-1 text-[6px]">
                    <div className="font-bold text-[#141414]">REMAINING</div>
                    <div className="font-black text-[#8A9A5B] text-[7.5px]">$1,230</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTemplate('classic')}
              className="w-full py-2.5 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              Export Classic PDF
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
                  Minimal B&amp;W
                </h3>
                <p className="text-xs text-[#141414]/80 font-medium leading-snug mt-1">
                  Pure black-and-white outlines with serif heading and envelope ledger tables.
                </p>
              </div>

              {/* Cropped Header Snippet: Minimal B&W */}
              <div className="border-2 border-[#141414] bg-white p-2 rounded-none space-y-1.5 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] group-hover:border-black transition-colors">
                <div className="bg-white border border-[#141414] text-[#141414] p-1.5 flex items-center justify-between">
                  <div className="text-[8px] font-black uppercase tracking-wider font-serif">
                    CASH ENVELOPE <span className="font-serif italic font-normal">Tracker</span>
                  </div>
                  <div className="text-[6px] text-gray-600">Pure B&amp;W</div>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <div className="bg-white border border-[#141414] p-1 text-[6px]">
                    <div className="font-bold text-[#141414]">ALLOCATED</div>
                    <div className="font-black text-[#141414] text-[7.5px]">$1,850</div>
                  </div>
                  <div className="bg-white border border-[#141414] p-1 text-[6px]">
                    <div className="font-bold text-[#141414]">SPENT</div>
                    <div className="font-black text-[#141414] text-[7.5px]">$620</div>
                  </div>
                  <div className="bg-white border border-[#141414] p-1 text-[6px]">
                    <div className="font-bold text-[#141414]">REMAINING</div>
                    <div className="font-black text-[#141414] text-[7.5px]">$1,230</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectTemplate('minimal-bw')}
              className="w-full py-2.5 bg-[#141414] hover:bg-black text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors border-2 border-[#141414]"
            >
              <Check className="w-4 h-4" />
              Export Minimal B&amp;W PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
