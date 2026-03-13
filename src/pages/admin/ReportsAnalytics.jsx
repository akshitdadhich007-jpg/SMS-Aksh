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
        monthlyCollection: [],
        paidPending: [],
        growth: [],
    },
    month: {
        monthlyCollection: [],
        paidPending: [],
        growth: [],
    },
    year: {
        monthlyCollection: [],
        paidPending: [],
        growth: [],
    },
};

const maintenanceRows = [];

const visitorTrend = [];

const visitedTowers = [];

const lostFoundRows = [];

const complaintBreakdown = [];

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
        { label: 'Total Residents', value: '0', subtitle: 'No data yet', trend: '0%', trendUp: true, icon: Users },
        { label: 'Total Payments Collected', value: 'Rs 0', subtitle: 'No data yet', trend: '0%', trendUp: true, icon: IndianRupee },
        { label: 'Pending Payments', value: '0', subtitle: 'No data yet', trend: '0%', trendUp: true, icon: Wallet },
        { label: 'Maintenance Requests', value: '0', subtitle: 'No data yet', trend: '0%', trendUp: true, icon: Wrench },
        { label: 'Visitors Today', value: '0', subtitle: 'No data yet', trend: '0%', trendUp: true, icon: UserCheck },
        { label: 'Lost & Found Items', value: '0', subtitle: 'No data yet', trend: '0%', trendUp: true, icon: Search },
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
                        {paymentData.monthlyCollection.length === 0 ? <div className="ra-empty">No data yet</div> : (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={paymentData.monthlyCollection}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                    <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#5B6CFF" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="ra-chart-box">
                        <h5>Paid vs Pending Payments</h5>
                        {paymentData.paidPending.length === 0 ? <div className="ra-empty">No data yet</div> : (
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
                        )}
                    </div>

                    <div className="ra-chart-box">
                        <h5>Revenue Growth Trend</h5>
                        {paymentData.growth.length === 0 ? <div className="ra-empty">No data yet</div> : (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={paymentData.growth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                    <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip />
                                    <Line dataKey="value" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Maintenance Reports" subtitle="Operational status and request lifecycle">
                <div className="ra-quick-stats">
                    <div><span>Total Requests</span><strong>0</strong></div>
                    <div><span>Completed Requests</span><strong>0</strong></div>
                    <div><span>Pending Requests</span><strong>0</strong></div>
                    <div><span>Average Resolution Time</span><strong>0 hrs</strong></div>
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
                            {maintenanceRows.length === 0 ? (
                                <tr><td colSpan="6" className="ra-empty">No data yet</td></tr>
                            ) : (
                                maintenanceRows.map((row) => (
                                    <tr key={`${row.issue}-${row.date}`}>
                                        <td>{row.issue}</td>
                                        <td>{row.resident}</td>
                                        <td>{row.tower}</td>
                                        <td><span className={`ra-badge ${statusClass(row.status)}`}>{row.status}</span></td>
                                        <td>{row.date}</td>
                                        <td>{row.staff}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            <div className="ra-split-grid">
                <SectionCard title="Visitor Analytics" subtitle="Footfall and tower traffic intelligence">
                    <div className="ra-quick-stats ra-quick-stats-3">
                        <div><span>Visitors Today</span><strong>0</strong></div>
                        <div><span>Visitors This Week</span><strong>0</strong></div>
                        <div><span>Visitors This Month</span><strong>0</strong></div>
                    </div>
                    <div className="ra-chart-grid ra-chart-grid-2">
                        <div className="ra-chart-box">
                            <h5>Visitors per Day</h5>
                            {visitorTrend.length === 0 ? <div className="ra-empty">No data yet</div> : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={visitorTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                        <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <Tooltip />
                                        <Line dataKey="visitors" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="ra-chart-box">
                            <h5>Most Visited Towers</h5>
                            {visitedTowers.length === 0 ? <div className="ra-empty">No data yet</div> : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={visitedTowers}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                                        <Tooltip />
                                        <Bar dataKey="visits" fill="#22C55E" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </SectionCard>

                <SectionCard title="Lost & Found Reports" subtitle="Tracking recovery and pending returns">
                    <div className="ra-quick-stats ra-quick-stats-3">
                        <div><span>Total Items Reported</span><strong>0</strong></div>
                        <div><span>Items Returned</span><strong>0</strong></div>
                        <div><span>Pending Items</span><strong>0</strong></div>
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
                                {lostFoundRows.length === 0 ? (
                                    <tr><td colSpan="5" className="ra-empty">No data yet</td></tr>
                                ) : (
                                    lostFoundRows.map((row) => (
                                        <tr key={`${row.item}-${row.date}`}>
                                            <td>{row.item}</td>
                                            <td>{row.foundBy}</td>
                                            <td>{row.location}</td>
                                            <td><span className={`ra-badge ${statusClass(row.status)}`}>{row.status}</span></td>
                                            <td>{row.date}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>
            </div>

            <SectionCard title="Complaint Analytics" subtitle="Most common issue categories across society">
                <div className="ra-chart-grid ra-chart-grid-2">
                    <div className="ra-chart-box">
                        <h5>Complaint Category Distribution</h5>
                        {complaintBreakdown.length === 0 ? <div className="ra-empty">No data yet</div> : (
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
                        )}
                    </div>
                    <article className="ra-ai-insights">
                        <div className="ra-ai-head">
                            <Sparkles size={20} />
                            <h4>AI Insights</h4>
                        </div>
                        <ul>
                            <li><BarChart3 size={14} /> No data yet.</li>
                        </ul>
                        <div className="ra-ai-footnote"><Clock3 size={14} /> Last synced: Not available</div>
                    </article>
                </div>
            </SectionCard>
        </div>
    );
};

export default ReportsAnalytics;
