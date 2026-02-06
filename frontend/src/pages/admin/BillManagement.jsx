import React from 'react';
import { PageHeader, Card, StatusBadge, Button, StatCard } from '../../components/ui';

const BillManagement = () => {
    // Mock Data for Bills
    const bills = [
        { id: 1, month: 'Feb 2026', totalAmount: 450000, collected: 250000, status: 'Pending' },
        { id: 2, month: 'Jan 2026', totalAmount: 450000, collected: 445000, status: 'Completed' },
        { id: 3, month: 'Dec 2025', totalAmount: 450000, collected: 450000, status: 'Completed' },
        { id: 4, month: 'Nov 2025', totalAmount: 440000, collected: 440000, status: 'Completed' },
    ];

    return (
        <>
            <PageHeader
                title="Maintenance & Bills"
                subtitle="Overview of society billing"
                action={<Button variant="primary">Generate New Bill</Button>}
            />

            {/* Overview Stats */}
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard label="Total Billed (Feb)" value="₹ 4.5L" trend={0} />
                <StatCard label="Collected" value="₹ 2.5L" trend={12} trendLabel="vs last month" />
                <StatCard label="Pending" value="₹ 2.0L" trend={-5} trendLabel="remaining" />
            </div>

            {/* Bills List */}
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Billing History</h3>
                    <Button variant="secondary" size="sm">Export Report</Button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Month</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Total Amount</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Collection Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Status</th>
                                <th style={{ padding: '16px', width: '100px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>{bill.month}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold' }}>₹{bill.totalAmount.toLocaleString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1, height: '6px', background: 'var(--bg-light)', borderRadius: '3px', maxWidth: '100px' }}>
                                                <div style={{ width: `${(bill.collected / bill.totalAmount) * 100}%`, height: '100%', background: 'var(--brand-blue)', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '12px' }}>{Math.round((bill.collected / bill.totalAmount) * 100)}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <StatusBadge status={bill.status === 'Completed' ? 'Paid' : 'Pending'} />
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <Button variant="secondary" size="sm">View</Button>
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

export default BillManagement;
