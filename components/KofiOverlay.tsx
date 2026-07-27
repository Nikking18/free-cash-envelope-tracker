'use client';

import React from 'react';
import Script from 'next/script';

export const KofiOverlay: React.FC = () => {
  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window !== 'undefined' && (window as any).kofiWidgetOverlay) {
          try {
            (window as any).kofiWidgetOverlay.draw('nikhilkhanpara', {
              'type': 'floating-chat',
              'floating-chat.donateButton.text': 'Support me',
              'floating-chat.donateButton.background-color': '#fcbf47',
              'floating-chat.donateButton.text-color': '#323842',
            });
          } catch (err) {
            console.error('Ko-fi widget initialization error:', err);
          }
        }
      }}
    />
  );
};
