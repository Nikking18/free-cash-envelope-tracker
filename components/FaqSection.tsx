'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { t } from '../lib/i18n';

interface FaqSectionProps {
  language?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language = 'en' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqList = [
    { question: t('faqQ1', language), answer: t('faqA1', language) },
    { question: t('faqQ2', language), answer: t('faqA2', language) },
    { question: t('faqQ3', language), answer: t('faqA3', language) },
    { question: t('faqQ4', language), answer: t('faqA4', language) },
    { question: t('faqQ5', language), answer: t('faqA5', language) },
    { question: t('faqQ6', language), answer: t('faqA6', language) },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t-4 border-[#141414]">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8A9A5B] text-white font-bold text-xs uppercase tracking-widest border-2 border-[#141414]">
          <HelpCircle className="w-4 h-4" />
          {t('faqBadge', language)}
        </div>
        <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#141414] uppercase tracking-tighter">
          {t('faqTitleLine1', language)} <span className="underline decoration-[#8A9A5B] decoration-8 underline-offset-4">{t('faqTitleHighlight', language)}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#141414]/80 font-bold max-w-2xl mx-auto">
          {t('faqSubtitle', language)}
        </p>
      </div>

      <div className="space-y-4">
        {faqList.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 font-serif font-black text-base sm:text-lg text-[#141414] uppercase tracking-tight cursor-pointer hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#8A9A5B]/20 text-[#141414] border border-[#141414] shrink-0">
                    0{idx + 1}
                  </span>
                  <span>{item.question}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#8A9A5B] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 border-t-2 border-[#141414]/20 pt-3 text-xs sm:text-sm text-[#141414]/90 font-medium leading-relaxed bg-[#FCFAF7]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
