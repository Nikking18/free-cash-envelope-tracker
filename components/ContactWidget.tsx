'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { t } from '../lib/i18n';

interface ContactWidgetProps {
  language?: string;
}

export const ContactWidget: React.FC<ContactWidgetProps> = ({ language = 'en' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('message', message.trim());
      formData.append('_subject', 'New Suggestion / Feedback — Free Cash Envelope Tracker');
      formData.append('_captcha', 'false');

      const response = await fetch('https://formsubmit.co/ajax/nikhilkhanpara@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const resData = await response.json().catch(() => null);
      if (resData && resData.message && resData.message.includes('Activation')) {
        console.log('FormSubmit Activation Email Triggered:', resData.message);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Contact form submission error:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
    setIsOpen(false);
    setErrorMessage('');
  };

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

      {/* Floating Popup Message Widget Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm sm:max-w-md p-2">
          <div className="bg-[#FCFAF7] border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#141414] pb-2.5">
              <div className="flex items-center gap-2 font-serif font-black text-base sm:text-lg text-[#141414] uppercase tracking-tight">
                <MessageSquare className="w-5 h-5 text-[#8A9A5B]" />
                <span>{t('contactWidgetTitle', language)}</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="p-1 hover:bg-[#F2EFE9] neo-border cursor-pointer text-[#141414]"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            {isSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="flex justify-center">
                  <CheckCircle2 className="w-12 h-12 text-[#059669]" />
                </div>
                <h3 className="font-serif font-black text-xl text-[#141414] uppercase tracking-tight">
                  {t('contactSuccessTitle', language)}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#141414]/80 max-w-xs mx-auto leading-relaxed">
                  {t('contactSuccessMsg', language)}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs font-bold text-[#141414]/70">
                  {t('contactWidgetSubtitle', language)}
                </p>

                {errorMessage && (
                  <div className="p-2 bg-red-100 border-2 border-red-600 text-red-800 text-[11px] font-bold uppercase">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-[#141414] tracking-wider">
                    {t('contactNameLabel', language)} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Smith"
                    className="w-full px-3 py-1.5 bg-white neo-border font-bold text-xs text-[#141414] focus:outline-hidden"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-[#141414] tracking-wider">
                    {t('contactEmailLabel', language)} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-3 py-1.5 bg-white neo-border font-bold text-xs text-[#141414] focus:outline-hidden"
                  />
                </div>

                {/* Message / Suggestion */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-[#141414] tracking-wider">
                    {t('contactMessageLabel', language)} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your suggestions, changes, or questions here..."
                    className="w-full px-3 py-1.5 bg-white neo-border font-bold text-xs text-[#141414] focus:outline-hidden resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#141414]">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-2 bg-[#FCFAF7] hover:bg-[#F2EFE9] text-[#141414] neo-button text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#8A9A5B] hover:bg-[#7a8a4b] text-white neo-button text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('contactSubmitBtn', language)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
