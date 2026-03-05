import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const CommitteeManagement = () => {
  const toast = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/committee")
      .then((res) => setMembers(res.data || []))
      .catch((err) => console.error("Failed to load committee:", err))
      .finally(() => setLoading(false));
  }, []);
  const [viewMember, setViewMember] = useState(null);
  const [roleModal, setRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({
    memberId: "",
    position: "",
  });
  const handleRoleUpdate = async (e) => {
    e.preventDefault();
    const id = roleForm.memberId;
    try {
      const { data } = await api.put(`/api/admin/committee/${id}/role`, {
        position: roleForm.position,
      });
      setMembers((prev) => prev.map((m) => (m.id === id ? data : m)));
      toast.success(`Role updated to ${roleForm.position}!`, "Role Updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role.");
    }
    setRoleModal(false);
  };
  return (
    <>
      <PageHeader
        title="Managing Committee"
        subtitle="Society governing body members"
        action={
          <Button variant="secondary" onClick={() => setRoleModal(true)}>
            🔄 Update Roles
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
                  Position
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
                  Email
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
              {members.map((member) => (
                <tr
                  key={member.id}
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
                    {member.name}
                  </td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: "var(--primary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {member.position}
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {member.contact}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {member.email}
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
                      onClick={() => setViewMember(member)}
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

      {/* View Member Modal */}
      <Modal
        isOpen={!!viewMember}
        title={viewMember?.name}
        onClose={() => setViewMember(null)}
      >
        {viewMember && (
          <div className="detail-grid">
            <div className="detail-label">Name</div>
            <div className="detail-value">{viewMember.name}</div>
            <div className="detail-label">Position</div>
            <div
              className="detail-value"
              style={{
                color: "var(--primary)",
                fontWeight: "bold",
              }}
            >
              {viewMember.position}
            </div>
            <div className="detail-label">Contact</div>
            <div
              className="detail-value"
              style={{
                fontFamily: "monospace",
              }}
            >
              {viewMember.contact}
            </div>
            <div className="detail-label">Email</div>
            <div className="detail-value">{viewMember.email}</div>
          </div>
        )}
      </Modal>

      {/* Update Role Modal */}
      <Modal
        isOpen={roleModal}
        title="Update Member Role"
        onClose={() => setRoleModal(false)}
      >
        <form className="modal-form" onSubmit={handleRoleUpdate}>
          <div className="form-group">
            <label>Select Member</label>
            <select
              value={roleForm.memberId}
              onChange={(e) =>
                setRoleForm({
                  ...roleForm,
                  memberId: e.target.value,
                })
              }
              required
            >
              <option value="">Choose member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.position}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>New Position</label>
            <select
              value={roleForm.position}
              onChange={(e) =>
                setRoleForm({
                  ...roleForm,
                  position: e.target.value,
                })
              }
              required
            >
              <option value="">Select position</option>
              <option value="Chairman">Chairman</option>
              <option value="Secretary">Secretary</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Member">Member</option>
            </select>
          </div>
          <div className="modal-actions">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setRoleModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Role
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default CommitteeManagement;
