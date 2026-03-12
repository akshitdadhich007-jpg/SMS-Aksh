import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Clock, Eye, CreditCard, BarChart3 } from 'lucide-react';
import { fetchViolationsForResident, payViolationFine, subscribeToViolations, computeViolationStats } from '../../utils/violationsService';
import { getCurrentUser } from '../../utils/visitorService';

const statusColor = {
    Unpaid: '#ef4444',
    Paid: '#10b981',
    Pending: '#f59e0b',
    Disputed: '#6366f1',
};

export default function MyViolations() {
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEvidence, setShowEvidence] = useState(null);
    const [paying, setPaying] = useState(null);

    const user = getCurrentUser?.() || {};
    // resident_id in violations matches the flat/unit stored in profile
    const residentId = user?.flat_number || user?.flatNumber || user?.flat || user?.apartment || user?.unit || user?.id || user?.email || '';

    const load = useCallback(async () => {
        setLoading(true);
        const data = await fetchViolationsForResident(residentId);
        setViolations(data);
        setLoading(false);
    }, [residentId]);

    useEffect(() => {
        load();
        const unsubscribe = subscribeToViolations(load);
        return unsubscribe;
    }, [load]);

    const handlePay = async (id) => {
        if (!window.confirm('Confirm payment for this fine?')) return;
        setPaying(id);
        await payViolationFine(id);
        await load();
        setPaying(null);
    };

    const stats = computeViolationStats(violations);

    return (
        <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif', color: 'var(--text-primary)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <AlertTriangle size={26} color="#f59e0b" />
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>My Violations</h1>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>View your violations detected by CivicGuard AI and manage fine payments</p>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, margin: '24px 0' }}>
                {[
                    { label: 'Total Violations', value: stats.total, icon: <BarChart3 size={18} color="#6366f1" />, bg: '#eef2ff', color: '#6366f1' },
                    { label: 'Amount Paid', value: `₹${stats.totalCollected.toLocaleString('en-IN')}`, icon: <CheckCircle size={18} color="#10b981" />, bg: '#ecfdf5', color: '#059669' },
                    { label: 'Pending Fines', value: stats.unpaid, icon: <Clock size={18} color="#f59e0b" />, bg: '#fffbeb', color: '#d97706' },
                    { label: 'Outstanding', value: `₹${stats.totalPending.toLocaleString('en-IN')}`, icon: <AlertTriangle size={18} color="#ef4444" />, bg: '#fef2f2', color: '#dc2626' },
                ].map(card => (
                    <div key={card.label} style={{ background: card.bg, borderRadius: 12, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>{card.icon}<span style={{ fontSize: 11, color: card.color, fontWeight: 600 }}>{card.label.toUpperCase()}</span></div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: card.color }}>{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Violations List */}
            <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 14, padding: '24px' }}>
                <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700 }}>Violation History</h3>
                {loading ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 32 }}>Loading your violations...</p>
                ) : violations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <CheckCircle size={40} color="#10b981" style={{ marginBottom: 12 }} />
                        <p style={{ color: '#059669', fontWeight: 600, fontSize: 15 }}>Great news! No violations recorded.</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Your compliance record is clean. Keep it up!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {violations.map(v => (
                            <div key={v.id} style={{ border: '1px solid var(--border, #e5e7eb)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ fontWeight: 700, fontSize: 15 }}>{v.violation_type}</span>
                                        <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: (statusColor[v.status] || '#888') + '22', color: statusColor[v.status] || '#888' }}>
                                            {v.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        📍 {v.location} &nbsp;•&nbsp; {new Date(v.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                </div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: v.status === 'Paid' ? '#10b981' : '#dc2626', minWidth: 80, textAlign: 'right' }}>
                                    ₹{v.fine_amount}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {v.evidence_image && (
                                        <button onClick={() => setShowEvidence(v)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                            <Eye size={13} /> Evidence
                                        </button>
                                    )}
                                    {v.status === 'Unpaid' && (
                                        <button onClick={() => handlePay(v.id)} disabled={paying === v.id}
                                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', background: paying === v.id ? '#a7f3d0' : '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: paying === v.id ? 'not-allowed' : 'pointer' }}>
                                            <CreditCard size={13} /> {paying === v.id ? 'Processing...' : 'Pay Fine'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Evidence Modal */}
            {showEvidence && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                    onClick={() => setShowEvidence(null)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 500, width: '90%' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <strong>Evidence — {showEvidence.violation_type}</strong>
                            <button onClick={() => setShowEvidence(null)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
                        </div>
                        <img src={showEvidence.evidence_image} alt="evidence" style={{ width: '100%', borderRadius: 10, maxHeight: 300, objectFit: 'contain' }} />
                        <div style={{ marginTop: 14, fontSize: 13, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                            <span>Location: <strong>{showEvidence.location}</strong></span>
                            <span>Fine: <strong style={{ color: '#dc2626' }}>₹{showEvidence.fine_amount}</strong></span>
                            <span>Status: <strong style={{ color: statusColor[showEvidence.status] }}>{showEvidence.status}</strong></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
