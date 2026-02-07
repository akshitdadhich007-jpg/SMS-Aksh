import React from 'react';
import { Card, PageHeader, Button, StatusBadge } from '../../components/ui';
import './MyBills.css';

const MyBills = () => {
    // Mock data - In a real app, this would come from an API
    const currentBill = {
        id: 'BILL-FEB-2026',
        flat: 'A-101',
        month: 'February 2026',
        maintenance: 2500,
        additional: 500, // e.g. fines, amenities
        status: 'Pending',
        dueDate: '10 Feb 2026'
    };

    const totalAmount = currentBill.maintenance + currentBill.additional;

    // Empty state logic
    if (!currentBill) {
        return (
            <>
                <PageHeader title="My Bills" subtitle="View and pay your society maintenance bills" />
                <Card className="text-center p-8">
                    <h3 className="text-lg font-semibold text-gray-700">No pending bills</h3>
                    <p className="text-gray-500 mt-2">You are all caught up! Check back next month.</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="My Bills"
                subtitle="View and pay your society maintenance bills"
                action={
                    <Button onClick={() => window.location.href = '/resident/history'} variant="outline">View History</Button>
                }
            />

            <div className="mybills-grid">
                {/* Left: Bill Breakdown */}
                <div className="bill-card-container">
                    <div className="bill-card-header">
                        <h3>Current Month Bill</h3>
                        <StatusBadge status={currentBill.status} />
                    </div>

                    <div className="bill-details">
                        <div className="bill-row">
                            <span className="bill-row-label">Bill ID:</span>
                            <span className="bill-row-value monospace">{currentBill.id}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-row-label">Flat Number:</span>
                            <span className="bill-row-value">{currentBill.flat}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-row-label">Billing Month:</span>
                            <span className="bill-row-value">{currentBill.month}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-row-label">Maintenance Charges:</span>
                            <span className="bill-row-value">₹{currentBill.maintenance.toLocaleString()}</span>
                        </div>
                        <div className="bill-row">
                            <span className="bill-row-label">Additional Charges:</span>
                            <span className="bill-row-value">₹{currentBill.additional.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bill-total-section">
                        <span className="bill-total-label">Total Amount:</span>
                        <span className="bill-total-amount">₹{totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="bill-actions">
                        <Button>Pay Now via UPI</Button>
                        <Button variant="secondary">Download Invoice</Button>
                    </div>
                </div>

                {/* Right: Status Summary */}
                <div className="mybills-right-section">
                    <div className="payment-status-card">
                        <h4>Payment Status</h4>
                        <div className="payment-status-content">
                            <span className="payment-status-icon">⚠️</span>
                            <div className="payment-status-info">
                                <div className="payment-status-title">Payment Pending</div>
                                <div className="payment-status-date">Due by {currentBill.dueDate}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bill-details-card">
                        <h4>Bill Details</h4>
                        <div className="bill-details-content">
                            <p>This bill includes standard monthly maintenance plus a quarterly amenities fee.</p>
                            <p>For discrepancies, please raise a complaint under the 'Accounts' category.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyBills;
