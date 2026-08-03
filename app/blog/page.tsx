import React from 'react';
import Metadata from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '../../lib/blog-data';
import { BookOpen, Clock, ArrowRight, Wallet, CheckCircle2, Shield, Download } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export const metadata = {
  title: 'Cash Envelope Budgeting Guides & Financial Tips | Free Cash Tracker',
  description: 'Explore expert guides on cash envelope budgeting, zero-based budgeting, printable PDF binder ledgers, and multi-currency expense tracking.',
  keywords: [
    'cash envelope budgeting guide',
    'cash stuffing for beginners',
    'printable budget envelope pdf',
    'zero based budgeting tips',
    'multi currency cash tracker',
  ],
  alternates: {
    canonical: 'https://www.freecashtracker.online/blog',
  },
  openGraph: {
    title: 'Cash Envelope Budgeting Guides & Financial Tips | Free Cash Tracker',
    description: 'Master cash envelope budgeting with step-by-step guides, printable B&W PDF ledgers, and free digital tools.',
    url: 'https://www.freecashtracker.online/blog',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#18181B] flex flex-col justify-between">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 w-full">
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#8A9A5B] text-white border-2 border-[#141414] font-bold text-xs uppercase tracking-widest neo-button">
            <BookOpen className="w-4 h-4" />
            <span>Budgeting Guides & Resources</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#141414] uppercase tracking-tight leading-tight">
            Master Your Cash Envelope Budget
          </h1>
          <p className="text-sm sm:text-base text-[#141414]/80 font-bold tracking-wide">
            Actionable strategies, printable PDF guides, and zero-based budgeting tips to stop overspending and reach financial freedom.
          </p>
        </div>

        {/* High-Converting App CTA Banner */}
        <div className="bg-white border-4 border-[#141414] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8A9A5B]">
              <Shield className="w-4 h-4" />
              <span>100% Free • No Signup Required • 100% Private</span>
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
            <span>Launch Tracker Free</span>
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

      <Footer />
    </div>
  );
}
