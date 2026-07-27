'use client';

import React from 'react';
import { ArrowDown, Shield, FileSpreadsheet, Lock, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onStartBudgeting: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBudgeting,
}) => {
  return (
    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Main Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8A9A5B] text-white border-2 border-[#141414] font-bold text-xs uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            100% Private — Browser-Only Cash Stuffing
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#141414] uppercase tracking-tighter leading-[1.1]">
            Master Your Money with <span className="underline decoration-[#8A9A5B] decoration-8 underline-offset-4">Digital Cash Envelopes</span>
          </h1>

          <p className="text-base sm:text-lg text-[#141414]/90 font-bold tracking-wide leading-relaxed max-w-2xl">
            Budget smarter using the time-tested cash envelope method digitally. Allocate income into virtual envelopes, log daily expenses, monitor live balances, and export your data anytime. Free forever, no accounts required, no bank links.
          </p>

          {/* Key Value Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">Zero Account Required</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">Local Storage Privacy</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border-3 border-[#141414] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">PDF & Excel Export</span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
            <button
              onClick={onStartBudgeting}
              className="px-6 py-3.5 bg-[#8A9A5B] text-white neo-button text-sm sm:text-base font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              Start Budgeting Now
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Feature Display Card */}
        <div className="lg:col-span-5">
          <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-6 relative">
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-4">
              <div className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">Why Digital Cash Stuffing?</div>
              <div className="px-2.5 py-1 bg-[#D15F47] text-white text-xs font-bold uppercase border-2 border-[#141414] tracking-widest">
                100% Free
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-[#8A9A5B]/15 border-2 border-[#141414] space-y-1">
                <div className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#8A9A5B]" />
                  Complete Data Ownership
                </div>
                <p className="text-xs text-[#141414]/90 font-medium">
                  Your budget data stays inside your browser localStorage. No servers, no tracking, no data harvesting.
                </p>
              </div>

              <div className="p-3 bg-[#5C768D]/15 border-2 border-[#141414] space-y-1">
                <div className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-[#5C768D]" />
                  Flexible Import & Backup
                </div>
                <p className="text-xs text-[#141414]/90 font-medium">
                  Easily download formatted PDF budget summaries or 2-sheet Excel files to keep external backups.
                </p>
              </div>

              <div className="p-3 bg-[#FCFAF7] border-2 border-[#141414] text-xs font-bold text-[#141414] leading-normal italic">
                &quot;Your data lives only in this browser. Clear your browsing data or switch devices, and it&apos;s gone — download a PDF if you want a backup.&quot;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
