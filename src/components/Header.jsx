import React from 'react'

const Header = ({transactions}) => {
  let income = 0
  let expense = 0

  transactions.forEach(t => {
    if (t.type === 'Income') {
      income += t.amount
    } else if (t.type === 'Expense') {
      expense += t.amount 
    }
  });

  const balance = income - expense
  return (
    <div className="summary-cards" id="summary">
      <div className="card">
        <h3>Balance</h3>
        <p id="balance">₹{balance}</p>
      </div>
      <div className="card">
        <h3>Income</h3>
        <p id="income">₹{income}</p>
      </div>
      <div className="card">
        <h3>Expenses</h3>
        <p id="expenses">₹{expense}</p>
      </div>
    </div>
  )
}

export default Header
