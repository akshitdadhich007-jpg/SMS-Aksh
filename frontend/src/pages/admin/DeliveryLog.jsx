import React, { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const DeliveryLog = () => {
  const toast = useToast();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/deliveries")
      .then((res) => setDeliveries(res.data || []))
      .catch((err) => console.error("Failed to load deliveries:", err))
      .finally(() => setLoading(false));
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    courier: "",
    flat: "",
    date: "",
  });
  const handleLogDelivery = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/admin/deliveries", {
        ...form,
      });
      setDeliveries((prev) => [data, ...prev]);
      toast.success(
        `Delivery from ${form.courier} logged for flat ${form.flat}!`,
        "Delivery Logged",
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to log delivery.");
    }
    setModalOpen(false);
    setForm({
      courier: "",
      flat: "",
      date: "",
    });
  };
  const handleNotify = async (delivery) => {
    try {
      await api.put(`/api/admin/deliveries/${delivery.id}/notify`);
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === delivery.id
            ? {
                ...d,
                status: "notified",
              }
            : d,
        ),
      );
      toast.info(
        `Notification sent to flat ${delivery.flat} about ${delivery.courier} delivery!`,
        "Notification Sent",
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notification.");
    }
  };
  return (
    <>
      <PageHeader
        title="Deliveries"
        subtitle="Package tracking and gate logs"
        action={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Log Delivery
          </Button>
        }
      />

      <Card>
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            className="table"
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col
                style={{
                  width: "96px",
                }}
              />
            </colgroup>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Courier
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Flat
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Date & Time
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Status
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  <td
                    style={{
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {delivery.courier}
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {delivery.flat}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {delivery.date}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <StatusBadge status={delivery.status} />
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleNotify(delivery)}
                    >
                      Notify
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        title="Log New Delivery"
        onClose={() => setModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleLogDelivery}>
          <div className="form-row">
            <div className="form-group">
              <label>Courier / Platform</label>
              <input
                type="text"
                value={form.courier}
                onChange={(e) =>
                  setForm({
                    ...form,
                    courier: e.target.value,
                  })
                }
                placeholder="e.g. Amazon, Flipkart"
                required
              />
            </div>
            <div className="form-group">
              <label>Flat Number</label>
              <input
                type="text"
                value={form.flat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    flat: e.target.value,
                  })
                }
                placeholder="e.g. A-101"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              placeholder="e.g. 06 Feb 2026, 10:00 AM"
              required
            />
          </div>
          <div className="modal-actions">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Delivery
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default DeliveryLog;
