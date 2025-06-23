import React, { useContext, useState, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const incomeCategories = ['Salary', 'Bonus', 'Investments', 'Freelancing', 'Others'];
const expenseCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Rent', 'Others'];

const TransactionSection = () => {
  const { transactions, setTransactions } = useContext(TransactionContext);
  const [filters, setFilters] = useState({ date: '', type: '', category: '' });
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let data = [...transactions];
    if (filters.date) data = data.filter((t) => t.date === filters.date);
    if (filters.type) data = data.filter((t) => t.type === filters.type);
    if (filters.category) data = data.filter((t) => t.category === filters.category);
    setFilteredData(data);
  }, [filters, transactions]);

  const getCurrentCategories = () => {
    if (filters.type === 'Income') return incomeCategories;
    if (filters.type === 'Expense') return expenseCategories;
    return [...incomeCategories, ...expenseCategories];
  };

  const handleDelete = (index) => {
    const updated = [...transactions];
    updated.splice(index, 1);
    setTransactions(updated);
  };

  return (
    <div className="transaction-wrapper">
      {/* Filters */}
      <div className="filters">
        <div>
          <label>Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>

        <div>
          <label>Type</label>
          <select
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value, category: '' });
            }}
          >
            <option value="">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div>
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All</option>
            {getCurrentCategories().map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-buttons">
          <button onClick={() => setFilters({ date: '', type: '', category: '' })}>
            <i className="fas fa-eraser" style={{ marginRight: '6px' }}></i>
            Clear Filters
          </button>

        </div>
      </div>

      {/* Transaction Table */}
      <table id="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Category</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No transactions found.</td>
            </tr>
          ) : (
            filteredData.map((t, idx) => (
              <tr key={idx}>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>{t.amount}</td>
                <td>{t.date}</td>
                <td>
                  <button onClick={() => handleDelete(idx)}>
                    <i className="fas fa-trash-alt" style={{ marginRight: '6px' }}></i>Delete
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
