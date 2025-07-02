export interface Repayment {
  id: string;
  amount: number;
  date: string;
  notes?: string; // For adding details like "EMI" or "Early payment"
}

export interface Loan {
  id: string;
  instrument: string;
  category: string;
  amount: number;
  date: string;
  repayments?: Repayment[];
  status: 'Active' | 'Paid'; 
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