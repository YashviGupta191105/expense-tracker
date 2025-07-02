import React, { useState, useContext, useMemo } from 'react';
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import LoanForm from '../components/LoanForm';
import TransactionSection from '../components/TransactionSection';
import { TransactionContext } from '../context/TransactionContext';
import LoanSection from '../components/LoanSection';

const DashboardPage = () => {
  // 1. Get the full context
  const context = useContext(TransactionContext);

  // 2. Set up local state for UI controls
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);

  // 3. Safely get data from context, providing default empty arrays
  const transactions = context?.transactions || [];
  const loans = context?.loans || [];

  // 4. Memoize the filtered list of transactions 
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!dateRange.start && !dateRange.end) return true;
      if (!t.datetime) return false;
      const transactionDate = t.datetime.slice(0, 10);
      const isAfterStart = !dateRange.start || transactionDate >= dateRange.start;
      const isBeforeEnd = !dateRange.end || transactionDate <= dateRange.end;
      return isAfterStart && isBeforeEnd;
    });
  }, [transactions, dateRange]);

  // 5. Memoize the calculation of all summary metrics
  const summaryMetrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let loanAmountUsedInExpenses = 0;

    filteredTransactions.forEach(t => {
      if (t.type === 'Income') {
        totalIncome += t.amount;
      } else if (t.type === 'Expense') {
        totalExpenses += t.amount;
        if (t.fundSource?.includes('(Loan)')) {
          loanAmountUsedInExpenses += t.amount;
        }
      }
    });

    const totalOutstandingLoanValue = loans
      .filter(loan => loan.status === 'Active') // Only include active loans in the calculation
      .reduce((total, loan) => {
        const principal = loan.amount;
        const totalRepaid = loan.repayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        return total + (principal - totalRepaid);
      }, 0);

    const totalFunds = totalIncome - (totalExpenses - loanAmountUsedInExpenses);
    const netWorth = totalIncome - totalExpenses - totalOutstandingLoanValue;

    return {
      totalFunds,
      totalExpenses,
      totalLoanValue: totalOutstandingLoanValue,
      netWorth
    };
  }, [filteredTransactions, loans]);

  // 6. Handle the initial loading state
  if (!context) {
    return <div>Loading...</div>;
  }

  // 7. Define UI helper functions
  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
  };

  // 8. Render the component JSX
  return (
    <>
      <div className="dashboard-controls">
        <div>
          <label>Filter From</label>
          <input type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
        </div>
        <div>
          <label>To</label>
          <input type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
        </div>

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

      {/* This now receives the correct metrics object */}
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

      <LoanSection loans={loans} />

      <TransactionSection transactions={filteredTransactions} />
    </>
  );
};

export default DashboardPage;