import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader, Button } from '../../components/ui';

const ResidentDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Due', value: '₹ 2,500', trend: 'Due in 5 days', color: '#ef4444' },
        { label: 'Last Paid', value: '₹ 2,500', trend: 'Jan 10, 2026', color: '#10b981' },
        { label: 'Active Complaints', value: '1', trend: 'In Progress', color: '#f59e0b' },
        { label: 'Notices', value: '2', trend: 'New Updates', color: '#3b82f6' },
    ];

    const quickActions = [
        { label: 'Pay Now', icon: '💳', route: '/resident/pay-maintenance', variant: 'primary' },
        { label: 'File Complaint', icon: '📝', route: '/resident/complaints', variant: 'secondary' },
        { label: 'View Announcements', icon: '📢', route: '/resident/announcements', variant: 'secondary' },
        { label: 'Emergency', icon: '🚨', route: '/resident/emergency', variant: 'danger' },
    ];

    const recentActivity = [
        { time: '2 hrs ago', text: 'Maintenance of ₹2,500 due in 5 days', icon: '⏰' },
        { time: 'Yesterday', text: 'Complaint #103 status: In Progress', icon: '🔧' },
        { time: '2 days ago', text: 'New notice: Water supply maintenance', icon: '📋' },
        { time: '10 Jan', text: 'Payment of ₹2,500 received — Jan 2026', icon: '✅' },
    ];

    return (
        <div>
            <PageHeader title="My Dashboard" subtitle="Welcome back, Resident" />

            {/* Stats Cards */}
            <div className="cards">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <div style={{ padding: '4px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>{stat.label}</div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.trend}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {quickActions.map((action, i) => (
                    <Button key={i} variant={action.variant} onClick={() => navigate(action.route)} style={{ padding: '12px 20px' }}>
                        {action.icon} {action.label}
                    </Button>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentActivity.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-light)' }}>
                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                            <div style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{item.text}</div>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{item.time}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ResidentDashboard;
