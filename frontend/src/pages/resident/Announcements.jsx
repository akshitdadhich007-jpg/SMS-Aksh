import React, { useState } from 'react';
import { PageHeader, Card } from '../../components/ui';

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
                <Card className="text-center p-8">
                    <h3 className="text-lg font-semibold text-gray-700">No announcements at the moment</h3>
                    <p className="text-gray-500 mt-2">Check back later for updates.</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader title="Announcements" subtitle="Updates and news from the society" />

            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {announcements.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--brand-dark)' }}>{item.title}</h3>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'var(--bg-light)', padding: '6px 12px', borderRadius: '20px', fontWeight: '500' }}>{item.date}</span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '15px' }}>
                            {item.description}
                        </p>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default Announcements;
