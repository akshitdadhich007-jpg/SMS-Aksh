import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Bell, AlertTriangle, CreditCard, CheckCircle2, Megaphone,
    CalendarDays, CloudSun, Droplets, Wind, Sparkles, ShieldAlert,
    ArrowRight, WalletCards, MessageSquareWarning, PhoneCall,
    BadgeIndianRupee, Clock3, CircleCheckBig, Activity
} from 'lucide-react';
import { Button } from '../../components/ui';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import '../../styles/ResidentDashboard.css';
import { useAuth } from '../../context/AuthContext';
import { subscribeToResidentBills } from '../../firebase/billService';
import { subscribeToResidentComplaints } from '../../firebase/complaintService';
import { subscribeToAnnouncements } from '../../firebase/announcementService';

const Skeleton = ({ className = '' }) => <div className={`rd-skeleton ${className}`} />;

const AnimatedCount = ({ value, prefix = '', duration = 1000 }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const start = performance.now();
        let frame;
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [value, duration]);

    return <>{prefix}{display.toLocaleString('en-IN')}</>;
};

const ResidentDashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [pendingBills, setPendingBills] = useState(0);
    const [activeComplaints, setActiveComplaints] = useState(0);
    const [announcementCount, setAnnouncementCount] = useState(0);

    useEffect(() => {
        const id = setTimeout(() => setIsLoading(false), 850);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        if (!user?.uid) return;
        const unsubBills = subscribeToResidentBills(user.uid, (items) => {
            setPendingBills(items.filter(b => !b.isPaid).length);
        });
        const unsubComplaints = subscribeToResidentComplaints(user.uid, (items) => {
            setActiveComplaints(items.filter(c => (c.status || '').toLowerCase() !== 'resolved').length);
        });
        const unsubAnnouncements = subscribeToAnnouncements((items) => {
            setAnnouncementCount(items.length);
        });
        return () => {
            unsubBills && unsubBills();
            unsubComplaints && unsubComplaints();
            unsubAnnouncements && unsubAnnouncements();
        };
    }, [user?.uid]);

    const stats = useMemo(() => ([
        {
            key: 'due',
            label: 'Total Due',
            value: pendingBills,
            hint: pendingBills > 0 ? 'Bills pending' : 'All clear',
            Icon: CreditCard,
            accent: 'danger',
            prefix: '₹'
        },
        {
            key: 'paid',
            label: 'Last Payment',
            value: 2500,
            hint: 'Jan 10, 2026',
            Icon: CheckCircle2,
            accent: 'success',
            prefix: '₹'
        },
        {
            key: 'complaints',
            label: 'Active Complaints',
            value: activeComplaints,
            hint: activeComplaints > 0 ? 'In Progress' : 'No active complaints',
            Icon: AlertTriangle,
            accent: 'warning',
            prefix: ''
        },
        {
            key: 'announce',
            label: 'Announcements',
            value: announcementCount,
            hint: announcementCount > 0 ? 'New Updates' : 'No new updates',
            Icon: Bell,
            accent: 'info',
            prefix: ''
        },
    ]), []);

    const quickActions = [
        { label: 'Pay Maintenance', Icon: WalletCards, route: '/resident/pay', accent: 'indigo' },
        { label: 'File Complaint', Icon: MessageSquareWarning, route: '/resident/complaints', accent: 'violet' },
        { label: 'View Announcements', Icon: Megaphone, route: '/resident/announcements', accent: 'sky' },
        { label: 'Emergency Contact', Icon: PhoneCall, route: '/resident/emergency-sos', accent: 'danger' },
    ];

    const recentActivity = [
        { time: '2 hrs ago', text: 'Maintenance payment of ₹2,500 completed', Icon: CircleCheckBig, accent: 'success' },
        { time: 'Yesterday', text: 'Complaint #103 submitted and assigned', Icon: AlertTriangle, accent: 'warning' },
        { time: '2 days ago', text: 'New announcement received: Water shutdown alert', Icon: Bell, accent: 'info' },
    ];

    const societyUpdates = [
        {
            title: 'Water Tank Maintenance Scheduled',
            description: 'Block A and B water supply will pause from 11:00 AM to 1:00 PM this Sunday.',
            date: 'Mar 08, 2026'
        },
        {
            title: 'Holi Community Event',
            description: 'Join residents at Club Lawn for Holi celebration and community lunch.',
            date: 'Mar 10, 2026'
        },
        {
            title: 'Parking Sticker Renewal',
            description: 'Please update your vehicle sticker details in Resident Settings by this Friday.',
            date: 'Mar 12, 2026'
        },
    ];

    const paymentSeries = [
        { month: 'Sep', amount: 2200 },
        { month: 'Oct', amount: 2500 },
        { month: 'Nov', amount: 2500 },
        { month: 'Dec', amount: 2500 },
        { month: 'Jan', amount: 2500 },
        { month: 'Feb', amount: 2500 },
    ];

    return (
        <div className="resident-dashboard-sa">
            <motion.section
                className="rd-welcome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <div>
                    <h1>Welcome back, Resident</h1>
                    <p>Here is an overview of your society activity</p>
                </div>
                <div className="rd-welcome-avatar">RK</div>
            </motion.section>

            <motion.section
                className="rd-kpi-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
            >
                {isLoading
                    ? [...Array(4)].map((_, idx) => <Skeleton key={`rd-kpi-${idx}`} className="rd-kpi-skeleton" />)
                    : stats.map((item) => (
                        <motion.article
                            key={item.key}
                            className={`rd-kpi-card ${item.accent}`}
                            whileHover={{ y: -4, scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 270, damping: 22 }}
                        >
                            <div className="rd-kpi-icon"><item.Icon size={18} /></div>
                            <div className="rd-kpi-label">{item.label}</div>
                            <div className="rd-kpi-value"><AnimatedCount value={item.value} prefix={item.prefix} /></div>
                            <div className="rd-kpi-hint">{item.hint}</div>
                        </motion.article>
                    ))}
            </motion.section>

            <motion.section
                className="rd-quick-actions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
            >
                {quickActions.map((action) => (
                    <button
                        key={action.label}
                        className={`rd-action-card ${action.accent}`}
                        onClick={() => navigate(action.route)}
                    >
                        <span className="rd-action-icon"><action.Icon size={18} /></span>
                        <span>{action.label}</span>
                        <ArrowRight size={15} />
                    </button>
                ))}
            </motion.section>

            <motion.section
                className="rd-main-grid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
            >
                <div className="rd-surface rd-timeline-card">
                    <div className="rd-surface-head">
                        <h3>Recent Activity</h3>
                    </div>
                    {isLoading ? (
                        <Skeleton className="rd-panel-skeleton" />
                    ) : (
                        <div className="rd-timeline">
                            {recentActivity.map((item, idx) => (
                                <div className="rd-timeline-item" key={`${item.time}-${idx}`}>
                                    <span className={`rd-timeline-dot ${item.accent}`}><item.Icon size={12} /></span>
                                    <div className="rd-timeline-content">
                                        <p>{item.text}</p>
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rd-side-stack">
                    <div className="rd-surface rd-chart-card">
                        <div className="rd-surface-head">
                            <h3>Monthly Maintenance Payments</h3>
                        </div>
                        {isLoading ? (
                            <Skeleton className="rd-chart-skeleton" />
                        ) : (
                            <div className="rd-chart-wrap">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={paymentSeries} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="rdLine" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.95} />
                                                <stop offset="100%" stopColor="#818CF8" stopOpacity={0.7} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--rd-grid)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--rd-muted)', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--rd-muted)', fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value) => [`₹${value}`, 'Amount']}
                                            contentStyle={{ borderRadius: 10, border: '1px solid var(--rd-border)', background: 'var(--rd-card)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="url(#rdLine)"
                                            strokeWidth={3}
                                            dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                                            isAnimationActive
                                            animationDuration={850}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    <div className="rd-surface rd-reminder-card">
                        <div className="rd-surface-head">
                            <h3>Upcoming Due Reminder</h3>
                        </div>
                        <div className="rd-reminder">
                            <div>
                                <strong>Maintenance Due: ₹2,500</strong>
                                <p>Due by 15 Mar, 2026 • 5 days left</p>
                            </div>
                            <Button variant="primary" onClick={() => navigate('/resident/pay')}>Pay Now</Button>
                        </div>
                    </div>

                    <div className="rd-surface rd-weather-card">
                        <div className="rd-surface-head">
                            <h3>Weather • Jaipur</h3>
                        </div>
                        <div className="rd-weather-grid">
                            <div className="rd-weather-main">
                                <CloudSun size={20} />
                                <div>
                                    <strong>29°C</strong>
                                    <span>Partly Cloudy</span>
                                </div>
                            </div>
                            <div className="rd-weather-meta"><Droplets size={14} /> Humidity 42%</div>
                            <div className="rd-weather-meta"><Wind size={14} /> Wind 9 km/h</div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                className="rd-bottom-grid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
            >
                <div className="rd-surface">
                    <div className="rd-surface-head">
                        <h3>Society Updates</h3>
                    </div>
                    <div className="rd-updates-grid">
                        {societyUpdates.map((item) => (
                            <article key={item.title} className="rd-update-card">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                                <div className="rd-update-foot">
                                    <span><CalendarDays size={13} /> {item.date}</span>
                                    <button onClick={() => navigate('/resident/announcements')}>Read More</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="rd-side-stack">
                    <div className="rd-surface rd-events-card">
                        <div className="rd-surface-head">
                            <h3>Society Events</h3>
                        </div>
                        <div className="rd-mini-list">
                            <div><CalendarDays size={14} /> Yoga Session • 7:00 AM</div>
                            <div><Activity size={14} /> Club House Meeting • 6:00 PM</div>
                            <div><Megaphone size={14} /> Cultural Night • Saturday</div>
                        </div>
                    </div>

                    <div className="rd-surface rd-ai-card">
                        <div className="rd-surface-head">
                            <h3>AI Insights</h3>
                        </div>
                        <div className="rd-ai-content">
                            <Sparkles size={16} />
                            <p>Pay your maintenance before due date to avoid ₹150 late fine and keep your payment streak active.</p>
                        </div>
                    </div>

                    <div className="rd-surface rd-smart-notif-card">
                        <div className="rd-surface-head">
                            <h3>Smart Notifications</h3>
                        </div>
                        <div className="rd-mini-list">
                            <div><BadgeIndianRupee size={14} /> Bill generated for March cycle</div>
                            <div><Clock3 size={14} /> Complaint #103 updated by admin</div>
                            <div><ShieldAlert size={14} /> Security advisory shared today</div>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default ResidentDashboard;
