export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rateToUSD: 0.78 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', rateToUSD: 83.5 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', rateToUSD: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', rateToUSD: 1.52 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', rateToUSD: 155.0 },
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
 * Formats a currency amount with symbol and decimal formatting
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
