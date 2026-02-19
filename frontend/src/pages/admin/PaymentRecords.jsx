import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

const PaymentRecords = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [payments] = useState([
        { id: 1, resident: 'Raj Kumar', flat: 'A-101', amount: 2500, mode: 'UPI', date: '05 Feb 2026', status: 'Paid' },
        { id: 2, resident: 'Anita Desai', flat: 'B-205', amount: 2500, mode: 'Credit Card', date: '04 Feb 2026', status: 'Paid' },
        { id: 3, resident: 'Vikram Singh', flat: 'C-304', amount: 5000, mode: 'NetBanking', date: '01 Feb 2026', status: 'Paid' },
        { id: 4, resident: 'Suresh Raina', flat: 'A-202', amount: 2500, mode: '-', date: '-', status: 'Pending' },
    ]);

    if (!payments || payments.length === 0) {
        return (
            <>
                <PageHeader title="Payments & Collections" subtitle="View transaction history" />
                <Card className="text-center p-12">
                    <h3 className="text-lg font-semibold text-gray-700">No payments recorded</h3>
                    <p className="text-gray-500 mt-2">Transactions will appear here once processed.</p>
                    <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => navigate('/admin/bills')}>Record Payment</Button>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Payments & Collections"
                subtitle="View transaction history"
                action={<Button variant="secondary" onClick={() => toast.success('Payment ledger downloaded as PDF!', 'Ledger Downloaded')}>📥 Download Ledger</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup><col /><col /><col /><col /><col /><col /></colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Resident</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Flat</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Amount</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Mode</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Date</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{payment.resident}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', verticalAlign: 'middle' }}>{payment.flat}</td>
                                    <td style={{ padding: '16px', fontWeight: '600', verticalAlign: 'middle' }}>₹{payment.amount.toLocaleString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{payment.mode}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{payment.date}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={payment.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default PaymentRecords;
