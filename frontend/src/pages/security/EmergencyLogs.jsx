import React, { useState } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import { TriangleAlert } from "lucide-react";
const EmergencyLogs = () => {
  const toast = useToast();
  const [drillModal, setDrillModal] = useState(false);
  const [drills, setDrills] = useState([]);
  const handleDrill = () => {
    const now = new Date();
    setDrills((prev) => [
      {
        id: Date.now(),
        type: "Manual Drill",
        time: now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        date: now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      },
      ...prev,
    ]);
    setDrillModal(false);
    toast.warning(
      "Emergency drill triggered! All personnel notified.",
      "🔔 Drill Triggered",
    );
  };
  return (
    <>
      <PageHeader
        title="Emergency Logs"
        subtitle="History of alarms and alerts"
      />

      {drills.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            background: "var(--background)",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--border)",
          }}
          className="p-48"
        >
          <TriangleAlert
            size={48}
            style={{
              color: "var(--text-secondary)",
            }}
            className="mb-16"
          />
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "var(--text-primary)",
              margin: "0 0 8px",
            }}
          >
            No recent emergencies
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              margin: "0 0 24px",
            }}
          >
            All systems running normal.
          </p>
          <Button variant="danger" onClick={() => setDrillModal(true)}>
            🔔 Trigger Manual Drill
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-24">
            <Button variant="danger" onClick={() => setDrillModal(true)}>
              🔔 Trigger Manual Drill
            </Button>
          </div>
          <Card>
            <h3
              style={{
                margin: "0 0 16px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Drill History
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              className="gap-16"
            >
              {drills.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "var(--radius-md)",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                  }}
                  className="gap-16 p-16"
                >
                  <span
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    🔔
                  </span>
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#991b1b",
                      }}
                    >
                      {d.type}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#b91c1c",
                      }}
                    >
                      {d.date} at {d.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      <Modal
        isOpen={drillModal}
        title="Trigger Emergency Drill"
        onClose={() => setDrillModal(false)}
      >
        <div className="confirm-dialog-content">
          <div className="confirm-dialog-icon">🔔</div>
          <h3>Start Emergency Drill?</h3>
          <p>
            This will notify all security staff and log a drill event. No
            resident alerts will be sent.
          </p>
          <div
            className="modal-actions"
            style={{
              justifyContent: "center",
            }}
          >
            <Button variant="secondary" onClick={() => setDrillModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDrill}>
              Start Drill
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default EmergencyLogs;
