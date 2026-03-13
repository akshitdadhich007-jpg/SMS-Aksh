import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Building2, Users, IndianRupee, CreditCard, AlertTriangle, TrendingUp, TrendingDown,
    Search, Wrench, Zap, Volume2, CheckCircle2, Clock3, Plus, Download,
    UserPlus, BellRing, ReceiptText
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { subscribeToFlats } from '../../firebase/flatService';
import { subscribeToResidents } from '../../firebase/residentService';
import { subscribeBillingStats } from '../../firebase/billService';
import { subscribeToAllComplaints } from '../../firebase/complaintService';
import { subscribeToTodayAttendance } from '../../firebase/attendanceService';
import { subscribeToActiveEmergencies } from '../../firebase/emergencyService';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import '../../styles/AdminDashboard.css';

const monthlyCollectionData = [];

const expenseData = [];

const recentPayments = [];

const latestComplaints = [];

const timelineEvents = [];

const quickActions = [
    { label: 'Add Resident', icon: UserPlus, path: '/admin/residents' },
    { label: 'Create Notice', icon: BellRing, path: '/admin/notices' },
    { label: 'Generate Bill', icon: ReceiptText, path: '/admin/maintenance' },
    { label: 'Track Complaints', icon: AlertTriangle, path: '/admin/complaints' },
];

const SkeletonCard = ({ className = '' }) => <div className={`admin-skeleton ${className}`} />;

