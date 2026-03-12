import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Card, StatusBadge, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import api from "../../services/api";
const PaymentRecords = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/payments")
      .then((res) => setPayments(res.data || []))
      .catch((err) => console.error("Failed to load payments:", err))
      .finally(() => setLoading(false));
  }, []);
  if (!payments || payments.length === 0) {
    return (
      <>
        <PageHeader
          title="Payments & Collections"
          subtitle="View transaction history"
        />
        <Card className="text-center p-12">
          <h3 className="text-lg font-semibold text-gray-700">
            No payments recorded
          </h3>
          <p className="text-gray-500 mt-2">
            Transactions will appear here once processed.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/admin/bills")}
            className="mt-16"
          >
            Record Payment
          </Button>
        </Card>
      </>
    );
  }
  return (
    <>
      <PageHeader
        title="Payments & Collections"
        subtitle="View transaction history"
        action={
          <Button
            variant="secondary"
            onClick={() =>
              toast.success(
                "Payment ledger downloaded as PDF!",
                "Ledger Downloaded",
              )
            }
          >
            📥 Download Ledger
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
                  Resident
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
                  Amount
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
                  Mode
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
                  Date
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
              {payments.map((payment) => (
                <tr
                  key={payment.id}
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
                    {payment.resident}
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {payment.flat}
                  </td>
                  <td
                    style={{
                      fontWeight: "600",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {payment.mode}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {payment.date}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <StatusBadge status={payment.status} />
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
export default PaymentRecords;
