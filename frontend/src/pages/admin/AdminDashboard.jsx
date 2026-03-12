<<<<<<< HEAD
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
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import '../../styles/AdminDashboard.css';

const monthlyCollectionData = [
    { month: 'Jan', collection: 3.9 },
    { month: 'Feb', collection: 4.1 },
    { month: 'Mar', collection: 4.3 },
    { month: 'Apr', collection: 4.2 },
    { month: 'May', collection: 4.7 },
    { month: 'Jun', collection: 4.9 },
];

const expenseData = [
    { name: 'Utilities', value: 28, color: '#6366F1' },
    { name: 'Staff Salaries', value: 36, color: '#22C55E' },
    { name: 'Repairs', value: 18, color: '#F59E0B' },
    { name: 'Events', value: 10, color: '#EC4899' },
    { name: 'Misc', value: 8, color: '#0EA5E9' },
];

const recentPayments = [
    { flat: 'A-101', resident: 'Raj Kumar', month: 'Mar 2026', amount: 2500, status: 'Paid' },
    { flat: 'B-205', resident: 'Anita Sharma', month: 'Mar 2026', amount: 2500, status: 'Pending' },
    { flat: 'C-304', resident: 'Vikram Singh', month: 'Feb 2026', amount: 2500, status: 'Overdue' },
    { flat: 'A-202', resident: 'Suresh Mehta', month: 'Mar 2026', amount: 2500, status: 'Paid' },
    { flat: 'D-108', resident: 'Neha Jain', month: 'Mar 2026', amount: 2500, status: 'Paid' },
    { flat: 'E-412', resident: 'Aman Verma', month: 'Mar 2026', amount: 2500, status: 'Pending' },
];

const latestComplaints = [
    { id: '#CMP-219', category: 'Plumbing', status: 'Open', time: '10 mins ago', icon: Wrench },
    { id: '#CMP-217', category: 'Electrical', status: 'Processing', time: '1 hour ago', icon: Zap },
    { id: '#CMP-210', category: 'Noise', status: 'Resolved', time: 'Yesterday', icon: Volume2 },
    { id: '#CMP-208', category: 'Lift Issue', status: 'Processing', time: 'Yesterday', icon: AlertTriangle },
];

