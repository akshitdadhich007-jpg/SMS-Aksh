import React, { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge, Button } from "../../components/ui";
import api from "../../services/api";
const VehicleVisitorLog = () => {
  const [vehicles, setVehicles] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.allSettled([
      api.get("/api/admin/vehicles"),
      api.get("/api/security/visitors"),
    ])
      .then(([vehRes, visRes]) => {
        if (vehRes.status === "fulfilled") setVehicles(vehRes.value.data || []);
        if (visRes.status === "fulfilled") setVisitors(visRes.value.data || []);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <PageHeader
        title="Vehicles & Visitors"
        subtitle="Gate logs and registry"
      />

      <div
        className="grid-1 gap-24"
        style={{
          display: "grid",
        }}
      >
        {/* Registered Vehicles */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="mb-16"
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Registered Vehicles
            </h3>
            <Button variant="secondary" size="sm">
              Export List
            </Button>
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
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col />
                <col />
                <col />
                <col />
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
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Owner
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Vehicle No
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Type
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Sticker ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr
                    key={v.id}
                    style={{
                      borderBottom: "1px solid var(--border-light)",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {v.flat}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {v.owner}
                    </td>
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
                      {v.stickerId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Visitor Logs */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="mb-16"
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              Recent Visitors
            </h3>
            <Button variant="secondary" size="sm">
              View All Logs
            </Button>
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
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col />
                <col />
                <col />
                <col />
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
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Visitor
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Host
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    In-Time
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Out-Time
                  </th>
                  <th
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr
                    key={v.id}
                    style={{
                      borderBottom: "1px solid var(--border-light)",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: "500",
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {v.name}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {v.host}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {v.inTime}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {v.outTime}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "12px",
                          fontWeight: "600",
                          background:
                            v.status === "Inside"
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(107, 114, 128, 0.1)",
                          color:
                            v.status === "Inside"
                              ? "var(--success)"
                              : "var(--text-secondary)",
                        }}
                      >
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};
export default VehicleVisitorLog;
