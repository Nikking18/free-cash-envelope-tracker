'use client';

import React from 'react';
import { t } from '../lib/i18n';

interface ContactWidgetProps {
  language?: string;
}

export const ContactWidget: React.FC<ContactWidgetProps> = ({ language = 'en' }) => {
  const GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScUP7c8Av1NXwCB5oKcO51P0cdisGfSnpc8kVa6osjpa37jZQ/viewform';

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <a
        href={GOOGLE_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-border neo-shadow-md text-xl font-bold flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        title={t('contactWidgetBtn', language)}
        aria-label="Suggestions or Contact"
      >
        💡
      </a>
    </div>
  );
};
