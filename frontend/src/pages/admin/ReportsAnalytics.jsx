import React, { useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui';
import {
    Users, IndianRupee, Wallet, Wrench, UserCheck, Search,
    Download, FileSpreadsheet, FileText, Sparkles, ArrowUpRight,
    ArrowDownRight, Clock3, ShieldAlert, BarChart3
} from 'lucide-react';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import './ReportsAnalytics.css';

const COLORS = ['#5B6CFF', '#7C3AED', '#22C55E', '#F59E0B', '#06B6D4', '#EF4444'];

const paymentByRange = {
    week: {
        monthlyCollection: [
            { label: 'Mon', value: 21000 },
            { label: 'Tue', value: 18000 },
            { label: 'Wed', value: 24500 },
            { label: 'Thu', value: 26300 },
            { label: 'Fri', value: 29100 },
            { label: 'Sat', value: 17500 },
            { label: 'Sun', value: 9200 },
        ],
        paidPending: [
            { name: 'Paid', value: 82 },
            { name: 'Pending', value: 18 },
        ],
        growth: [
            { label: 'W1', value: 68 },
            { label: 'W2', value: 72 },
            { label: 'W3', value: 76 },
            { label: 'W4', value: 81 },
        ],
    },
    month: {
        monthlyCollection: [
            { label: 'Jan', value: 325000 },
            { label: 'Feb', value: 348000 },
            { label: 'Mar', value: 372000 },
            { label: 'Apr', value: 361000 },
            { label: 'May', value: 388000 },
            { label: 'Jun', value: 402000 },
        ],
        paidPending: [
            { name: 'Paid', value: 76 },
            { name: 'Pending', value: 24 },
        ],
        growth: [
            { label: 'Jan', value: 58 },
            { label: 'Feb', value: 63 },
            { label: 'Mar', value: 67 },
            { label: 'Apr', value: 64 },
            { label: 'May', value: 71 },
            { label: 'Jun', value: 75 },
        ],
    },
    year: {
        monthlyCollection: [
            { label: '2021', value: 34 },
            { label: '2022', value: 38 },
            { label: '2023', value: 43 },
            { label: '2024', value: 47 },
            { label: '2025', value: 52 },
            { label: '2026', value: 56 },
        ],
        paidPending: [
            { name: 'Paid', value: 81 },
            { name: 'Pending', value: 19 },
        ],
        growth: [
            { label: '2021', value: 35 },
            { label: '2022', value: 41 },
            { label: '2023', value: 45 },
            { label: '2024', value: 49 },
            { label: '2025', value: 54 },
            { label: '2026', value: 60 },
        ],
    },
};

const maintenanceRows = [
    { issue: 'Water leakage in basement', resident: 'Raj Kumar', tower: 'Tower A', status: 'Pending', date: '11 Mar 2026', staff: 'Mahesh (Plumber)' },
    { issue: 'Lift panel malfunction', resident: 'Neha Jain', tower: 'Tower B', status: 'In Progress', date: '10 Mar 2026', staff: 'Ramesh (Lift Tech)' },
    { issue: 'Generator noise complaint', resident: 'Aman Verma', tower: 'Tower C', status: 'Completed', date: '09 Mar 2026', staff: 'Sanjay (Electrical)' },
    { issue: 'Street light failure', resident: 'Priya Shah', tower: 'Tower D', status: 'Completed', date: '08 Mar 2026', staff: 'Vikas (Maintenance)' },
];

const visitorTrend = [
    { day: 'Mon', visitors: 52 },
    { day: 'Tue', visitors: 61 },
    { day: 'Wed', visitors: 58 },
    { day: 'Thu', visitors: 72 },
    { day: 'Fri', visitors: 79 },
    { day: 'Sat', visitors: 95 },
    { day: 'Sun', visitors: 88 },
];

const visitedTowers = [
    { name: 'Tower A', visits: 184 },
    { name: 'Tower B', visits: 226 },
    { name: 'Tower C', visits: 171 },
    { name: 'Tower D', visits: 148 },
];

const lostFoundRows = [
    { item: 'Wallet', foundBy: 'Security - Ravi', location: 'Club House', status: 'Returned', date: '10 Mar 2026' },
    { item: 'Car Keys', foundBy: 'Housekeeping', location: 'Tower B Lobby', status: 'Pending', date: '09 Mar 2026' },
    { item: 'School Bag', foundBy: 'Resident - A-204', location: 'Play Area', status: 'Returned', date: '08 Mar 2026' },
    { item: 'Smart Watch', foundBy: 'Security - Rohan', location: 'Parking P1', status: 'Pending', date: '07 Mar 2026' },
];

const complaintBreakdown = [
    { name: 'Water Issues', value: 33 },
    { name: 'Electricity Issues', value: 21 },
    { name: 'Parking Issues', value: 18 },
    { name: 'Security Issues', value: 14 },
    { name: 'Other Complaints', value: 14 },
];

const SectionCard = ({ title, subtitle, action, children }) => (
    <section className="ra-card">
        <div className="ra-card-head">
            <div>
                <h3>{title}</h3>
                {subtitle ? <p>{subtitle}</p> : null}
            </div>
            {action ? <div>{action}</div> : null}
        </div>
        <div className="ra-card-body">{children}</div>
    </section>
);

const ReportsAnalytics = () => {
    const [range, setRange] = useState('month');

    const paymentData = useMemo(() => paymentByRange[range], [range]);

    const analyticsCards = [
        { label: 'Total Residents', value: '1,248', subtitle: 'Registered residents', trend: '+3.4%', trendUp: true, icon: Users },
        { label: 'Total Payments Collected', value: 'Rs 40.2L', subtitle: 'Maintenance collections', trend: '+8.1%', trendUp: true, icon: IndianRupee },
        { label: 'Pending Payments', value: '15', subtitle: 'Residents pending dues', trend: '-2.7%', trendUp: true, icon: Wallet },
        { label: 'Maintenance Requests', value: '62', subtitle: 'Active maintenance issues', trend: '+1.9%', trendUp: false, icon: Wrench },
        { label: 'Visitors Today', value: '94', subtitle: 'Checked-in visitors', trend: '+6.2%', trendUp: true, icon: UserCheck },
        { label: 'Lost & Found Items', value: '28', subtitle: 'Items reported this month', trend: '-1.1%', trendUp: true, icon: Search },
    ];

    const statusClass = (status) => {
        const v = String(status).toLowerCase();
        if (v.includes('completed') || v.includes('returned')) return 'ok';
        if (v.includes('progress')) return 'progress';
        return 'pending';
    };

    return (
        <div className="ra-page">
            <PageHeader
                title="Reports & Analytics"
                subtitle="Detailed insights of society operations"
                action={
                    <div className="ra-export-actions">
                        <button className="ra-btn ra-btn-muted"><FileText size={15} /> Download PDF</button>
                        <button className="ra-btn ra-btn-muted"><FileSpreadsheet size={15} /> Export Excel</button>
                        <button className="ra-btn ra-btn-primary"><Download size={15} /> Export CSV</button>
                    </div>
                }
            />

            <div className="ra-overview-grid">
                {analyticsCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <article key={card.label} className="ra-overview-card">
                            <div className="ra-overview-top">
                                <span className="ra-overview-icon"><Icon size={18} /></span>
                                <span className={`ra-trend ${card.trendUp ? 'up' : 'down'}`}>
                                    {card.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {card.trend}
                                </span>
                            </div>
                            <h4>{card.value}</h4>
                            <strong>{card.label}</strong>
                            <p>{card.subtitle}</p>
                        </article>
                    );
                })}
            </div>

            <SectionCard
                title="Payment Analytics"
                subtitle="Collection health, paid ratio, and revenue trajectory"
                action={
                    <div className="ra-range-filter">
                        {['week', 'month', 'year'].map((item) => (
                            <button
                                key={item}
                                className={range === item ? 'active' : ''}
                                onClick={() => setRange(item)}
                            >
                                {item === 'week' ? 'This Week' : item === 'month' ? 'This Month' : 'This Year'}
                            </button>
                        ))}
                    </div>
                }
            >
                <div className="ra-chart-grid ra-chart-grid-3">
                    <div className="ra-chart-box">
                        <h5>Monthly Payment Collection</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={paymentData.monthlyCollection}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#5B6CFF" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="ra-chart-box">
                        <h5>Paid vs Pending Payments</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={paymentData.paidPending} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={86} innerRadius={52}>
                                    {paymentData.paidPending.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="ra-chart-box">
                        <h5>Revenue Growth Trend</h5>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={paymentData.growth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip />
                                <Line dataKey="value" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Maintenance Reports" subtitle="Operational status and request lifecycle">
                <div className="ra-quick-stats">
                    <div><span>Total Requests</span><strong>62</strong></div>
                    <div><span>Completed Requests</span><strong>39</strong></div>
                    <div><span>Pending Requests</span><strong>23</strong></div>
                    <div><span>Average Resolution Time</span><strong>18 hrs</strong></div>
                </div>
                <div className="ra-table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Issue</th>
                                <th>Resident</th>
                                <th>Tower</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Assigned Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenanceRows.map((row) => (
                                <tr key={`${row.issue}-${row.date}`}>
                                    <td>{row.issue}</td>
                                    <td>{row.resident}</td>
                                    <td>{row.tower}</td>
                                    <td><span className={`ra-badge ${statusClass(row.status)}`}>{row.status}</span></td>
                                    <td>{row.date}</td>
                                    <td>{row.staff}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            <div className="ra-split-grid">
                <SectionCard title="Visitor Analytics" subtitle="Footfall and tower traffic intelligence">
                    <div className="ra-quick-stats ra-quick-stats-3">
                        <div><span>Visitors Today</span><strong>94</strong></div>
                        <div><span>Visitors This Week</span><strong>548</strong></div>
                        <div><span>Visitors This Month</span><strong>2,241</strong></div>
                    </div>
                    <div className="ra-chart-grid ra-chart-grid-2">
                        <div className="ra-chart-box">
                            <h5>Visitors per Day</h5>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={visitorTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                    <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip />
                                    <Line dataKey="visitors" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="ra-chart-box">
                            <h5>Most Visited Towers</h5>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={visitedTowers}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                    <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="visits" fill="#22C55E" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Lost & Found Reports" subtitle="Tracking recovery and pending returns">
                    <div className="ra-quick-stats ra-quick-stats-3">
                        <div><span>Total Items Reported</span><strong>28</strong></div>
                        <div><span>Items Returned</span><strong>16</strong></div>
                        <div><span>Pending Items</span><strong>12</strong></div>
                    </div>
                    <div className="ra-table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Found By</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lostFoundRows.map((row) => (
                                    <tr key={`${row.item}-${row.date}`}>
                                        <td>{row.item}</td>
                                        <td>{row.foundBy}</td>
                                        <td>{row.location}</td>
                                        <td><span className={`ra-badge ${statusClass(row.status)}`}>{row.status}</span></td>
                                        <td>{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>
            </div>

            <SectionCard title="Complaint Analytics" subtitle="Most common issue categories across society">
                <div className="ra-chart-grid ra-chart-grid-2">
                    <div className="ra-chart-box">
                        <h5>Complaint Category Distribution</h5>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={complaintBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={96} innerRadius={52}>
                                    {complaintBreakdown.map((entry, index) => (
                                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <article className="ra-ai-insights">
                        <div className="ra-ai-head">
                            <Sparkles size={20} />
                            <h4>AI Insights</h4>
                        </div>
                        <ul>
                            <li><BarChart3 size={14} /> Maintenance complaints increased by 20% this week.</li>
                            <li><Users size={14} /> Tower B has the highest visitor traffic.</li>
                            <li><IndianRupee size={14} /> 15 residents have pending payments.</li>
                            <li><ShieldAlert size={14} /> Most common complaint category is water leakage.</li>
                        </ul>
                        <div className="ra-ai-footnote"><Clock3 size={14} /> Last synced: Today, 10:45 AM</div>
                    </article>
                </div>
            </SectionCard>
        </div>
    );
};

export default ReportsAnalytics;
