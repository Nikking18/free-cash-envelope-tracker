'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Wallet, Globe, DollarSign, Info, X, RefreshCw } from 'lucide-react';
import {
  getSupportedCurrencies,
  getCurrencyInfo,
  SUPPORTED_LANGUAGES,
  lastRateFetchTime,
  subscribeRatesChange,
} from '../lib/currency-utils';
import { t } from '../lib/i18n';

interface NavbarProps {
  onScrollToTracker?: () => void;
  mainCurrency?: string;
  onChangeMainCurrency?: (currency: string) => void;
  language?: string;
  onChangeLanguage?: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToTracker = () => {
    if (typeof window !== 'undefined') window.location.href = '/#tracker';
  },
  mainCurrency = 'USD',
  onChangeMainCurrency = () => {},
  language = 'en',
  onChangeLanguage = () => {},
}) => {
  const [showRateInfo, setShowRateInfo] = useState(false);
  const [, setRateUpdateTick] = useState(0);
  const rateInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeRatesChange(() => {
      setRateUpdateTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (rateInfoRef.current && !rateInfoRef.current.contains(e.target as Node)) {
        setShowRateInfo(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleCurrencySelect = (currencyCode: string) => {
    onChangeMainCurrency(currencyCode);
    setShowRateInfo(true);
  };

  const handleLanguageChange = (langCode: string) => {
    onChangeLanguage(langCode);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user_language', langCode);
      } catch (e) {}

      const host = window.location.hostname;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${host}`;
      document.cookie = `googtrans=/en/${langCode}; path=/`;

      window.dispatchEvent(new CustomEvent('app_language_change', { detail: langCode }));

      const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (gtCombo) {
        gtCombo.value = langCode;
        gtCombo.dispatchEvent(new Event('change'));
        gtCombo.dispatchEvent(new Event('input'));
      }
    }
  };

  const selectedCurrencyObj = getCurrencyInfo(mainCurrency);
  const supportedCurrencies = getSupportedCurrencies();

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7] border-b-4 border-[#141414] bg-opacity-95 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#8A9A5B] border-3 border-[#141414] flex items-center justify-center neo-shadow-sm group-hover:-translate-y-0.5 transition-transform">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <span className="font-serif font-black text-base sm:text-2xl uppercase tracking-tighter text-[#141414] block leading-none">
              {t('brandName', language)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#141414]/70 font-bold uppercase tracking-widest hidden sm:block mt-1">
              {t('brandTagline', language)}
            </span>
          </div>
        </Link>

        {/* Currency, Language & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Main Currency Selector with Live Rate Info Popover */}
          <div className="relative flex items-center shrink-0" ref={rateInfoRef}>
            <div className="relative flex items-center">
              <DollarSign className="w-3.5 h-3.5 text-[#141414]/70 absolute left-2 pointer-events-none hidden xs:block" />
              <select
                value={mainCurrency}
                onChange={(e) => handleCurrencySelect(e.target.value)}
                className="pl-2 xs:pl-6 pr-2 py-1.5 bg-white neo-border text-xs font-bold text-[#141414] focus:outline-hidden cursor-pointer hover:bg-gray-50"
                title="Select Main Budget Currency"
                aria-label="Select Main Budget Currency"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowRateInfo((prev) => !prev)}
              className="p-1.5 ml-1 bg-white hover:bg-gray-100 text-[#141414] neo-border cursor-pointer flex items-center justify-center"
              title="View Live Exchange Rate & Info"
              aria-label="View Live Exchange Rate & Info"
            >
              <Info className="w-3.5 h-3.5 text-[#5C768D]" />
            </button>

            {/* Exchange Rate Notice Popover */}
            {showRateInfo && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-4 bg-[#FCFAF7] border-3 border-[#141414] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 text-xs text-[#141414] space-y-3">
                <div className="font-bold text-sm uppercase tracking-tight border-b-2 border-[#141414] pb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-[#8A9A5B]" />
                    {t('exchangeRateNoticeTitle', language)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRateInfo(false)}
                    className="text-[#141414] hover:text-red-600 font-bold p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-white border-2 border-[#141414] space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#5C768D]">
                    {t('selectedCurrencyLabel', language)}: <strong className="text-[#141414]">{selectedCurrencyObj.name}</strong>
                  </div>
                  <div className="text-sm font-serif font-black text-[#8A9A5B]">
                    1 USD = {selectedCurrencyObj.rateToUSD.toFixed(4)} {selectedCurrencyObj.code}
                  </div>
                  <div className="text-[10px] font-bold text-[#141414]/70">
                    {t('liveRateSyncedLabel', language)}: {lastRateFetchTime}
                  </div>
                </div>

                <div className="p-2.5 bg-[#FFFBEB] border-2 border-amber-500 text-[11px] font-bold text-[#141414] leading-snug">
                  📌 <strong className="uppercase">{t('noteWord', language)}:</strong> {t('exchangeRateNoticeDesc', language)}
                </div>

                <div className="p-2 bg-gray-100 border-2 border-gray-400 text-[11px] font-bold text-[#141414]/80 leading-snug">
                  ℹ️ {t('exchangeRateAccuracyNotice', language)}
                </div>

                <div className="p-2.5 bg-red-50 border-2 border-red-600 text-red-700 text-[11px] font-bold leading-snug">
                  {t('currencyChangeWarning', language)}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center shrink-0">
            <Globe className="w-3.5 h-3.5 text-[#141414]/70 absolute left-2 pointer-events-none hidden xs:block" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
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

          {/* Blog & Guides Link */}
          <Link
            href="/blog"
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider bg-white text-[#141414] neo-border hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t('navBlogGuides', language)}
          </Link>

          {/* Go to Tracker Button */}
          <button
            onClick={onScrollToTracker}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#8A9A5B] text-white neo-button cursor-pointer whitespace-nowrap"
          >
            <span className="hidden md:inline">{t('navGoToTracker', language)}</span>
            <span className="md:hidden">{t('navTracker', language)}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
