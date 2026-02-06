import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';

const ResidentManagement = () => {
    // Mock Data
    const [residents] = useState([
        { id: 1, name: 'Raj Kumar', flat: 'A-101', email: 'raj.k@example.com', status: 'Active' },
        { id: 2, name: 'Anita Desai', flat: 'B-205', email: 'anita.d@example.com', status: 'Active' },
        { id: 3, name: 'Vikram Singh', flat: 'C-304', email: 'vikram.s@example.com', status: 'Inactive' },
        { id: 4, name: 'Suresh Raina', flat: 'A-202', email: 'suresh.r@example.com', status: 'Active' },
    ]);

    // Empty state check
    if (!residents || residents.length === 0) {
        return (
            <>
                <PageHeader title="Resident Management" subtitle="Manage flats and residents" />
                <Card className="text-center p-12">
                    <h3 className="text-lg font-semibold text-gray-700">No residents found</h3>
                    <p className="text-gray-500 mt-2">Get started by adding a new resident.</p>
                    <Button variant="primary" style={{ marginTop: '16px' }}>Add Resident</Button>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Resident Management"
                subtitle="Manage flats and residents"
                action={<Button variant="primary">Add Resident</Button>}
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
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Flat Number</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Email</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.map((resident) => (
                                <tr key={resident.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{resident.name}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold', verticalAlign: 'middle' }}>{resident.flat}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{resident.email}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={resident.status} /></td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm">Edit</Button>
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

export default ResidentManagement;
