import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';

const SecurityDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [emergencyModal, setEmergencyModal] = useState(false);

    const handleEmergencyAlert = () => {
        setEmergencyModal(false);
        toast.warning('Emergency alert sent to all residents and management!', '🚨 Emergency Alert');
    };

    return (
        <>
            <PageHeader title="Security Dashboard" subtitle="Overview of gate activities" />

            <div className="quick-actions" style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button variant="primary" style={{ padding: '12px 20px' }} onClick={() => navigate('/security/visitors')}>Add Visitor Entry</Button>
                <Button variant="secondary" style={{ padding: '12px 20px' }} onClick={() => navigate('/security/vehicles')}>Add Vehicle Entry</Button>
                <Button variant="secondary" style={{ padding: '12px 20px' }} onClick={() => navigate('/security/deliveries')}>Log Delivery</Button>
                <Button variant="danger" style={{ padding: '12px 20px' }} onClick={() => setEmergencyModal(true)}>🚨 Emergency Alert</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <Card>
                    <div style={{ padding: '4px' }}>
                        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Today's Summary</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--brand-blue)' }}>12</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Visitors</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)' }}>8</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Deliveries</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--warning)' }}>5</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Vehicles</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--danger)' }}>0</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Alerts</div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ padding: '4px' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Recent Activity</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { time: '2:30 PM', text: 'Visitor Rahul checked in — Flat A-101', icon: '👤' },
                                { time: '1:15 PM', text: 'Amazon delivery logged — Flat B-205', icon: '📦' },
                                { time: '12:00 PM', text: 'Vehicle KA-01-AB-1234 entered', icon: '🚗' },
                                { time: '10:30 AM', text: 'Pre-approved visitor Anita arrived', icon: '✅' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-light)' }}>
                                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{item.text}</div>
                                    </div>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Emergency Confirmation Modal */}
            <Modal isOpen={emergencyModal} title="Send Emergency Alert" onClose={() => setEmergencyModal(false)}>
                <div className="confirm-dialog-content">
                    <div className="confirm-dialog-icon">🚨</div>
                    <h3>Are you sure?</h3>
                    <p>This will send an emergency notification to all residents, management, and security staff immediately.</p>
                    <div className="modal-actions" style={{ justifyContent: 'center' }}>
                        <Button variant="secondary" onClick={() => setEmergencyModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleEmergencyAlert}>Send Alert</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SecurityDashboard;
