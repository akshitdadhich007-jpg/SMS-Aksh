import React, { useState, useEffect, useMemo } from "react";
import { PageHeader, Card, StatusBadge, Button } from "../../components/ui";
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Modal from "../../components/ui/Modal.jsx";
import api from "../../services/api";
const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/complaints")
      .then((res) => {
        const mapped = (res.data || []).map((c) => ({
          id: c.id,
          resident: `${c.residents?.name || "Unknown"} (${c.residents?.flat || "—"})`,
          category: c.category || c.title || "—",
          description: c.description || "",
          status: c.status || "Pending",
          date: c.created_at
            ? new Date(c.created_at).toISOString().slice(0, 10)
            : "—",
          priority: c.priority || "Medium",
        }));
        setComplaints(mapped);
      })
      .catch((err) => console.error("Failed to load complaints:", err))
      .finally(() => setLoading(false));
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate Stats
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    const inProgress = complaints.filter(
      (c) => c.status === "In Progress",
    ).length;
    return {
      total,
      pending,
      resolved,
      inProgress,
    };
  }, [complaints]);

  // Filter Logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.resident.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchTerm, statusFilter]);
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await api.delete(`/api/admin/complaints/${id}`);
        setComplaints((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ef4444";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  // Inline Styles for Dashboard
  const styles = {
    pageContainer: {
      maxWidth: "1280px",
      margin: "0 auto",
      width: "100%",
      padding: "0 24px",
    },
    statsGrid: {
      width: "100%",
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
      transition: "transform 0.2s",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
      gap: "12px",
    },
    statHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: 0, // Remove margin to rely on gap for perfect spacing
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
      margin: "4px 0 0 0",
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
    controlsBar: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      backgroundColor: "white",
      padding: "16px 24px",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    },
    searchBox: {
      position: "relative",
      flex: "1",
      minWidth: "300px",
    },
    searchInput: {
      width: "100%",
      height: "42px",
      padding: "0 16px 0 40px",
      borderRadius: "var(--radius-md)",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none",
    },
    filterGroup: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    filterSelect: {
      height: "42px",
      padding: "0 36px 0 16px",
      borderRadius: "var(--radius-md)",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      outline: "none",
      minWidth: "150px",
      backgroundColor: "white",
      cursor: "pointer",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "var(--radius-md)",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "1px solid var(--border)",
      overflow: "hidden",
    },
    tableHeader: {
      backgroundColor: "#f9fafb",
      padding: "16px 24px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowActionBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "var(--radius-md)",
      transition: "background-color 0.2s",
      color: "#6b7280",
    },
  };
  return (
    <div className="complaint-management-page" style={styles.pageContainer}>
      {/* Custom Header for strict alignment */}
      <div className="mb-32">
        <h1
          style={{
            margin: "0 0 8px 0",
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Complaint Management
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Efficiently track, manage, and resolve resident issues
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-grid" style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("var(--primary)")}>
              <MessageSquare size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              +2 this week
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>Total Complaints</span>
            <h3 style={styles.statValue}>{stats.total}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("#f59e0b")}>
              <AlertCircle size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#f59e0b",
                fontWeight: "500",
              }}
            >
              Requires attention
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>Pending</span>
            <h3 style={styles.statValue}>{stats.pending}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("var(--primary)")}>
              <Clock size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "var(--primary)",
                fontWeight: "500",
              }}
            >
              Active resolutions
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>In Progress</span>
            <h3 style={styles.statValue}>{stats.inProgress}</h3>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={styles.iconBox("#10b981")}>
              <CheckCircle size={24} />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#10b981",
                fontWeight: "500",
              }}
            >
              {Math.round((stats.resolved / stats.total) * 100 || 0)}% completed
            </span>
          </div>
          <div>
            <span style={styles.statLabel}>Resolved</span>
            <h3 style={styles.statValue}>{stats.resolved}</h3>
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div style={styles.controlsBar}>
        <div style={styles.searchBox}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by ID, Resident, Category..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterGroup}>
          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <Button
            variant="outline"
            style={{
              height: "42px",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
            }}
            icon={<Filter size={16} />}
            className="gap-16"
          >
            Advanced
          </Button>
          <Button
            variant="secondary"
            style={{
              height: "42px",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
            }}
            icon={<Download size={16} />}
            className="gap-16"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Modern Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            All Complaints
          </h3>
          <span
            style={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Showing {filteredComplaints.length} entries
          </span>
        </div>
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            className="table"
            style={{
              width: "100%",
              minWidth: "1000px",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "#f9fafb",
                }}
              >
                <th
                  style={{
                    width: "12%",
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  ID / Date
                </th>
                <th
                  style={{
                    width: "18%",
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  Resident
                </th>
                <th
                  style={{
                    width: "14%",
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    width: "26%",
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    width: "10%",
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  Priority
                </th>
                <th
                  style={{
                    width: "10%",
                    padding: "16px 24px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    width: "10%",
                    padding: "16px 24px",
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    letterSpacing: "0.05em",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      transition: "background-color 0.15s",
                    }}
                    className="hover:bg-gray-50"
                  >
                    <td
                      style={{
                        padding: "16px 24px",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {complaint.id}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                        className="mt-16"
                      >
                        {complaint.date}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        className="gap-16"
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#e0e7ff",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          {complaint.resident.charAt(0)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: "500",
                              color: "#374151",
                            }}
                          >
                            {complaint.resident.split("(")[0]}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                            }}
                          >
                            {complaint.resident.match(/\((.*?)\)/)?.[1] || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        verticalAlign: "middle",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 10px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "var(--radius-md)",
                          fontSize: "12px",
                          color: "#4b5563",
                          fontWeight: "500",
                        }}
                      >
                        {complaint.category}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "#4b5563",
                          maxWidth: "100%",
                          display: "block",
                        }}
                      >
                        {complaint.description}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        className="gap-16"
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: getPriorityColor(
                              complaint.priority,
                            ),
                          }}
                        ></div>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#374151",
                          }}
                        >
                          {complaint.priority}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td
                      style={{
                        padding: "16px 24px",
                        textAlign: "right",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                        className="gap-16"
                      >
                        <button
                          style={{
                            ...styles.rowActionBtn,
                            color: "var(--primary)",
                            backgroundColor: "#eff6ff",
                          }}
                          title="View Details"
                          onClick={() => handleViewDetails(complaint)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          style={{
                            ...styles.rowActionBtn,
                            color: "#ef4444",
                            backgroundColor: "#fef2f2",
                          }}
                          title="Delete"
                          onClick={() => handleDelete(complaint.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                    className="p-32"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      className="gap-16"
                    >
                      <Search
                        size={32}
                        style={{
                          opacity: 0.2,
                        }}
                      />
                      <p>No complaints found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Complaint Details"
      >
        {selectedComplaint && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
            className="gap-16"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #f3f4f6",
              }}
              className="pb-16"
            >
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    color: "#111827",
                  }}
                >
                  #{selectedComplaint.id}
                </h3>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Posted on {selectedComplaint.date}
                </p>
              </div>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
              className="gap-16"
            >
              <div>
                <label
                  style={{
                    display: "block",
                    textTransform: "uppercase",
                    fontSize: "11px",
                    color: "#9ca3af",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                  className="mb-16"
                >
                  Resident
                </label>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#111827",
                  }}
                >
                  {selectedComplaint.resident}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    textTransform: "uppercase",
                    fontSize: "11px",
                    color: "#9ca3af",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                  className="mb-16"
                >
                  Category
                </label>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#111827",
                  }}
                >
                  {selectedComplaint.category}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    textTransform: "uppercase",
                    fontSize: "11px",
                    color: "#9ca3af",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                  }}
                  className="mb-16"
                >
                  Priority
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="gap-16"
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: getPriorityColor(
                        selectedComplaint.priority,
                      ),
                    }}
                  ></div>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "var(--radius-md)",
              }}
              className="p-16"
            >
              <label
                style={{
                  display: "block",
                  textTransform: "uppercase",
                  fontSize: "11px",
                  color: "#9ca3af",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                }}
                className="mb-16"
              >
                Description
              </label>
              <p
                style={{
                  color: "#374151",
                  lineHeight: "1.5",
                }}
              >
                {selectedComplaint.description}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
              className="gap-16 mt-16"
            >
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary">Update Status</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default ComplaintManagement;
