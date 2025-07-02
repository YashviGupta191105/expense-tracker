import React from 'react';

interface Props {
  metrics: {
    totalFunds: number;
    totalExpenses: number;
    totalLoanValue: number;
    netWorth: number;
  }
}

const Header = ({ metrics }: Props) => {
  const { totalFunds, totalExpenses, totalLoanValue, netWorth } = metrics;

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
        {/* CHANGED: Update the title and the value to display */}
        <h3>Outstanding Loans</h3>
        <p>₹{totalLoanValue.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Net Worth</h3>
        <p>₹{netWorth.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Header;