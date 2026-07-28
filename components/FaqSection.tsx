'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, FileSpreadsheet, Lock, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is Free Cash Envelope Tracker 100% free with no hidden fees?',
    answer: 'Yes! Free Cash Envelope Tracker is 100% free forever. There are no premium subscriptions, no paywalled features, no ads, and no hidden charges. All envelope management, expense logging, PDF exports, and Excel imports/exports are completely free to use.',
  },
  {
    question: 'How does digital cash stuffing work?',
    answer: 'Digital cash stuffing adapts the traditional physical cash envelope budgeting system into a convenient browser app. Instead of withdrawing physical paper cash into paper envelopes, you create virtual digital envelopes (e.g. Groceries, Rent, Dining Out, Savings), assign target budget amounts, and log transactions as you spend. Live progress bars visually alert you if an envelope is approaching or exceeding its limit.',
  },
  {
    question: 'Is my financial budget data safe and private?',
    answer: 'Absolutely. Your privacy is guaranteed because 100% of your budget data is stored exclusively inside your browser\'s local storage (localStorage). We do not operate remote databases, we do not require account sign-ups or email addresses, and we never link to bank credentials. Your data never leaves your device.',
  },
  {
    question: 'Can I export my cash envelope budget to PDF or Excel?',
    answer: 'Yes! You can export your complete budget summary anytime. We support two customizable PDF export templates: Classic Minimal (color-coded cards and itemized ledger) and Minimal B&W (print-friendly ruled lines). You can also export your budget into a 2-sheet Excel (.xlsx) spreadsheet or import existing Excel budget files.',
  },
  {
    question: 'What happens if I clear my browser history or switch devices?',
    answer: 'Because all budget data lives locally in your browser\'s storage, clearing browser cache or switching to a new phone/computer will start a fresh session. We recommend regularly exporting a PDF or Excel backup file so you can restore or reference your budget records whenever needed.',
  },
  {
    question: 'Do I need to connect a bank account or credit card?',
    answer: 'No! Free Cash Envelope Tracker requires zero bank credentials, zero credit cards, and zero account creation. It is a completely manual, privacy-focused zero-login budgeting tool designed for total financial autonomy.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t-4 border-[#141414]">
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8A9A5B] text-white font-bold text-xs uppercase tracking-widest border-2 border-[#141414]">
          <HelpCircle className="w-4 h-4" />
          Frequently Asked Questions &amp; Guide
        </div>
        <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#141414] uppercase tracking-tighter">
          Everything You Need to Know About <span className="underline decoration-[#8A9A5B] decoration-8 underline-offset-4">Digital Cash Stuffing</span>
        </h2>
        <p className="text-sm sm:text-base text-[#141414]/80 font-bold max-w-2xl mx-auto">
          Get quick answers about privacy, zero-login cash envelope tracking, PDF/Excel backups, and digital budget management.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
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
