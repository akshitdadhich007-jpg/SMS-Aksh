import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { subscribeToAllVisitors, subscribeToVisitorStats } from '../../firebase/visitorService';
import { subscribeToTodayAttendance } from '../../firebase/attendanceService';
import { subscribeToActiveEmergencies } from '../../firebase/emergencyService';

const SecurityDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [emergencyModal, setEmergencyModal] = useState(false);
    const { user } = useAuth();
    const societyId = user?.societyId || 'default-society';

    const [visitorCount, setVisitorCount] = useState(0);
    const [deliveryCount, setDeliveryCount] = useState(0);
    const [staffInside, setStaffInside] = useState(0);
    const [activeAlerts, setActiveAlerts] = useState(0);

    useEffect(() => {
        const unsubVisitors = subscribeToAllVisitors((items) => {
            setVisitorCount(items.length);
            setDeliveryCount(items.filter(v => (v.purpose || '').toLowerCase().includes('delivery')).length);
        });
        const unsubStats = subscribeToVisitorStats((stats) => {
            // not used directly yet but available for future KPIs
        });
        const unsubAttendance = subscribeToTodayAttendance(societyId, (items) => {
            setStaffInside(items.length);
        });
        const unsubEmergencies = subscribeToActiveEmergencies(societyId, (items) => {
            setActiveAlerts(items.length);
        });
        return () => {
            unsubVisitors && unsubVisitors();
            unsubStats && unsubStats();
            unsubAttendance && unsubAttendance();
            unsubEmergencies && unsubEmergencies();
        };
    }, [societyId]);

    const handleEmergencyAlert = () => {
        setEmergencyModal(false);
        toast.warning('Redirecting to Emergency Alerts screen.', '🚨 Emergency Alert');
        navigate('/security/emergency-alerts');
    };

    return (
        <>
            <PageHeader title="Security Dashboard" subtitle="Overview of gate activities" />

            <div className="quick-actions" style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button variant="primary" style={{ padding: '12px 20px' }} onClick={() => navigate('/security/visitors')}>Add Visitor Entry</Button>
                <Button variant="secondary" style={{ padding: '12px 20px' }} onClick={() => navigate('/security/preapproved')}>Pre-Approved Visitors</Button>
                <Button variant="danger" style={{ padding: '12px 20px' }} onClick={() => setEmergencyModal(true)}>🚨 Emergency Alert</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <Card>
                    <div style={{ padding: '4px' }}>
                        <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>Today's Summary</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--brand-blue)' }}>{visitorCount}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Visitors</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--success)' }}>{deliveryCount}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Deliveries</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--warning)' }}>{staffInside}</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Staff on Duty</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-light)', borderRadius: '10px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--danger)' }}>{activeAlerts}</div>
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
                                { time: '12:00 PM', text: 'Vehicle KA-01-AB-1234 entered', icon: '�' },
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
