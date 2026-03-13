import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader, Card, Button, StatusBadge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import {
    subscribeToActiveEmergencies,
    subscribeToAllEmergencies,
    updateEmergencyStatus,
} from '../../firebase/emergencyService';
import {
    AlertTriangle,
    Siren,
    ShieldAlert,
    Clock,
    MapPin,
    CheckCircle2,
} from 'lucide-react';

const EmergencyAlerts = () => {
    const { user } = useAuth();
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [history, setHistory] = useState([]);
    const societyId = user?.societyId || 'default-society';

    useEffect(() => {
        const unsubActive = subscribeToActiveEmergencies(societyId, setActiveAlerts);
        const unsubHistory = subscribeToAllEmergencies(societyId, setHistory);
        return () => {
            unsubActive && unsubActive();
            unsubHistory && unsubHistory();
        };
    }, [societyId]);

    const stats = useMemo(() => {
        const total = history.length;
        const active = activeAlerts.length;
        const acknowledged = history.filter(e => e.status === 'ACKNOWLEDGED').length;
        const resolved = history.filter(e => e.status === 'RESOLVED').length;
        return { total, active, acknowledged, resolved };
    }, [activeAlerts, history]);

    const handleAcknowledge = async (alert) => {
        try {
            await updateEmergencyStatus(alert.id, 'ACKNOWLEDGED', {
                acknowledgedBy: user?.id || 'security',
            });
        } catch (err) {
            console.error('Failed to acknowledge emergency', err);
        }
    };

    const handleResolve = async (alert) => {
        try {
            await updateEmergencyStatus(alert.id, 'RESOLVED', {
                resolvedBy: user?.id || 'security',
            });
        } catch (err) {
            console.error('Failed to resolve emergency', err);
        }
    };

    return (
        <>
            <PageHeader
                title="Emergency Alerts"
                subtitle="Live emergency feed and history"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 999, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Siren size={22} color="#dc2626" />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600, color: '#b91c1c', letterSpacing: '.08em' }}>Active</div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.active}</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 999, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldAlert size={22} color="#16a34a" />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600, color: '#166534', letterSpacing: '.08em' }}>Acknowledged</div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.acknowledged}</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 999, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 size={22} color="#2563eb" />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, textTransform: 'uppercase', fontWeight: 600, color: '#1d4ed8', letterSpacing: '.08em' }}>Resolved</div>
                            <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.resolved}</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.3fr)', gap: 20 }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={{ margin: 0, fontSize: 16 }}>Live Emergency Feed</h3>
                        <StatusBadge status={stats.active > 0 ? 'Active' : 'Resolved'} />
                    </div>
                    {activeAlerts.length === 0 ? (
                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p style={{ margin: 0 }}>No active emergencies right now.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {activeAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    style={{
                                        borderRadius: 10,
                                        border: '1px solid #fee2e2',
                                        background: '#fef2f2',
                                        padding: 14,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        insetInlineStart: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 4,
                                        background: 'linear-gradient(to bottom,#dc2626,#f97316)',
                                    }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <AlertTriangle size={18} color="#b91c1c" />
                                        <strong>{alert.title || 'Emergency Alert'}</strong>
                                    </div>
                                    {alert.message && (
                                        <div style={{ fontSize: 13, color: '#4b5563' }}>{alert.message}</div>
                                    )}
                                    <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#6b7280', alignItems: 'center', flexWrap: 'wrap' }}>
                                        {alert.location && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                <MapPin size={12} /> {alert.location}
                                            </span>
                                        )}
                                        {alert.createdAt && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                <Clock size={12} /> {alert.createdAt.toDate?.().toLocaleString?.() || ''}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                                        {alert.status === 'ACTIVE' && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleAcknowledge(alert)}
                                            >
                                                Acknowledge
                                            </Button>
                                        )}
                                        {alert.status !== 'RESOLVED' && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleResolve(alert)}
                                            >
                                                Mark Resolved
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Recent Emergencies</h3>
                    <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                        {history.length === 0 ? (
                            <div style={{ padding: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                                No emergency history yet.
                            </div>
                        ) : (
                            history.map((alert) => (
                                <div
                                    key={alert.id}
                                    style={{
                                        padding: '10px 0',
                                        borderBottom: '1px solid var(--border-light)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: 8,
                                        fontSize: 13,
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontWeight: 600 }}>
                                                {alert.title || 'Emergency'}
                                            </span>
                                        </div>
                                        {alert.location && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', marginTop: 2 }}>
                                                <MapPin size={11} /> {alert.location}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ marginBottom: 4, fontSize: 11, color: '#6b7280' }}>
                                            <Clock size={11} />{' '}
                                            {alert.createdAt?.toDate?.().toLocaleString?.() || ''}
                                        </div>
                                        <StatusBadge status={alert.status || 'Active'} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default EmergencyAlerts;

