import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import TransactionSection from '../components/TransactionSection';
import { TransactionContext } from '../context/TransactionContext';

const DashboardPage = () => {
  const { transactions, setTransactions } = useContext(TransactionContext);
  const [filters, setFilters] = useState({ date: '', type: '', category: '' });
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Header transactions={transactions} />

      <div style={{ textAlign: 'center', marginBottom: '0px' }}>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add Transaction <i className="fa-solid fa-user-plus"></i>
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TransactionForm onClose={() => setShowForm(false)} />
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
          </div>
        </div>
      )}

      <TransactionSection
        transactions={transactions}
        setTransactions={setTransactions}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

export default DashboardPage;
