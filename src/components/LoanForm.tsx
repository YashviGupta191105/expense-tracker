import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Loan } from '../types';

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
    const newLoan: Loan = {
      id: Date.now().toString(),
      instrument,
      category,
      amount: parseFloat(amount),
      date,
    };
    context.setLoans(prev => [...prev, newLoan]);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <input type="text" placeholder="Lending Instrument (e.g., Bajaj Finance)" value={instrument} onChange={e => setInstrument(e.target.value)} required />
      <input type="text" placeholder="Loan Category (e.g., Gadget Purchase)" value={category} onChange={e => setCategory(e.target.value)} required />
      <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <button type="submit" className="add-btn">Add Loan</button>
    </form>
  );
};

export default LoanForm;