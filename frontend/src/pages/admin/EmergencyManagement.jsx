import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import {
  AlertTriangle,
  Ambulance,
  Flame,
  ShieldAlert,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Radio,
  Megaphone,
  User,
  Activity,
  Siren,
  Stethoscope,
  PhoneCall,
  Edit2,
} from "lucide-react";
import api from "../../services/api";
const EmergencyManagement = () => {
  const [stats, setStats] = useState({
    activeSOS: 0,
    medical: 0,
    fire: 0,
    security: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts] = useState([
    {
      name: "Ambulance",
      number: "108",
      type: "Medical",
      icon: Ambulance,
      color: "#ef4444",
    },
    {
      name: "Fire Brigade",
      number: "101",
      type: "Fire",
      icon: Flame,
      color: "#f97316",
    },
    {
      name: "Police Station",
      number: "100",
      type: "Security",
      icon: ShieldAlert,
      color: "var(--primary)",
    },
    {
      name: "City Hospital",
      number: "022-2456-7890",
      type: "Medical",
      icon: Stethoscope,
      color: "#ef4444",
    },
    {
      name: "Main Gate Security",
      number: "+91 98765 43210",
      type: "Security",
      icon: User,
      color: "#6b7280",
    },
    {
      name: "Electrician",
      number: "+91 98765 43211",
      type: "Maintenance",
      icon: Activity,
      color: "#f59e0b",
    },
  ]);
  useEffect(() => {
    api
      .get("/api/admin/emergency")
      .then((res) => {
        const data = res.data || {};
        setAlerts(data.alerts || data || []);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error("Failed to load emergency data:", err))
      .finally(() => setLoading(false));
  }, []);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const handleResolve = async (id) => {
    if (window.confirm("Mark this alert as resolved?")) {
      try {
        await api.put(`/api/admin/emergency/${id}/resolve`);
      } catch {
        /* ignore if endpoint doesn't exist */
      }
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "Resolved",
              }
            : a,
        ),
      );
    }
  };

  // Styles matching ComplaintManagement
  const styles = {
    pageContainer: {
      maxWidth: "1280px",
      margin: "0 auto",
      width: "100%",
      padding: "0 24px",
    },
    headerSection: {
      marginBottom: "32px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "24px",
      marginBottom: "32px",
    },
    statCard: {
      padding: "24px",
      borderRadius: "var(--radius-md)",
      backgroundColor: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      border: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "140px",
      position: "relative",
      overflow: "hidden",
      gap: "12px",
    },
    statHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statLabel: {
      color: "#6b7280",
      fontSize: "14px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    statValue: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
      lineHeight: 1,
    },
    iconBox: (color) => ({
      padding: "12px",
      borderRadius: "var(--radius-md)",
      backgroundColor: `${color}15`,
      color: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    mainContentGrid: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "24px",
      alignItems: "start",
    },
    sectionCard: {
      backgroundColor: "white",
      borderRadius: "var(--radius-md)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    },
    sectionHeader: {
      padding: "20px 24px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f9fafb",
    },
    sectionTitle: {
      margin: 0,
      fontSize: "16px",
      fontWeight: "600",
      color: "#111827",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      borderBottom: "1px solid #f3f4f6",
      transition: "background-color 0.2s",
    },
    broadcastPanel: {
      padding: "24px",
      backgroundColor: "var(--surface)1f2",
      border: "1px solid #fecdd3",
      borderRadius: "var(--radius-md)",
      marginTop: "24px",
    },
  };
  return (
    <div className="emergency-page" style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.headerSection}>
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Emergency Control Center
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Real-time monitoring and rapid response dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("#ef4444")}>
              <Siren size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#ef4444",
                fontWeight: "600",
                backgroundColor: "#fef2f2",
                padding: "2px 8px",
                borderRadius: "var(--radius-md)",
              }}
            >
              URGENT
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>Active SOS</span>
            <h3 style={styles.statValue}>{stats.activeSOS}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("var(--primary)")}>
              <Stethoscope size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              Today
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>Medical</span>
            <h3 style={styles.statValue}>{stats.medical}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("#f97316")}>
              <Flame size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              This Month
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>Fire Alerts</span>
            <h3 style={styles.statValue}>{stats.fire}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("var(--primary)")}>
              <ShieldAlert size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              Active Patrols
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>Security</span>
            <h3 style={styles.statValue}>{stats.security}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="emergency-content-grid" style={styles.mainContentGrid}>
        {/* Left Column: Live Alerts */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>
              <Radio size={18} className="animate-pulse text-red-500" />
              Live Emergency Feed
            </h3>
            <Button variant="outline" size="sm">
              Download Report
            </Button>
          </div>
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <tr>
                  <th
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                    className="p-16"
                  >
                    Alert ID
                  </th>
                  <th
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                    className="p-16"
                  >
                    Type
                  </th>
                  <th
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                    className="p-16"
                  >
                    Reported By
                  </th>
                  <th
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                    className="p-16"
                  >
                    Location
                  </th>
                  <th
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                    className="p-16"
                  >
                    Time
                  </th>
                  <th
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                    className="p-16"
                  >
                    Status
                  </th>
                  <th
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                      textAlign: "right",
                    }}
                    className="p-16"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: "500",
                      }}
                      className="p-16"
                    >
                      {alert.id}
                    </td>
                    <td className="p-16">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor:
                            alert.type === "Medical"
                              ? "#eff6ff"
                              : alert.type === "Fire"
                                ? "var(--surface)7ed"
                                : "#fef2f2",
                          color:
                            alert.type === "Medical"
                              ? "#1d4ed8"
                              : alert.type === "Fire"
                                ? "#c2410c"
                                : "#b91c1c",
                        }}
                        className="gap-16"
                      >
                        {alert.type === "Medical" && <Activity size={12} />}
                        {alert.type === "Fire" && <Flame size={12} />}
                        {alert.type === "Security" && <ShieldAlert size={12} />}
                        {alert.type}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "#374151",
                      }}
                      className="p-16"
                    >
                      {alert.reporter}
                    </td>
                    <td
                      style={{
                        color: "#4b5563",
                      }}
                      className="p-16"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        className="gap-16"
                      >
                        <MapPin size={14} /> {alert.location}
                      </div>
                    </td>
                    <td
                      style={{
                        color: "#6b7280",
                        fontSize: "13px",
                      }}
                      className="p-16"
                    >
                      {alert.time}
                    </td>
                    <td className="p-16">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 12px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor:
                            alert.status === "Active" ? "#fef2f2" : "#ecfdf5",
                          color:
                            alert.status === "Active" ? "#ef4444" : "#10b981",
                          border: `1px solid ${alert.status === "Active" ? "#fecaca" : "#a7f3d0"}`,
                        }}
                        className="gap-16"
                      >
                        {alert.status === "Active" && (
                          <span className="animate-pulse">●</span>
                        )}
                        {alert.status}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                      }}
                      className="p-16"
                    >
                      {alert.status === "Active" && (
                        <Button
                          style={{
                            fontSize: "12px",
                            padding: "6px 12px",
                            height: "auto",
                            backgroundColor: "#10b981",
                            borderColor: "#10b981",
                            color: "white",
                          }}
                          onClick={() => handleResolve(alert.id)}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Contacts + Broadcast */}
        <div>
          {/* Emergency Contacts */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>
                <PhoneCall size={18} /> Quick Contacts
              </h3>
              <Button variant="ghost" className="p-16">
                <Edit2 size={16} />
              </Button>
            </div>
            <div>
              {contacts.map((contact, index) => (
                <div key={index} style={styles.contactItem}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="gap-16"
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: `${contact.color}15`,
                        color: contact.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <contact.icon size={20} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#111827",
                          fontSize: "14px",
                        }}
                      >
                        {contact.name}
                      </div>
                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        {contact.number}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    style={{
                      padding: "6px 10px",
                      height: "32px",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <Phone size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Panel */}
          <div style={styles.broadcastPanel}>
            <h3
              style={{
                ...styles.sectionTitle,
                color: "#be123c",
              }}
              className="mb-16"
            >
              <Megaphone size={18} /> Broadcast Emergency Alert
            </h3>
            <div className="mb-16">
              <textarea
                placeholder="Type emergency message here... This will be sent to all residents immediately."
                style={{
                  width: "100%",
                  height: "100px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #fecdd3",
                  resize: "none",
                  fontSize: "14px",
                  outline: "none",
                }}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="p-16"
              ></textarea>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                }}
                className="gap-16"
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#881337",
                  }}
                  className="gap-16"
                >
                  <input type="checkbox" defaultChecked /> Push Notif
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#881337",
                  }}
                  className="gap-16"
                >
                  <input type="checkbox" defaultChecked /> SMS
                </label>
              </div>
              <Button
                style={{
                  backgroundColor: "#e11d48",
                  border: "none",
                  color: "white",
                }}
              >
                Send Alert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmergencyManagement;
