import React, { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge } from "../../components/ui";
import api from "../../services/api";
const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/shops")
      .then((res) => setShops(res.data || []))
      .catch((err) => console.error("Failed to load shops:", err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <PageHeader
        title="Shop Management"
        subtitle="Overview of commercial units"
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
                  Shop Name
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
                  Owner
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
                  Contact
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
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr
                  key={shop.id}
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
                    {shop.name}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {shop.owner}
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {shop.contact}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <StatusBadge status={shop.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};
export default ShopManagement;
