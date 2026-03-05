import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  PageHeader,
  Card,
  Button,
  CardHeader,
  CardContent,
  StatusBadge,
} from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
const VisitorEntry = () => {
  const toast = useToast();
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    purpose: "",
    flat: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/api/security/visitors');
      // Filter to only show active visitors, or recent ones depending on preference.
      // Assuming the backend returns the latest 50. Let's filter for active ones primarily.
      setVisitors(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch visitors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/security/visitor/checkin', {
        name: form.name,
        phone: "N/A", // Add phone to form if needed, hardcoding for now based on previous UI
        flat: form.flat,
        purpose: form.purpose,
        vehicle_number: ""
      });

      toast.success(
        `${form.name} checked in for flat ${form.flat}!`,
        "Visitor Checked In",
      );

      setForm({
        name: "",
        purpose: "",
        flat: "",
      });

      fetchVisitors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to check in");
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await api.put('/api/security/visitor/checkout', { id });
      toast.info(`Visitor checked out`, "Visitor Left");
      fetchVisitors();
    } catch (err) {
      toast.error("Failed to check out visitor");
    }
  };

  return (
    <>
      <PageHeader title="Visitor Entry" subtitle="Log and manage visitors" />

      <div
        className="grid-2 gap-24"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Card>
          <CardHeader title="New Visitor Log" />
          <CardContent>
            <form className="modal-form" onSubmit={handleCheckIn}>
              <div className="form-group">
                <label>Visitor Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Purpose</label>
                <input
                  type="text"
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      purpose: e.target.value,
                    })
                  }
                  placeholder="Purpose of visit"
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
              <Button
                variant="primary"
                type="submit"
                style={{
                  width: "100%",
                  background: "var(--success)",
                  border: "none",
                }}
                className="mt-16"
              >
                ✅ Check In Visitor
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Recent Visitors" />
          <CardContent>
            {isLoading ? (
              <div style={{ color: "var(--text-secondary)", textAlign: "center" }} className="p-24">
                Loading visitors...
              </div>
            ) : visitors.length === 0 ? (
              <div
                style={{
                  color: "var(--text-secondary)",
                  textAlign: "center",
                }}
                className="p-24"
              >
                No active visitors at the moment.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="gap-16"
              >
                {visitors.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      background: "var(--bg-light)",
                    }}
                    className="gap-16 p-16"
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, var(--primary), var(--primary))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                        flexShrink: 0,
                      }}
                    >
                      {v.visitor_name.charAt(0).toUpperCase()}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "var(--text-primary)",
                        }}
                      >
                        {v.visitor_name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {v.purpose} • Flat {v.flat} • {new Date(v.check_in).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {!v.check_out ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckOut(v.id)}
                      >
                        Check Out
                      </Button>
                    ) : (
                      <StatusBadge status="Left" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default VisitorEntry;
