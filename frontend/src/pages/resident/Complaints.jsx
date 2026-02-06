import React, { useState } from 'react';
import { PageHeader, Card, Button, StatusBadge } from '../../components/ui';

const Complaints = () => {
    // Mock Data
    const [complaints] = useState([
        { id: 'CMP-2026-001', category: 'Plumbing', description: 'Leaking tap in master bathroom', status: 'Pending', date: '04 Feb 2026' },
        { id: 'CMP-2026-002', category: 'Electrical', description: 'Corridor light not working near flat A-101', status: 'Resolved', date: '20 Jan 2026' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Complaint raised successfully! (Demo only)');
    };

    return (
        <>
            <PageHeader title="Complaints" subtitle="Raise issues and track their status" />

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '24px' }}>
                {/* Section 1: Raise Complaint */}
                <Card>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Raise a Complaint</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Category</label>
                            <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none' }}>
                                <option>Plumbing</option>
                                <option>Electrical</option>
                                <option>Security</option>
                                <option>Housekeeping</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Description</label>
                            <textarea
                                rows="4"
                                placeholder="Describe the issue in detail..."
                                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', background: 'var(--bg-card)', color: 'var(--text-primary)', resize: 'vertical', outline: 'none' }}
                            ></textarea>
                        </div>

                        <Button type="submit" style={{ width: '100%' }}>Submit Complaint</Button>
                    </form>
                </Card>

                {/* Section 2: My Complaints */}
                <Card>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>My Complaints</h3>
                    {complaints.length === 0 ? (
                        <div className="text-center p-8">
                            <p className="text-gray-500">No complaints raised yet.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <colgroup>
                                    <col style={{ width: '150px' }} />
                                    <col />
                                    <col style={{ width: '120px' }} />
                                </colgroup>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>ID</th>
                                        <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Details</th>
                                        <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '16px', fontWeight: '600', fontFamily: 'monospace', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{item.id}</td>
                                            <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.category}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.description}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.date}</div>
                                            </td>
                                            <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                                                <StatusBadge status={item.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
};

export default Complaints;
