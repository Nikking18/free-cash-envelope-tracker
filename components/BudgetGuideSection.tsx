'use client';

import React from 'react';
import { BookOpen, Check, Wallet, FileText, Lock, Sparkles } from 'lucide-react';

export const BudgetGuideSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#141414]">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5C768D] text-white font-bold text-xs uppercase tracking-widest neo-border">
          <BookOpen className="w-3.5 h-3.5" />
          Cash Stuffing Guide &amp; Resources
        </div>
        <h2 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-[#141414] uppercase tracking-tighter leading-snug sm:leading-tight">
          The Ultimate <span className="inline-block border-b-4 border-[#5C768D] pb-1">Digital Cash Envelope</span> System
        </h2>
        <p className="text-sm sm:text-base text-[#141414]/80 font-bold max-w-2xl mx-auto">
          Learn how digital cash stuffing helps you take full control of your personal finances, sinking funds, and monthly spending.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guide Card 1 */}
        <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
          <div className="w-10 h-10 bg-[#8A9A5B] text-white neo-border flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
            What is Cash Stuffing?
          </h3>
          <p className="text-xs sm:text-sm text-[#141414]/80 font-medium leading-relaxed">
            Cash stuffing (popularized by Dave Ramsey and personal finance creators) is a zero-based budgeting method where you allocate every dollar of your paycheck into individual envelopes for specific spending categories like <strong>Groceries</strong>, <strong>Gas</strong>, <strong>Dining Out</strong>, and <strong>Sinking Funds</strong>.
          </p>
          <ul className="text-xs font-bold text-[#141414] space-y-1.5 pt-2 border-t border-[#141414]/20">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> Prevents Impulse Overspending
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> Visual Real-Time Progress Bars
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> 100% Free &amp; Zero Accounts
            </li>
          </ul>
        </div>

        {/* Guide Card 2 */}
        <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
          <div className="w-10 h-10 bg-[#D15F47] text-white neo-border flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
            Why Choose Digital Over Paper?
          </h3>
          <p className="text-xs sm:text-sm text-[#141414]/80 font-medium leading-relaxed">
            Carrying physical wads of cash in binder envelopes carries security risks and limits card/online payments. <strong>Free Cash Envelope Tracker</strong> lets you practice strict cash envelope discipline digitally without needing physical cash withdrawals or bank logins.
          </p>
          <ul className="text-xs font-bold text-[#141414] space-y-1.5 pt-2 border-t border-[#141414]/20">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#D15F47]" /> No Physical Cash Loss Risk
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#D15F47]" /> Local Storage Browser Privacy
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#D15F47]" /> Fast Transaction Logging
            </li>
          </ul>
        </div>

        {/* Guide Card 3 */}
        <div className="bg-white border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
          <div className="w-10 h-10 bg-[#5C768D] text-white neo-border flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
            Printable PDF &amp; Excel Reports
          </h3>
          <p className="text-xs sm:text-sm text-[#141414]/80 font-medium leading-relaxed">
            Need a paper record for your physical budget binder or tax spreadsheet? Export clean, high-contrast PDF statement cards or download a structured 2-sheet Excel file (.xlsx) with built-in formula-injection security anytime.
          </p>
          <ul className="text-xs font-bold text-[#141414] space-y-1.5 pt-2 border-t border-[#141414]/20">
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5C768D]" /> Classic Minimal PDF Cards
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5C768D]" /> Print-Friendly Minimal B&amp;W
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5C768D]" /> 2-Sheet Excel Import &amp; Export
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
