export type Category = 'Essential' | 'Discretionary' | 'Savings' | 'Debt';

export interface Envelope {
  id: string;
  name: string;
  allocated: number;
  category: Category;
  color: string;
}

export interface Expense {
  id: string;
  envelopeId: string;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
}

export interface TrackerData {
  envelopes: Envelope[];
  expenses: Expense[];
  budgetPeriod?: string;
  notes?: string;
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
  envelopes: [
    { id: 'env_1', name: 'Groceries & Household', allocated: 450, category: 'Essential', color: '#8A9A5B' },
    { id: 'env_2', name: 'Dining & Takeout', allocated: 150, category: 'Discretionary', color: '#D15F47' },
    { id: 'env_3', name: 'Rent & Utilities', allocated: 1200, category: 'Essential', color: '#5C768D' },
    { id: 'env_4', name: 'Emergency Fund', allocated: 200, category: 'Savings', color: '#059669' },
  ],
  expenses: [
    { id: 'exp_1', envelopeId: 'env_1', amount: 68.40, note: "Weekly Grocery Run", date: '2026-07-27' },
    { id: 'exp_2', envelopeId: 'env_2', amount: 24.50, note: 'Coffee & Lunch', date: '2026-07-27' },
  ],
};
