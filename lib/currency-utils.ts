export interface CurrencyInfo {
  code: string;
  symbol: string;
  pdfSymbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
}

export const DEFAULT_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', pdfSymbol: '$', name: 'US Dollar (USD)', rateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', pdfSymbol: '€', name: 'Euro (EUR)', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', pdfSymbol: '£', name: 'British Pound (GBP)', rateToUSD: 0.78 },
  { code: 'INR', symbol: '₹', pdfSymbol: 'Rs.', name: 'Indian Rupee (INR)', rateToUSD: 83.5 },
  { code: 'CAD', symbol: 'CA$', pdfSymbol: 'CA$', name: 'Canadian Dollar (CAD)', rateToUSD: 1.36 },
  { code: 'AUD', symbol: 'A$', pdfSymbol: 'A$', name: 'Australian Dollar (AUD)', rateToUSD: 1.52 },
  { code: 'JPY', symbol: '¥', pdfSymbol: '¥', name: 'Japanese Yen (JPY)', rateToUSD: 155.0 },
  { code: 'BRL', symbol: 'R$', pdfSymbol: 'R$', name: 'Brazilian Real (BRL)', rateToUSD: 5.45 },
  { code: 'MXN', symbol: 'Mex$', pdfSymbol: 'Mex$', name: 'Mexican Peso (MXN)', rateToUSD: 18.2 },
  { code: 'CHF', symbol: 'CHF', pdfSymbol: 'CHF ', name: 'Swiss Franc (CHF)', rateToUSD: 0.89 },
  { code: 'SEK', symbol: 'kr', pdfSymbol: 'kr ', name: 'Swedish Krona (SEK)', rateToUSD: 10.6 },
  { code: 'NZD', symbol: 'NZ$', pdfSymbol: 'NZ$', name: 'New Zealand Dollar (NZD)', rateToUSD: 1.65 },
  { code: 'SGD', symbol: 'SG$', pdfSymbol: 'SG$', name: 'Singapore Dollar (SGD)', rateToUSD: 1.35 },
  { code: 'HKD', symbol: 'HK$', pdfSymbol: 'HK$', name: 'Hong Kong Dollar (HKD)', rateToUSD: 7.81 },
  { code: 'ZAR', symbol: 'R', pdfSymbol: 'R ', name: 'South African Rand (ZAR)', rateToUSD: 18.1 },
  { code: 'AED', symbol: 'AED', pdfSymbol: 'AED ', name: 'UAE Dirham (AED)', rateToUSD: 3.67 },
];

export let SUPPORTED_CURRENCIES: CurrencyInfo[] = [...DEFAULT_CURRENCIES];
export let lastRateFetchTime: string = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' });

export interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
];

let currencyMap = new Map<string, CurrencyInfo>(
  SUPPORTED_CURRENCIES.map((c) => [c.code, c])
);

/**
 * Fetches real-time exchange rates on visitor entry and updates rate matrix
 */
export async function fetchLiveExchangeRates(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!res.ok) return false;

    const data = await res.json();
    if (data && data.rates) {
      updateRatesMap(data.rates);
      lastRateFetchTime = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      });
      return true;
    }
  } catch (err) {
    console.warn('Real-time exchange rate fetch fallback:', err);
  }
  return false;
}

function updateRatesMap(rates: Record<string, number>) {
  SUPPORTED_CURRENCIES = SUPPORTED_CURRENCIES.map((c) => {
    if (rates[c.code]) {
      return { ...c, rateToUSD: rates[c.code] };
    }
    return c;
  });
  currencyMap = new Map<string, CurrencyInfo>(
    SUPPORTED_CURRENCIES.map((c) => [c.code, c])
  );
}

export function getCurrencySymbol(code: string = 'USD'): string {
  const currency = currencyMap.get(code.toUpperCase());
  return currency ? currency.symbol : '$';
}

export function getPdfCurrencySymbol(code: string = 'USD'): string {
  const currency = currencyMap.get(code.toUpperCase());
  return currency ? currency.pdfSymbol : `${code} `;
}

/**
 * Converts an amount from one currency to another currency using real-time rates
 */
export function convertCurrency(
  amount: number,
  fromCode: string = 'USD',
  toCode: string = 'USD'
): number {
  if (isNaN(amount) || amount === 0) return 0;
  const from = currencyMap.get(fromCode.toUpperCase()) || currencyMap.get('USD')!;
  const to = currencyMap.get(toCode.toUpperCase()) || currencyMap.get('USD')!;

  if (from.code === to.code) return amount;

  const amountInUSD = amount / from.rateToUSD;
  const converted = amountInUSD * to.rateToUSD;
  return Math.round(converted * 100) / 100;
}

/**
 * Formats a currency amount for Web UI display
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedNumber = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formattedNumber}`;
}

/**
 * Formats a currency amount for PDF export without Unicode glyph errors
 */
export function formatPdfCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = getPdfCurrencySymbol(currencyCode);
  const formattedNumber = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${symbol}${formattedNumber}`;
}
