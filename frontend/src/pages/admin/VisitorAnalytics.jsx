<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from 'react';
import { Download, AlertTriangle, TrendingUp, Users, Clock, DivideCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import '../resident/VisitorPreApproval.css';
=======
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Download,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  DivideCircle,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import "../resident/VisitorPreApproval.css";
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002';

const VisitorAnalytics = () => {
<<<<<<< HEAD
  const [dateRange, setDateRange] = useState('30days'); // '30days', '90days', 'all'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analyticsPayload, setAnalyticsPayload] = useState({
    totalApprovals: 0,
    entriesCompleted: 0,
    conversionRate: 0,
    avgStayTimeMinutes: 0,
    approvedCount: 0,
    cancelledCount: 0,
    uniqueVisitors: 0,
    uniqueResidents: 0,
    dailyVisitors: {},
    visitors: [],
  });

  const fetchAnalytics = async (range) => {
    setIsLoading(true);
    setError('');
    try {
      const rangeParam = range === 'all' ? 'all' : range.replace('days', '');
      const res = await fetch(`${API_BASE}/api/admin/visitor-analytics?range=${rangeParam}`);
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to fetch analytics');
      }
      setAnalyticsPayload(payload.data || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
=======
  const [dateRange, setDateRange] = useState("30days");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalVisitors: 0,
    totalVehicles: 0,
    dailyVisitors: {},
    dailyVehicles: {}
  });

  const fetchAnalytics = async (range) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/api/admin/visitor-analytics?range=${range}`);
      setAnalyticsData(data || {
        totalVisitors: 0,
        totalVehicles: 0,
        dailyVisitors: {},
        dailyVehicles: {}
      });
    } catch (err) {
      console.error("Failed to fetch analytics", err);
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchAnalytics(dateRange);
  }, [dateRange]);

  const filteredData = analyticsPayload.visitors || [];
  const filteredAnalytics = {
    totalApprovals: analyticsPayload.totalApprovals || 0,
    approvedCount: analyticsPayload.approvedCount || 0,
    cancelledCount: analyticsPayload.cancelledCount || 0,
    entriesCompleted: analyticsPayload.entriesCompleted || 0,
  };

  const conversionRate = analyticsPayload.conversionRate || 0;

  // Top visitors
  const getTopVisitors = () => {
    const visitors = {};
    filteredData.forEach(a => {
      const key = `${a.visitor_name}`;
      visitors[key] = (visitors[key] || 0) + 1;
    });

    return Object.entries(visitors)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Purpose distribution
  const getPurposeDistribution = () => {
    const purposes = {};
    const purposeLabels = {
      meeting: 'Meeting/Work',
      personal: 'Personal Visit',
      delivery: 'Delivery',
      repair: 'Repair/Maintenance',
      guest: 'Guest/Family',
      other: 'Other',
    };

    filteredData.forEach(a => {
      const label = purposeLabels[a.purpose] || a.purpose;
      purposes[label] = (purposes[label] || 0) + 1;
    });

    return Object.entries(purposes)
      .map(([purpose, count]) => ({ purpose, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Residents with most approvals
  const getTopResidents = () => {
    const residents = {};
    filteredData.forEach(a => {
      const key = `Resident (${a.flat_number})`;
      residents[key] = (residents[key] || 0) + 1;
    });

    return Object.entries(residents)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
=======
    fetchAnalytics(dateRange.replace('days', ''));
  }, [dateRange]);

  const handleRangeChange = (range) => {
    setDateRange(range);
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
  };

  // Export to CSV
  const handleExportCSV = () => {
<<<<<<< HEAD
    const headers = ['Visitor Name', 'Mobile', 'Resident', 'Flat', 'Purpose', 'Date', 'Approval Code', 'Entry Time', 'Exit Time', 'Status'];
    const rows = filteredData.map(a => [
      a.visitor_name,
      '',
      'Resident',
      a.flat_number,
      a.purpose,
      new Date(a.check_in_at).toISOString().split('T')[0],
      a.id,
      a.check_in_at ? new Date(a.check_in_at).toLocaleString() : '',
      a.check_out_at ? new Date(a.check_out_at).toLocaleString() : '',
      a.status,
=======
    const headers = ["Date", "Visitors", "Vehicles"];

    // Merge dates
    const dates = new Set([...Object.keys(analyticsData.dailyVisitors || {}), ...Object.keys(analyticsData.dailyVehicles || {})]);

    const rows = Array.from(dates).sort().map(date => [
      date,
      analyticsData.dailyVisitors[date] || 0,
      analyticsData.dailyVehicles[date] || 0
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visitor-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

<<<<<<< HEAD
  const topVisitors = getTopVisitors();
  const purposeDistribution = getPurposeDistribution();
  const topResidents = getTopResidents();
  const avgStayTime = analyticsPayload.avgStayTimeMinutes || 0;
  const suspiciousActivities = useMemo(() => {
    return filteredData.filter((activity) => {
      if (!activity.check_in_at) return false;
      if (!activity.check_out_at) return false;
      const stayMs = new Date(activity.check_out_at) - new Date(activity.check_in_at);
      return stayMs > 6 * 60 * 60 * 1000;
    });
  }, [filteredData]);

=======
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
  return (
    <div className="admin-visitor-analytics-page">
      <PageHeader
        title="Visitor Analytics"
        subtitle="Monitor visitor trends, activities, and audit misuse"
        icon="📊"
      />

      <div className="analytics-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="gap-16"
        >
          <div
            style={{
              display: "flex",
            }}
            className="gap-16"
          >
            {["30days", "90days", "all"].map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                style={{
                  padding: "8px 14px",
                  background:
                    dateRange === range
                      ? "var(--primary)"
                      : "var(--background)",
                  color: dateRange === range ? "white" : "var(--text-primary)",
                  border: `1px solid ${dateRange === range ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {range === "30days"
                  ? "Last 30 Days"
                  : range === "90days"
                    ? "Last 90 Days"
                    : "All Time"}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 14px",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "var(--primary-hover)")
            }
            onMouseLeave={(e) => (e.target.style.background = "var(--primary)")}
            className="gap-16"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

