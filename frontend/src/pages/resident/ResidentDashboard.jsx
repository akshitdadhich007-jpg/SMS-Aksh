import React from 'react';
import { Card, PageHeader } from '../../components/ui';

const ResidentDashboard = () => {
    // Stats Data
    const stats = [
        { label: 'Total Due', value: '₹ 2,500', trend: 'Due in 5 days', color: '#ef4444' },
        { label: 'Last Paid', value: '₹ 2,500', trend: 'Jan 10, 2026', color: '#10b981' },
        { label: 'Active Complaints', value: '1', trend: 'In Progress', color: '#f59e0b' },
        { label: 'Notices', value: '2', trend: 'New Updates', color: '#3b82f6' },
    ];

    return (
        <div>
            <PageHeader title="Dashboard" subtitle="Welcome back, Amit Sharma (A-101)" />

            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>{stat.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>{stat.value}</div>
                        <div style={{ fontSize: '13px', color: stat.color, fontWeight: '600' }}>{stat.trend}</div>
                    </Card>
                ))}
            </div>

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Recent Activity */}
                <Card>
                </Card>
            </div>
        </div>
    );
};

export default ResidentDashboard;
