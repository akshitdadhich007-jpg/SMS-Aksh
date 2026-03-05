import React, { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const ResidentManagement = () => {
  const toast = useToast();
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [form, setForm] = useState({
    name: "",
    flat: "",
    email: "",
    phone: "",
    status: "Active",
  });
  useEffect(() => {
    fetchResidents();
  }, []);
  const fetchResidents = async () => {
    try {
      const { data } = await api.get("/api/admin/residents");
      setResidents(data);
    } catch (err) {
      console.error("Failed to load residents:", err);
      toast.error("Failed to load residents");
    } finally {
      setLoading(false);
    }
  };
  const openAddModal = () => {
    setEditingResident(null);
    setForm({
      name: "",
      flat: "",
      email: "",
      phone: "",
      status: "Active",
    });
    setModalOpen(true);
  };
  const openEditModal = (resident) => {
    setEditingResident(resident);
    setForm({
      name: resident.name,
      flat: resident.flat,
      email: resident.email,
      phone: resident.phone || "",
      status: resident.status,
    });
    setModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResident) {
        const { data } = await api.put(
          `/api/admin/residents/${editingResident.id}`,
          form,
        );
        setResidents((prev) =>
          prev.map((r) => (r.id === editingResident.id ? data : r)),
        );
        toast.success(
          `${form.name}'s details updated successfully!`,
          "Resident Updated",
        );
      } else {
        const { data } = await api.post("/api/admin/residents", form);
        setResidents((prev) => [data, ...prev]);
        toast.success(
          `${form.name} added to flat ${form.flat}!`,
          "Resident Added",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Operation failed. Please try again.");
    }
    setModalOpen(false);
  };
  if (loading) {
    return (
      <>
        <PageHeader
          title="Resident Management"
          subtitle="Manage flats and residents"
        />
        <Card className="text-center p-12">
          <p>Loading residents…</p>
        </Card>
      </>
    );
  }
  if (!residents || residents.length === 0) {
    return (
      <>
        <PageHeader
          title="Resident Management"
          subtitle="Manage flats and residents"
        />
        <Card className="text-center p-12">
          <h3 className="text-lg font-semibold text-gray-700">
            No residents found
          </h3>
          <p className="text-gray-500 mt-2">
            Get started by adding a new resident.
          </p>
          <Button variant="primary" onClick={openAddModal} className="mt-16">
            + Add Resident
          </Button>
        </Card>
      </>
    );
  }
  return (
    <>
      <PageHeader
        title="Resident Management"
        subtitle="Manage flats and residents"
        action={
          <Button variant="primary" onClick={openAddModal}>
            + Add Resident
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
                    verticalAlign: "middle",
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
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Flat Number
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
                  Email
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
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {residents.map((resident) => (
                <tr
                  key={resident.id}
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
                    {resident.name}
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {resident.flat}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {resident.email}
                  </td>
                  <td
                    style={{
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <StatusBadge status={resident.status} />
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditModal(resident)}
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
        title={editingResident ? "Edit Resident" : "Add New Resident"}
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
                placeholder="e.g. Raj Kumar"
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
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                placeholder="9876543210"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
              {editingResident ? "Save Changes" : "Add Resident"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default ResidentManagement;
