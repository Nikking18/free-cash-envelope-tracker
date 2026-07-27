'use client';

import React from 'react';
import { Layers, CreditCard, PieChart, AlertCircle } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#141414]">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#141414] uppercase tracking-tighter">
          How Cash Envelope Budgeting Works
        </h2>
        <p className="text-sm sm:text-base text-[#141414]/90 font-bold tracking-wide">
          A simple, visual, discipline-building method that gives every dollar a specific purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="bg-white border-4 border-[#141414] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="w-12 h-12 bg-[#8A9A5B] text-white border-3 border-[#141414] font-serif font-black text-xl flex items-center justify-center neo-shadow-sm">
            1
          </div>
          <h3 className="font-serif font-bold text-xl text-[#141414] uppercase tracking-tight">
            Create Named Envelopes
          </h3>
          <p className="text-xs sm:text-sm text-[#141414]/80 font-bold leading-relaxed">
            Divide your income into distinct category envelopes like Groceries, Rent, Dining, or Emergency Fund. Assign a target allocated budget to each.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white border-4 border-[#141414] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="w-12 h-12 bg-[#D15F47] text-white border-3 border-[#141414] font-serif font-black text-xl flex items-center justify-center neo-shadow-sm">
            2
          </div>
          <h3 className="font-serif font-bold text-xl text-[#141414] uppercase tracking-tight">
            Log Expenses in Real-Time
          </h3>
          <p className="text-xs sm:text-sm text-[#141414]/80 font-bold leading-relaxed">
            Record expenses against specific envelopes as you spend. Watch live progress bars update and catch over-budget warnings instantly.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white border-4 border-[#141414] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="w-12 h-12 bg-[#5C768D] text-white border-3 border-[#141414] font-serif font-black text-xl flex items-center justify-center neo-shadow-sm">
            3
          </div>
          <h3 className="font-serif font-bold text-xl text-[#141414] uppercase tracking-tight">
            Export & Back Up
          </h3>
          <p className="text-xs sm:text-sm text-[#141414]/80 font-bold leading-relaxed">
            Download print-ready PDF summaries or export clean 2-sheet Excel files for tax prep or archiving. Your data stays 100% private in your browser.
          </p>
        </div>
      </div>

      {/* Mandatory Data Privacy Notice Box */}
      <div className="mt-8 p-4 bg-white border-4 border-[#141414] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#D15F47] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm font-bold text-[#141414] leading-relaxed">
          <span className="uppercase text-[#D15F47] mr-2 tracking-wider">Data Privacy Notice:</span>
          &quot;Your data lives only in this browser. Clear your browsing data or switch devices, and it&apos;s gone — download a PDF if you want a backup.&quot;
        </div>
      </div>
    </section>
  );
};
