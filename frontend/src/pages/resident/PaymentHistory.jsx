import React, { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge } from "../../components/ui";
import api from "../../services/api";
const PaymentHistory = () => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    api
      .get("/api/resident/payments")
      .then((res) => setHistory(res.data || []))
      .catch((err) => console.error("Failed to load history:", err));
  }, []);

  // Empty state logic
  if (!history || history.length === 0) {
    return (
      <>
        <PageHeader
          title="Payment History"
          subtitle="View your past transactions"
        />
        <Card className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-700">
            No previous payments found
          </h3>
          <p className="text-gray-500 mt-2">
            Once you make a payment, it will appear here.
          </p>
        </Card>
      </>
    );
  }
  return (
    <>
      <PageHeader
        title="Payment History"
        subtitle="View your past transactions"
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
              <col
                style={{
                  width: "200px",
                }}
              />
              <col
                style={{
                  width: "150px",
                }}
              />
              <col
                style={{
                  width: "150px",
                }}
              />
              <col
                style={{
                  width: "150px",
                }}
              />
              <col
                style={{
                  width: "120px",
                }}
              />
            </colgroup>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  textAlign: "left",
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
                  Month
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="p-16"
                >
                  Amount
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="p-16"
                >
                  Mode
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="p-16"
                >
                  Date
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
              {history.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                    transition: "background 0.2s",
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
                    {item.month}
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "600",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    ₹{item.amount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {item.mode}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {item.date}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <StatusBadge status={item.status} />
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
export default PaymentHistory;
