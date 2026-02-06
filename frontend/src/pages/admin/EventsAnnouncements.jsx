import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';

const EventsAnnouncements = () => {
    // Mock Data
    const [events] = useState([
        { id: 1, title: 'Holi Celebration 2026', date: '25 Mar 2026', time: '10:00 AM', location: 'Club House Ground' },
        { id: 2, title: 'Annual General Meeting', date: '15 Apr 2026', time: '05:00 PM', location: 'Community Hall' },
        { id: 3, title: 'Yoga Workshop', date: 'Every Sunday', time: '07:00 AM', location: 'Garden Area' },
    ]);

    const [announcements] = useState([
        { id: 1, title: 'Water Supply Maintenance', date: '08 Feb 2026', message: 'Water supply will be disrupted from 2 PM to 5 PM due to tank cleaning.' },
        { id: 2, title: 'Lift Service Due', date: '10 Feb 2026', message: 'Lift B-Wing will be under maintenance on 12th Feb.' },
        { id: 3, title: 'Garbage Collection Timing', date: '01 Feb 2026', message: 'Garbage collection trucks will now arrive at 8:30 AM instead of 9:00 AM.' },
    ]);

    return (
        <>
            <PageHeader
                title="Events & Announcements"
                subtitle="Manage society notices and gatherings"
                action={<Button variant="primary">Create New</Button>}
            />

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>

                {/* Events Section */}
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--brand-blue)' }}>Upcoming Events</h3>
                        <Button variant="outline" size="sm">View All</Button>
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
                        <Button variant="outline" size="sm">Archive</Button>
                    </div>
                    <div>
                        {announcements.map((notice) => (
                            <div key={notice.id} style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{notice.title}</h5>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{notice.date}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{notice.message}</p>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </>
    );
};

export default EventsAnnouncements;
