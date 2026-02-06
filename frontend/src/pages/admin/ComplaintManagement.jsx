import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';

const ComplaintManagement = () => {
    // Mock Data
    const [complaints] = useState([
        { id: 'CMP-2026-001', resident: 'Raj Kumar (A-101)', category: 'Plumbing', description: 'Leaking pipe in master bedroom bathroom', status: 'Pending' },
        { id: 'CMP-2026-002', resident: 'Anita Desai (B-205)', category: 'Electrical', description: 'Corridor light flickering outside unit', status: 'Resolved' },
        { id: 'CMP-2026-003', resident: 'Vikram Singh (C-304)', category: 'Noise', description: 'Loud music from club house late night', status: 'Resolved' },
        { id: 'CMP-2026-004', resident: 'Suresh Raina (A-202)', category: 'Cleanliness', description: 'Staircase not swept for 2 days', status: 'In Progress' },
    ]);

    return (
        <>
            <PageHeader
                title="Complaint Management"
                subtitle="Track and resolve resident issues"
            />

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
                {/* Stats Row could go here if needed, but keeping it simple as per request */}

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Recent Complaints</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button variant="outline" size="sm">Filter</Button>
                            <Button variant="secondary" size="sm">Export</Button>
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                            <colgroup>
                                <col />
                                <col />
                                <col />
                                <col />
                                <col />
                                <col style={{ width: '96px' }} />
                            </colgroup>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>ID</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Resident</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Category</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Description</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((c) => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                        <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: '600', color: 'var(--brand-blue)', verticalAlign: 'middle' }}>{c.id}</td>
                                        <td style={{ padding: '16px', fontWeight: '500', verticalAlign: 'middle' }}>{c.resident}</td>
                                        <td style={{ padding: '16px', verticalAlign: 'middle' }}>{c.category}</td>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{c.description}</td>
                                        <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={c.status} /></td>
                                        <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                            <Button variant="secondary" size="sm">Update</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ComplaintManagement;
