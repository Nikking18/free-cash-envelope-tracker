'use client';

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { t } from '../lib/i18n';

interface ContactWidgetProps {
  language?: string;
}

export const ContactWidget: React.FC<ContactWidgetProps> = ({ language = 'en' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-4 py-3 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-border neo-shadow-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('contactWidgetBtn', language)}</span>
          </button>
        )}
      </div>

      {/* Floating Popup Window with Embedded Google Form */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-[380px] sm:max-w-[420px] p-2">
          <div className="bg-[#FCFAF7] border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-2">
              <div className="flex items-center gap-2 font-serif font-black text-base text-[#141414] uppercase tracking-tight">
                <MessageSquare className="w-4 h-4 text-[#8A9A5B]" />
                <span>{t('contactWidgetTitle', language)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#F2EFE9] neo-border cursor-pointer text-[#141414]"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded Google Form Iframe */}
            <div className="w-full h-[460px] border-2 border-[#141414] bg-white overflow-hidden">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScUP7c8Av1NXwCB5oKcO51P0cdisGfSnpc8kVa6osjpa37jZQ/viewform?embedded=true"
                width="100%"
                height="460"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                className="w-full h-full"
                title="Suggestions & Feedback Form"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
