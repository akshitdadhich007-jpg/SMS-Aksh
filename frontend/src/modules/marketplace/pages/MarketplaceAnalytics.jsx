import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMarketplace } from '../context/MarketplaceContext';
import '../styles/marketplace.css';

const COLORS = ['#4F46E5', '#06b6d4', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899'];

const MarketplaceAnalytics = () => {
    const navigate = useNavigate();
    const { state } = useMarketplace();

    const stats = useMemo(() => {
        const total = state.listings.length;
        const forSale = state.listings.filter(l => l.type === 'sale').length;
        const forRent = state.listings.filter(l => l.type === 'rent').length;
        const active = state.listings.filter(l => ['approved', 'under_visit'].includes(l.status)).length;
        const sold = state.listings.filter(l => l.status === 'sold').length;
        const rented = state.listings.filter(l => l.status === 'rented').length;
        const pending = state.listings.filter(l => l.status === 'pending').length;
        const totalEnquiries = state.enquiries.length;
        const totalVisits = state.visits.length;
        const totalViews = state.listings.reduce((sum, l) => sum + (l.views || 0), 0);

        return { total, forSale, forRent, active, sold, rented, pending, totalEnquiries, totalVisits, totalViews };
    }, [state]);

    const typeData = useMemo(() => [
        { name: 'For Sale', value: stats.forSale },
        { name: 'For Rent', value: stats.forRent },
    ], [stats]);

    const statusData = useMemo(() => [
        { name: 'Active', value: stats.active },
        { name: 'Sold', value: stats.sold },
        { name: 'Rented', value: stats.rented },
        { name: 'Pending', value: stats.pending },
    ], [stats]);

    const monthlyData = useMemo(() => {
        const months = {};
        state.listings.forEach(l => {
            const d = new Date(l.createdAt);
            const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
            if (!months[key]) months[key] = { month: key, sale: 0, rent: 0 };
            if (l.type === 'sale') months[key].sale++;
            else months[key].rent++;
        });
        return Object.values(months).slice(-6);
    }, [state.listings]);

    const engagementData = useMemo(() => [
        { name: 'Views', value: stats.totalViews },
        { name: 'Enquiries', value: stats.totalEnquiries },
        { name: 'Visits', value: stats.totalVisits },
    ], [stats]);

    return (
        <div className="mp-page">
            <div className="mp-page-header">
                <div>
                    <h1>📊 Marketplace Analytics</h1>
                    <p>Insights and trends from society property marketplace</p>
                </div>
                <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/admin/marketplace')}>
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {/* Stats */}
            <div className="mp-stats">
                <div className="mp-stat-card"><div className="mp-stat-label">Total Listings</div><div className="mp-stat-value">{stats.total}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Active</div><div className="mp-stat-value" style={{ color: '#22c55e' }}>{stats.active}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Sold</div><div className="mp-stat-value" style={{ color: '#8b5cf6' }}>{stats.sold}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Rented</div><div className="mp-stat-value" style={{ color: '#06b6d4' }}>{stats.rented}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Pending</div><div className="mp-stat-value" style={{ color: '#f59e0b' }}>{stats.pending}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Total Views</div><div className="mp-stat-value">{stats.totalViews}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Enquiries</div><div className="mp-stat-value">{stats.totalEnquiries}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Visits</div><div className="mp-stat-value">{stats.totalVisits}</div></div>
            </div>

            {/* Charts */}
            <div className="mp-charts-grid">
                {/* Sale vs Rent Pie */}
                <div className="mp-chart-card">
                    <h3>Sale vs Rent Distribution</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {typeData.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Pie */}
                <div className="mp-chart-card">
                    <h3>Listing Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                {statusData.map((_, i) => (<Cell key={i} fill={COLORS[i + 2]} />))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Bar Chart */}
                <div className="mp-chart-card">
                    <h3>Monthly Listings</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #e2e8f0)" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sale" name="Sale" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="rent" name="Rent" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Engagement Bar */}
                <div className="mp-chart-card">
                    <h3>User Engagement</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={engagementData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #e2e8f0)" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" name="Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceAnalytics;
