import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const EventsAnnouncements = () => {
    const toast = useToast();
    const [events, setEvents] = useState([
        { id: 1, title: 'Holi Celebration 2026', date: '25 Mar 2026', time: '10:00 AM', location: 'Club House Ground' },
        { id: 2, title: 'Annual General Meeting', date: '15 Apr 2026', time: '05:00 PM', location: 'Community Hall' },
        { id: 3, title: 'Yoga Workshop', date: 'Every Sunday', time: '07:00 AM', location: 'Garden Area' },
    ]);

    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Water Supply Maintenance', date: '08 Feb 2026', message: 'Water supply will be disrupted from 2 PM to 5 PM due to tank cleaning.' },
        { id: 2, title: 'Lift Service Due', date: '10 Feb 2026', message: 'Lift B-Wing will be under maintenance on 12th Feb.' },
        { id: 3, title: 'Garbage Collection Timing', date: '01 Feb 2026', message: 'Garbage collection trucks will now arrive at 8:30 AM instead of 9:00 AM.' },
    ]);

    const [createModal, setCreateModal] = useState(false);
    const [createType, setCreateType] = useState('event');
    const [form, setForm] = useState({ title: '', date: '', time: '', location: '', message: '' });

    const handleCreate = (e) => {
        e.preventDefault();
        if (createType === 'event') {
            setEvents(prev => [...prev, { id: Date.now(), title: form.title, date: form.date, time: form.time, location: form.location }]);
            toast.success(`Event "${form.title}" created!`, 'Event Added');
        } else {
            setAnnouncements(prev => [{ id: Date.now(), title: form.title, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), message: form.message }, ...prev]);
            toast.success(`Notice "${form.title}" published!`, 'Notice Posted');
        }
        setCreateModal(false);
        setForm({ title: '', date: '', time: '', location: '', message: '' });
    };

    return (
        <>
            <PageHeader
                title="Events & Announcements"
                subtitle="Manage society notices and gatherings"
                action={<Button variant="primary" onClick={() => setCreateModal(true)}>+ Create New</Button>}
            />

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>

                {/* Events Section */}
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--brand-blue)' }}>Upcoming Events</h3>
                        <Button variant="outline" size="sm" onClick={() => toast.info(`Showing all ${events.length} events`, 'All Events')}>View All</Button>
                    </div>
                    <div>
                        {events.map((event) => (
                            <div key={event.id} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '12px', background: 'var(--bg-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{event.title}</h4>
                                    <span style={{ fontSize: '12px', background: 'white', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--border)' }}>{event.date}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <span>⏰ {event.time}</span>
                                    <span>📍 {event.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Announcements Section */}
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--danger)' }}>Notice Board</h3>
                        <Button variant="outline" size="sm" onClick={() => {
                            setAnnouncements([]);
                            toast.success('All notices archived successfully!', 'Archived');
                        }}>Archive</Button>
                    </div>
                    <div>
                        {announcements.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
                                <p style={{ fontSize: '32px', marginBottom: '8px' }}>📋</p>
                                <p>No active notices. All caught up!</p>
                            </div>
                        ) : (
                            announcements.map((notice) => (
                                <div key={notice.id} style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{notice.title}</h5>
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{notice.date}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{notice.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

            </div>

            {/* Create Event/Announcement Modal */}
            <Modal isOpen={createModal} title="Create New" onClose={() => setCreateModal(false)}>
                <form className="modal-form" onSubmit={handleCreate}>
                    <div className="form-group">
                        <label>Type</label>
                        <select value={createType} onChange={e => setCreateType(e.target.value)}>
                            <option value="event">Event</option>
                            <option value="announcement">Announcement / Notice</option>
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
                        <div className="form-group">
                            <label>Message</label>
                            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your notice message..." rows={4} required />
                        </div>
                    )}
                    <div className="modal-actions">
                        <Button variant="secondary" type="button" onClick={() => setCreateModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Create {createType === 'event' ? 'Event' : 'Notice'}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default EventsAnnouncements;
