import React, { useState, useEffect } from "react";
import {
  PageHeader,
  Card,
  Button,
  CardHeader,
  CardContent,
} from "../../components/ui";
import api from "../../services/api";
const VehicleEntry = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    vehicleNo: "",
    type: "Guest Vehicle",
    flat: "",
  });
  useEffect(() => {
    api
      .get("/api/security/vehicles")
      .then((res) => setVehicles(res.data || []))
      .catch((err) => console.error("Failed to load vehicles:", err));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/security/vehicles", form);
      setVehicles((prev) => [data, ...prev]);
      setForm({
        vehicleNo: "",
        type: "Guest Vehicle",
        flat: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to log vehicle entry.");
    }
  };
  return (
    <>
      <PageHeader
        title="Vehicle Entry"
        subtitle="Track incoming and outgoing vehicles"
      />

      <div
        className="grid-2 gap-24"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(350px, 1fr) 2fr",
        }}
      >
        <Card>
          <CardHeader title="Log Vehicle" />
          <CardContent>
            <form
              className="form gap-16"
              style={{
                display: "grid",
              }}
              onSubmit={handleSubmit}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="gap-16"
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Vehicle Number
                </label>
                <input
                  placeholder="MH 12 AB 1234"
                  required
                  className="form-input p-16"
                  style={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontSize: "14px",
                    width: "100%",
                  }}
                  value={form.vehicleNo}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      vehicleNo: e.target.value,
                    }))
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="gap-16"
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Type
                </label>
                <select
                  className="form-input p-16"
                  style={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontSize: "14px",
                    width: "100%",
                    background: "var(--bg-card)",
                  }}
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      type: e.target.value,
                    }))
                  }
                >
                  <option>Guest Vehicle</option>
                  <option>Delivery Vehicle</option>
                  <option>Cab / Taxi</option>
                  <option>Other</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="gap-16"
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Flat Number (Optional)
                </label>
                <input
                  placeholder="e.g. B-202"
                  className="form-input p-16"
                  style={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontSize: "14px",
                    width: "100%",
                  }}
                  value={form.flat}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      flat: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                variant="primary"
                type="submit"
                style={{
                  background: "var(--primary)",
                  width: "100%",
                }}
                className="mt-16"
              >
                Log Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Vehicle Log" />
          <CardContent className="p-0">
            <table
              className="table"
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col
                  style={{
                    width: "150px",
                  }}
                />
                <col
                  style={{
                    width: "140px",
                  }}
                />
                <col
                  style={{
                    width: "140px",
                  }}
                />
                <col />
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
                    }}
                    className="p-16"
                  >
                    Vehicle No.
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                    className="p-16"
                  >
                    Type
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                    className="p-16"
                  >
                    Entry Time
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                    className="p-16"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        color: "var(--text-secondary)",
                      }}
                      className="p-24"
                    >
                      No vehicles logged
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v, i) => (
                    <tr
                      key={v.id || i}
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        style={{
                          fontFamily: "monospace",
                          verticalAlign: "middle",
                        }}
                        className="p-16"
                      >
                        {v.vehicleNo}
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                        }}
                        className="p-16"
                      >
                        {v.type}
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                        }}
                        className="p-16"
                      >
                        {v.entryTime || v.time}
                      </td>
                      <td
                        style={{
                          verticalAlign: "middle",
                        }}
                        className="p-16"
                      >
                        <span
                          style={{
                            background: "#ecfdf5",
                            color: "#166534",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {v.status || "In Premises"}
                        </span>
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
export default VehicleEntry;
