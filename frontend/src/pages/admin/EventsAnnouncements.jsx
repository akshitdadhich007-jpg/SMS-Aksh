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
};

export default EventsAnnouncements;
