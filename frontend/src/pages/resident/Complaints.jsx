import React, { useState } from 'react';
import { PageHeader, Card, Button, StatusBadge } from '../../components/ui';
import './Complaints.css';

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

            <div className="complaints-grid">
                {/* Section 1: Raise Complaint */}
                <div className="complaint-form-card">
                    <h3>Raise a Complaint</h3>
                    <form onSubmit={handleSubmit} className="complaint-form">
                        <div className="form-group">
                            <label>Category</label>
                            <select>
                                <option>Plumbing</option>
                                <option>Electrical</option>
                                <option>Security</option>
                                <option>Housekeeping</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                placeholder="Describe the issue in detail..."
                            ></textarea>
                        </div>

                        <Button type="submit" className="complaint-submit-btn">Submit Complaint</Button>
                    </form>
                </div>

                {/* Section 2: My Complaints */}
                <div className="complaints-list-card">
                    <h3>My Complaints</h3>
                    {complaints.length === 0 ? (
                        <div className="complaints-empty-state">
                            <p>No complaints raised yet.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="complaints-table">
                                <colgroup>
                                    <col style={{ width: '140px' }} />
                                    <col />
                                    <col style={{ width: '130px' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Details</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map((item) => (
                                        <tr key={item.id}>
                                            <td className="complaint-id">{item.id}</td>
                                            <td>
                                                <div className="complaint-details">
                                                    <div className="complaint-category">{item.category}</div>
                                                    <div className="complaint-description">{item.description}</div>
                                                    <div className="complaint-date">{item.date}</div>
                                                </div>
                                            </td>
                                            <td className="complaint-status-cell">
                                                <StatusBadge status={item.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Complaints;