const AnimatedCount = ({ value, prefix = '', suffix = '', duration = 1200 }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const start = performance.now();
        let animationFrame;

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(tick);
            }
        };

        animationFrame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return (
        <span>
            {prefix}{display.toLocaleString('en-IN')}{suffix}
        </span>
    );
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const societyId = user?.societyId;

    const [flatCount, setFlatCount] = useState(0);
    const [residentCount, setResidentCount] = useState(0);
    const [collectionStats, setCollectionStats] = useState({ totalBilled: 0, totalCollected: 0, totalPending: 0, billCount: 0, collectionPercentage: 0 });
    const [openComplaints, setOpenComplaints] = useState(0);
    const [presentStaff, setPresentStaff] = useState(0);
    const [activeAlerts, setActiveAlerts] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (!societyId) {
            console.log('[AdminDashboard] No societyId, skipping subscriptions');
            return;
        }

        console.log('[AdminDashboard] Subscribing to data for societyId:', societyId);

        const unsubFlats = subscribeToFlats(societyId, (items) => {
            console.log('[AdminDashboard] Received flats:', items.length);
            setFlatCount(items.length);
        });
        const unsubResidents = subscribeToResidents(societyId, (items) => {
            console.log('[AdminDashboard] Received residents:', items.length);
            setResidentCount(items.length);
        });
        const unsubBills = subscribeBillingStats(societyId, (stats) => {
            console.log('[AdminDashboard] Received billing stats:', stats);
            setCollectionStats(stats || { totalBilled: 0, totalCollected: 0, totalPending: 0, billCount: 0, collectionPercentage: 0 });
        });
        const unsubComplaints = subscribeToAllComplaints(societyId, (items) => {
            console.log('[AdminDashboard] Received complaints:', items.length);
            setOpenComplaints(items.filter(c => (c.status || '').toLowerCase() !== 'resolved').length);
        });
        const unsubAttendance = subscribeToTodayAttendance(societyId, (items) => {
            console.log('[AdminDashboard] Received attendance:', items.length);
            setPresentStaff(items.length);
        });
        const unsubEmergencies = subscribeToActiveEmergencies(societyId, (items) => {
            console.log('[AdminDashboard] Received emergencies:', items.length);
            setActiveAlerts(items.length);
        });
        return () => {
            if (unsubFlats) unsubFlats();
            if (unsubResidents) unsubResidents();
            if (unsubBills) unsubBills();
            if (unsubComplaints) unsubComplaints();
            if (unsubAttendance) unsubAttendance();
            if (unsubEmergencies) unsubEmergencies();
        };
    }, [societyId]);

    const kpiCards = useMemo(() => ([
        {
            key: 'flats',
            label: 'Total Flats',
            value: flatCount || 0,
            prefix: '',
            suffix: '',
            description: flatCount > 0 ? 'Live flat count' : 'No data yet',
            trend: '0%',
            trendType: 'up',
            Icon: Building2,
            tint: 'indigo',
        },
        {
            key: 'residents',
            label: 'Total Residents',
            value: residentCount || 0,
            prefix: '',
            suffix: '',
            description: residentCount > 0 ? 'Live resident count' : 'No data yet',
            trend: '0%',
            trendType: 'up',
            Icon: Users,
            tint: 'sky',
        },
        {
            key: 'collection',
            label: 'Monthly Collection',
            value: collectionStats.totalCollected || 0,
            prefix: '₹',
            suffix: '',
            description: collectionStats.totalCollected > 0 ? 'Collected this month' : 'No data yet',
            trend: '0%',
            trendType: 'up',
            Icon: IndianRupee,
            tint: 'green',
        },
        {
            key: 'pending',
            label: 'Pending Payments',
            value: collectionStats.totalPending || 0,
            prefix: '₹',
            suffix: '',
            description: collectionStats.totalPending > 0 ? 'Pending collection' : 'No data yet',
            trend: '0%',
            trendType: 'down',
            Icon: CreditCard,
            tint: 'amber',
        },
        {
            key: 'complaints',
            label: 'Active Complaints',
            value: openComplaints || 0,
            prefix: '',
            suffix: '',
            description: openComplaints > 0 ? 'Need attention' : 'No data yet',
            trend: '0%',
            trendType: 'down',
            Icon: AlertTriangle,
            tint: 'rose',
        },
    ]), [flatCount, residentCount, collectionStats.totalCollected, collectionStats.totalPending, openComplaints]);

    const handleDownloadReport = () => {
        toast.success('Dashboard report downloaded successfully!', 'Download Complete');
    };

    const getResidentInitials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="admin-dashboard-sa">
            <motion.div
                className="admin-dashboard-head"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <div>
                    <h1>Overview</h1>
                    <p>Welcome back, Administrator. Here is your real-time society snapshot.</p>
                </div>

                <div className="admin-dashboard-head-actions">
                    <Button variant="primary" onClick={handleDownloadReport}>
                        <Download size={16} /> Download Report
                    </Button>
                </div>
            </motion.div>

            <motion.div
                className="kpi-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
            >
                {isLoading
                    ? [...Array(5)].map((_, idx) => <SkeletonCard key={`kpi-skeleton-${idx}`} className="kpi-skeleton" />)
                    : kpiCards.map((card) => {
                        const TrendIcon = card.trendType === 'up' ? TrendingUp : TrendingDown;
                        return (
                            <motion.article
                                key={card.key}
                                className={`kpi-card tint-${card.tint}`}
                                whileHover={{ y: -4, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            >
                                <div className="kpi-icon-wrap">
                                    <card.Icon size={20} />
                                </div>

                                <div className="kpi-main-value">
                                    <AnimatedCount value={card.value} prefix={card.prefix} suffix={card.suffix} />
                                </div>

                                <div className="kpi-label">{card.label}</div>
                                <div className="kpi-desc">{card.description}</div>

                                <div className={`kpi-trend ${card.trendType}`}>
                                    <TrendIcon size={14} /> {card.trend}
                                </div>
                            </motion.article>
                        );
                    })}
            </motion.div>

            <motion.section
                className="analytics-grid"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
            >
                <div className="surface-card chart-card">
                    <div className="surface-head">
                        <div>
                            <h3>Monthly Maintenance Collection</h3>
                            <p>Performance across last 6 months</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <SkeletonCard className="chart-skeleton" />
                    ) : monthlyCollectionData.length === 0 ? (
                        <div className="chart-empty">No data yet</div>
                    ) : (
                        <div className="chart-area">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyCollectionData} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366F1" stopOpacity={0.95} />
                                            <stop offset="100%" stopColor="#22C55E" stopOpacity={0.65} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--chart-grid)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-label)', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--chart-label)', fontSize: 12 }} domain={[3, 5.5]} />
                                    <Tooltip
                                        formatter={(value) => [`₹ ${value}L`, 'Collection']}
                                        contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text-primary)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="collection"
                                        stroke="url(#lineGradient)"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                        activeDot={{ r: 6 }}
                                        isAnimationActive
                                        animationDuration={900}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="surface-card chart-card">
                    <div className="surface-head">
                        <div>
                            <h3>Expense Distribution</h3>
                            <p>Current month allocation</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <SkeletonCard className="chart-skeleton" />
                    ) : expenseData.length === 0 ? (
                        <div className="chart-empty">No data yet</div>
                    ) : (
                        <div className="donut-wrap">
                            <div className="chart-area donut-chart-area">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={expenseData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={62}
                                            outerRadius={92}
                                            paddingAngle={3}
                                            isAnimationActive
                                            animationDuration={900}
                                        >
                                            {expenseData.map((entry) => (
                                                <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`${value}%`, 'Share']}
                                            contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text-primary)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="donut-legend">
                                {expenseData.map((item) => (
                                    <div key={item.name} className="legend-row">
                                        <span className="legend-dot" style={{ background: item.color }} />
                                        <span>{item.name}</span>
                                        <strong>{item.value}%</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.section>

            <motion.section
                className="data-grid"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
            >
                <div className="surface-card payments-card">
                    <div className="surface-head">
                        <div>
                            <h3>Recent Payments</h3>
                            <p>Latest maintenance transactions</p>
                        </div>
                        <button className="link-btn" onClick={() => navigate('/admin/payments')}>View All</button>
                    </div>

                    {isLoading ? (
                        <div className="table-skeleton-wrap">
                            <SkeletonCard className="table-skeleton" />
                        </div>
                    ) : recentPayments.length === 0 ? (
                        <div className="table-empty">No payments yet</div>
                    ) : (
                        <div className="table-wrap">
                            <table className="saas-table">
                                <thead>
                                    <tr>
                                        <th>Flat</th>
                                        <th>Resident</th>
                                        <th>Month</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPayments.map((row, idx) => (
                                        <tr key={`${row.flat}-${row.month}-${idx}`}>
                                            <td>{row.flat}</td>
                                            <td>
                                                <div className="resident-cell">
                                                    <span className="resident-avatar">{getResidentInitials(row.resident)}</span>
                                                    <span>{row.resident}</span>
                                                </div>
                                            </td>
                                            <td>{row.month}</td>
                                            <td>₹ {row.amount.toLocaleString('en-IN')}</td>
                                            <td>
                                                <span className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="stacked-side-panels">
                    <div className="surface-card complaints-card">
                        <div className="surface-head">
                            <div>
                                <h3>Latest Complaints</h3>
                                <p>Track resident service issues</p>
                            </div>
                            <button className="link-btn" onClick={() => navigate('/admin/complaints')}>View All</button>
                        </div>

                        {isLoading ? (
                            <SkeletonCard className="complaints-skeleton" />
                        ) : latestComplaints.length === 0 ? (
                            <div className="list-empty">No complaints yet</div>
                        ) : (
                            <div className="complaint-list">
                                {latestComplaints.map((item) => (
                                    <button
                                        key={item.id}
                                        className="complaint-card"
                                        onClick={() => navigate('/admin/complaints')}
                                    >
                                        <div className="complaint-icon"><item.icon size={16} /></div>
                                        <div className="complaint-main">
                                            <div className="complaint-top-line">
                                                <strong>{item.id}</strong>
                                                <span className={`status-pill ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                                            </div>
                                            <p>{item.category}</p>
                                        </div>
                                        <span className="complaint-time"><Clock3 size={12} /> {item.time}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="surface-card quick-actions-card">
                        <div className="surface-head">
                            <div>
                                <h3>Quick Actions</h3>
                                <p>Speed up daily operations</p>
                            </div>
                        </div>

                        <div className="quick-actions-grid">
                            {quickActions.map((action) => (
                                <button key={action.label} className="quick-action" onClick={() => navigate(action.path)}>
                                    <action.icon size={16} />
                                    <span>{action.label}</span>
                                    <Plus size={14} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="surface-card timeline-card">
                        <div className="surface-head">
                            <div>
                                <h3>Activity Timeline</h3>
                                <p>Latest operational events</p>
                            </div>
                        </div>

                        <div className="timeline-list">
                            {timelineEvents.length === 0 ? (
                                <div className="list-empty">No data yet</div>
                            ) : (
                                timelineEvents.map((event, idx) => (
                                    <div key={`${event.title}-${idx}`} className="timeline-item">
                                        <span className={`timeline-dot ${event.color}`} />
                                        <div className="timeline-content">
                                            <strong>{event.title}</strong>
                                            <p>{event.meta}</p>
                                        </div>
                                        <span className="timeline-time">{event.time}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default AdminDashboard;
