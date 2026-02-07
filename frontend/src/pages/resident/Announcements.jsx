import React, { useState } from 'react';
import { PageHeader, Card } from '../../components/ui';
import './Announcements.css';

const Announcements = () => {
    // Mock Data
    const [announcements] = useState([
        {
            id: 1,
            title: 'Annual General Meeting',
            date: '15 Feb 2026',
            description: 'The AGM will be held at the Community Hall at 10:00 AM. All members are requested to attend. Agenda includes election of new committee members and approval of annual budget.'
        },
        {
            id: 2,
            title: 'Swimming Pool Maintenance',
            date: '10 Feb 2026',
            description: 'The swimming pool will be closed for maintenance from 10th Feb to 12th Feb. We apologize for the inconvenience.'
        },
        {
            id: 3,
            title: 'Ganesh Chaturthi Celebrations',
            date: '02 Feb 2026',
            description: 'Join us for the Ganesh Chaturthi celebrations starting from 5th Feb. Detailed schedule has been mailed to all residents.'
        }
    ]);

    if (!announcements || announcements.length === 0) {
        return (
            <>
                <PageHeader title="Announcements" subtitle="Updates and news from the society" />
                <div className="announcements-empty-state">
                    <h3>No announcements at the moment</h3>
                    <p>Check back later for updates.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader title="Announcements" subtitle="Updates and news from the society" />

            <div className="announcements-container">
                {announcements.map((item) => (
                    <div key={item.id} className="announcement-card">
                        <div className="announcement-header">
                            <h3 className="announcement-title">{item.title}</h3>
                            <span className="announcement-date">{item.date}</span>
                        </div>
                        <p className="announcement-description">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Announcements;
