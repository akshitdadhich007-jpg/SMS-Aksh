import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, PageHeader, Button } from "../../components/ui";
import api from "../../services/api";
const ResidentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    {
      label: "Total Due",
      value: "₹ 0",
      trend: "--",
      color: "#ef4444",
    },
    {
      label: "Last Paid",
      value: "₹ 0",
      trend: "--",
      color: "#10b981",
    },
    {
      label: "Active Complaints",
      value: "0",
      trend: "--",
      color: "#f59e0b",
    },
    {
      label: "Notices",
      value: "0",
      trend: "--",
      color: "var(--primary)",
    },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  useEffect(() => {
    api
      .get("/api/resident/dashboard")
      .then((res) => {
        const d = res.data || {};
        if (d.stats) setStats(d.stats);
        if (d.recentActivity) setRecentActivity(d.recentActivity);
      })
      .catch((err) => console.error("Failed to load dashboard:", err));
  }, []);
  const quickActions = [
    {
      label: "Pay Now",
      icon: "💳",
      route: "/resident/pay",
      variant: "primary",
    },
    {
      label: "File Complaint",
      icon: "📝",
      route: "/resident/complaints",
      variant: "secondary",
    },
    {
      label: "View Announcements",
      icon: "📢",
      route: "/resident/announcements",
      variant: "secondary",
    },
    {
      label: "Emergency",
      icon: "🚨",
      route: "/resident/emergency",
      variant: "danger",
    },
  ];
  return (
    <div>
      <PageHeader title="My Dashboard" subtitle="Welcome back, Resident" />

      {/* Stats Cards */}
      <div className="cards">
        {stats.map((stat, index) => (
          <Card
            key={index}
            style={{
              borderLeft: `3px solid ${stat.color}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
              className="p-16 gap-16"
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "var(--radius-md)",
                  background: `${stat.color}14`,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                  fontWeight: 700,
                }}
              >
                {stat.label === "Total Due"
                  ? "💳"
                  : stat.label === "Last Paid"
                    ? "✅"
                    : stat.label === "Active Complaints"
                      ? "⚠️"
                      : "📢"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                  className="mb-16"
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: stat.color,
                    lineHeight: 1.2,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                  className="mt-16"
                >
                  {stat.trend}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
        className="gap-16 mb-24"
      >
        {quickActions.map((action, i) => (
          <Button
            key={i}
            variant={action.variant}
            onClick={() => navigate(action.route)}
            style={{
              padding: "12px 22px",
              fontSize: 14,
            }}
          >
            {action.icon} {action.label}
          </Button>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: "15px",
            fontWeight: "700",
            color: "var(--text-primary)",
            letterSpacing: "-0.3px",
          }}
        >
          Recent Activity
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
          className="gap-16"
        >
          {recentActivity.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                transition: "background 0.15s",
                cursor: "default",
                borderLeft: "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--background)";
                e.currentTarget.style.borderLeftColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderLeftColor = "transparent";
              }}
              className="gap-16"
            >
              <span
                style={{
                  fontSize: "18px",
                  width: 28,
                  textAlign: "center",
                }}
              >
                {item.icon}
              </span>
              <div
                style={{
                  flex: 1,
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "var(--text-primary)",
                }}
              >
                {item.text}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default ResidentDashboard;
