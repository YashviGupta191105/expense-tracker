import React, { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const incomeCategories = ['Salary', 'Bonus', 'Investments', 'Freelancing', 'Others'];
const expenseCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Rent', 'Others'];

const TransactionForm = ({ onClose }) => {
  const { setTransactions } = useContext(TransactionContext);

  const [type, setType] = useState('Income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState(incomeCategories);

  useEffect(() => {
    setCategories(type === 'Income' ? incomeCategories : expenseCategories);
    setCategory('');
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      alert('Please fill all fields');
      return;
    }

    const newTransaction = {
      type,
      amount: parseFloat(amount),
      category,
      date,
    };

    setTransactions((prev) => [...prev, newTransaction]);

    // Clear form
    setAmount('');
    setCategory('');
    setDate('');
    setType('Income');

    if (onClose) onClose(); // Close modal if available
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit" className="add-btn">
        <i className="fas fa-check" style={{ marginRight: '8px' }}></i>Submit
      </button>
    </form>
  );
};

export default TransactionForm;

