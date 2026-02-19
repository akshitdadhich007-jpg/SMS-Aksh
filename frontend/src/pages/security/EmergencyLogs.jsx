import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import { TriangleAlert } from 'lucide-react';

const EmergencyLogs = () => {
    const toast = useToast();
    const [drillModal, setDrillModal] = useState(false);
    const [drills, setDrills] = useState([]);

    const handleDrill = () => {
        const now = new Date();
        setDrills(prev => [{
            id: Date.now(),
            type: 'Manual Drill',
            time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        }, ...prev]);
        setDrillModal(false);
        toast.warning('Emergency drill triggered! All personnel notified.', '🔔 Drill Triggered');
    };

    return (
        <>
            <PageHeader title="Emergency Logs" subtitle="History of alarms and alerts" />

            {drills.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px', flexDirection: 'column', alignItems: 'center', background: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                    <TriangleAlert size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 8px' }}>No recent emergencies</h3>
                    <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px' }}>All systems running normal.</p>
                    <Button variant="danger" onClick={() => setDrillModal(true)}>🔔 Trigger Manual Drill</Button>
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: '24px' }}>
                        <Button variant="danger" onClick={() => setDrillModal(true)}>🔔 Trigger Manual Drill</Button>
                    </div>
                    <Card>
                        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>Drill History</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {drills.map(d => (
                                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca' }}>
                                    <span style={{ fontSize: '20px' }}>🔔</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#991b1b' }}>{d.type}</div>
                                        <div style={{ fontSize: '12px', color: '#b91c1c' }}>{d.date} at {d.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}

            <Modal isOpen={drillModal} title="Trigger Emergency Drill" onClose={() => setDrillModal(false)}>
                <div className="confirm-dialog-content">
                    <div className="confirm-dialog-icon">🔔</div>
                    <h3>Start Emergency Drill?</h3>
                    <p>This will notify all security staff and log a drill event. No resident alerts will be sent.</p>
                    <div className="modal-actions" style={{ justifyContent: 'center' }}>
                        <Button variant="secondary" onClick={() => setDrillModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDrill}>Start Drill</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EmergencyLogs;
