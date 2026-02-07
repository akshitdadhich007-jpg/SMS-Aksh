import React, { useState } from 'react';
import { Download, AlertTriangle, TrendingUp, Users, Clock, DivideCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useVisitors } from '../../context/VisitorContext';
import '../resident/VisitorPreApproval.css';

const VisitorAnalytics = () => {
  const {
    getAnalyticsData,
    getSuspiciousActivities,
    approvals,
  } = useVisitors();

  const [dateRange, setDateRange] = useState('30days'); // '30days', '90days', 'all'

  const analyticsData = getAnalyticsData();
  const suspiciousActivities = getSuspiciousActivities();

  // Filter data by date range
  const getFilteredData = () => {
    let cutoffDate = null;

    if (dateRange === '30days') {
      cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);
    } else if (dateRange === '90days') {
      cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90);
    }

    return approvals.filter(a => {
      if (!cutoffDate) return true;
      return new Date(a.createdAt) >= cutoffDate;
    });
  };

  const filteredData = getFilteredData();
  const filteredAnalytics = {
    totalApprovals: filteredData.length,
    approvedCount: filteredData.filter(a => a.status === 'approved').length,
    cancelledCount: filteredData.filter(a => a.status === 'cancelled').length,
    entriesCompleted: filteredData.filter(a => a.entryTime && a.exitTime).length,
  };

  // Calculate conversion rate
  const conversionRate = filteredData.length > 0 
    ? Math.round((filteredAnalytics.entriesCompleted / filteredAnalytics.approvedCount) * 100) 
    : 0;

  // Calculate average stay time
  const getAverageStayTime = () => {
    const completed = filteredData.filter(a => a.entryTime && a.exitTime);
    if (completed.length === 0) return 0;

    const totalMinutes = completed.reduce((sum, a) => {
      const duration = new Date(a.exitTime) - new Date(a.entryTime);
      return sum + (duration / (1000 * 60));
    }, 0);

    return Math.round(totalMinutes / completed.length);
  };

  // Top visitors
  const getTopVisitors = () => {
    const visitors = {};
    filteredData.forEach(a => {
      const key = `${a.visitorName} (${a.mobileNumber})`;
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
      const key = `${a.residentName} (${a.flatNumber})`;
      residents[key] = (residents[key] || 0) + 1;
    });

    return Object.entries(residents)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Visitor Name', 'Mobile', 'Resident', 'Flat', 'Purpose', 'Date', 'Approval Code', 'Entry Time', 'Exit Time', 'Status'];
    const rows = filteredData.map(a => [
      a.visitorName,
      a.mobileNumber,
      a.residentName,
      a.flatNumber,
      a.purpose,
      a.dateOfVisit,
      a.approvalCode,
      a.entryTime ? new Date(a.entryTime).toLocaleString() : '',
      a.exitTime ? new Date(a.exitTime).toLocaleString() : '',
      a.status,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visitor-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const topVisitors = getTopVisitors();
  const purposeDistribution = getPurposeDistribution();
  const topResidents = getTopResidents();
  const avgStayTime = getAverageStayTime();

  return (
    <div className="admin-visitor-analytics-page">
      <PageHeader
        title="Visitor Analytics"
        subtitle="Monitor visitor trends, activities, and audit misuse"
        icon="📊"
      />

      <div className="analytics-container">
        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['30days', '90days', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                style={{
                  padding: '8px 14px',
                  background: dateRange === range ? '#4F46E5' : 'var(--hover-bg)',
                  color: dateRange === range ? 'white' : 'var(--text-primary)',
                  border: `1px solid ${dateRange === range ? '#4F46E5' : 'var(--border)'}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {range === '30days' ? 'Last 30 Days' : range === '90days' ? 'Last 90 Days' : 'All Time'}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = '#4338CA'}
            onMouseLeave={(e) => e.target.style.background = '#4F46E5'}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Key Metrics */}
        <div className="analytics-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{filteredAnalytics.totalApprovals}</div>
            <div className="stat-label">Total Approvals</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{filteredAnalytics.entriesCompleted}</div>
            <div className="stat-label">Entries Completed</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{conversionRate}%</div>
            <div className="stat-label">Conversion Rate</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{avgStayTime}m</div>
            <div className="stat-label">Avg Stay Time</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-value">{filteredAnalytics.approvedCount}</div>
            <div className="stat-label">Approved</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✗</div>
            <div className="stat-value">{filteredAnalytics.cancelledCount}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>

        {/* Purpose Distribution */}
        {purposeDistribution.length > 0 && (
          <div className="chart-container">
            <h3 className="chart-title">📊 Visitor Purpose Distribution</h3>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Count</th>
                  <th>Percentage</th>
                  <th>Visual</th>
                </tr>
              </thead>
              <tbody>
                {purposeDistribution.map((item, idx) => {
                  const percentage = Math.round((item.count / filteredAnalytics.totalApprovals) * 100);
                  return (
                    <tr key={idx}>
                      <td>{item.purpose}</td>
                      <td style={{ fontWeight: 600 }}>{item.count}</td>
                      <td>{percentage}%</td>
                      <td>
                        <div style={{
                          background: 'var(--hover-bg)',
                          height: '8px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: '#4F46E5',
                            transition: 'width 0.3s ease',
                          }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

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
                    const date = a.dateOfVisit;
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
                {new Set(filteredData.map(a => a.mobileNumber)).size}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Unique Residents
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#4F46E5' }}>
                {new Set(filteredData.map(a => a.residerId)).size}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorAnalytics;
