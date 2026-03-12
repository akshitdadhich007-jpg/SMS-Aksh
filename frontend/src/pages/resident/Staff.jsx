import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button, StatusBadge } from "../../components/ui";
import { User, Phone, Briefcase } from "lucide-react";
import api from "../../services/api";
const Staff = () => {
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    api
      .get("/api/resident/staff")
      .then((res) => setStaff(res.data || []))
      .catch((err) => console.error("Failed to load staff:", err));
  }, []);
  if (!staff || staff.length === 0) {
    return (
      <>
        <PageHeader title="Staff & Services" subtitle="Contact society staff" />
        <Card className="text-center p-8">
          <h3 className="text-lg font-semibold text-gray-700">
            No staff information available
          </h3>
          <p className="text-gray-500 mt-2">
            Please contact the society office for assistance.
          </p>
        </Card>
      </>
    );
  }
  return (
    <>
      <PageHeader title="Staff & Services" subtitle="Contact society staff" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
        className="gap-24"
      >
        {staff.map((person) => (
          <Card key={person.id} className="hover:shadow-md transition-shadow">
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
              className="gap-16 mb-16"
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--bg-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                }}
              >
                <User size={28} />
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                  }}
                >
                  {person.name}
                </h3>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="gap-16 mt-16"
                >
                  <Briefcase size={14} /> {person.role}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              className="mb-16"
            >
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "13px",
                  fontWeight: "500",
                  background:
                    person.status === "On Duty" || person.status === "Available"
                      ? "#dcfce7"
                      : "#fee2e2",
                  color:
                    person.status === "On Duty" || person.status === "Available"
                      ? "#166534"
                      : "#991b1b",
                }}
              >
                {person.status}
              </span>
            </div>

            <a
              href={`tel:${person.contact}`}
              style={{
                textDecoration: "none",
              }}
            >
              <Button
                variant="outline"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
                className="gap-16"
              >
                <Phone size={16} /> Call {person.name.split(" ")[0]}
              </Button>
            </a>
          </Card>
        ))}
      </div>
    </>
  );
};
export default Staff;
