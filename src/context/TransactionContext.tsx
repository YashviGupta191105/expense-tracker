import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Transaction, Loan, Repayment } from '../types';

interface TransactionContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  addRepayment: (loanId: string, repayment: Omit<Repayment, 'id'>) => void;
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

  // CORRECTED: The addRepayment function is wrapped in useCallback
  const addRepayment = useCallback((loanId: string, repaymentData: Omit<Repayment, 'id'>) => {
    const newRepayment: Repayment = {
      id: Date.now().toString(),
      ...repaymentData
    };

    setLoans(currentLoans =>
      currentLoans.map(loan => {
        if (loan.id === loanId) {
          // Add the new repayment
          const updatedRepayments = loan.repayments ? [...loan.repayments, newRepayment] : [newRepayment];
          
          // Check if the loan is now paid off
          const totalRepaid = updatedRepayments.reduce((sum, p) => sum + p.amount, 0);
          const newStatus = totalRepaid >= loan.amount ? 'Paid' : 'Active';

          // Return the updated loan object with new repayment and new status
          return { ...loan, repayments: updatedRepayments, status: newStatus };
        }
        return loan; // Return other loans unchanged
      })
    );
  }, []); // The dependency array can be empty because setLoans is stable.

  // CORRECTED: The context value is wrapped in useMemo for optimization
  const contextValue = useMemo(() => ({
    transactions,
    setTransactions,
    loans,
    setLoans,
    addRepayment,
    fundSources,
    incomeDestinations
  }), [transactions, loans, addRepayment, fundSources, incomeDestinations]);


  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};