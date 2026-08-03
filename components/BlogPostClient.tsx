'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '../lib/blog-data';
import { Clock, Calendar, User, ArrowLeft, Wallet, Shield } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GoogleTranslateScript } from './GoogleTranslateScript';
import { t } from '../lib/i18n';

interface BlogPostClientProps {
  post: BlogPost;
}

export const BlogPostClient: React.FC<BlogPostClientProps> = ({ post }) => {
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

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141414]/70">
          <Link href="/blog" className="hover:text-[#8A9A5B] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Guides</span>
          </Link>
          <span>/</span>
          <span className="text-[#8A9A5B] truncate">{post.category}</span>
        </div>

        {/* Article Header Header */}
        <header className="space-y-4 border-b-4 border-[#141414] pb-6">
          <div className="inline-block px-3 py-1 bg-[#8A9A5B] text-white border-2 border-[#141414] font-bold text-xs uppercase tracking-widest">
            {post.category}
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#141414] uppercase tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#141414]/80">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#8A9A5B]" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D15F47]" />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#5C768D]" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Table of Contents Box */}
        {post.tableOfContents && post.tableOfContents.length > 0 && (
          <div className="bg-white border-3 border-[#141414] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <h3 className="font-serif font-black text-sm uppercase tracking-wide text-[#141414] flex items-center gap-2 border-b-2 border-[#141414]/10 pb-2">
              <span>Table of Contents</span>
            </h3>
            <ul className="space-y-1.5 text-xs font-bold text-[#141414]/90">
              {post.tableOfContents.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="hover:text-[#8A9A5B] underline decoration-[#141414]/30">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Main Body Content */}
        <article
          className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed text-[#141414] space-y-6 pt-2"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* High-Converting CTA Box */}
        <div className="bg-[#141414] text-white p-6 sm:p-8 border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(138,154,91,1)] space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 my-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">
              <Shield className="w-4 h-4" />
              <span>Start Budgeting Privately Today</span>
            </div>
            <h3 className="font-serif font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
              Try Free Cash Envelope Tracker Now
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              Zero registration. Zero ads. Real-time balance calculations, multi-currency support, and 1-click printable B&W PDF ledgers.
            </p>
          </div>
          <Link
            href="/#tracker"
            className="px-6 py-3 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button font-serif font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Wallet className="w-4 h-4" />
            <span>{t('navGoToTracker', language)}</span>
          </Link>
        </div>

        {/* Related Navigation */}
        <div className="pt-6 border-t-2 border-[#141414]/10 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141414] hover:text-[#8A9A5B]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Guides</span>
          </Link>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};
