import React, { useState } from 'react';
import { useEffect } from 'react';
import { PageHeader, Card, Button, CardHeader, CardContent, StatusBadge } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';

// TODO: Replace fetchVisitors, handleCheckIn, handleCheckOut with Firebase calls

const VisitorEntry = () => {
    const toast = useToast();
    const [visitors, setVisitors] = useState([]);
    const [form, setForm] = useState({ name: '', purpose: '', flat: '' });

    const fetchVisitors = async () => {
        // TODO: Load visitor entries from Firebase
        setVisitors([]);
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleCheckIn = async (e) => {
        e.preventDefault();
        // TODO: Write visitor check-in to Firebase
        toast.success(`${form.name} checked in for flat ${form.flat}! (Firebase pending)`, 'Visitor Checked In');
        setForm({ name: '', purpose: '', flat: '' });
    };

    const handleCheckOut = async (id) => {
        const visitor = visitors.find(v => v.id === id);
        // TODO: Update visitor checkout in Firebase
        toast.info(`${visitor?.visitor_name || 'Visitor'} checked out (Firebase pending)`, 'Visitor Left');
        setVisitors(prev => prev.filter(v => v.id !== id));
    };

    return (
        <>
            <PageHeader title="Visitor Entry" subtitle="Log and manage visitors" />

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Card>
                    <CardHeader title="New Visitor Log" />
                    <CardContent>
                        <form className="modal-form" onSubmit={handleCheckIn}>
                            <div className="form-group">
                                <label>Visitor Name</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter name" required />
                            </div>
                            <div className="form-group">
                                <label>Purpose</label>
                                <input type="text" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="Purpose of visit" required />
                            </div>
                            <div className="form-group">
                                <label>Flat Number</label>
                                <input type="text" value={form.flat} onChange={e => setForm({ ...form, flat: e.target.value })} placeholder="e.g. A-101" required />
                            </div>
                            <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '8px', background: 'var(--success)', border: 'none' }}>✅ Check In Visitor</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Recent Visitors" />
                    <CardContent>
                        {visitors.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>No active visitors at the moment.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {visitors.map(v => (
                                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-light)' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
                                            {v.visitor_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{v.visitor_name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                {v.purpose} • Flat {v.flat_number} • {new Date(v.check_in_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </div>
                                        </div>
                                        {v.status === 'active' ? (
                                            <Button variant="outline" size="sm" onClick={() => handleCheckOut(v.id)}>Check Out</Button>
                                        ) : (
                                            <StatusBadge status="Left" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default VisitorEntry;
