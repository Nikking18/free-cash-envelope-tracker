'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, FileSpreadsheet, FileText, ShieldCheck } from 'lucide-react';
import { t } from '../lib/i18n';

interface WebViewShowcaseProps {
  language?: string;
}

export const WebViewShowcase: React.FC<WebViewShowcaseProps> = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile' | 'export'>('desktop');

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#141414]">
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#141414] text-[#FCFAF7] font-bold text-xs uppercase tracking-widest neo-border">
          <Monitor className="w-3.5 h-3.5 text-[#8A9A5B]" />
          {t('showcaseBadge', language)}
        </div>
        <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#141414] uppercase tracking-tighter">
          {t('showcaseTitleLine1', language)} <span className="underline decoration-[#8A9A5B] decoration-8 underline-offset-4">{t('showcaseTitleLine2', language)}</span>
        </h2>
        <p className="text-sm sm:text-base text-[#141414]/80 font-bold max-w-2xl mx-auto">
          {t('showcaseSubtitle', language)}
        </p>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('desktop')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider neo-button flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'desktop'
                ? 'bg-[#141414] text-white shadow-[4px_4px_0px_0px_rgba(138,154,91,1)]'
                : 'bg-white text-[#141414] hover:bg-gray-100'
            }`}
          >
            <Monitor className="w-4 h-4 text-[#8A9A5B]" />
            {t('tabDesktop', language)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider neo-button flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'mobile'
                ? 'bg-[#141414] text-white shadow-[4px_4px_0px_0px_rgba(138,154,91,1)]'
                : 'bg-white text-[#141414] hover:bg-gray-100'
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#D15F47]" />
            {t('tabMobile', language)}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider neo-button flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-[#141414] text-white shadow-[4px_4px_0px_0px_rgba(138,154,91,1)]'
                : 'bg-white text-[#141414] hover:bg-gray-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#5C768D]" />
            {t('tabReports', language)}
          </button>
        </div>
      </div>

      {/* Tab 1: Desktop Web View Mockup */}
      {activeTab === 'desktop' && (
        <div className="bg-white border-4 border-[#141414] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Browser Address Bar Mockup */}
          <div className="bg-[#141414] px-4 py-2.5 flex items-center justify-between border-b-4 border-[#141414]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D15F47] inline-block border border-black/30" />
              <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block border border-black/30" />
              <span className="w-3 h-3 rounded-full bg-[#059669] inline-block border border-black/30" />
            </div>
            <div className="bg-[#2A2A2A] text-gray-200 px-4 py-1 text-xs font-mono rounded flex items-center gap-2 w-full max-w-md mx-4 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>https://freecashtracker.online</span>
            </div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest hidden sm:block">
              Web Application
            </div>
          </div>

          {/* Mock Desktop Content */}
          <div className="p-4 sm:p-6 lg:p-8 bg-[#FCFAF7] space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#141414]/70">{t('totalAllocated', language)}</div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-[#141414]">$2,000.00</div>
                <div className="text-[10px] font-bold text-[#8A9A5B] uppercase tracking-wider">4 Active Envelopes</div>
              </div>
              <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#141414]/70">{t('totalSpent', language)}</div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-[#D15F47]">$425.50</div>
                <div className="text-[10px] font-bold text-[#D15F47] uppercase tracking-wider">21.3% of Total Budget</div>
              </div>
              <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#141414]/70">{t('totalRemaining', language)}</div>
                <div className="font-serif font-black text-2xl sm:text-3xl text-[#059669]">$1,574.50</div>
                <div className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">78.7% Safe Remaining</div>
              </div>
            </div>

            {/* Mock Envelopes Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-[#141414] pb-2">
                <h3 className="font-serif font-black text-base uppercase text-[#141414]">{t('cashEnvelopes', language)} Preview</h3>
                <span className="text-xs font-bold text-[#8A9A5B] uppercase tracking-wider">{t('addExpenseBtn', language)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Envelope 1 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="h-1.5 w-full bg-[#8A9A5B] absolute top-0 left-0" />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Groceries</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#8A9A5B]/20 text-[#141414] neo-border">{t('catEssential', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-serif font-black text-[#141414]">$321.60</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $450.00</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 neo-border overflow-hidden">
                    <div className="h-full bg-[#8A9A5B] w-[28.5%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#141414]/70">
                    <span>{t('totalSpent', language)}: $128.40</span>
                    <span className="text-[#8A9A5B]">71.5% Left</span>
                  </div>
                </div>

                {/* Envelope 2 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="h-1.5 w-full bg-[#D15F47] absolute top-0 left-0" />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Dining &amp; Takeout</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#D15F47]/20 text-[#141414] neo-border">{t('catDiscretionary', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-serif font-black text-[#141414]">$52.90</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $150.00</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 neo-border overflow-hidden">
                    <div className="h-full bg-[#D15F47] w-[64.7%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#141414]/70">
                    <span>{t('totalSpent', language)}: $97.10</span>
                    <span className="text-[#D15F47]">35.3% Left</span>
                  </div>
                </div>

                {/* Envelope 3 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="h-1.5 w-full bg-[#5C768D] absolute top-0 left-0" />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Rent &amp; Utilities</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#5C768D]/20 text-[#141414] neo-border">{t('catEssential', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-serif font-black text-[#141414]">$1,000.00</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $1,000.00</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 neo-border overflow-hidden">
                    <div className="h-full bg-[#5C768D] w-[0%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#141414]/70">
                    <span>{t('totalSpent', language)}: $0.00</span>
                    <span className="text-[#059669]">100% Left</span>
                  </div>
                </div>

                {/* Envelope 4 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="h-1.5 w-full bg-[#059669] absolute top-0 left-0" />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Emergency Savings</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#059669]/20 text-[#141414] neo-border">{t('catSavings', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-serif font-black text-[#141414]">$200.00</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $400.00</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 neo-border overflow-hidden">
                    <div className="h-full bg-[#059669] w-[50%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#141414]/70">
                    <span>{t('totalSpent', language)}: $200.00</span>
                    <span className="text-[#059669]">50% Left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Mobile Web View Mockup */}
      {activeTab === 'mobile' && (
        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-[#141414] rounded-[36px] p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-[#141414]">
            {/* Phone Screen Container */}
            <div className="bg-[#FCFAF7] rounded-[24px] overflow-hidden border-2 border-gray-800 space-y-4 pb-6">
              {/* Phone Status Bar */}
              <div className="bg-[#141414] px-5 py-2 flex items-center justify-between text-white text-[11px] font-bold">
                <span>9:41</span>
                <div className="w-16 h-3 bg-black rounded-full" />
                <span>100% 🔋</span>
              </div>

              {/* Mobile App Header */}
              <div className="px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-black text-lg text-[#141414] uppercase">{t('budgetOverview', language)}</span>
                  <span className="px-2 py-0.5 bg-[#8A9A5B] text-white text-[10px] font-bold rounded">Live</span>
                </div>

                {/* Mobile Overview Card */}
                <div className="bg-white border-2 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#141414]">
                    <span>{t('totalRemaining', language)}</span>
                    <span className="text-[#059669]">$1,240.00</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 neo-border overflow-hidden">
                    <div className="h-full bg-[#8A9A5B] w-[35%]" />
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 bg-[#8A9A5B] text-white text-xs font-bold uppercase neo-button flex items-center justify-center gap-1">
                    + {t('newEnvelope', language)}
                  </button>
                  <button className="py-2 bg-[#D15F47] text-white text-xs font-bold uppercase neo-button flex items-center justify-center gap-1">
                    + {t('logExpense', language)}
                  </button>
                </div>

                {/* Mobile Envelope Stack */}
                <div className="space-y-2 pt-1">
                  <div className="bg-white border-2 border-[#141414] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-serif font-black">
                      <span>Groceries</span>
                      <span>$350.00 Left</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded overflow-hidden">
                      <div className="h-full bg-[#8A9A5B] w-[30%]" />
                    </div>
                  </div>

                  <div className="bg-white border-2 border-[#141414] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-serif font-black">
                      <span>Dining Out</span>
                      <span className="text-[#D15F47]">$45.00 Left</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded overflow-hidden">
                      <div className="h-full bg-[#D15F47] w-[70%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PDF & Excel Export Preview */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PDF Preview Card */}
          <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D15F47]" />
                <h3 className="font-serif font-black text-lg text-[#141414] uppercase">{t('cardPdfTitle', language)}</h3>
              </div>
              <span className="px-2 py-0.5 bg-[#8A9A5B] text-white text-[10px] font-bold uppercase neo-border">
                {t('cardPdfBadge', language)}
              </span>
            </div>
            <p className="text-xs text-[#141414]/80 font-bold leading-relaxed">
              {t('cardPdfDesc', language)}
            </p>
            <div className="bg-[#FCFAF7] border-2 border-[#141414] p-4 font-mono text-[11px] text-[#141414] space-y-2">
              <div className="font-bold uppercase tracking-wider text-[#8A9A5B]">{t('pdfPreviewTag', language)}</div>
              <div>• {t('pdfBullet1', language)}</div>
              <div>• {t('pdfBullet2', language)}</div>
              <div>• {t('pdfBullet3', language)}</div>
            </div>
          </div>

          {/* Excel Preview Card */}
          <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#059669]" />
                <h3 className="font-serif font-black text-lg text-[#141414] uppercase">{t('cardExcelTitle', language)}</h3>
              </div>
              <span className="px-2 py-0.5 bg-[#5C768D] text-white text-[10px] font-bold uppercase neo-border">
                {t('cardExcelBadge', language)}
              </span>
            </div>
            <p className="text-xs text-[#141414]/80 font-bold leading-relaxed">
              {t('cardExcelDesc', language)}
            </p>
            <div className="bg-[#FCFAF7] border-2 border-[#141414] p-4 font-mono text-[11px] text-[#141414] space-y-2">
              <div className="font-bold uppercase tracking-wider text-[#059669]">{t('excelPreviewTag', language)}</div>
              <div>• {t('excelBullet1', language)}</div>
              <div>• {t('excelBullet2', language)}</div>
              <div>• {t('excelBullet3', language)}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
