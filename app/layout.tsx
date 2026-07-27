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

const SITE_URL = 'https://freecashtracker.online/';
const SITE_NAME = 'Free Cash Envelope Tracker';
const SITE_TITLE = 'Free Cash Envelope Tracker — Private Cash Stuffing Budget App';
const SITE_DESC = 'Free, private, zero-login cash envelope budgeting app. Manage digital cash stuffing, log expenses, live progress tracking, PDF export & Excel import/export. 100% browser-based privacy.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: [
    'free cash envelope tracker',
    'cash stuffing app',
    'digital envelope budgeting',
    'cash envelope system',
    'free budget tracker',
    'private budgeting tool',
    'no login budget app',
    'excel cash envelope import',
    'pdf budget export'
  ],
  authors: [{ name: 'Free Cash Envelope Tracker' }],
  creator: 'Free Cash Envelope Tracker',
  publisher: 'Free Cash Envelope Tracker',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESC,
    siteName: SITE_NAME,
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
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
    },
  };

  return (
    <html lang="en" className={`${libreBaskerville.variable} ${plusJakartaSans.variable}`}>
      <head>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FCFAF7] text-[#18181B] font-sans antialiased min-h-screen selection:bg-[#8A9A5B] selection:text-white" suppressHydrationWarning>
        {children}
        <KofiOverlay />
      </body>
    </html>
  );
}
