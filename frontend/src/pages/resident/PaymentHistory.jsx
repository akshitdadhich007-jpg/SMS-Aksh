import React from 'react';
import { PageHeader, Card, StatusBadge } from '../../components/ui';

const PaymentHistory = () => {
    // Mock Data
    const history = [
        { id: 1, month: 'Jan 2026', amount: 2500, mode: 'UPI', date: '10 Jan 2026', status: 'Paid' },
        { id: 2, month: 'Dec 2025', amount: 2500, mode: 'Card', date: '12 Dec 2025', status: 'Paid' },
        { id: 3, month: 'Nov 2025', amount: 2500, mode: 'NetBanking', date: '11 Nov 2025', status: 'Paid' },
        { id: 4, month: 'Oct 2025', amount: 2600, mode: 'UPI', date: '10 Oct 2025', status: 'Overdue' },
        { id: 5, month: 'Sep 2025', amount: 2500, mode: 'UPI', date: '09 Sep 2025', status: 'Paid' },
    ];

    // Empty state logic
    if (!history || history.length === 0) {
        return (
            <>
                <PageHeader title="Payment History" subtitle="View your past transactions" />
                <Card className="text-center p-8">
                    <h3 className="text-lg font-semibold text-gray-700">No previous payments found</h3>
                    <p className="text-gray-500 mt-2">Once you make a payment, it will appear here.</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader title="Payment History" subtitle="View your past transactions" />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup>
                            <col style={{ width: '200px' }} />
                            <col style={{ width: '150px' }} />
                            <col style={{ width: '150px' }} />
                            <col style={{ width: '150px' }} />
                            <col style={{ width: '120px' }} />
                        </colgroup>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Month</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Amount</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Mode</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Date</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{item.month}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: '600', verticalAlign: 'middle' }}>₹{item.amount.toLocaleString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{item.mode}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{item.date}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default PaymentHistory;
