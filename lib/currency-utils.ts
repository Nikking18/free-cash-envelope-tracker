export interface CurrencyInfo {
  code: string;
  symbol: string;
  pdfSymbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
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

const CURRENCY_MAP = new Map<string, CurrencyInfo>(
  SUPPORTED_CURRENCIES.map((c) => [c.code, c])
);

export function getCurrencySymbol(code: string = 'USD'): string {
  const currency = CURRENCY_MAP.get(code.toUpperCase());
  return currency ? currency.symbol : '$';
}

export function getPdfCurrencySymbol(code: string = 'USD'): string {
  const currency = CURRENCY_MAP.get(code.toUpperCase());
  return currency ? currency.pdfSymbol : `${code} `;
}

/**
 * Converts an amount from one currency to another currency
 */
export function convertCurrency(
  amount: number,
  fromCode: string = 'USD',
  toCode: string = 'USD'
): number {
  if (isNaN(amount) || amount === 0) return 0;
  const from = CURRENCY_MAP.get(fromCode.toUpperCase()) || CURRENCY_MAP.get('USD')!;
  const to = CURRENCY_MAP.get(toCode.toUpperCase()) || CURRENCY_MAP.get('USD')!;

  if (from.code === to.code) return amount;

  // Convert from origin currency to USD, then from USD to target currency
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
