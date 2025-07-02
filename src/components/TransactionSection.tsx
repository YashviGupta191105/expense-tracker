import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const TransactionSection = ({ transactions }: Props) => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("TransactionSection must be used in a provider");
  const { setTransactions } = context;

  const handleDelete = (transactionToDelete: Transaction) => {
    if (transactionToDelete.type === 'Expense' && transactionToDelete.fundSource?.includes('(Loan)')) {
      const confirmDelete = window.confirm(
        'This expense is linked to a loan. Deleting it will not repay the loan itself. Are you sure you want to delete?'
      );
      if (!confirmDelete) return;
    }
    setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
  };

  return (
    <div className="transaction-wrapper">
      <h2>Transactions</h2>
      <table id="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Category</th>
            <th>Amount (₹)</th>
            <th>Date & Time</th>
            <th>Source / Destination</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center' }}>No transactions found for this period.</td></tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>{t.amount.toFixed(2)}</td>
                <td>{new Date(t.datetime).toLocaleString()}</td>
                <td>{t.type === 'Income' ? t.destination : t.fundSource}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(t)}
                  >
                    <i className="fas fa-trash-alt" style={{ marginRight: '8px' }}></i>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionSection;
