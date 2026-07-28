'use client';

import React from 'react';
import { Wallet, PieChart, Lock } from 'lucide-react';
import { t } from '../lib/i18n';

interface HowItWorksSectionProps {
  language?: string;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ language = 'en' }) => {
  return (
    <section className="py-12 sm:py-16 bg-[#8A9A5B]/10 border-y-4 border-[#141414] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#141414] uppercase tracking-tight">
            {t('howItWorksTitle', language)}
          </h2>
          <p className="text-sm sm:text-base text-[#141414]/80 font-bold tracking-wide">
            {t('howItWorksSubtitle', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="bg-white border-4 border-[#141414] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 relative">
            <div className="w-12 h-12 bg-[#8A9A5B] text-white border-3 border-[#141414] font-serif font-black text-xl flex items-center justify-center neo-shadow-sm">
              01
            </div>
            <h3 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#8A9A5B]" />
              {t('step1Title', language)}
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/90 font-medium leading-relaxed">
              {t('step1Desc', language)}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-4 border-[#141414] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 relative">
            <div className="w-12 h-12 bg-[#D15F47] text-white border-3 border-[#141414] font-serif font-black text-xl flex items-center justify-center neo-shadow-sm">
              02
            </div>
            <h3 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#D15F47]" />
              {t('step2Title', language)}
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/90 font-medium leading-relaxed">
              {t('step2Desc', language)}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-4 border-[#141414] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 relative">
            <div className="w-12 h-12 bg-[#5C768D] text-white border-3 border-[#141414] font-serif font-black text-xl flex items-center justify-center neo-shadow-sm">
              03
            </div>
            <h3 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#5C768D]" />
              {t('step3Title', language)}
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/90 font-medium leading-relaxed">
              {t('step3Desc', language)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
