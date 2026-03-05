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

const VisitorAnalytics = () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(dateRange.replace('days', ''));
  }, [dateRange]);

  const handleRangeChange = (range) => {
    setDateRange(range);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Date", "Visitors", "Vehicles"];

    // Merge dates
    const dates = new Set([...Object.keys(analyticsData.dailyVisitors || {}), ...Object.keys(analyticsData.dailyVehicles || {})]);

    const rows = Array.from(dates).sort().map(date => [
      date,
      analyticsData.dailyVisitors[date] || 0,
      analyticsData.dailyVehicles[date] || 0
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

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading analytics...
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
      </div>
    </div>
  );
};
export default VisitorAnalytics;
