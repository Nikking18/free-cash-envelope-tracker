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
              'floating-chat.donateButton.background-color': '#5cb85c',
              'floating-chat.donateButton.text-color': '#fff',
            });
          } catch (err) {
            console.error('Ko-fi widget initialization error:', err);
          }
        }
      }}
    />
  );
};
