import React, { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge } from "../../components/ui";
import api from "../../services/api";
const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  useEffect(() => {
    api
      .get("/api/security/deliveries")
      .then((res) => setDeliveries(res.data || []))
      .catch((err) => console.error("Failed to load deliveries:", err));
  }, []);
  return (
    <>
      <PageHeader title="Deliveries" subtitle="Manage incoming packages" />

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
                  Status
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
                  Time
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
                  Gate Keeper
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                    className="p-24"
                  >
                    No deliveries logged
                  </td>
                </tr>
              ) : (
                deliveries.map((d, i) => (
                  <tr
                    key={d.id || i}
                    style={{
                      borderBottom: "1px solid var(--border-light)",
                    }}
                  >
                    <td
                      style={{
                        color: "var(--text-primary)",
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {d.courier}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {d.flat}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      <StatusBadge status={d.status} />
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {d.time}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                      }}
                      className="p-16"
                    >
                      {d.gateKeeper}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
export default Deliveries;
