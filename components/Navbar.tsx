'use client';

import React from 'react';
import { Wallet, Globe, DollarSign } from 'lucide-react';
import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from '../lib/currency-utils';

interface NavbarProps {
  onScrollToTracker: () => void;
  mainCurrency: string;
  onChangeMainCurrency: (currency: string) => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToTracker,
  mainCurrency,
  onChangeMainCurrency,
  language,
  onChangeLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7] border-b-4 border-[#141414] bg-opacity-95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#8A9A5B] border-3 border-[#141414] flex items-center justify-center neo-shadow-sm group-hover:-translate-y-0.5 transition-transform">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <span className="font-serif font-black text-base sm:text-2xl uppercase tracking-tighter text-[#141414] block leading-none">
              Free Cash Envelope Tracker
            </span>
            <span className="text-[10px] sm:text-xs text-[#141414]/70 font-bold uppercase tracking-widest hidden sm:block mt-1">
              Digital Cash Stuffing &amp; Budgeting
            </span>
          </div>
        </a>

        {/* Currency, Language & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Main Currency Selector */}
          <div className="relative flex items-center">
            <DollarSign className="w-3.5 h-3.5 text-[#141414]/70 absolute left-2 pointer-events-none hidden xs:block" />
            <select
              value={mainCurrency}
              onChange={(e) => onChangeMainCurrency(e.target.value)}
              className="pl-2 xs:pl-6 pr-2 py-1.5 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden cursor-pointer hover:bg-gray-50"
              title="Select Main Budget Currency"
              aria-label="Select Main Budget Currency"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-[#141414]/70 absolute left-2 pointer-events-none hidden xs:block" />
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value)}
              className="pl-2 xs:pl-6 pr-2 py-1.5 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden cursor-pointer hover:bg-gray-50"
              title="Select Language"
              aria-label="Select Language"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Go to Tracker Button */}
          <button
            onClick={onScrollToTracker}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#8A9A5B] text-white neo-button cursor-pointer whitespace-nowrap"
          >
            <span className="hidden md:inline">Go to Tracker</span>
            <span className="md:hidden">Tracker</span>
          </button>
        </div>
      </div>
    </header>
  );
};
