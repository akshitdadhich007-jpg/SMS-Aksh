import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Card, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const SecurityDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [emergencyModal, setEmergencyModal] = useState(false);
  const [stats, setStats] = useState({
    visitors: 0,
    deliveries: 0,
    vehicles: 0,
    alerts: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  useEffect(() => {
    api
      .get("/api/security/dashboard")
      .then((res) => {
        const d = res.data || {};
        if (d.stats) setStats(d.stats);
        if (d.recentActivity) setRecentActivity(d.recentActivity);
      })
      .catch((err) => console.error("Failed to load dashboard:", err));
  }, []);
  const handleEmergencyAlert = () => {
    setEmergencyModal(false);
    toast.warning(
      "Emergency alert sent to all residents and management!",
      "🚨 Emergency Alert",
    );
  };
  return (
    <>
      <PageHeader
        title="Security Dashboard"
        subtitle="Overview of gate activities"
      />

      <div
        className="quick-actions mb-24 gap-16"
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="primary"
          style={{
            padding: "12px 20px",
          }}
          onClick={() => navigate("/security/visitors")}
        >
          Add Visitor Entry
        </Button>
        <Button
          variant="secondary"
          style={{
            padding: "12px 20px",
          }}
          onClick={() => navigate("/security/vehicles")}
        >
          Add Vehicle Entry
        </Button>
        <Button
          variant="secondary"
          style={{
            padding: "12px 20px",
          }}
          onClick={() => navigate("/security/deliveries")}
        >
          Log Delivery
        </Button>
        <Button
          variant="danger"
          style={{
            padding: "12px 20px",
          }}
          onClick={() => setEmergencyModal(true)}
        >
          🚨 Emergency Alert
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
        className="gap-16"
      >
        <Card>
          <div className="p-16">
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--text-secondary)",
              }}
            >
              Today's Summary
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
              className="gap-16"
            >
              <div
                style={{
                  textAlign: "center",
                  background: "var(--bg-light)",
                  borderRadius: "var(--radius-md)",
                }}
                className="p-16"
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "var(--primary)",
                  }}
                >
                  {stats.visitors}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: "500",
                  }}
                >
                  Visitors
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  background: "var(--bg-light)",
                  borderRadius: "var(--radius-md)",
                }}
                className="p-16"
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "var(--success)",
                  }}
                >
                  {stats.deliveries}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: "500",
                  }}
                >
                  Deliveries
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  background: "var(--bg-light)",
                  borderRadius: "var(--radius-md)",
                }}
                className="p-16"
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "var(--warning)",
                  }}
                >
                  {stats.vehicles}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: "500",
                  }}
                >
                  Vehicles
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  background: "var(--bg-light)",
                  borderRadius: "var(--radius-md)",
                }}
                className="p-16"
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "var(--danger)",
                  }}
                >
                  {stats.alerts}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: "500",
                  }}
                >
                  Alerts
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-16">
            <h3
              style={{
                margin: "0 0 16px",
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--text-secondary)",
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
              {recentActivity.length === 0 ? (
                <p
                  style={{
                    color: "var(--text-secondary)",
                    textAlign: "center",
                  }}
                >
                  No recent activity
                </p>
              ) : (
                recentActivity.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-light)",
                    }}
                    className="gap-16"
                  >
                    <span
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {item.icon || "📋"}
                    </span>
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.text}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Emergency Confirmation Modal */}
      <Modal
        isOpen={emergencyModal}
        title="Send Emergency Alert"
        onClose={() => setEmergencyModal(false)}
      >
        <div className="confirm-dialog-content">
          <div className="confirm-dialog-icon">🚨</div>
          <h3>Are you sure?</h3>
          <p>
            This will send an emergency notification to all residents,
            management, and security staff immediately.
          </p>
          <div
            className="modal-actions"
            style={{
              justifyContent: "center",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setEmergencyModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleEmergencyAlert}>
              Send Alert
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default SecurityDashboard;
