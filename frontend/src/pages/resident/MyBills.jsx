import React, { useState, useEffect } from 'react';
import { Card, PageHeader, Button, StatusBadge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { subscribeToResidentBills, recordPayment } from '../../firebase/billService';
import Modal from '../../components/ui/Modal.jsx';
import './MyBills.css';

const MyBills = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);
    const [isPaying, setIsPaying] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    // Subscribe to resident's bills
    useEffect(() => {
        if (!user?.uid) return;
        const unsub = subscribeToResidentBills(user.uid, (data) => {
            setBills(data);
            setLoading(false);
        });
        return () => unsub();
    }, [user?.uid]);

    // Get the current bill (latest pending or first from list)
    const currentBill = bills.find(b => b.paymentStatus === 'Pending') || bills[0] || null;

    const handlePayment = async (bill) => {
        if (!bill || !user) return;
        setIsPaying(true);
        try {
            await recordPayment(bill.id, user.uid, {
                amount: bill.totalAmount,
                residentFlat: user.flatNumber || 'N/A',
                residentName: user.name || 'Resident'
            });
            toast.success(`Payment of ₹${bill.totalAmount.toLocaleString()} recorded successfully!`, 'Payment Confirmed');
            setSelectedBill(null);
        } catch (err) {
            const errorMsg = err?.message || 'Failed to record payment';
            console.error('[Payment Handler Error]:', errorMsg, err);
            toast.error(errorMsg, 'Payment Failed');
        } finally {
            setIsPaying(false);
        }
    };

    // Empty state logic
    if (!loading && bills.length === 0) {
        return (
            <>
                <PageHeader title="My Bills" subtitle="View and pay your society maintenance bills" />
                <Card className="text-center p-8">
                    <h3 className="text-lg font-semibold text-gray-700">No bills yet</h3>
                    <p className="text-gray-500 mt-2">Check back when the next billing cycle begins.</p>
                </Card>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <PageHeader title="My Bills" subtitle="View and pay your society maintenance bills" />
                <Card className="text-center p-8">
                    <p className="text-gray-500">Loading your bills...</p>
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
                    <Button onClick={() => setIsHistoryModalOpen(true)} variant="outline">View History</Button>
                }
            />

            {currentBill && (
                <div className="mybills-grid">
                    {/* Left: Bill Breakdown */}
                    <div className="bill-card-container">
                        <div className="bill-card-header">
                            <h3>Current Bill — {currentBill.billMonth}/{currentBill.billYear}</h3>
                            <StatusBadge status={currentBill.paymentStatus} />
                        </div>

                        <div className="bill-details">
                            <div className="bill-row">
                                <span className="bill-row-label">Bill ID:</span>
                                <span className="bill-row-value monospace">{currentBill.id.substring(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="bill-row">
                                <span className="bill-row-label">Flat Number:</span>
                                <span className="bill-row-value">{user?.flatNumber || 'N/A'}</span>
                            </div>
                            <div className="bill-row">
                                <span className="bill-row-label">Billing Period:</span>
                                <span className="bill-row-value">{currentBill.billMonth}/{currentBill.billYear}</span>
                            </div>
                            <div className="bill-row">
                                <span className="bill-row-label">Amount:</span>
                                <span className="bill-row-value">₹{currentBill.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="bill-row">
                                <span className="bill-row-label">Due Date:</span>
                                <span className="bill-row-value">{currentBill.dueDate}</span>
                            </div>
                        </div>

                        <div className="bill-total-section">
                            <span className="bill-total-label">Total Amount:</span>
                            <span className="bill-total-amount">₹{currentBill.totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="bill-actions">
                            <Button onClick={() => setSelectedBill(currentBill)} disabled={currentBill.paymentStatus === 'Paid'}>
                                {currentBill.paymentStatus === 'Paid' ? '✓ Paid' : 'Pay Now'}
                            </Button>
                            <Button variant="secondary">Download Invoice</Button>
                        </div>
                    </div>

                    {/* Right: Status Summary */}
                    <div className="mybills-right-section">
                        <div className={`payment-status-card ${currentBill.paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>
                            <h4>Payment Status</h4>
                            <div className="payment-status-content">
                                <span className="payment-status-icon">{currentBill.paymentStatus === 'Paid' ? '✓' : '⚠️'}</span>
                                <div className="payment-status-info">
                                    <div className="payment-status-title">
                                        {currentBill.paymentStatus === 'Paid' ? 'Payment Received' : 'Payment Pending'}
                                    </div>
                                    <div className="payment-status-date">
                                        {currentBill.paymentStatus === 'Paid' 
                                            ? `Paid on ${currentBill.displayDate}` 
                                            : `Due by ${currentBill.dueDate}`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bill-details-card">
                            <h4>All Bills ({bills.length})</h4>
                            <div className="bill-history-list">
                                {bills.map(bill => (
                                    <div key={bill.id} className="bill-history-item">
                                        <div className="bill-history-month">{bill.billMonth}/{bill.billYear}</div>
                                        <div className="bill-history-amount">₹{bill.totalAmount.toLocaleString()}</div>
                                        <StatusBadge status={bill.paymentStatus} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Confirmation Modal */}
            <Modal
                isOpen={!!selectedBill}
                onClose={() => setSelectedBill(null)}
                title="Confirm Payment"
            >
                {selectedBill && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                            <p style={{ margin: 0, color: '#1e40af', fontWeight: '500' }}>
                                Amount to Pay: <strong style={{ fontSize: '18px' }}>₹{selectedBill.totalAmount.toLocaleString()}</strong>
                            </p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bill Period</label>
                            <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>{selectedBill.billMonth}/{selectedBill.billYear}</p>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Method</label>
                            <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>UPI, Card, or Bank Transfer</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <Button variant="secondary" onClick={() => setSelectedBill(null)}>Cancel</Button>
                            <Button onClick={() => handlePayment(selectedBill)} disabled={isPaying}>
                                {isPaying ? 'Processing...' : 'Confirm Payment'}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* History Modal */}
            <Modal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                title="Billing History"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {bills.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No billing history yet.</p>
                    ) : (
                        bills.map(bill => (
                            <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#111827' }}>{bill.billMonth}/{bill.billYear}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{bill.displayDate}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '700', color: '#111827' }}>₹{bill.totalAmount.toLocaleString()}</div>
                                    <StatusBadge status={bill.paymentStatus} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </>
    );
};

export default MyBills;
