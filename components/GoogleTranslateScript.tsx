'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export const GoogleTranslateScript: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,hi,it,pt,ru,zh-CN,ja,ar,ko,tr,nl,pl',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Defer Google Translate script loading to avoid main-thread render blocking
    const timer = setTimeout(() => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="notranslate-container">
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
    </div>
  );
};
