export type Category = 'Essential' | 'Discretionary' | 'Savings' | 'Debt';

export interface Envelope {
  id: string;
  name: string;
  allocated: number;
  category: Category;
  color: string;
  currency?: string;
}

export interface Expense {
  id: string;
  envelopeId: string;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
  currency?: string;
  type?: 'expense' | 'addCash'; // transaction type
}

export interface TrackerData {
  envelopes: Envelope[];
  expenses: Expense[];
  budgetPeriod?: string;
  notes?: string;
  mainCurrency?: string;
  language?: string;
}

export const CATEGORIES: Category[] = ['Essential', 'Discretionary', 'Savings', 'Debt'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Essential: '#8A9A5B',     // Olive
  Discretionary: '#D15F47',   // Terracotta
  Savings: '#059669',         // Emerald
  Debt: '#5C768D',            // Slate Blue
};

export const PRESET_COLORS = [
  '#8A9A5B', // Olive Green
  '#D15F47', // Terracotta
  '#5C768D', // Slate Blue
  '#D97706', // Amber Gold
  '#059669', // Emerald
  '#7C3AED', // Muted Purple
  '#DB2777', // Rose
  '#2563EB', // Royal Blue
];

export const INITIAL_STORAGE_KEY = 'cash_envelope_tracker_data';

export const DEFAULT_INITIAL_DATA: TrackerData = {
  envelopes: [],
  expenses: [],
};
