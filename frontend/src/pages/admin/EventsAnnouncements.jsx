import React, { useState, useEffect } from 'react';
import { PageHeader, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import {
    Bell, Calendar as CalendarIcon, Clock, AlertCircle,
    Wrench, Users, Info, Plus, MapPin, Megaphone, Trash2
} from 'lucide-react';
import { postAnnouncement, deleteAnnouncement, subscribeToAnnouncements } from '../../firebase/announcementService';
import './EventsAnnouncements.css';

const EventsAnnouncements = () => {
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModal, setCreateModal] = useState(false);
    const [createType, setCreateType] = useState('event');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', date: '', time: '', location: '', message: '', annType: 'info' });

    useEffect(() => {
        const unsub = subscribeToAnnouncements((data) => {
            setItems(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const events = items.filter(i => i.category === 'event');
    const announcements = items.filter(i => i.category === 'notice');

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (createType === 'event') {
                await postAnnouncement({
                    category: 'event',
                    type: 'event',
                    title: form.title,
                    date: form.date,
                    time: form.time,
                    location: form.location,
                    message: `${form.date} at ${form.time} — ${form.location}`,
                });
                toast.success(`Event "${form.title}" created!`, 'Event Added');
            } else {
                await postAnnouncement({
                    category: 'notice',
                    type: form.annType,
                    title: form.title,
                    message: form.message,
                });
                toast.success(`Notice "${form.title}" published!`, 'Notice Posted');
            }
            setCreateModal(false);
            setForm({ title: '', date: '', time: '', location: '', message: '', annType: 'info' });
        } catch {
            toast.error('Failed to publish. Try again.', 'Error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, title) => {
        try {
            await deleteAnnouncement(id);
            toast.success(`"${title}" removed`, 'Deleted');
        } catch {
            toast.error('Delete failed. Try again.', 'Error');
        }
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
                subtitle="Post notices and events — residents see them instantly in real-time"
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
                        <div className="ea-kpi-value">Live</div>
                        <div className="ea-kpi-label">Real-Time Updates</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Loading announcements...
                </div>
            ) : (
                <div className="ea-grid-2">

                    <section className="ea-column">
                        <div className="ea-section-head">
                            <h2>Notice Board</h2>
                        </div>

                        <div className="ea-list">
                            {announcements.length === 0 ? (
                                <div className="ea-empty-state">
                                    <div className="ea-empty-icon">
                                        <Bell size={32} />
                                    </div>
                                    <h3>No active notices</h3>
                                    <p>Click "Create New" to post a notice!</p>
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
                                                    <Clock size={12} /> {notice.displayDate}
                                                </div>
                                            </div>
                                            <div className="ea-description">
                                                {notice.message}
                                            </div>
                                        </div>
                                        <button
                                            className="ea-delete-btn"
                                            onClick={() => handleDelete(notice.id, notice.title)}
                                            title="Delete notice"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="ea-column">
                        <div className="ea-section-head">
                            <h2>Upcoming Events</h2>
                        </div>

                        <div className="ea-list">
                            {events.length === 0 ? (
                                <div className="ea-empty-state">
                                    <div className="ea-empty-icon"><CalendarIcon size={32} /></div>
                                    <h3>No events yet</h3>
                                    <p>Click "Create New" to add an event!</p>
                                </div>
                            ) : (
                                events.map((event, index) => (
                                    <article key={event.id} className="ea-card ea-type-event" style={{ animationDelay: `${index * 60}ms` }}>
                                        <div className="ea-icon-wrap ea-icon-event">
                                            <CalendarIcon size={20} />
                                        </div>
                                        <div className="ea-content">
                                            <div className="ea-top-row">
                                                <h3 className="ea-title">{event.title}</h3>
                                                <div className="ea-date-badge">
                                                    <Clock size={12} /> {event.date || event.displayDate}
                                                </div>
                                            </div>
                                            <div className="ea-meta-row">
                                                {event.time && <span><Clock size={14} /> {event.time}</span>}
                                                {event.location && <span><MapPin size={14} /> {event.location}</span>}
                                            </div>
                                        </div>
                                        <button
                                            className="ea-delete-btn"
                                            onClick={() => handleDelete(event.id, event.title)}
                                            title="Delete event"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                </div>
            )}

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
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? 'Publishing...' : `Publish ${createType === 'event' ? 'Event' : 'Notice'}`}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EventsAnnouncements;
