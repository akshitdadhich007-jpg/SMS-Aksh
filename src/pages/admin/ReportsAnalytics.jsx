import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../../components/ui';
import {
    Users, IndianRupee, Wallet, Wrench, UserCheck, Search,
    Download, FileSpreadsheet, FileText, Sparkles, ArrowUpRight,
    ArrowDownRight, Clock3, ShieldAlert, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeToResidents } from '../../firebase/residentService';
import { subscribeToAllBills } from '../../firebase/billService';
import { subscribeToAllComplaints } from '../../firebase/complaintService';
import { subscribeToStaff } from '../../firebase/staffService';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import './ReportsAnalytics.css';

const COLORS = ['#5B6CFF', '#7C3AED', '#22C55E', '#F59E0B', '#06B6D4', '#EF4444'];

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
    const { user } = useAuth();
    const [range, setRange] = useState('month');
    const societyId = user?.societyId || null;

    const [residents, setResidents] = useState([]);
    const [bills, setBills] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [staff, setStaff] = useState([]);
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        if (!societyId) {
            setResidents([]);
            setBills([]);
            setComplaints([]);
            setStaff([]);
            setVisitors([]);
            return () => {};
        }

        const unsubs = [
            subscribeToResidents(societyId, setResidents),
            subscribeToAllBills(societyId, setBills),
            subscribeToAllComplaints(societyId, setComplaints),
            subscribeToStaff(societyId, setStaff),
        ];

        const visitorsQuery = query(collection(db, 'visitors'), where('societyId', '==', societyId));
        const unsubVisitors = onSnapshot(visitorsQuery, (snapshot) => {
            setVisitors(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }, () => setVisitors([]));

        unsubs.push(unsubVisitors);

        return () => {
            unsubs.forEach((unsub) => unsub && unsub());
        };
    }, [societyId]);

    const getDateFromTimestamp = (value) => {
        if (!value) return null;
        if (value?.toDate) return value.toDate();
        if (value instanceof Date) return value;
        if (typeof value === 'string') {
            const parsed = new Date(value);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
        return null;
    };

    const getBillDate = (bill) => {
        if (bill?.billMonth && bill?.billYear) {
            const parsed = new Date(`${bill.billMonth} 1, ${bill.billYear}`);
            if (!Number.isNaN(parsed.getTime())) return parsed;
        }
        return getDateFromTimestamp(bill?.createdAt) || new Date();
    };

    const totalCollected = useMemo(() => (
        bills.reduce((sum, bill) => {
            const paid = (bill.payments || []).reduce((acc, payment) => {
                const amount = Number(payment.amount || 0);
                return payment.status === 'Paid' ? acc + amount : acc;
            }, 0);
            return sum + paid;
        }, 0)
    ), [bills]);

    const totalPendingAmount = useMemo(() => (
        bills.reduce((sum, bill) => {
            const totalAmount = Number(bill.totalAmount || 0);
            const paid = (bill.payments || []).reduce((acc, payment) => {
                const amount = Number(payment.amount || 0);
                return payment.status === 'Paid' ? acc + amount : acc;
            }, 0);
            return sum + Math.max(totalAmount - paid, 0);
        }, 0)
    ), [bills]);

    const totalPendingBills = useMemo(() => (
        bills.filter((bill) => {
            const totalAmount = Number(bill.totalAmount || 0);
            const paid = (bill.payments || []).reduce((acc, payment) => {
                const amount = Number(payment.amount || 0);
                return payment.status === 'Paid' ? acc + amount : acc;
            }, 0);
            return totalAmount - paid > 0;
        }).length
    ), [bills]);

    const openComplaints = useMemo(
        () => complaints.filter((item) => (item.status || '').toLowerCase() !== 'resolved').length,
        [complaints]
    );

    const paymentByRange = useMemo(() => {
        const now = new Date();
        const dayStart = new Date(now);
        dayStart.setHours(0, 0, 0, 0);

        const buildWeekSeries = () => {
            const labels = [];
            for (let i = 6; i >= 0; i -= 1) {
                const date = new Date(dayStart);
                date.setDate(dayStart.getDate() - i);
                labels.push({
                    key: date.toISOString().slice(0, 10),
                    label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
                    value: 0,
                });
            }
            const map = new Map(labels.map((row) => [row.key, row]));
            bills.forEach((bill) => {
                const date = getBillDate(bill);
                const key = date.toISOString().slice(0, 10);
                if (!map.has(key)) return;
                const paid = (bill.payments || []).reduce((acc, payment) => (
                    payment.status === 'Paid' ? acc + Number(payment.amount || 0) : acc
                ), 0);
                map.get(key).value += paid;
            });
            return labels.map((row) => ({ label: row.label, value: Math.round(row.value) }));
        };

        const buildMonthSeries = () => {
            const month = now.getMonth();
            const year = now.getFullYear();
            const weeks = [
                { label: 'W1', value: 0 },
                { label: 'W2', value: 0 },
                { label: 'W3', value: 0 },
                { label: 'W4', value: 0 },
                { label: 'W5', value: 0 },
            ];

            bills.forEach((bill) => {
                const date = getBillDate(bill);
                if (date.getMonth() !== month || date.getFullYear() !== year) return;
                const weekIndex = Math.min(4, Math.floor((date.getDate() - 1) / 7));
                const paid = (bill.payments || []).reduce((acc, payment) => (
                    payment.status === 'Paid' ? acc + Number(payment.amount || 0) : acc
                ), 0);
                weeks[weekIndex].value += paid;
            });

            return weeks.map((row) => ({ ...row, value: Math.round(row.value) }));
        };

        const buildYearSeries = () => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const year = now.getFullYear();
            const rows = months.map((label) => ({ label, value: 0 }));

            bills.forEach((bill) => {
                const date = getBillDate(bill);
                if (date.getFullYear() !== year) return;
                const paid = (bill.payments || []).reduce((acc, payment) => (
                    payment.status === 'Paid' ? acc + Number(payment.amount || 0) : acc
                ), 0);
                rows[date.getMonth()].value += paid;
            });

            return rows.map((row) => ({ ...row, value: Math.round(row.value) }));
        };

        const weekSeries = buildWeekSeries();
        const monthSeries = buildMonthSeries();
        const yearSeries = buildYearSeries();

        const toGrowthSeries = (series) => {
            let running = 0;
            return series.map((row) => {
                running += row.value;
                return { label: row.label, value: running };
            });
        };

        const paidPending = [
            { name: 'Paid', value: Math.round(totalCollected) },
            { name: 'Pending', value: Math.round(totalPendingAmount) },
        ];

        return {
            week: {
                monthlyCollection: weekSeries,
                paidPending,
                growth: toGrowthSeries(weekSeries),
            },
            month: {
                monthlyCollection: monthSeries,
                paidPending,
                growth: toGrowthSeries(monthSeries),
            },
            year: {
                monthlyCollection: yearSeries,
                paidPending,
                growth: toGrowthSeries(yearSeries),
            },
        };
    }, [bills, totalCollected, totalPendingAmount]);

    const paymentData = useMemo(() => paymentByRange[range], [paymentByRange, range]);

    const maintenanceRows = useMemo(() => (
        complaints
            .slice()
            .sort((a, b) => {
                const at = getDateFromTimestamp(a.createdAt)?.getTime() || 0;
                const bt = getDateFromTimestamp(b.createdAt)?.getTime() || 0;
                return bt - at;
            })
            .slice(0, 8)
            .map((item) => ({
                issue: item.category || item.title || 'Complaint',
                resident: item.residentName || 'Resident',
                tower: item.residentFlat || item.flatNumber || '-',
                status: item.status || 'Pending',
                date: item.displayDate || getDateFromTimestamp(item.createdAt)?.toLocaleDateString('en-IN') || '-',
                staff: item.assignedTo || 'Pending assignment',
            }))
    ), [complaints]);

    const visitorStats = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - 6);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let today = 0;
        let week = 0;
        let month = 0;

        visitors.forEach((visitor) => {
            const date = getDateFromTimestamp(visitor.createdAt) || getDateFromTimestamp(visitor.entryTime);
            if (!date) return;
            if (date >= startOfToday) today += 1;
            if (date >= startOfWeek) week += 1;
            if (date >= startOfMonth) month += 1;
        });

        return { today, week, month };
    }, [visitors]);

    const visitorTrend = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const rows = [];
        for (let i = 6; i >= 0; i -= 1) {
            const date = new Date(start);
            date.setDate(start.getDate() - i);
            rows.push({
                key: date.toISOString().slice(0, 10),
                day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
                visitors: 0,
            });
        }
        const map = new Map(rows.map((row) => [row.key, row]));
        visitors.forEach((visitor) => {
            const date = getDateFromTimestamp(visitor.createdAt) || getDateFromTimestamp(visitor.entryTime);
            if (!date) return;
            const key = date.toISOString().slice(0, 10);
            if (map.has(key)) {
                map.get(key).visitors += 1;
            }
        });
        return rows;
    }, [visitors]);

    const visitedTowers = useMemo(() => {
        const counts = new Map();
        visitors.forEach((visitor) => {
            const label = visitor.flatNumber || visitor.residentFlat || 'Unknown';
            counts.set(label, (counts.get(label) || 0) + 1);
        });
        return Array.from(counts.entries())
            .map(([name, visits]) => ({ name, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 6);
    }, [visitors]);

    const complaintBreakdown = useMemo(() => {
        const counts = new Map();
        complaints.forEach((item) => {
            const key = item.category || 'Other';
            counts.set(key, (counts.get(key) || 0) + 1);
        });
        return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
    }, [complaints]);

    const resolutionHours = useMemo(() => {
        const resolved = complaints.filter((item) => (item.status || '').toLowerCase() === 'resolved');
        if (!resolved.length) return 0;

        const total = resolved.reduce((sum, item) => {
            const start = getDateFromTimestamp(item.createdAt);
            const end = getDateFromTimestamp(item.updatedAt);
            if (!start || !end) return sum;
            return sum + Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
        }, 0);

        return resolved.length ? Math.round(total / resolved.length) : 0;
    }, [complaints]);

    const lastSynced = useMemo(() => {
        const candidates = [
            ...bills.map((b) => getDateFromTimestamp(b.updatedAt) || getDateFromTimestamp(b.createdAt)),
            ...complaints.map((c) => getDateFromTimestamp(c.updatedAt) || getDateFromTimestamp(c.createdAt)),
            ...visitors.map((v) => getDateFromTimestamp(v.updatedAt) || getDateFromTimestamp(v.createdAt)),
        ].filter(Boolean);

        if (!candidates.length) return 'Not available';
        const latest = candidates.sort((a, b) => b.getTime() - a.getTime())[0];
        return latest.toLocaleString('en-IN');
    }, [bills, complaints, visitors]);

    const maintenanceRowsCount = maintenanceRows.length;

    const analyticsCards = [
        { label: 'Total Residents', value: String(residents.length), subtitle: residents.length ? 'Live resident count' : 'No data yet', trend: 'Live', trendUp: true, icon: Users },
        { label: 'Total Payments Collected', value: `Rs ${Math.round(totalCollected).toLocaleString('en-IN')}`, subtitle: totalCollected > 0 ? 'Realtime billing collection' : 'No data yet', trend: 'Live', trendUp: true, icon: IndianRupee },
        { label: 'Pending Payments', value: String(totalPendingBills), subtitle: totalPendingBills > 0 ? 'Bills with pending amount' : 'No pending bills', trend: 'Live', trendUp: totalPendingBills === 0, icon: Wallet },
        { label: 'Maintenance Requests', value: String(openComplaints), subtitle: openComplaints > 0 ? 'Open complaints' : 'No open complaints', trend: 'Live', trendUp: openComplaints === 0, icon: Wrench },
        { label: 'Visitors Today', value: String(visitorStats.today), subtitle: visitorStats.today > 0 ? 'Entries today' : 'No entries yet', trend: 'Live', trendUp: true, icon: UserCheck },
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
                    <div><span>Total Requests</span><strong>{complaints.length}</strong></div>
                    <div><span>Completed Requests</span><strong>{complaints.filter((item) => (item.status || '').toLowerCase() === 'resolved').length}</strong></div>
                    <div><span>Pending Requests</span><strong>{openComplaints}</strong></div>
                    <div><span>Average Resolution Time</span><strong>{resolutionHours} hrs</strong></div>
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
                        <div><span>Visitors Today</span><strong>{visitorStats.today}</strong></div>
                        <div><span>Visitors This Week</span><strong>{visitorStats.week}</strong></div>
                        <div><span>Visitors This Month</span><strong>{visitorStats.month}</strong></div>
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
                            <li><BarChart3 size={14} /> {openComplaints > 0 ? `${openComplaints} complaints need active attention.` : 'No pending complaints right now.'}</li>
                            <li><ShieldAlert size={14} /> {staff.length} staff members currently configured for this society.</li>
                            <li><Users size={14} /> {maintenanceRowsCount} recent maintenance entries visible in live feed.</li>
                        </ul>
                        <div className="ra-ai-footnote"><Clock3 size={14} /> Last synced: {lastSynced}</div>
                    </article>
                </div>
            </SectionCard>
        </div>
    );
};

export default ReportsAnalytics;
