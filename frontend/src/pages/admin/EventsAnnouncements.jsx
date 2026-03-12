<<<<<<< HEAD
import React, { useState } from 'react';
import { PageHeader, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import {
    Bell, Calendar as CalendarIcon, Clock, AlertCircle,
    Wrench, Users, Info, Plus, MapPin, Megaphone
} from 'lucide-react';
import './EventsAnnouncements.css';

const EventsAnnouncements = () => {
    const toast = useToast();
    const [events, setEvents] = useState([
        { id: 1, title: 'Holi Celebration 2026', date: '25 Mar 2026', time: '10:00 AM', location: 'Club House Ground' },
        { id: 2, title: 'Annual General Meeting', date: '15 Apr 2026', time: '05:00 PM', location: 'Community Hall' },
        { id: 3, title: 'Yoga Workshop', date: 'Every Sunday', time: '07:00 AM', location: 'Garden Area' },
    ]);

    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Water Supply Maintenance', type: 'maintenance', date: '08 Feb 2026', message: 'Water supply will be disrupted from 2 PM to 5 PM due to tank cleaning.' },
        { id: 2, title: 'Lift Service Due', type: 'warning', date: '10 Feb 2026', message: 'Lift B-Wing will be under maintenance on 12th Feb.' },
        { id: 3, title: 'Garbage Collection Timing', type: 'info', date: '01 Feb 2026', message: 'Garbage collection trucks will now arrive at 8:30 AM instead of 9:00 AM.' },
    ]);

    const [createModal, setCreateModal] = useState(false);
    const [createType, setCreateType] = useState('event');
    const [form, setForm] = useState({ title: '', date: '', time: '', location: '', message: '', annType: 'info' });

    const handleCreate = (e) => {
        e.preventDefault();
        if (createType === 'event') {
            setEvents(prev => [...prev, { id: Date.now(), title: form.title, date: form.date, time: form.time, location: form.location }]);
            toast.success(`Event "${form.title}" created!`, 'Event Added');
        } else {
            setAnnouncements(prev => [{
                id: Date.now(),
                title: form.title,
                type: form.annType,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                message: form.message
            }, ...prev]);
            toast.success(`Notice "${form.title}" published!`, 'Notice Posted');
        }
        setCreateModal(false);
        setForm({ title: '', date: '', time: '', location: '', message: '', annType: 'info' });
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'meeting': return <Users size={20} />;
            case 'maintenance': return <Wrench size={20} />;
            case 'warning': return <AlertCircle size={20} />;
            case 'event': return <CalendarIcon size={20} />;
            case 'info': default: return <Info size={20} />;
        }
    };

    return (
        <div className="ea-dashboard">
            <PageHeader
                title="Events & Announcements"
                subtitle="Gate logs, registered vehicles, and visitor tracking"
                action={
                    <button className="ea-create-btn" onClick={() => setCreateModal(true)}>
                        <Plus size={16} /> Create New
                    </button>
                }
            />

            <div className="ea-kpis">
                <div className="ea-kpi-card">
                    <div className="ea-kpi-icon kpi-violet"><Megaphone size={18} /></div>
                    <div>
                        <div className="ea-kpi-value">{announcements.length}</div>
                        <div className="ea-kpi-label">Active Notices</div>
                    </div>
                </div>
                <div className="ea-kpi-card">
                    <div className="ea-kpi-icon kpi-blue"><CalendarIcon size={18} /></div>
                    <div>
                        <div className="ea-kpi-value">{events.length}</div>
                        <div className="ea-kpi-label">Upcoming Events</div>
                    </div>
                </div>
                <div className="ea-kpi-card">
                    <div className="ea-kpi-icon kpi-amber"><Clock size={18} /></div>
                    <div>
                        <div className="ea-kpi-value">24/7</div>
                        <div className="ea-kpi-label">Community Updates</div>
                    </div>
                </div>
            </div>

            <div className="ea-grid-2">

                <section className="ea-column">
                    <div className="ea-section-head">
                        <h2>Notice Board</h2>
                        <button
                            className="ea-outline-btn"
                            onClick={() => {
                            setAnnouncements([]);
                            toast.success('All notices archived successfully!', 'Archived');
                            }}
                        >
                            Archive All
                        </button>
                    </div>

                    <div className="ea-list">
                        {announcements.length === 0 ? (
                            <div className="ea-empty-state">
                                <div className="ea-empty-icon">
                                    <Bell size={32} />
                                </div>
                                <h3>No active notices</h3>
                                <p>You're all caught up!</p>
                            </div>
                        ) : (
                            announcements.map((notice, index) => (
                                <article key={notice.id} className={`ea-card ea-type-${notice.type || 'info'}`} style={{ animationDelay: `${index * 45}ms` }}>
                                    <div className="ea-icon-wrap">
                                        {getIconForType(notice.type)}
                                    </div>
                                    <div className="ea-content">
                                        <div className="ea-top-row">
                                            <h3 className="ea-title">{notice.title}</h3>
                                            <div className="ea-date-badge">
                                                <Clock size={12} /> {notice.date}
                                            </div>
                                        </div>
                                        <div className="ea-description">
                                            {notice.message}
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>

                <section className="ea-column">
                    <div className="ea-section-head">
                        <h2>Upcoming Events</h2>
                        <button className="ea-outline-btn" onClick={() => toast.info(`Showing all ${events.length} events`, 'All Events')}>
                            View All
                        </button>
                    </div>

                    <div className="ea-list">
                        {events.map((event, index) => (
                            <article key={event.id} className="ea-card ea-type-event" style={{ animationDelay: `${index * 60}ms` }}>
                                <div className="ea-icon-wrap ea-icon-event">
                                    <CalendarIcon size={20} />
                                </div>
                                <div className="ea-content">
                                    <div className="ea-top-row">
                                        <h3 className="ea-title">{event.title}</h3>
                                        <div className="ea-date-badge">
                                            <Clock size={12} /> {event.date}
                                        </div>
                                    </div>
                                    <div className="ea-meta-row">
                                        <span>
                                            <Clock size={14} /> {event.time}
                                        </span>
                                        <span>
                                            <MapPin size={14} /> {event.location}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

            </div>

            <Modal isOpen={createModal} title="Create New" onClose={() => setCreateModal(false)}>
                <form className="modal-form" onSubmit={handleCreate}>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={createType} onChange={e => setCreateType(e.target.value)}>
                            <option value="event">Society Event</option>
                            <option value="announcement">Notice / Announcement</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Holi Celebration" required />
                    </div>

                    {createType === 'event' ? (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. 25 Mar 2026" required />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <input type="text" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Club House" required />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Notice Type</label>
                                <select value={form.annType} onChange={e => setForm({ ...form, annType: e.target.value })}>
                                    <option value="info">General Information</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="warning">Alert/Warning</option>
                                    <option value="meeting">Meeting</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your notice message..." rows={4} required />
                            </div>
                        </>
                    )}
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setCreateModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Publish {createType === 'event' ? 'Event' : 'Notice'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
=======
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
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
};
export default EventsAnnouncements;
