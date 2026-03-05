import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const ExpenseTracker = () => {
  const toast = useToast();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/expenses")
      .then((res) => setExpenses(res.data || []))
      .catch((err) => console.error("Failed to load expenses:", err))
      .finally(() => setLoading(false));
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const openAddModal = () => {
    setEditingExpense(null);
    setForm({
      category: "",
      amount: "",
      date: "",
      description: "",
    });
    setModalOpen(true);
  };
  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setForm({
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date,
      description: expense.description,
    });
    setModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        const { data } = await api.put(
          `/api/admin/expenses/${editingExpense.id}`,
          {
            ...form,
            amount: parseInt(form.amount),
          },
        );
        setExpenses((prev) =>
          prev.map((ex) => (ex.id === editingExpense.id ? data : ex)),
        );
        toast.success("Expense updated successfully!", "Expense Updated");
      } else {
        const { data } = await api.post("/api/admin/expenses", {
          ...form,
          amount: parseInt(form.amount),
        });
        setExpenses((prev) => [data, ...prev]);
        toast.success(
          `₹${parseInt(form.amount).toLocaleString()} expense added under ${form.category}!`,
          "Expense Added",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    }
    setModalOpen(false);
  };
  return (
    <>
      <PageHeader
        title="Expense Tracker"
        subtitle="Monitor society spending"
        action={
          <Button variant="primary" onClick={openAddModal}>
            + Add Expense
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
                  }}
                  className="p-16"
                >
                  Category
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
                  Description
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                  className="p-16"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
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
                    {expense.category}
                  </td>
                  <td
                    style={{
                      fontWeight: "600",
                    }}
                    className="p-16"
                  >
                    ₹{expense.amount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                    }}
                    className="p-16"
                  >
                    {expense.date}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                    }}
                    className="p-16"
                  >
                    {expense.description}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                    }}
                    className="p-16"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditModal(expense)}
                    >
                      Edit
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
        title={editingExpense ? "Edit Expense" : "Add New Expense"}
        onClose={() => setModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                required
              >
                <option value="">Select category</option>
                <option value="Salaries">Salaries</option>
                <option value="Utilities">Utilities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Events">Events</option>
                <option value="Security">Security</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: e.target.value,
                  })
                }
                placeholder="e.g. 15000"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              placeholder="e.g. 05 Feb 2026"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Brief description of the expense"
              rows={3}
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
              {editingExpense ? "Save Changes" : "Add Expense"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default ExpenseTracker;
