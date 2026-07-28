'use client';

import React from 'react';
import { ArrowDown, Shield, FileSpreadsheet, Lock, CheckCircle2 } from 'lucide-react';
import { t } from '../lib/i18n';

interface HeroSectionProps {
  onStartBudgeting: () => void;
  language?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBudgeting,
  language = 'en',
}) => {
  return (
    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Main Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8A9A5B] text-white border-2 border-[#141414] font-bold text-xs uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            {t('heroBadge', language)}
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#141414] uppercase tracking-tighter leading-[1.1]">
            {t('heroTitleLine1', language)}{' '}
            <span className="underline decoration-[#8A9A5B] decoration-8 underline-offset-4">
              {t('heroTitleLine2', language)}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#141414]/90 font-bold tracking-wide leading-relaxed max-w-2xl">
            {t('heroSubtitle', language)}
          </p>

          {/* Key Value Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                {t('heroBullet1', language)}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                {t('heroBullet2', language)}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                {t('heroBullet3', language)}
              </span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={onStartBudgeting}
              className="px-6 py-3.5 bg-[#8A9A5B] text-white neo-button text-sm sm:text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              {t('heroStartButton', language)}
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Feature Display Card */}
        <div className="lg:col-span-5">
          <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-6 relative">
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-4">
              <div className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
                {t('heroWhyTitle', language)}
              </div>
              <div className="px-2.5 py-1 bg-[#D15F47] text-white text-xs font-bold uppercase border-2 border-[#141414] tracking-widest">
                {t('heroFreeBadge', language)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[#8A9A5B]/15 border-2 border-[#141414] space-y-1">
                <div className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#8A9A5B]" />
                  {t('heroFeature1Title', language)}
                </div>
                <p className="text-xs text-[#141414]/90 font-medium">
                  {t('heroFeature1Desc', language)}
                </p>
              </div>

              <div className="p-3 bg-[#5C768D]/15 border-2 border-[#141414] space-y-1">
                <div className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-[#5C768D]" />
                  {t('heroFeature2Title', language)}
                </div>
                <p className="text-xs text-[#141414]/90 font-medium">
                  {t('heroFeature2Desc', language)}
                </p>
              </div>

              <div className="p-3 bg-[#FCFAF7] border-2 border-[#141414] text-xs font-bold text-[#141414] leading-normal italic">
                {t('heroQuote', language)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
