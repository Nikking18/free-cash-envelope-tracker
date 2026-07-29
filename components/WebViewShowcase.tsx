'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, FileSpreadsheet, ShieldCheck } from 'lucide-react';
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
            {/* Top 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#141414]/70">{t('totalAllocated', language)}</div>
                <div className="font-serif font-black text-2xl text-[#141414]">$2,000.00</div>
                <div className="text-[10px] font-bold text-[#8A9A5B] uppercase tracking-wider">4 Active Envelopes</div>
              </div>
              <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#141414]/70">{t('totalCashAdded', language)}</div>
                <div className="font-serif font-black text-2xl text-[#059669]">+$250.00</div>
                <div className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">2 Extra Deposits</div>
              </div>
              <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#141414]/70">{t('totalSpent', language)}</div>
                <div className="font-serif font-black text-2xl text-[#D15F47]">$425.50</div>
                <div className="text-[10px] font-bold text-[#D15F47] uppercase tracking-wider">18.9% of Funds</div>
              </div>
              <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#141414]/70">{t('totalRemaining', language)}</div>
                <div className="font-serif font-black text-2xl text-[#5C768D]">$1,824.50</div>
                <div className="text-[10px] font-bold text-[#5C768D] uppercase tracking-wider">81.1% Available</div>
              </div>
            </div>

            {/* Overall Multi-Colored Stacked Progress Bar Preview */}
            <div className="bg-white border-3 border-[#141414] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <span>{t('budgetUtilization', language)}</span>
                  <span className="text-[#D15F47] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D15F47] inline-block border border-black" /> Spent (19%)</span>
                  <span className="text-[#8A9A5B] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8A9A5B] inline-block border border-black" /> Available (70%)</span>
                  <span className="text-[#059669] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#059669] inline-block border border-black" /> Cash Added (+11%)</span>
                </div>
                <span>18.9% Used</span>
              </div>
              <div className="w-full h-5 bg-[#E4E3E0] neo-border flex overflow-hidden">
                <div className="h-full bg-[#D15F47] w-[19%]" />
                <div className="h-full bg-[#8A9A5B] w-[70%]" />
                <div className="h-full bg-[#059669] w-[11%]" />
              </div>
            </div>

            {/* Mock Envelopes Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-[#141414] pb-2">
                <h3 className="font-serif font-black text-base uppercase text-[#141414]">{t('cashEnvelopes', language)} Preview</h3>
                <span className="text-xs font-bold text-[#8A9A5B] uppercase tracking-wider">+ {t('addExpenseBtn', language)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Envelope 1 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Groceries</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#8A9A5B] text-white neo-border">{t('catEssential', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-serif font-black text-[#141414]">$128.40</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $500.00</span>
                  </div>

                  {/* Multi-Colored Stacked Bar */}
                  <div className="w-full h-4 bg-[#E4E3E0] neo-border flex overflow-hidden">
                    <div className="h-full bg-[#D15F47] w-[26%]" />
                    <div className="h-full bg-[#8A9A5B] w-[64%]" />
                    <div className="h-full bg-[#059669] w-[10%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[#8A9A5B]">74% Available ($371.60)</span>
                    <span className="text-[#059669]">+ $50.00</span>
                  </div>
                </div>

                {/* Envelope 2 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Dining &amp; Takeout</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#D15F47] text-white neo-border">{t('catDiscretionary', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-serif font-black text-[#141414]">$97.10</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $150.00</span>
                  </div>

                  {/* Multi-Colored Stacked Bar */}
                  <div className="w-full h-4 bg-[#E4E3E0] neo-border flex overflow-hidden">
                    <div className="h-full bg-[#D15F47] w-[65%]" />
                    <div className="h-full bg-[#8A9A5B] w-[35%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[#8A9A5B]">35% Available ($52.90)</span>
                    <span className="text-[#D15F47]">65% Spent</span>
                  </div>
                </div>

                {/* Envelope 3 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Rent &amp; Utilities</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#5C768D] text-white neo-border">{t('catEssential', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-serif font-black text-[#141414]">$0.00</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $1,000.00</span>
                  </div>

                  {/* Multi-Colored Stacked Bar */}
                  <div className="w-full h-4 bg-[#E4E3E0] neo-border flex overflow-hidden">
                    <div className="h-full bg-[#8A9A5B] w-[100%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[#8A9A5B]">100% Available</span>
                    <span className="text-[#059669]">$1,000.00</span>
                  </div>
                </div>

                {/* Envelope 4 */}
                <div className="bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif font-black text-sm text-[#141414]">Emergency Savings</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#059669] text-white neo-border">{t('catSavings', language)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-serif font-black text-[#141414]">$200.00</span>
                    <span className="text-xs font-bold text-[#141414]/60">/ $600.00</span>
                  </div>

                  {/* Multi-Colored Stacked Bar */}
                  <div className="w-full h-4 bg-[#E4E3E0] neo-border flex overflow-hidden">
                    <div className="h-full bg-[#D15F47] w-[33%]" />
                    <div className="h-full bg-[#8A9A5B] w-[33%]" />
                    <div className="h-full bg-[#059669] w-[34%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[#8A9A5B]">67% Available</span>
                    <span className="text-[#059669]">+ $200.00</span>
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
                    <span className="text-[#8A9A5B]">$1,824.50</span>
                  </div>
                  <div className="w-full h-2 bg-[#E4E3E0] neo-border flex overflow-hidden">
                    <div className="h-full bg-[#D15F47] w-[19%]" />
                    <div className="h-full bg-[#8A9A5B] w-[70%]" />
                    <div className="h-full bg-[#059669] w-[11%]" />
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
                      <span className="text-[#8A9A5B]">$371.60 Left</span>
                    </div>
                    <div className="w-full h-2 bg-[#E4E3E0] neo-border flex overflow-hidden">
                      <div className="h-full bg-[#D15F47] w-[26%]" />
                      <div className="h-full bg-[#8A9A5B] w-[64%]" />
                      <div className="h-full bg-[#059669] w-[10%]" />
                    </div>
                  </div>

                  <div className="bg-white border-2 border-[#141414] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-3 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-serif font-black">
                      <span>Dining Out</span>
                      <span className="text-[#D15F47]">$52.90 Left</span>
                    </div>
                    <div className="w-full h-2 bg-[#E4E3E0] neo-border flex overflow-hidden">
                      <div className="h-full bg-[#D15F47] w-[65%]" />
                      <div className="h-full bg-[#8A9A5B] w-[35%]" />
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
