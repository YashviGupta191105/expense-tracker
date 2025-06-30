// src/components/TransactionForm.tsx

import React, { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Transaction } from '../types';

const incomeCategories = ['Salary', 'Bonus', 'Investments', 'Freelancing', 'Others'];
const expenseCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Rent', 'Gadget Purchase', 'Others'];

interface Props {
  onClose: () => void;
}

const TransactionForm = ({ onClose }: Props) => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("TransactionForm must be used within a TransactionProvider");
  
  const { setTransactions, loans, fundSources, incomeDestinations } = context;

  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [datetime, setDatetime] = useState(new Date().toISOString().slice(0, 16));
  const [source, setSource] = useState('');
  const [categories, setCategories] = useState(incomeCategories);

  // UPDATED: Combine regular fund sources with available loans for the dropdown
  const availableFundSources = [...fundSources, ...loans.map(l => `${l.instrument} (Loan)`)];

  useEffect(() => {
    setCategories(type === 'Income' ? incomeCategories : expenseCategories);
    setCategory('');
    setSource('');
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !datetime || !source) {
      alert('Please fill all fields');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category,
      datetime,
      ...(type === 'Expense' && { fundSource: source }),
      ...(type === 'Income' && { destination: source }),
    };

    setTransactions((prev) => [...prev, newTransaction]);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <select value={type} onChange={(e) => setType(e.target.value as 'Income' | 'Expense')}>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
      </select>
      
      {/* NEW: Dynamic dropdown for Source/Destination */}
      <select value={source} onChange={(e) => setSource(e.target.value)} required>
        <option value="">{type === 'Income' ? 'Select Destination' : 'Select Fund Source'}</option>
        {(type === 'Income' ? incomeDestinations : availableFundSources).map((src, idx) => (
          <option key={idx} value={src}>{src}</option>
        ))}
      </select>

      {/* NEW: Input for Date and Time */}
      <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
      <button type="submit" className="add-btn">Submit</button>
    </form>
  );
};

export default TransactionForm;

