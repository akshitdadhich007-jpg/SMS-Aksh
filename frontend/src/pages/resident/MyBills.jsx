import React from 'react';
import { Card, PageHeader, Button, StatusBadge } from '../../components/ui';

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

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Left: Bill Breakdown */}
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--brand-dark)' }}>Current Month Bill</h3>
                        <StatusBadge status={currentBill.status} />
                    </div>

                    <div className="bill-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                            <span className="text-secondary">Bill ID:</span>
                            <span style={{ fontWeight: '600', fontFamily: 'monospace' }}>{currentBill.id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-secondary">Flat Number:</span>
                            <span style={{ fontWeight: '600' }}>{currentBill.flat}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-secondary">Billing Month:</span>
                            <span style={{ fontWeight: '600' }}>{currentBill.month}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-secondary">Maintenance Charges:</span>
                            <span style={{ fontWeight: '600' }}>₹{currentBill.maintenance.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-secondary">Additional Charges:</span>
                            <span style={{ fontWeight: '600' }}>₹{currentBill.additional.toLocaleString()}</span>
                        </div>

                        <div style={{
                            borderTop: '2px dashed var(--border)',
                            paddingTop: '16px',
                            marginTop: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '20px',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Total Amount:</span>
                            <span style={{ fontWeight: '800', color: 'var(--brand-blue)' }}>₹{totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="bill-actions" style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                            <Button style={{ flex: 1 }}>Pay Now via UPI</Button>
                            <Button variant="secondary" style={{ flex: 1 }}>Download Invoice</Button>
                        </div>
                    </div>
                </Card>

                {/* Right: Status Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card className="card-highlight">
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment Status</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '24px' }}>⚠️</span>
                            <div>
                                <div style={{ fontWeight: '700', color: 'var(--warning)', fontSize: '18px' }}>Payment Pending</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Due by {currentBill.dueDate}</div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill Details</h4>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            <p style={{ margin: 0 }}>This bill includes standard monthly maintenance plus a quarterly amenities fee.</p>
                            <p style={{ marginTop: '12px' }}>For discrepancies, please raise a complaint under the 'Accounts' category.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default MyBills;
