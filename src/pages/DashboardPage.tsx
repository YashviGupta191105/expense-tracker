// src/pages/DashboardPage.tsx

import React, { useState, useContext, useMemo } from 'react';
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import LoanForm from '../components/LoanForm';
import TransactionSection from '../components/TransactionSection';
import { TransactionContext } from '../context/TransactionContext';

const DashboardPage = () => {
  const context = useContext(TransactionContext);
  
 
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);

  const transactions = context?.transactions || [];

  const filteredTransactions = useMemo(() => {
    // CHANGED: The filter logic now only applies if a start or end date is actually set.
    return transactions.filter(t => {
      // If no dates are set, every transaction passes the filter.
      if (!dateRange.start && !dateRange.end) {
        return true;
      }

      if (!t.datetime) return false;
      const transactionDate = t.datetime.slice(0, 10);
      
      // Check against start and end dates if they exist.
      const isAfterStart = !dateRange.start || transactionDate >= dateRange.start;
      const isBeforeEnd = !dateRange.end || transactionDate <= dateRange.end;

      return isAfterStart && isBeforeEnd;
    });
  }, [transactions, dateRange]);

  const summaryMetrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let loanAmountUsed = 0;

    filteredTransactions.forEach(t => {
      if (t.type === 'Income') {
        totalIncome += t.amount;
      } else if (t.type === 'Expense') {
        totalExpenses += t.amount;
        if (t.fundSource?.includes('(Loan)')) {
          loanAmountUsed += t.amount;
        }
      }
    });

    const totalFunds = totalIncome - (totalExpenses - loanAmountUsed);
    const netWorth = totalIncome - totalExpenses;

    return { totalFunds, totalExpenses, loanAmountUsed, netWorth };
  }, [filteredTransactions]);


  if (!context) {
    return <div>Loading...</div>;
  }
  
  // NEW: A function to clear the filters and go back to the default "show all" state.
  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
  };
 
  return (
    <>
      <div className="dashboard-controls">
        <div>
          <label>Filter From</label>
          <input type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))} />
        </div>
        <div>
          <label>To</label>
          <input type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))} />
        </div>

        {/* NEW: A clear filters button */}
        <button className="clear-btn" onClick={clearFilters}>
          Clear Filters <i className="fas fa-eraser" style={{ marginLeft: '6px' }}></i>
        </button>
        
        <div className="action-buttons">
            <button className="add-btn" onClick={() => setShowTransactionForm(true)}>
            Add Transaction <i className="fa-solid fa-plus"></i>
            </button>
            <button className="add-btn loan-btn" onClick={() => setShowLoanForm(true)}>
            Add Loan <i className="fa-solid fa-hand-holding-dollar"></i>
            </button>
        </div>
      </div>

      <Header metrics={summaryMetrics} />
      
      {showTransactionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TransactionForm onClose={() => setShowTransactionForm(false)} />
            <button className="close-btn" onClick={() => setShowTransactionForm(false)}>×</button>
          </div>
        </div>
      )}

      {showLoanForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <LoanForm onClose={() => setShowLoanForm(false)} />
            <button className="close-btn" onClick={() => setShowLoanForm(false)}>×</button>
          </div>
        </div>
      )}

      <TransactionSection transactions={filteredTransactions} />
    </>
  );
};

export default DashboardPage;