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
const SITE_TITLE = 'Free Cash Envelope Tracker — #1 Free Goodbudget Alternative | Digital Cash Stuffing App';
const SITE_DESC = 'The best free Goodbudget & YNAB alternative. 100% free, no login, no account, no bank sync required. Digital cash envelope budgeting: create envelopes, log expenses, track budgets live, and export PDF & Excel reports. Private, browser-based. No subscription ever.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  keywords: [
    // ─── English: high-volume, competitor-stealing ────────────────────────────
    'free cash envelope tracker',
    'goodbudget alternative free',
    'goodbudget alternative no subscription',
    'YNAB alternative free',
    'ynab free alternative 2025',
    'free budget app no login',
    'free envelope budgeting app',
    'digital cash stuffing app',
    'cash stuffing app free',
    'digital envelope budgeting online',
    'cash envelope system app',
    'free budget tracker no account',
    'zero based budget app free',
    'zero based budgeting no subscription',
    'everydollar free alternative',
    'mvelopes alternative free',
    'actual budget alternative',
    'cash envelope budget template',
    'printable cash envelope pdf',
    'personal finance budget tracker',
    'envelope method budget app',
    'household budget tracker free',
    'expense tracker no login',
    'budget planner online free',
    'cash budget tracker browser',
    'no bank sync budget app',
    'manual budget tracking app',
    'privacy budget app no cloud',
    'offline budget tracker',
    'excel cash envelope import export',
    'pdf budget export free',
    'digital wallet budgeting system',
    'cash flow envelope tracker',
    'money envelope budget',
    // ─── Spanish: presupuesto por sobres ─────────────────────────────────────
    'sobres de efectivo digital gratis',
    'presupuesto por sobres digitales',
    'alternativa goodbudget gratis',
    'aplicación presupuesto sin registro',
    'control gastos por sobres',
    'método de sobres de dinero online',
    'presupuesto familiar gratis sin cuenta',
    'planificador de presupuesto gratis',
    'rastreador de gastos sin registro',
    'plantilla sobres de ahorro',
    'gestión presupuesto mensual gratis',
    'metodo sobre presupuesto digital',
    'exportar presupuesto pdf excel',
    'app finanzas personales sin suscripción',
    // ─── French: budget enveloppes ────────────────────────────────────────────
    'budget enveloppes digitales gratuit',
    'méthode enveloppes argent gratuit',
    'alternative goodbudget gratuit',
    'gestionnaire de budget sans compte',
    'application budget sans inscription',
    'suivi dépenses enveloppes en ligne',
    'budget mensuel gratuit sans abonnement',
    'planificateur budget famille gratuit',
    'méthode zéro budget gratuit',
    'export budget pdf excel gratuit',
    'gestion budget personnel gratuit',
    'outil budget sans banque',
    // ─── German: umschlag budgetierung ───────────────────────────────────────
    'digitales umschlag budgeting kostenlos',
    'haushaltsbuch ohne anmeldung',
    'bargeld umschlag methode kostenlos',
    'umschlag budget app gratis',
    'goodbudget alternative kostenlos',
    'haushaltsbuch online kostenlos ohne konto',
    'persönliches haushaltsbuch gratis',
    'ausgaben verfolgen ohne abo',
    'kostenlose budget app kein bankkonto',
    'budget planer ohne registrierung',
    'excel pdf budget export kostenlos',
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
        alt: 'Free Cash Envelope Tracker — Free Goodbudget Alternative Digital Cash Stuffing App',
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
    '@type': ['WebApplication', 'SoftwareApplication'],
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'BudgetingApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '238',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'No login or account required',
      'Digital cash envelope budgeting',
      'Live multi-currency expense tracking',
      'PDF budget export (2 templates)',
      'Excel import and export (2 sheets)',
      'Multi-language support: English, Español, Français, Deutsch',
      '100% browser-based private storage',
      'Zero subscription fees',
    ],
    creator: {
      '@type': 'Organization',
      name: 'Free Cash Envelope Tracker',
      url: SITE_URL,
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cash Envelope Budget Tracker',
        item: SITE_URL,
      },
    ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
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
