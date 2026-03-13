import React, { useEffect, useState } from 'react';
import { PageHeader, Card, Button, StatusBadge, StatCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import {
    subscribeToResidentPreApprovals,
    createPreApproval,
    cancelPreApproval
} from '../../firebase/visitorService';
import Modal from '../../components/ui/Modal.jsx';
import { Plus, Trash2 } from 'lucide-react';
import './VisitorPreApproval.css';

const VisitorPreApproval = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [preApprovals, setPreApprovals] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, inProgress: 0 });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        visitorName: '',
        phone: '',
        dateOfVisit: '',
        startTime: '',
        endTime: '',
        purpose: ''
    });

    // Subscribe to resident's pre-approvals
    useEffect(() => {
        if (!user?.uid) {
            console.log('[VisitorPreApproval] Waiting for user auth...');
            return;
        }
        
        console.log('[VisitorPreApproval] Setting up subscription for user:', user.uid);
        
        const unsub = subscribeToResidentPreApprovals(user.uid, (data) => {
            console.log('[VisitorPreApproval] Real-time update received:', data);
            setPreApprovals(data);
            
            // Calculate stats
            const pending = data.filter(p => p.status === 'pending').length;
            const approved = data.filter(p => p.status === 'checked_in').length;
            const inProgress = data.filter(p => p.status === 'checked_out').length;
            
            console.log('[VisitorPreApproval] Stats:', { pending, approved, inProgress, total: data.length });
            setStats({ pending, approved, inProgress });
            setLoading(false);
        });
        
        return () => {
            console.log('[VisitorPreApproval] Cleaning up subscription');
            unsub();
        };
    }, [user?.uid]);

    const handleCreatePreApproval = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.visitorName || !formData.phone || !formData.dateOfVisit) {
            toast.error('Please fill all required fields', 'Error');
            return;
        }

        // Validate user is authenticated
        if (!user?.uid) {
            toast.error('You must be logged in to create a pre-approval', 'Error');
            console.error('User not authenticated:', user);
            return;
        }

        setIsSubmitting(true);
        try {
            const preApprovalData = {
                visitorName: formData.visitorName,
                phone: formData.phone,
                dateOfVisit: formData.dateOfVisit,
                startTime: formData.startTime || '10:00',
                endTime: formData.endTime || '18:00',
                purpose: formData.purpose || 'Visit',
                residentUid: user.uid,
                residentFlat: user.flatNumber || 'N/A',
                residentName: user.displayName || user.name || 'Resident'
            };
            
            console.log('Creating pre-approval with data:', preApprovalData);
            await createPreApproval(preApprovalData);
            
            toast.success(`Pre-approval created for ${formData.visitorName}!`, 'Visitor Added');
            setIsModalOpen(false);
            setFormData({
                visitorName: '',
                phone: '',
                dateOfVisit: '',
                startTime: '',
                endTime: '',
                purpose: ''
            });
        } catch (err) {
            console.error('Pre-approval creation error:', err);
            const errorMsg = err.message || 'Failed to create pre-approval. Check Firebase rules and authentication.';
            toast.error(errorMsg, 'Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async (preApprovalId) => {
        if (window.confirm('Cancel this pre-approval? Security will no longer allow this visitor.')) {
            try {
                await cancelPreApproval(preApprovalId);
                toast.success('Pre-approval cancelled', 'Cancelled');
            } catch (err) {
                toast.error('Failed to cancel pre-approval', 'Error');
            }
        }
    };

    const getStatusBadgeType = (status) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'approved': return 'Approved';
            case 'checked_in': return 'In Progress';
            case 'checked_out': return 'Completed';
            case 'cancelled': return 'Cancelled';
            case 'denied': return 'Cancelled';
            default: return 'Pending';
        }
    };

    return (
        <>
            <PageHeader
                title="Visitor Pre-Approvals"
                subtitle="Schedule and approve visitors in advance"
                action={<Button onClick={() => setIsModalOpen(true)} icon={<Plus size={16} />}>+ New Visitor</Button>}
            />

            {/* Stats */}
            <div className="vpa-stats-grid">
                <StatCard label="Pending Approvals" value={stats.pending} />
                <StatCard label="Checked In" value={stats.approved} />
                <StatCard label="Checked Out" value={stats.inProgress} />
                <StatCard label="Total Visitors" value={preApprovals.length} />
            </div>

            {/* Pre-Approvals List */}
            <Card>
                <div style={{ padding: '24px' }}>
                    <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600' }}>
                        Your Pre-Approvals
                    </h3>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                            Loading your pre-approvals...
                        </div>
                    ) : preApprovals.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                            <p>No pre-approvals yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="vpa-list">
                            {preApprovals.map(preApproval => (
                                <div key={preApproval.id} className="vpa-card">
                                    <div className="vpa-card-header">
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>
                                                {preApproval.visitorName}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                                                {preApproval.phone} • {preApproval.purpose}
                                            </p>
                                        </div>
                                        <StatusBadge status={getStatusBadgeType(preApproval.status)} />
                                    </div>

                                    <div className="vpa-card-details">
                                        <div className="vpa-detail-row">
                                            <span className="vpa-detail-label">Date of Visit:</span>
                                            <span className="vpa-detail-value">{preApproval.dateOfVisit}</span>
                                        </div>
                                        <div className="vpa-detail-row">
                                            <span className="vpa-detail-label">Time Window:</span>
                                            <span className="vpa-detail-value">{preApproval.startTime} - {preApproval.endTime}</span>
                                        </div>
                                        <div className="vpa-detail-row">
                                            <span className="vpa-detail-label">Approval Code:</span>
                                            <span className="vpa-detail-value monospace">{preApproval.approvalCode}</span>
                                        </div>
                                    </div>

                                    {preApproval.status === 'pending' && (
                                        <div className="vpa-card-actions">
                                            <button
                                                onClick={() => handleCancel(preApproval.id)}
                                                className="vpa-delete-btn"
                                                title="Cancel"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Create Pre-Approval Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule New Visitor"
            >
                <form className="vpa-form" onSubmit={handleCreatePreApproval}>
                    <div className="form-group">
                        <label>Visitor Name *</label>
                        <input
                            type="text"
                            value={formData.visitorName}
                            onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                            placeholder="Full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="10-digit phone"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Visit *</label>
                        <input
                            type="date"
                            value={formData.dateOfVisit}
                            onChange={(e) => setFormData({ ...formData, dateOfVisit: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>From Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>To Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Purpose of Visit</label>
                        <select
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        >
                            <option value="">Select purpose...</option>
                            <option value="Family Visit">Family Visit</option>
                            <option value="Friends">Friends</option>
                            <option value="Business">Business</option>
                            <option value="Delivery">Delivery</option>
                            <option value="Service">Service/Maintenance</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Pre-Approval'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default VisitorPreApproval;
