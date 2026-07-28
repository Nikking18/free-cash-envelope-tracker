'use client';

import React from 'react';
import { BookOpen, CheckCircle2, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { t } from '../lib/i18n';

interface BudgetGuideSectionProps {
  language?: string;
}

export const BudgetGuideSection: React.FC<BudgetGuideSectionProps> = ({ language = 'en' }) => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#141414]">
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5C768D] text-white border-2 border-[#141414] font-bold text-xs uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            {t('guideBadge', language)}
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#141414] uppercase tracking-tight leading-tight">
            {t('guideTitleLine1', language)}{' '}
            <span className="underline decoration-[#8A9A5B] decoration-4 sm:decoration-8 underline-offset-4 sm:underline-offset-8 inline-block">
              {t('guideTitleLine2', language)}
            </span>{' '}
            {t('guideTitleLine3', language)}
          </h2>
          <p className="text-xs sm:text-base text-[#141414]/80 font-bold tracking-wide">
            {t('guideSubtitle', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="bg-white border-4 border-[#141414] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="w-10 h-10 bg-[#8A9A5B] text-white border-2 border-[#141414] flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight">
              {t('card1Title', language)}
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/90 font-medium leading-relaxed">
              {t('card1Desc', language)}
            </p>
            <ul className="space-y-2 pt-2 border-t-2 border-[#141414]/10 text-xs font-bold text-[#141414]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
                <span>{t('card1Check1', language)}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
                <span>{t('card1Check2', language)}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
                <span>{t('card1Check3', language)}</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-4 border-[#141414] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="w-10 h-10 bg-[#D15F47] text-white border-2 border-[#141414] flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight">
              {t('card2Title', language)}
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/90 font-medium leading-relaxed">
              {t('card2Desc', language)}
            </p>
            <ul className="space-y-2 pt-2 border-t-2 border-[#141414]/10 text-xs font-bold text-[#141414]">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D15F47] shrink-0" />
                <span>{t('card2Check1', language)}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D15F47] shrink-0" />
                <span>{t('card2Check2', language)}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D15F47] shrink-0" />
                <span>{t('card2Check3', language)}</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white border-4 border-[#141414] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="w-10 h-10 bg-[#5C768D] text-white border-2 border-[#141414] flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight">
              {t('card3Title', language)}
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/90 font-medium leading-relaxed">
              {t('card3Desc', language)}
            </p>
            <ul className="space-y-2 pt-2 border-t-2 border-[#141414]/10 text-xs font-bold text-[#141414]">
              <li className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#5C768D] shrink-0" />
                <span>{t('card3Check1', language)}</span>
              </li>
              <li className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#5C768D] shrink-0" />
                <span>{t('card3Check2', language)}</span>
              </li>
              <li className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#5C768D] shrink-0" />
                <span>{t('card3Check3', language)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
