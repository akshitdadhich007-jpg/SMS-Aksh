import React, { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const StaffManagement = () => {
  const toast = useToast();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/staff")
      .then((res) => setStaffList(res.data || []))
      .catch((err) => console.error("Failed to load staff:", err))
      .finally(() => setLoading(false));
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    salary: "",
    status: "Pending",
  });
  const openAddModal = () => {
    setEditingStaff(null);
    setForm({
      name: "",
      role: "",
      salary: "",
      status: "Pending",
    });
    setModalOpen(true);
  };
  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setForm({
      name: staff.name,
      role: staff.role,
      salary: String(staff.salary),
      status: staff.status,
    });
    setModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const { data } = await api.put(`/api/admin/staff/${editingStaff.id}`, {
          ...form,
          salary: parseInt(form.salary),
        });
        setStaffList((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? data : s)),
        );
        toast.success(`${form.name}'s details updated!`, "Staff Updated");
      } else {
        const { data } = await api.post("/api/admin/staff", {
          ...form,
          salary: parseInt(form.salary),
        });
        setStaffList((prev) => [data, ...prev]);
        toast.success(`${form.name} added as ${form.role}!`, "Employee Added");
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
        title="Staff & Salaries"
        subtitle="Manage employees and payroll"
        action={
          <Button variant="primary" onClick={openAddModal}>
            + Add Employee
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
                  Name
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="p-16"
                >
                  Role
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="p-16"
                >
                  Salary
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  className="p-16"
                >
                  Payment Status
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
              {staffList.map((staff) => (
                <tr
                  key={staff.id}
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
                    {staff.name}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                    }}
                    className="p-16"
                  >
                    {staff.role}
                  </td>
                  <td
                    style={{
                      fontWeight: "600",
                      fontFamily: "monospace",
                    }}
                    className="p-16"
                  >
                    ₹{staff.salary.toLocaleString()}
                  </td>
                  <td className="p-16">
                    <StatusBadge status={staff.status} />
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
                      onClick={() => openEditModal(staff)}
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
        title={editingStaff ? "Edit Employee" : "Add New Employee"}
        onClose={() => setModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Employee name"
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
                required
              >
                <option value="">Select role</option>
                <option value="Security Guard">Security Guard</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Gardener">Gardener</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Monthly Salary (₹)</label>
              <input
                type="number"
                value={form.salary}
                onChange={(e) =>
                  setForm({
                    ...form,
                    salary: e.target.value,
                  })
                }
                placeholder="e.g. 15000"
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
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
              {editingStaff ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default StaffManagement;
