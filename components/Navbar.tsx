'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

interface NavbarProps {
  onScrollToTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToTracker,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7] border-b-4 border-[#141414] bg-opacity-95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-[#8A9A5B] border-3 border-[#141414] flex items-center justify-center neo-shadow-sm group-hover:-translate-y-0.5 transition-transform">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-serif font-black text-xl sm:text-2xl uppercase tracking-tighter text-[#141414] block leading-none">
              Free Cash Envelope Tracker
            </span>
            <span className="text-[10px] sm:text-xs text-[#141414]/70 font-bold uppercase tracking-widest hidden sm:block mt-1">
              Digital Cash Stuffing & Budgeting
            </span>
          </div>
        </a>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={onScrollToTracker}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest bg-[#8A9A5B] text-white neo-button cursor-pointer whitespace-nowrap min-h-[36px]"
          >
            <span className="hidden xs:inline">Go to Tracker</span>
            <span className="xs:hidden">Tracker</span>
          </button>
        </div>
      </div>
    </header>
  );
};
