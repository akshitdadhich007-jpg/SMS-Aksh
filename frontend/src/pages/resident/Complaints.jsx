import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Button, StatusBadge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { submitComplaint, subscribeToResidentComplaints } from '../../firebase/complaintService';
import './Complaints.css';

const Complaints = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ category: 'Plumbing', description: '' });

    // Subscribe to resident's complaints
    useEffect(() => {
        if (!user?.uid) return;
        const unsub = subscribeToResidentComplaints(user.uid, (data) => {
            setComplaints(data);
            setLoading(false);
        });
        return () => unsub();
    }, [user?.uid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description.trim()) {
            toast.error('Please describe your complaint', 'Error');
            return;
        }
        setSubmitting(true);
        try {
            await submitComplaint({
                category: formData.category,
                description: formData.description,
                residentUid: user.uid,
                residentName: user.name || 'Resident',
                residentFlat: user.flatNumber || 'N/A',
            });
            toast.success('Complaint submitted successfully!', 'Complaint Raised');
            setFormData({ category: 'Plumbing', description: '' });
        } catch (err) {
            toast.error('Failed to submit complaint', 'Error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader title="Complaints" subtitle="Raise issues and track their status — updates in real-time" />

            <div className="complaints-grid">
                {/* Section 1: Raise Complaint Form */}
                <div className="complaint-form-card">
                    <h3>Raise a Complaint</h3>
                    <form onSubmit={handleSubmit} className="complaint-form">
                        <div className="form-group">
                            <label>Category</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                <option>Plumbing</option>
                                <option>Electrical</option>
                                <option>Security</option>
                                <option>Housekeeping</option>
                                <option>Maintenance</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the issue in detail..."
                                rows={5}
                            ></textarea>
                        </div>

                        <Button type="submit" disabled={submitting} className="complaint-submit-btn">
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </Button>
                    </form>
                </div>

                {/* Section 2: My Complaints List */}
                <div className="complaints-list-card">
                    <h3>My Complaints</h3>
                    {loading ? (
                        <div className="complaints-loading">
                            <p>Loading your complaints...</p>
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className="complaints-empty-state">
                            <p>No complaints raised yet. Submit one above to get started!</p>
                        </div>
                    ) : (
                        <div className="complaint-cards-list">
                            {complaints.map((item) => (
                                <div key={item.id} className="complaint-card">
                                    <div className="complaint-card-header">
                                        <span className="complaint-category-badge">{item.category}</span>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <p className="complaint-card-desc">{item.description}</p>
                                    <div className="complaint-card-footer">
                                        <span className="complaint-card-id">#{item.id.substring(0, 8).toUpperCase()}</span>
                                        <span className="complaint-card-date">{item.displayDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Complaints;
