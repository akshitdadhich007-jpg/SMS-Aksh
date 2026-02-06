import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';

const CommitteeManagement = () => {
    // Mock Data
    const [members] = useState([
        { id: 1, name: 'Dr. Vivek S', position: 'Chairman', contact: '9876543210', email: 'chairman@society.com' },
        { id: 2, name: 'Mr. Raj Kumar', position: 'Secretary', contact: '9123456789', email: 'secretary@society.com' },
        { id: 3, name: 'Mrs. Priya Sharma', position: 'Treasurer', contact: '9898989898', email: 'treasurer@society.com' },
        { id: 4, name: 'Mr. Ankit Verma', position: 'Member', contact: '8765432109', email: 'ankit.v@society.com' },
        { id: 5, name: 'Ms. Neha Gupta', position: 'Member', contact: '7654321098', email: 'neha.g@society.com' },
    ]);

    return (
        <>
            <PageHeader
                title="Managing Committee"
                subtitle="Society governing body members"
                action={<Button variant="secondary">Update Roles</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                            <col style={{ width: '96px' }} />
                        </colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Name</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Position</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Contact</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Email</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{member.name}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--brand-blue)', verticalAlign: 'middle' }}>{member.position}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', verticalAlign: 'middle' }}>{member.contact}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{member.email}</td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default CommitteeManagement;
