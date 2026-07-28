import type { Metadata } from 'next';
import { Libre_Baskerville, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { KofiOverlay } from '../components/KofiOverlay';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const SITE_URL = 'https://www.freecashtracker.online/';
const SITE_NAME = 'Free Cash Envelope Tracker';
const SITE_TITLE = 'Free Cash Envelope Tracker — Private Digital Cash Stuffing Budget App';
const SITE_DESC = '100% free, private, zero-login digital cash envelope budgeting app. Manage cash stuffing, log expenses, live progress tracking, PDF report export & 2-sheet Excel import/export in English, Español, Français, Deutsch.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: [
    // English
    'free cash envelope tracker',
    'cash stuffing app',
    'digital envelope budgeting',
    'cash envelope system',
    'free budget tracker',
    'private budgeting tool',
    'no login budget app',
    'excel cash envelope import',
    'pdf budget export',
    'digital cash stuffing online',
    'cash envelope budget template',
    'printable cash envelope pdf',
    'personal finance budget tracker',
    'zero login envelope budget',
    // Spanish
    'sobres de efectivo digital',
    'presupuesto por sobres gratis',
    'plantilla de sobres de dinero',
    'control de presupuesto sin registro',
    'gestión de gastos por sobres',
    // French
    'budget enveloppes digitales',
    'méthode enveloppes argent gratuit',
    'gestionnaire de budget sans compte',
    'suivi des dépenses par enveloppes',
    // German
    'digitales umschlag budgeting',
    'bargeld umschlag methode kostenlos',
    'haushaltsbuch ohne anmeldung',
    'umschlag budget rechner'
  ],
  authors: [{ name: 'Free Cash Envelope Tracker' }],
  creator: 'Free Cash Envelope Tracker',
  publisher: 'Free Cash Envelope Tracker',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en': SITE_URL,
      'es': `${SITE_URL}?lang=es`,
      'fr': `${SITE_URL}?lang=fr`,
      'de': `${SITE_URL}?lang=de`,
      'x-default': SITE_URL,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESC,
    siteName: SITE_NAME,
    locale: 'en_US',
    alternateLocale: ['es_ES', 'fr_FR', 'de_DE'],
    images: [
      {
        url: `${SITE_URL}og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Free Cash Envelope Tracker — Free Digital Cash Stuffing App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [`${SITE_URL}og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'b4HpIWI9uc6KOVQntu_E91w3SEAqZjS-BG9rV75wuHw',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Free Cash Envelope Tracker',
      url: SITE_URL,
    },
  };

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Budget with Digital Cash Envelopes',
    description: 'Learn how to create digital cash envelopes, allocate funds, log transactions, and back up your budget as PDF or Excel.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Create Virtual Cash Envelopes',
        text: 'Create digital envelopes for categories like Groceries, Rent, Dining, or Savings, and set target allocation amounts.',
      },
      {
        '@type': 'HowToStep',
        name: 'Log Expenses in Real-Time',
        text: 'Record daily purchases against specific envelopes and monitor live color-coded progress bars to prevent overspending.',
      },
      {
        '@type': 'HowToStep',
        name: 'Export PDF or Excel Backups',
        text: 'Download print-ready PDF statement cards or structured 2-sheet Excel files anytime to keep permanent offline backups.',
      },
    ],
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Free Cash Envelope Tracker 100% free with no hidden fees?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Free Cash Envelope Tracker is 100% free forever. There are no premium subscriptions, no paywalled features, no ads, and no hidden charges. All envelope management, expense logging, PDF exports, and Excel imports/exports are completely free to use.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does digital cash stuffing work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Digital cash stuffing adapts the traditional physical cash envelope budgeting system into a convenient browser app. Instead of withdrawing physical paper cash into paper envelopes, you create virtual digital envelopes (e.g. Groceries, Rent, Dining Out, Savings), assign target budget amounts, and log transactions as you spend.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my financial budget data safe and private?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Your privacy is guaranteed because 100% of your budget data is stored exclusively inside your browser\'s local storage (localStorage). We do not operate remote databases, we do not require account sign-ups or email addresses, and we never link to bank credentials.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I export my cash envelope budget to PDF or Excel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can export your complete budget summary anytime. We support two customizable PDF export templates: Classic Minimal and Minimal B&W. You can also export your budget into a 2-sheet Excel (.xlsx) spreadsheet or import existing Excel budget files.',
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${libreBaskerville.variable} ${plusJakartaSans.variable}`}>
      <head>
        <meta name="google-site-verification" content="b4HpIWI9uc6KOVQntu_E91w3SEAqZjS-BG9rV75wuHw" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var fetchVal = window.fetch;
                  Object.defineProperty(window, 'fetch', {
                    get: function() { return fetchVal; },
                    set: function(v) { fetchVal = v; },
                    configurable: true,
                    enumerable: true
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="bg-[#FCFAF7] text-[#18181B] font-sans antialiased min-h-screen selection:bg-[#8A9A5B] selection:text-white" suppressHydrationWarning>
        {children}
        <KofiOverlay />
      </body>
    </html>
  );
}
