export interface CurrencyInfo {
  code: string;
  symbol: string;
  pdfSymbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
}

export const TOP_5_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', pdfSymbol: '$', name: 'US Dollar (USD)', rateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', pdfSymbol: '€', name: 'Euro (EUR)', rateToUSD: 0.8788 },
  { code: 'GBP', symbol: '£', pdfSymbol: '£', name: 'British Pound (GBP)', rateToUSD: 0.7519 },
  { code: 'INR', symbol: '₹', pdfSymbol: 'Rs.', name: 'Indian Rupee (INR)', rateToUSD: 95.94 },
  { code: 'CAD', symbol: 'CA$', pdfSymbol: 'CA$', name: 'Canadian Dollar (CAD)', rateToUSD: 1.4115 },
];

export const SUPPORTED_CURRENCIES = TOP_5_CURRENCIES;

let currencyMap = new Map<string, CurrencyInfo>(
  TOP_5_CURRENCIES.map((c) => [c.code, c])
);

export let lastRateFetchTime: string = new Date().toLocaleString('en-US', {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

const listeners = new Set<() => void>();

export function getSupportedCurrencies(): CurrencyInfo[] {
  return Array.from(currencyMap.values());
}

export function getCurrencyInfo(code: string = 'USD'): CurrencyInfo {
  return currencyMap.get(code.toUpperCase()) || {
    code: code.toUpperCase(),
    symbol: '$',
    pdfSymbol: '$',
    name: `${code.toUpperCase()} Currency`,
    rateToUSD: 1.0,
  };
}

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
];

/**
 * Fetches real-time exchange rates on visitor entry for Top 5 Currencies
 */
export async function fetchLiveExchangeRates(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        updateRatesMap(data.rates);
        lastRateFetchTime = new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'medium',
        });
        listeners.forEach((cb) => cb());
        return true;
      }
    }
  } catch (e) {
    // Fallback to secondary API
    try {
      const res2 = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.rates) {
          updateRatesMap(data2.rates);
          lastRateFetchTime = new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          });
          listeners.forEach((cb) => cb());
          return true;
        }
      }
    } catch (err) {
      console.warn('Live rates fetch fallback:', err);
    }
  }
  return false;
}

function updateRatesMap(rates: Record<string, number>) {
  TOP_5_CURRENCIES.forEach((c) => {
    if (rates[c.code]) {
      currencyMap.set(c.code, { ...c, rateToUSD: rates[c.code] });
    }
  });
}

export function subscribeRatesChange(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getCurrencySymbol(code: string = 'USD'): string {
  const currency = getCurrencyInfo(code);
  return currency ? currency.symbol : '$';
}

export function getPdfCurrencySymbol(code: string = 'USD'): string {
  const currency = getCurrencyInfo(code);
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
  const from = getCurrencyInfo(fromCode);
  const to = getCurrencyInfo(toCode);

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
