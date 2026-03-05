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
};
export default AdminDashboard;