<<<<<<< HEAD
        {isLoading && (
          <div style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading analytics...</div>
        )}
        {error && (
          <div style={{ marginTop: '12px', color: '#DC2626' }}>{error}</div>
        )}

        {/* Key Metrics */}
        <div className="analytics-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{filteredAnalytics.totalApprovals}</div>
            <div className="stat-label">Total Approvals</div>
=======
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading analytics...
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
          </div>
        ) : (
          <div className="analytics-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{analyticsData?.totalApprovals || 0}</div>
              <div className="stat-label">Total Approvals</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">
                {analyticsData?.entriesCompleted || 0}
              </div>
              <div className="stat-label">Entries Completed</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">{analyticsData?.conversionRate || 0}%</div>
              <div className="stat-label">Conversion Rate</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{analyticsData?.avgStayTime || 0}m</div>
              <div className="stat-label">Avg Stay Time</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-value">{analyticsData?.approvedCount || 0}</div>
              <div className="stat-label">Approved</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✗</div>
              <div className="stat-value">{analyticsData?.cancelledCount || 0}</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </div>
        )}
<<<<<<< HEAD

        {/* Top Visitors */}
        {topVisitors.length > 0 && (
          <div className="chart-container">
            <h3 className="chart-title">🔝 Frequent Visitors</h3>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Visitor Name (Mobile)</th>
                  <th>Visits</th>
                  <th>Approval Rate</th>
                </tr>
              </thead>
              <tbody>
                {topVisitors.map((visitor, idx) => (
                  <tr key={idx}>
                    <td>{visitor.name}</td>
                    <td style={{ fontWeight: 600 }}>{visitor.count}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: 'rgba(22, 163, 74, 0.15)',
                        color: '#16A34A',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        100%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Residents */}
        {topResidents.length > 0 && (
          <div className="chart-container">
            <h3 className="chart-title">👤 Most Active Residents</h3>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Resident (Flat)</th>
                  <th>Approvals</th>
                  <th>Avg Visitors/Month</th>
                </tr>
              </thead>
              <tbody>
                {topResidents.map((resident, idx) => {
                  const monthsActive = dateRange === '30days' ? 1 : dateRange === '90days' ? 3 : Math.max(1, Math.floor(filteredData.length / 10));
                  const avgPerMonth = Math.round(resident.count / monthsActive);
                  return (
                    <tr key={idx}>
                      <td>{resident.name}</td>
                      <td style={{ fontWeight: 600 }}>{resident.count}</td>
                      <td>{avgPerMonth}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Suspicious Activities */}
        {suspiciousActivities.length > 0 && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.05)',
            border: '1px solid #DC2626',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AlertTriangle size={20} style={{ color: '#DC2626' }} />
              <h3 style={{ margin: 0, fontSize: '16px', color: '#DC2626', fontWeight: 600 }}>
                ⚠️ Suspicious Activities ({suspiciousActivities.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {suspiciousActivities.slice(0, 10).map((activity, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  background: 'var(--card)',
                  border: '1px solid #DC2626',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {activity.visitorName} ({activity.mobileNumber})
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {activity.entryTime && new Date(activity.entryTime).getTime() > new Date(`${activity.dateOfVisit}T${activity.endTime}`).getTime()
                      ? '⚠️ Entered outside approval window'
                      : activity.exitTime && new Date(activity.exitTime).getTime() - new Date(`${activity.dateOfVisit}T${activity.endTime}`).getTime() > 2 * 60 * 60 * 1000
                      ? '⚠️ Extended stay (2+ hours past end time)'
                      : '⚠️ Multiple visitors from same phone'}
                  </div>
                </div>
              ))}
            </div>

            {suspiciousActivities.length > 10 && (
              <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                ... and {suspiciousActivities.length - 10} more suspicious activities
              </p>
            )}
          </div>
        )}

        {/* Summary Report */}
        <div className="chart-container">
          <h3 className="chart-title">📋 Summary Report</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Approval Success Rate
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#4F46E5' }}>
                {filteredData.length > 0 
                  ? Math.round((filteredAnalytics.approvedCount / filteredAnalytics.totalApprovals) * 100)
                  : 0}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Peak Approval Day
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {(() => {
                  const daily = {};
                  filteredData.forEach(a => {
                    const date = new Date(a.check_in_at).toISOString().split('T')[0];
                    daily[date] = (daily[date] || 0) + 1;
                  });
                  const peak = Object.entries(daily).sort((a, b) => b[1] - a[1])[0];
                  return peak ? `${peak[0]} (${peak[1]} approvals)` : 'N/A';
                })()}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Unique Visitors
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A' }}>
                {analyticsPayload.uniqueVisitors || 0}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Unique Residents
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#4F46E5' }}>
                {analyticsPayload.uniqueResidents || 0}
              </div>
            </div>
          </div>
        </div>
=======
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
      </div>
    </div>
  );
};
export default VisitorAnalytics;
