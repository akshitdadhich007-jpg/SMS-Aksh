import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const EventsAnnouncements = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/events")
      .then((res) => {
        const all = res.data || [];
        setEvents(all.filter((e) => e.type === "event"));
        setAnnouncements(all.filter((e) => e.type === "announcement"));
      })
      .catch((err) => console.error("Failed to load events:", err))
      .finally(() => setLoading(false));
  }, []);
  const [createModal, setCreateModal] = useState(false);
  const [createType, setCreateType] = useState("event");
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    message: "",
  });
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/admin/events", {
        type: createType,
        title: form.title,
        date: form.date || undefined,
        time: form.time || undefined,
        location: form.location || undefined,
        message: form.message || undefined,
      });
      if (createType === "event") {
        setEvents((prev) => [...prev, data]);
        toast.success(`Event "${form.title}" created!`, "Event Added");
      } else {
        setAnnouncements((prev) => [data, ...prev]);
        toast.success(`Notice "${form.title}" published!`, "Notice Posted");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create entry.");
    }
    setCreateModal(false);
    setForm({
      title: "",
      date: "",
      time: "",
      location: "",
      message: "",
    });
  };
  return (
    <>
      <PageHeader
        title="Events & Announcements"
        subtitle="Manage society notices and gatherings"
        action={
          <Button variant="primary" onClick={() => setCreateModal(true)}>
            + Create New
          </Button>
        }
      />

      <div
        className="grid-2 gap-24"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        }}
      >
        {/* Events Section */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="mb-16"
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--primary)",
              }}
            >
              Upcoming Events
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info(`Showing all ${events.length} events`, "All Events")
              }
            >
              View All
            </Button>
          </div>
          <div>
            {events.map((event) => (
              <div
                key={event.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-light)",
                }}
                className="p-16 mb-16"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {event.title}
                  </h4>
                  <span
                    style={{
                      fontSize: "12px",
                      background: "white",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {event.date}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                  className="gap-16"
                >
                  <span>⏰ {event.time}</span>
                  <span>📍 {event.location}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Announcements Section */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="mb-16"
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--danger)",
              }}
            >
              Notice Board
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnnouncements([]);
                toast.success("All notices archived successfully!", "Archived");
              }}
            >
              Archive
            </Button>
          </div>
          <div>
            {announcements.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0",
                  color: "var(--text-secondary)",
                }}
              >
                <p
                  style={{
                    fontSize: "32px",
                  }}
                  className="mb-16"
                >
                  📋
                </p>
                <p>No active notices. All caught up!</p>
              </div>
            ) : (
              announcements.map((notice) => (
                <div
                  key={notice.id}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                  }}
                  className="p-16"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    className="mb-16"
                  >
                    <h5
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                      }}
                    >
                      {notice.title}
                    </h5>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {notice.date}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: "1.5",
                    }}
                  >
                    {notice.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Create Event/Announcement Modal */}
      <Modal
        isOpen={createModal}
        title="Create New"
        onClose={() => setCreateModal(false)}
      >
        <form className="modal-form" onSubmit={handleCreate}>
          <div className="form-group">
            <label>Type</label>
            <select
              value={createType}
              onChange={(e) => setCreateType(e.target.value)}
            >
              <option value="event">Event</option>
              <option value="announcement">Announcement / Notice</option>
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="e.g. Holi Celebration"
              required
            />
          </div>
          {createType === "event" ? (
            <>
              <div className="form-row">
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
                    placeholder="e.g. 25 Mar 2026"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        time: e.target.value,
                      })
                    }
                    placeholder="e.g. 10:00 AM"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g. Club House"
                  required
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
                placeholder="Write your notice message..."
                rows={4}
                required
              />
            </div>
          )}
          <div className="modal-actions">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setCreateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create {createType === "event" ? "Event" : "Notice"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default EventsAnnouncements;
