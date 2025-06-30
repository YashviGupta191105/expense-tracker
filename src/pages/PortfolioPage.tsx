// src/pages/PortfolioPage.tsx

import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../App.css';
import { Transaction } from '../types'; // Import our Transaction type

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioPage = () => {
  const context = useContext(TransactionContext);

  // Error Boundary: Safely handle the case where context is not yet available.
  if (!context) {
    return <div>Loading...</div>;
  }

  const { transactions, loans } = context;

  const incomeData = transactions.filter((t) => t.type === 'Income');
  const expenseData = transactions.filter((t) => t.type === 'Expense');

  const totalIncome = incomeData.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseData.reduce((sum, t) => sum + t.amount, 0);
  
  // NEW: Calculate total outstanding loan amount
  const totalLoanValue = loans.reduce((sum, l) => sum + l.amount, 0);

  // UPDATED: Net Worth calculation now includes loans
  const netWorth = totalIncome - totalExpense - totalLoanValue;

  const getCategoryTotals = (data: Transaction[]) => {
    // Specify the type for the accumulator in reduce
    return data.reduce((acc: { [key: string]: number }, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  };

  const incomeCategories = getCategoryTotals(incomeData);
  const expenseCategories = getCategoryTotals(expenseData);

  const incomeChartData = {
    labels: Object.keys(incomeCategories),
    datasets: [{
      data: Object.values(incomeCategories),
      backgroundColor: ['#ffb74d', '#ff8a65', '#ff7043', '#ffcc80', '#ffd54f', '#ffe082'],
      borderWidth: 1,
    }],
  };

  const expenseChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [{
      data: Object.values(expenseCategories),
      backgroundColor: ['#4db6ac', '#4dd0e1', '#81d4fa', '#64b5f6', '#90caf9', '#80deea'],
      borderWidth: 1,
    }],
  };

  // Sort transactions by datetime before slicing
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    .slice(0, 5);

  return (
    <div className="portfolio-container" style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>My Financial Portfolio</h2>

      <div className="summary-cards" style={{ display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="card">
          <h3>Total Income</h3>
          <p>₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Expense</h3>
          <p>₹{totalExpense.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Outstanding Loans</h3>
          <p>₹{totalLoanValue.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Net Worth</h3>
          <p>₹{netWorth.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-wrapper" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        <div className="chart-container">
          <h3>Income Breakdown</h3>
          {incomeData.length > 0 ? <Doughnut data={incomeChartData} /> : <p>No income data.</p>}
        </div>
        <div className="chart-container">
          <h3>Expense Breakdown</h3>
          {expenseData.length > 0 ? <Doughnut data={expenseChartData} /> : <p>No expense data.</p>}
        </div>
      </div>

      <div className="recent-transactions">
        <h3 style={{ marginBottom: '20px' }}>Recent Transactions</h3>
        <table className="recent-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t, i) => (
                <tr key={i}>
                  <td>{new Date(t.datetime).toLocaleDateString()}</td>
                  <td>{t.type}</td>
                  <td>{t.category}</td>
                  <td>₹{t.amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No recent transactions.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioPage;
