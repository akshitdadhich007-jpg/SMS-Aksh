import React, { useState } from 'react';
import { PageHeader, Card, Button, StatusBadge } from '../../components/ui';
import { User, Phone, Briefcase } from 'lucide-react';

const Staff = () => {
    // Mock Data
    const [staff] = useState([
        { id: 1, name: 'Ramesh Kumar', role: 'Security Guard', contact: '9876543210', status: 'On Duty' },
        { id: 2, name: 'Suresh Patil', role: 'Plumber', contact: '9876543212', status: 'Available' },
        { id: 3, name: 'Mina Devi', role: 'Housekeeping', contact: '9876543213', status: 'On Leave' },
        { id: 4, name: 'Rajesh Singh', role: 'Electrician', contact: '9876543214', status: 'Available' },
    ]);

    if (!staff || staff.length === 0) {
        return (
            <>
                <PageHeader title="Staff & Services" subtitle="Contact society staff" />
                <Card className="text-center p-8">
                    <h3 className="text-lg font-semibold text-gray-700">No staff information available</h3>
                    <p className="text-gray-500 mt-2">Please contact the society office for assistance.</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader title="Staff & Services" subtitle="Contact society staff" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {staff.map((person) => (
                    <Card key={person.id} className="hover:shadow-md transition-shadow">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: 'var(--bg-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--brand-blue)'
                            }}>
                                <User size={28} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{person.name}</h3>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                    <Briefcase size={14} /> {person.role}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '500',
                                background: person.status === 'On Duty' || person.status === 'Available' ? '#dcfce7' : '#fee2e2',
                                color: person.status === 'On Duty' || person.status === 'Available' ? '#166534' : '#991b1b'
                            }}>
                                {person.status}
                            </span>
                        </div>

                        <a href={`tel:${person.contact}`} style={{ textDecoration: 'none' }}>
                            <Button variant="outline" style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <Phone size={16} /> Call {person.name.split(' ')[0]}
                            </Button>
                        </a>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default Staff;
