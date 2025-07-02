// src/components/LoanSection.tsx

import React, { useState } from 'react';
import { Loan } from '../types';
import RepaymentForm from './RepaymentForm';

interface Props {
    loans: Loan[];
}

const LoanSection = ({ loans }: Props) => {
    // State for managing the repayment modal
    const [showRepaymentModal, setShowRepaymentModal] = useState(false);
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

    // State for the "Hide Paid" toggle
    const [hidePaid, setHidePaid] = useState(false);

    // THIS IS THE MISSING FUNCTION
    const handleOpenRepaymentModal = (loanId: string) => {
        setSelectedLoanId(loanId);
        setShowRepaymentModal(true);
    };

    // THIS IS ALSO A NEEDED HELPER FUNCTION
    const handleCloseRepaymentModal = () => {
        setSelectedLoanId(null);
        setShowRepaymentModal(false);
    };

    const calculateOutstandingBalance = (loan: Loan): number => {
        const totalRepaid = loan.repayments?.reduce((sum, repayment) => sum + repayment.amount, 0) || 0;
        return loan.amount - totalRepaid;
    };

    const visibleLoans = hidePaid ? loans.filter(loan => loan.status === 'Active') : loans;

    return (
        <>
            <div className="transaction-wrapper">
                <div className="section-header">
                    <h2>Loan Accounts</h2>
                    <div className="toggle-switch">
                        <input
                            id="hide-paid-toggle"
                            type="checkbox"
                            checked={hidePaid}
                            onChange={() => setHidePaid(!hidePaid)}
                        />
                        <label htmlFor="hide-paid-toggle">
                            {hidePaid ? 'Show Active Only' : 'Show All'}
                        </label>
                    </div>
                </div>

                <table id="loan-table" className="data-table">
                    <thead>
                        <tr>
                            <th>Instrument</th>
                            <th>Category</th>
                            <th>Original Amount (₹)</th>
                            <th>Outstanding Balance (₹)</th>
                            <th>Date Taken</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleLoans.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center' }}>
                                {hidePaid ? "No active loans." : "No loans added yet."}
                            </td></tr>
                        ) : (
                            visibleLoans.map((loan) => {
                                // Calculate the balance once for efficiency
                                const outstandingBalance = calculateOutstandingBalance(loan);

                                return (
                                    // The className logic is already correct
                                    <tr key={loan.id} className={loan.status === 'Paid' ? 'loan-paid' : ''}>
                                        <td>{loan.instrument}</td>
                                        <td>{loan.category}</td>
                                        <td>{loan.amount.toFixed(2)}</td>


                                        <td>
                                            {loan.status === 'Paid' ? (
                                                <strong className="paid-status">Paid</strong>
                                            ) : (
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {outstandingBalance.toFixed(2)}
                                                </span>
                                            )}
                                        </td>

                                        <td>{loan.date}</td>
                                        <td>

                                            <button
                                                className="repay-btn"
                                                onClick={() => handleOpenRepaymentModal(loan.id)}
                                                disabled={loan.status === 'Paid'} // The 'disabled' logic is already correct
                                            >
                                                {/* Change the button text based on status */}
                                                {loan.status === 'Paid' ? (
                                                    // Icon and text for the PAID state
                                                    <>
                                                        <i className="fa fa-check-circle" style={{ marginRight: '8px' }}></i>
                                                        Paid Off
                                                    </>
                                                ) : (
                                                    // Icon and text for the ACTIVE state
                                                    <>
                                                        <i className="fa fa-plus-circle" style={{ marginRight: '8px' }}></i>
                                                        Add Repayment
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* This modal logic now works correctly because the state and handlers exist */}
            {showRepaymentModal && selectedLoanId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <RepaymentForm loanId={selectedLoanId} onClose={handleCloseRepaymentModal} />
                        <button className="close-btn" onClick={handleCloseRepaymentModal}>×</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoanSection;