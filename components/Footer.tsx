'use client';

import React from 'react';
import { Heart, ShieldCheck, ExternalLink, Github, Twitter, Linkedin } from 'lucide-react';
import { t } from '../lib/i18n';

interface FooterProps {
  language?: string;
}

export const Footer: React.FC<FooterProps> = ({ language = 'en' }) => {
  return (
    <footer className="mt-16 border-t-4 border-[#141414] bg-[#FCFAF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission */}
          <div className="md:col-span-6 space-y-3">
            <h3 className="font-serif font-black text-2xl uppercase tracking-tight text-[#141414]">
              {t('brandName', language)}
            </h3>
            <p className="text-xs sm:text-sm text-[#141414]/90 font-bold leading-relaxed max-w-md">
              {t('footerTagline', language)}
            </p>
            <div className="text-xs text-[#5C768D] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8A9A5B]" />
              {t('privacyBadge', language)}
            </div>

            {/* Social Links in Brand Column */}
            <div className="pt-2 flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[#141414]/70">{t('connect', language)}</span>
              <a
                href="https://github.com/Nikking18"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-white neo-border hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label="GitHub Profile"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://x.com/nikhilkhanpara"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-white neo-border hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label="X (Twitter) Profile"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X / Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/in/nikhilkhanpara/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-white neo-border hover:bg-[#141414] hover:text-white text-[#141414] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Support / Ko-fi Donation Section */}
          <div className="md:col-span-6 space-y-3 bg-white border-4 border-[#141414] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5">
            <h4 className="font-serif font-black text-lg text-[#141414] uppercase tracking-tight flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#D15F47] fill-[#D15F47]" />
              {t('supportTitle', language)}
            </h4>
            <p className="text-xs text-[#141414]/90 font-bold leading-relaxed">
              {t('supportDesc', language)}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <a
                href="https://ko-fi.com/nikhilkhanpara"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#D15F47] hover:bg-[#b84d37] text-white neo-button text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{t('supportBtn', language)}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] font-bold text-[#141414]/60 uppercase tracking-wider">
                {t('poweredByKofi', language)}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t-2 border-[#141414] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-[#141414]/70">
          <div>
            © {new Date().getFullYear()} {t('footerCopyright', language)}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] normal-case tracking-normal font-bold">
              {t('createdWithLove', language)}
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Nikking18"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#141414]/80 hover:text-[#141414] p-1 transition-colors"
                title="GitHub"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/nikhilkhanpara"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#141414]/80 hover:text-[#141414] p-1 transition-colors"
                title="X (Twitter)"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/nikhilkhanpara/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#141414]/80 hover:text-[#141414] p-1 transition-colors"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
