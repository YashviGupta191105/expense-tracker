
import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

interface Props {
  loanId: string;
  onClose: () => void;
}

const RepaymentForm = ({ loanId, onClose }: Props) => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("RepaymentForm must be used within a TransactionProvider");

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) {
      alert('Please fill amount and date');
      return;
    }

    context.addRepayment(loanId, {
      amount: parseFloat(amount),
      date,
      notes,
    });
    
    // Also, let's create a corresponding 'Expense' transaction for this repayment
    const newExpenseTransaction = {
        id: Date.now().toString() + "-expense", // unique id
        type: 'Expense' as 'Expense',
        category: 'Loan Repayment',
        amount: parseFloat(amount),
        datetime: `${date}T${new Date().toTimeString().slice(0,5)}`,
        fundSource: 'Bank Account' // Or let the user select
    };
    context.setTransactions(prev => [...prev, newExpenseTransaction]);

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <h4>Add Repayment</h4>
      <input type="number" placeholder="Repayment Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="text" placeholder="Notes (e.g., 'Monthly EMI')" value={notes} onChange={e => setNotes(e.target.value)} />
      <button type="submit" className="add-btn">Submit Repayment</button>
    </form>
  );
};

export default RepaymentForm;