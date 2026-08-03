'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '../lib/blog-data';
import { BookOpen, Clock, ArrowRight, Wallet, Shield } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GoogleTranslateScript } from './GoogleTranslateScript';
import { t } from '../lib/i18n';

export const BlogIndexClient: React.FC = () => {
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_language') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLangEvent = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail) {
          setLanguage(customEvent.detail);
        }
      };

      window.addEventListener('app_language_change', handleLangEvent);
      return () => window.removeEventListener('app_language_change', handleLangEvent);
    }
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#18181B] flex flex-col justify-between">
      <GoogleTranslateScript />

      <header>
        <Navbar language={language} onChangeLanguage={handleLanguageChange} />
      </header>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8A9A5B] text-white border-2 border-[#141414] font-bold text-xs uppercase tracking-widest neo-button">
            <BookOpen className="w-4 h-4" />
            <span>{t('guideBadge', language)}</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#141414] uppercase tracking-tight leading-tight">
            {t('guideTitleLine1', language)} {t('guideTitleLine2', language)} {t('guideTitleLine3', language)}
          </h1>
          <p className="text-sm sm:text-base text-[#141414]/80 font-bold tracking-wide">
            {t('guideSubtitle', language)}
          </p>
        </div>

        {/* High-Converting App CTA Banner */}
        <div className="bg-white border-4 border-[#141414] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">
              <Shield className="w-4 h-4" />
              <span>{t('privacyBadge', language)}</span>
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#141414] uppercase tracking-tight">
              Ready to start tracking your cash envelopes right now?
            </h2>
            <p className="text-xs sm:text-sm text-[#141414]/80 font-medium">
              Create custom envelopes, log expenses in real-time, and download ready-to-print B&W PDF ledgers instantly in your browser.
            </p>
          </div>
          <Link
            href="/#tracker"
            className="px-6 py-3.5 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full md:w-auto"
          >
            <Wallet className="w-4 h-4" />
            <span>{t('navGoToTracker', language)}</span>
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white border-4 border-[#141414] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between p-6 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#141414]/70 border-b-2 border-[#141414]/10 pb-2">
                  <span className="px-2.5 py-1 bg-[#F4F1EA] border border-[#141414] uppercase tracking-wider text-[10px] text-[#141414]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#5C768D]" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight leading-snug hover:text-[#8A9A5B] transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-[#141414]/80 font-medium line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-[#141414]/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#141414]/60">
                  By {post.author}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#141414] uppercase tracking-wider hover:text-[#8A9A5B] transition-colors"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};
