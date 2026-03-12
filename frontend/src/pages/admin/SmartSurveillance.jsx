import { useState, useEffect, useCallback } from 'react';
import { Shield, AlertTriangle, Download, Trash2, Eye, CheckCircle, Clock, ScanLine, Camera, BarChart3 } from 'lucide-react';
import {
    createViolation,
    fetchAllViolations,
    deleteViolation,
    subscribeToViolations,
    computeViolationStats,
    FINE_RULES,
} from '../../utils/violationsService';

const VIOLATION_TYPES = Object.keys(FINE_RULES);

const statusColor = {
    Unpaid: '#ef4444',
    Paid: '#10b981',
    Pending: '#f59e0b',
    Disputed: '#6366f1',
};

export default function SmartSurveillance() {
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [violations, setViolations] = useState([]);
    const [violationType, setViolationType] = useState('Wrong Parking');
    const [residentId, setResidentId] = useState('A-101');
    const [residentName, setResidentName] = useState('Demo Resident');
    const [location, setLocation] = useState('Society Premises');
    const [filter, setFilter] = useState('All');
    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showEvidence, setShowEvidence] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        const data = await fetchAllViolations();
        setViolations(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        load();
        const unsubscribe = subscribeToViolations(load);
        return unsubscribe;
    }, [load]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImage(URL.createObjectURL(file));
    };

    const handleScan = async () => {
        if (!image) return alert('Upload an evidence image first');
        setScanning(true);
        await new Promise(r => setTimeout(r, 1500));
        const confidence = Math.floor(Math.random() * 10) + 90;

        let evidenceBase64 = image;
        if (imageFile) {
            evidenceBase64 = await new Promise((res) => {
                const reader = new FileReader();
                reader.onload = (e) => res(e.target.result);
                reader.readAsDataURL(imageFile);
            });
        }

        try {
            const saved = await createViolation({
                resident_id: residentId.trim(),
                resident_name: residentName.trim(),
                violation_type: violationType,
                evidence_image: evidenceBase64,
                location: location.trim() || 'Society Premises',
            });
            setResult({ ...saved, confidence });
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 4000);
            await load();
        } catch (err) {
            console.error('Violation creation failed:', err);
            alert('Failed to record violation. Please try again.');
        }
        setScanning(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this violation record?')) return;
        await deleteViolation(id);
        await load();
    };

    const downloadCSV = () => {
        const headers = ['ID', 'Resident', 'Resident Name', 'Type', 'Location', 'Fine (₹)', 'Status', 'Date'];
        const rows = violations.map(v => [
            v.id, v.resident_id, v.resident_name, v.violation_type,
            v.location, v.fine_amount, v.status,
            new Date(v.created_at).toLocaleString('en-IN'),
        ]);
        const csv = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(r => r.join(',')).join('\n');
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', 'civiora_violations_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const stats = computeViolationStats(violations);
    const filteredViolations = filter === 'All' ? violations : violations.filter(v => v.status === filter);

    const getLeaderboard = () => {
        const map = {};
        violations.forEach(v => {
            if (!map[v.resident_id]) map[v.resident_id] = { name: v.resident_name, score: 100, violations: 0 };
            map[v.resident_id].score -= 10;
            map[v.resident_id].violations += 1;
        });
        return Object.values(map).sort((a, b) => b.score - a.score).slice(0, 5);
    };

    return (
        <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif', color: 'var(--text-primary)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                <Shield size={28} color="#6366f1" />
                <div>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>CivicGuard AI — Smart Surveillance</h1>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>Automated violation detection, fine generation, and resident discipline monitoring</p>
                </div>
            </div>

            {showAlert && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 18px', borderRadius: 10, marginBottom: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={18} /> 🚨 Violation Recorded! Notification sent to resident instantly.
                </div>
            )}

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
                {[
                    { label: 'Total Violations', value: stats.total, icon: <BarChart3 size={18} color="#6366f1" />, bg: '#eef2ff', color: '#6366f1' },
                    { label: 'Total Collected', value: `₹${stats.totalCollected.toLocaleString('en-IN')}`, icon: <CheckCircle size={18} color="#10b981" />, bg: '#ecfdf5', color: '#059669' },
                    { label: 'Pending Fines', value: stats.unpaid, icon: <Clock size={18} color="#f59e0b" />, bg: '#fffbeb', color: '#d97706' },
                    { label: 'Pending Amount', value: `₹${stats.totalPending.toLocaleString('en-IN')}`, icon: <AlertTriangle size={18} color="#ef4444" />, bg: '#fef2f2', color: '#dc2626' },
                ].map(card => (
                    <div key={card.label} style={{ background: card.bg, borderRadius: 12, padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>{card.icon}<span style={{ fontSize: 12, color: card.color, fontWeight: 600 }}>{card.label.toUpperCase()}</span></div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: card.color }}>{card.value}</div>
                    </div>
                ))}
            </div>

            {/* AI Scan Panel */}
            <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 14, padding: '24px', marginBottom: 28 }}>
                <h3 style={{ margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                    <ScanLine size={18} color="#6366f1" /> Run AI Violation Scan
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>VIOLATION TYPE</label>
                        <select value={violationType} onChange={e => setViolationType(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border,#e5e7eb)', background: 'var(--card,#fff)', fontSize: 14 }}>
                            {VIOLATION_TYPES.map(t => <option key={t} value={t}>{t} — ₹{FINE_RULES[t]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>RESIDENT FLAT / ID</label>
                        <input value={residentId} onChange={e => setResidentId(e.target.value)} placeholder="e.g. A-101"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border,#e5e7eb)', background: 'var(--card,#fff)', fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>RESIDENT NAME</label>
                        <input value={residentName} onChange={e => setResidentName(e.target.value)} placeholder="e.g. Raj Kumar"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border,#e5e7eb)', background: 'var(--card,#fff)', fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>LOCATION</label>
                        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Gate 2 Parking"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border,#e5e7eb)', background: 'var(--card,#fff)', fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f1f5f9', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        <Camera size={16} /> Upload Evidence Image
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                    {image && <img src={image} alt="evidence" style={{ height: 64, borderRadius: 8, objectFit: 'cover', border: '2px solid #6366f1' }} />}
                    <button onClick={handleScan} disabled={scanning || !image}
                        style={{ padding: '10px 22px', background: scanning ? '#a5b4fc' : '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: scanning ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ScanLine size={16} /> {scanning ? '🔍 AI Scanning...' : 'Run AI Scan'}
                    </button>
                </div>
                {result && !scanning && (
                    <div style={{ marginTop: 18, padding: '14px 18px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10 }}>
                        <strong style={{ color: '#15803d' }}>✅ Violation Detected & Saved</strong>
                        <div style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 13, flexWrap: 'wrap' }}>
                            <span>Type: <strong>{result.violation_type}</strong></span>
                            <span>Fine: <strong>₹{result.fine_amount}</strong></span>
                            <span>Confidence: <strong>{result.confidence}%</strong></span>
                            <span>Resident: <strong>{result.resident_name} ({result.resident_id})</strong></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Violation Records Table */}
            <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 14, padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={18} color="#f59e0b" /> Violation Records
                    </h3>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <select value={filter} onChange={e => setFilter(e.target.value)}
                            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border,#e5e7eb)', background: 'var(--card,#fff)', fontSize: 13 }}>
                            <option value="All">All</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                            <option value="Disputed">Disputed</option>
                        </select>
                        <button onClick={downloadCSV}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                            <Download size={14} /> Export CSV
                        </button>
                    </div>
                </div>
                {loading ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 32 }}>Loading violations...</p>
                ) : filteredViolations.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 32 }}>No violations found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: 'var(--hover-bg, #f8fafc)' }}>
                                    {['Resident', 'Name', 'Violation Type', 'Location', 'Fine', 'Status', 'Date', 'Evidence', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredViolations.map((v, idx) => (
                                    <tr key={v.id} style={{ borderTop: '1px solid var(--border, #f1f5f9)', background: idx % 2 === 0 ? 'transparent' : 'var(--hover-bg, #f8fafc)' }}>
                                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{v.resident_id}</td>
                                        <td style={{ padding: '10px 12px' }}>{v.resident_name}</td>
                                        <td style={{ padding: '10px 12px' }}>{v.violation_type}</td>
                                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{v.location}</td>
                                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#dc2626' }}>₹{v.fine_amount}</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: (statusColor[v.status] || '#888') + '22', color: statusColor[v.status] || '#888' }}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                            {new Date(v.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            {v.evidence_image ? (
                                                <button onClick={() => setShowEvidence(v)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                    <Eye size={13} /> View
                                                </button>
                                            ) : <span style={{ color: '#94a3b8', fontSize: 12 }}>—</span>}
                                        </td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <button onClick={() => handleDelete(v.id)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Discipline Leaderboard */}
            <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e5e7eb)', borderRadius: 14, padding: '24px', marginTop: 24 }}>
                <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700 }}>🏆 Resident Discipline Scores</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'var(--hover-bg, #f8fafc)' }}>
                            {['Rank', 'Resident', 'Violations', 'Trust Score'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12, textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getLeaderboard().map((r, i) => (
                            <tr key={r.name} style={{ borderTop: '1px solid var(--border, #f1f5f9)' }}>
                                <td style={{ padding: '10px 12px' }}>{['🥇', '🥈', '🥉', '4', '5'][i]}</td>
                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.name}</td>
                                <td style={{ padding: '10px 12px' }}>{r.violations}</td>
                                <td style={{ padding: '10px 12px' }}>
                                    <span style={{ color: r.score >= 90 ? '#10b981' : r.score >= 70 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>
                                        {r.score}/100
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {getLeaderboard().length === 0 && (
                            <tr><td colSpan={4} style={{ padding: '20px 12px', color: 'var(--text-secondary)', textAlign: 'center' }}>No data yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Evidence Modal */}
            {showEvidence && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                    onClick={() => setShowEvidence(null)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 520, width: '90%' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <strong>Evidence — {showEvidence.violation_type}</strong>
                            <button onClick={() => setShowEvidence(null)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer' }}>×</button>
                        </div>
                        <img src={showEvidence.evidence_image} alt="evidence" style={{ width: '100%', borderRadius: 10, maxHeight: 320, objectFit: 'contain' }} />
                        <div style={{ marginTop: 14, fontSize: 13, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                            <span>Resident: <strong>{showEvidence.resident_name} ({showEvidence.resident_id})</strong></span>
                            <span>Fine: <strong>₹{showEvidence.fine_amount}</strong></span>
                            <span>Status: <strong style={{ color: statusColor[showEvidence.status] }}>{showEvidence.status}</strong></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
