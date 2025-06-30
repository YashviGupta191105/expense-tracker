export interface Loan {
  id: string; // A unique identifier
  instrument: string; // e.g., 'Bajaj Finance EMI'
  category: string; // e.g., 'Gadget Purchase'
  amount: number;
  date: string; // Format: 'YYYY-MM-DD'
}

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  datetime: string; // NEW: Replaces 'date' with date and time support

  // Conditionally available properties
  fundSource?: string; // For Expenses: e.g., 'Bank Account' or a Loan reference
  destination?: string; // For Income: e.g., 'Bank Account'
}