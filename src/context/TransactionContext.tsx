import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Loan } from '../types';

interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  fundSources: string[];
  incomeDestinations: string[];
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Define default sources
const initialFundSources = ['Cash', 'Bank Account', 'Credit Card'];
const initialIncomeDests = ['Bank Account', 'PayPal', 'Cash'];

// Type the props for the provider component
interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('loans');
    return saved ? JSON.parse(saved) : [];
  });

  const [fundSources, setFundSources] = useState<string[]>(initialFundSources);
  const [incomeDestinations, setIncomeDestinations] = useState<string[]>(initialIncomeDests);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);
  
  const contextValue: TransactionContextType = {
    transactions,
    setTransactions,
    loans,
    setLoans,
    fundSources,
    incomeDestinations
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
