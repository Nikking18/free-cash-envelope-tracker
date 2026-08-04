'use client';

import React, { useEffect } from 'react';

export const KofiOverlay: React.FC = () => {
  useEffect(() => {
    const scriptId = 'kofi-overlay-script';

    const drawWidget = () => {
      if (typeof window !== 'undefined' && (window as any).kofiWidgetOverlay) {
        try {
          const existingOverlay = document.getElementById('kofi-widget-overlay-container');
          if (existingOverlay) {
            existingOverlay.remove();
          }
          (window as any).kofiWidgetOverlay.draw('nikhilkhanpara', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support me',
            'floating-chat.donateButton.background-color': '#fcbf47',
            'floating-chat.donateButton.text-color': '#323842'
          });
        } catch (err) {
          console.error('Ko-fi widget initialization error:', err);
        }
      }
    };

    // Defer widget script loading to prevent main-thread TBT penalty on page load
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).kofiWidgetOverlay) {
        drawWidget();
        return;
      }

      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
        script.async = true;
        script.defer = true;
        script.onload = drawWidget;
        document.body.appendChild(script);
      } else {
        script.addEventListener('load', drawWidget);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
};

