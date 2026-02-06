import React from 'react';
import { PageHeader, Card, StatCard, StatusBadge, Button, CardHeader, CardContent } from '../../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
    return (
        <>
            <style>{`
                .analytics, .tables {
                    display: grid !important;
                    grid-template-columns: 1fr 400px !important;
                    gap: 24px !important;
                    margin-bottom: 32px;
                }
                @media (max-width: 1024px) {
                    .analytics, .tables {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <PageHeader
                title="Overview"
                subtitle="Welcome back, Administrator"
                action={<Button variant="primary">Download Report</Button>}
            />

            <div className="cards">
                <StatCard label="Total Flats" value="120" trend={0} />
                <StatCard label="Total Residents" value="305" trend={2.5} trendLabel="this month" />
                <StatCard label="Monthly Collection" value="₹ 4.5L" trend={12} trendLabel="vs last month" />
                <StatCard label="Pending Dues" value="₹ 45k" trend={-5} trendLabel="decreased" />
                <StatCard label="Total Expenses" value="₹ 2.1L" trend={0} />
            </div>

            <div className="analytics">
                <Card>
                    <CardHeader title="Monthly Maintenance Collection" />
                    <CardContent style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: 'Jan', amount: 4000 },
                                    { name: 'Feb', amount: 3000 },
                                    { name: 'Mar', amount: 2000 },
                                    { name: 'Apr', amount: 2780 },
                                    { name: 'May', amount: 1890 },
                                    { name: 'Jun', amount: 2390 },
                                ]}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Expense Distribution" />
                    <CardContent style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Salaries', value: 400 },
                                        { name: 'Utilities', value: 300 },
                                        { name: 'Maintenance', value: 300 },
                                        { name: 'Events', value: 200 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {
                                        [
                                            { name: 'Salaries', value: 400 },
                                            { name: 'Utilities', value: 300 },
                                            { name: 'Maintenance', value: 300 },
                                            { name: 'Events', value: 200 },
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#2563eb', '#10b981', '#f59e0b', '#64748b'][index % 4]} strokeWidth={0} />
                                        ))
                                    }
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '13px', color: '#64748b' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="tables">
                <Card>
                    <CardHeader title="Recent Payments" action={<Button variant="secondary" size="sm">View All</Button>} />
                    <CardContent className="p-0">
                        <table className="table" id="paymentsTable">
                            <thead>
                                <tr><th>Flat</th><th>Resident</th><th>Month</th><th>Amount</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>A-101</td><td>Raj Kumar</td><td>Feb 2026</td><td>₹2,500</td><td><StatusBadge status="Paid" /></td></tr>
                                <tr><td>B-205</td><td>Anita</td><td>Feb 2026</td><td>₹2,500</td><td><StatusBadge status="Pending" /></td></tr>
                                <tr><td>C-304</td><td>Vikram</td><td>Jan 2026</td><td>₹2,500</td><td><StatusBadge status="Overdue" /></td></tr>
                                <tr><td>A-202</td><td>Suresh</td><td>Feb 2026</td><td>₹2,500</td><td><StatusBadge status="Paid" /></td></tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Latest Complaints" />
                    <CardContent className="p-0">
                        <table className="table" id="complaintsTable">
                            <thead>
                                <tr><th>ID</th><th>Category</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>#101</td><td>Plumbing</td><td><StatusBadge status="Open" /></td></tr>
                                <tr><td>#102</td><td>Electrical</td><td><StatusBadge status="Resolved" /></td></tr>
                                <tr><td>#103</td><td>Noise</td><td><StatusBadge status="Processing" /></td></tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AdminDashboard;
