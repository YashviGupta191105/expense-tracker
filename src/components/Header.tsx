import React from 'react';

interface Props {
  metrics: {
    totalFunds: number;
    totalExpenses: number;
    loanAmountUsed: number;
    netWorth: number;
  }
}

const Header = ({ metrics }: Props) => {
  const { totalFunds, totalExpenses, loanAmountUsed, netWorth } = metrics;
  return (
    <div className="summary-cards" id="summary">
      <div className="card">
        <h3>Total Funds</h3>
        <p>₹{totalFunds.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Total Expenses</h3>
        <p>₹{totalExpenses.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Loan Tracked</h3>
        <p>₹{loanAmountUsed.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Net Worth (Flow)</h3>
        <p>₹{netWorth.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Header;