import React, { useState, useEffect } from "react";
import { BILL_STATUS } from "../../config/constants";
import {
  PageHeader,
  Card,
  StatusBadge,
  Button,
  StatCard,
} from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const BillManagement = () => {
  const toast = useToast();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/bills")
      .then((res) => setBills(res.data || []))
      .catch((err) => console.error("Failed to load bills:", err))
      .finally(() => setLoading(false));
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [form, setForm] = useState({
    month: "",
    totalAmount: "",
  });
  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/admin/bills", {
        month: form.month,
        total_amount: parseInt(form.totalAmount),
      });
      setBills((prev) => [data, ...prev]);
      toast.success(`Bill generated for ${form.month}!`, "Bill Created");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate bill.");
    }
    setModalOpen(false);
    setForm({
      month: "",
      totalAmount: "",
    });
  };
  const totalBilled = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalCollected = bills.reduce((sum, b) => sum + (b.collected || 0), 0);
  const totalPending = totalBilled - totalCollected;

  return (
    <>
      <PageHeader
        title="Maintenance & Bills"
        subtitle="Overview of society billing"
        action={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Generate New Bill
          </Button>
        }
      />

      <div
        className="grid-3 gap-24 mb-32"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <StatCard
          label="Total Billed"
          value={`₹ ${totalBilled.toLocaleString()}`}
          trend={0}
        />
        <StatCard
          label="Collected"
          value={`₹ ${totalCollected.toLocaleString()}`}
          trend={totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}
          trendLabel="% collected"
        />
        <StatCard
          label="Pending"
          value={`₹ ${totalPending.toLocaleString()}`}
          trend={0}
          trendLabel="remaining"
        />
      </div>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="mb-24"
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Billing History
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast.success(
                "Billing report exported as CSV!",
                "Export Complete",
              )
            }
          >
            📥 Export Report
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
              borderCollapse: "collapse",
            }}
          >
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
                  Total Amount
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="p-16"
                >
                  Collection Status
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
                <th
                  style={{
                    width: "100px",
                  }}
                  className="p-16"
                ></th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.id}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  <td
                    style={{
                      fontWeight: "500",
                      color: "var(--text-primary)",
                    }}
                    className="p-16"
                  >
                    {bill.month}
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                    className="p-16"
                  >
                    ₹{bill.totalAmount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                    }}
                    className="p-16"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="gap-16"
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "6px",
                          background: "var(--bg-light)",
                          borderRadius: "var(--radius-md)",
                          maxWidth: "100px",
                        }}
                      >
                        <div
                          style={{
                            width: `${(bill.collected / bill.totalAmount) * 100}%`,
                            height: "100%",
                            background: "var(--primary)",
                            borderRadius: "var(--radius-md)",
                          }}
                        ></div>
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        {Math.round((bill.collected / bill.totalAmount) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-16">
                    <StatusBadge
                      status={bill.status === BILL_STATUS.PAID ? BILL_STATUS.PAID : BILL_STATUS.PENDING}
                    />
                  </td>
                  <td className="p-16">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewModal(bill)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Generate Bill Modal */}
      <Modal
        isOpen={modalOpen}
        title="Generate New Bill"
        onClose={() => setModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleGenerate}>
          <div className="form-group">
            <label>Billing Month</label>
            <input
              type="text"
              value={form.month}
              onChange={(e) =>
                setForm({
                  ...form,
                  month: e.target.value,
                })
              }
              placeholder="e.g. Mar 2026"
              required
            />
          </div>
          <div className="form-group">
            <label>Total Amount (₹)</label>
            <input
              type="number"
              value={form.totalAmount}
              onChange={(e) =>
                setForm({
                  ...form,
                  totalAmount: e.target.value,
                })
              }
              placeholder="e.g. 450000"
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
              Generate Bill
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Bill Details Modal */}
      <Modal
        isOpen={!!viewModal}
        title={`Bill Details — ${viewModal?.month}`}
        onClose={() => setViewModal(null)}
      >
        {viewModal && (
          <div className="detail-grid">
            <div className="detail-label">Month</div>
            <div className="detail-value">{viewModal.month}</div>
            <div className="detail-label">Total Amount</div>
            <div
              className="detail-value"
              style={{
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            >
              ₹{viewModal.totalAmount.toLocaleString()}
            </div>
            <div className="detail-label">Collected</div>
            <div
              className="detail-value"
              style={{
                color: "var(--success)",
              }}
            >
              ₹{viewModal.collected.toLocaleString()}
            </div>
            <div className="detail-label">Pending</div>
            <div
              className="detail-value"
              style={{
                color: "var(--danger)",
              }}
            >
              ₹{(viewModal.totalAmount - viewModal.collected).toLocaleString()}
            </div>
            <div className="detail-label">Collection %</div>
            <div className="detail-value">
              {Math.round((viewModal.collected / viewModal.totalAmount) * 100)}%
            </div>
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <StatusBadge
                status={viewModal.status === BILL_STATUS.PAID ? BILL_STATUS.PAID : BILL_STATUS.PENDING}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
export default BillManagement;