const timelineEvents = [
    { title: 'March maintenance cycle generated', meta: '120 flats billed', time: '09:15 AM', color: 'indigo' },
    { title: 'Complaint #CMP-217 assigned', meta: 'Assigned to electrical vendor', time: '10:05 AM', color: 'amber' },
    { title: 'Bulk notice sent', meta: 'Water supply shutdown alert', time: '11:40 AM', color: 'sky' },
    { title: 'Payment milestone reached', meta: '82% collection achieved', time: '12:10 PM', color: 'green' },
];

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

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timeoutId);
    }, []);

    const kpiCards = useMemo(() => ([
        {
            key: 'flats',
            label: 'Total Flats',
            value: 120,
            prefix: '',
            suffix: '',
            description: 'Across all towers',
            trend: '+3.2%',
            trendType: 'up',
            Icon: Building2,
            tint: 'indigo',
        },
        {
            key: 'residents',
            label: 'Total Residents',
            value: 305,
            prefix: '',
            suffix: '',
            description: 'Including tenants',
            trend: '+2.5%',
            trendType: 'up',
            Icon: Users,
            tint: 'sky',
        },
        {
            key: 'collection',
            label: 'Monthly Collection',
            value: 450000,
            prefix: '₹',
            suffix: '',
            description: 'Collected this month',
            trend: '+12%',
            trendType: 'up',
            Icon: IndianRupee,
            tint: 'green',
        },
        {
            key: 'pending',
            label: 'Pending Payments',
            value: 45000,
            prefix: '₹',
            suffix: '',
            description: 'From 18 units',
            trend: '-5%',
            trendType: 'down',
            Icon: CreditCard,
            tint: 'amber',
        },
        {
            key: 'complaints',
            label: 'Active Complaints',
            value: 14,
            prefix: '',
            suffix: '',
            description: 'Need attention',
            trend: '-8%',
            trendType: 'down',
            Icon: AlertTriangle,
            tint: 'rose',
        },
    ]), []);

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
                    <button className="glass-action-btn" onClick={() => navigate('/admin/reports')}>
                        <Search size={16} />
                        Analyze Insights
                    </button>
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
                            {timelineEvents.map((event, idx) => (
                                <div key={`${event.title}-${idx}`} className="timeline-item">
                                    <span className={`timeline-dot ${event.color}`} />
                                    <div className="timeline-content">
                                        <strong>{event.title}</strong>
                                        <p>{event.meta}</p>
                                    </div>
                                    <span className="timeline-time">{event.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
=======
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  Card,
  StatCard,
  StatusBadge,
  Button,
  CardHeader,
  CardContent,
} from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../services/api";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadDashboard();
  }, []);
  const loadDashboard = async () => {
    try {
      const [summaryRes, paymentsRes, complaintsRes] = await Promise.allSettled(
        [
          api.get("/api/admin/reports/summary"),
          api.get("/api/admin/payments"),
          api.get("/api/admin/complaints"),
        ],
      );
      if (summaryRes.status === "fulfilled") setStats(summaryRes.value.data);
      if (paymentsRes.status === "fulfilled")
        setRecentPayments((paymentsRes.value.data || []).slice(0, 4));
      if (complaintsRes.status === "fulfilled")
        setRecentComplaints((complaintsRes.value.data || []).slice(0, 3));
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadReport = async () => {
    try {
      const response = await api.get("/api/admin/reports/summary");
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dashboard_report.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success(
        "Dashboard report downloaded successfully!",
        "Download Complete",
      );
    } catch {
      toast.error("Failed to download report");
    }
  };

  // Build chart data from API stats
  const monthlyData = stats?.monthlyBreakdown
    ? Object.entries(stats.monthlyBreakdown).map(([month, amount]) => ({
        name: month,
        amount,
      }))
    : [];
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
        action={
          <Button variant="primary" onClick={handleDownloadReport}>
            📥 Download Report
          </Button>
        }
      />

      <div className="cards">
        <StatCard
          label="Total Residents"
          value={loading ? "…" : (stats?.totalResidents ?? "—")}
          icon="👥"
          accentColor="var(--primary)"
        />
        <StatCard
          label="Total Complaints"
          value={loading ? "…" : (stats?.totalComplaints ?? "—")}
          icon="📋"
          accentColor="#f59e0b"
        />
        <StatCard
          label="Pending Complaints"
          value={loading ? "…" : (stats?.pendingComplaints ?? "—")}
          icon="⏳"
          accentColor="#ef4444"
        />
        <StatCard
          label="Total Revenue"
          value={
            loading
              ? "…"
              : `₹${((stats?.totalRevenue || 0) / 1000).toFixed(1)}k`
          }
          icon="💰"
          accentColor="#10b981"
        />
      </div>

      <div className="analytics">
        <Card>
          <CardHeader title="Monthly Maintenance Collection" />
          <CardContent
            style={{
              height: 320,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--text-secondary)",
                    fontSize: 12,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--text-secondary)",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  cursor={{
                    fill: "var(--background)",
                  }}
                  contentStyle={{
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Expense Distribution" />
          <CardContent
            style={{
              height: 320,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Salaries",
                      value: 400,
                    },
                    {
                      name: "Utilities",
                      value: 300,
                    },
                    {
                      name: "Maintenance",
                      value: 300,
                    },
                    {
                      name: "Events",
                      value: 200,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          "#2563eb",
                          "#10b981",
                          "#f59e0b",
                          "var(--text-secondary)",
                        ][index]
                      }
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="tables">
        <Card>
          <CardHeader
            title="Recent Payments"
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/admin/payments")}
              >
                View All →
              </Button>
            }
          />
          <CardContent className="p-0">
            <table className="table" id="paymentsTable">
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
                {recentPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        color: "var(--text-secondary)",
                      }}
                      className="p-24"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((p, i) => (
                    <tr key={p.id || i}>
                      <td>{p.residents?.flat || p.flat || "—"}</td>
                      <td>{p.residents?.name || "—"}</td>
                      <td>{p.month || "—"}</td>
                      <td>
                        ₹
                        {Number(
                          p.amount || p.total_amount || 0,
                        ).toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge status={p.status || "Pending"} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Latest Complaints"
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/admin/complaints")}
              >
                View All →
              </Button>
            }
          />
          <CardContent className="p-0">
            <table className="table" id="complaintsTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        color: "var(--text-secondary)",
                      }}
                      className="p-24"
                    >
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  recentComplaints.map((c, i) => (
                    <tr key={c.id || i}>
                      <td>#{String(c.id).slice(-4)}</td>
                      <td>{c.category || c.title || "—"}</td>
                      <td>
                        <StatusBadge status={c.status || "Open"} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
};
export default AdminDashboard;
