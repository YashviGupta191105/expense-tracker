import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Loan } from '../types';

const loanInstruments = [
  'Personal Loan',
  'Credit Card EMI',
  'Home Loan',
  'Car Loan',
  'Student Loan',
  'Loan from Friend/Family',
  'Other'
];

const loanCategories = [
  'Gadget Purchase',
  'Vehicle',
  'Home Improvement',
  'Education',
  'Medical Emergency',
  'Travel',
  'Debt Consolidation',
  'Other'
];

interface Props {
  onClose: () => void;
}

const LoanForm = ({ onClose }: Props) => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("LoanForm must be used within a TransactionProvider");

  const [instrument, setInstrument] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instrument || !category || !amount || !date) {
      alert('Please fill all fields');
      return;
    }
    const newLoan: Loan = {
      id: Date.now().toString(),
      instrument,
      category,
      amount: parseFloat(amount),
      date,
      status: 'Active',
    };
    context.setLoans(prev => [...prev, newLoan]);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <select value={instrument} onChange={e => setInstrument(e.target.value)} required>
        <option value="" disabled>Select Instrument...</option>
        {loanInstruments.map(inst => (
          <option key={inst} value={inst}>{inst}</option>
        ))}
      </select>

      <select value={category} onChange={e => setCategory(e.target.value)} required>
        <option value="" disabled>Select Loan Category...</option>
        {loanCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <button type="submit" className="add-btn">Add Loan</button>
    </form>
  );
};

export default LoanForm;