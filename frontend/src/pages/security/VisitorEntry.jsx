import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Button, CardHeader, CardContent, StatusBadge } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { checkInVisitor, checkOutVisitor, subscribeToAllVisitors } from '../../firebase/visitorService';

const VisitorEntry = () => {
    const toast = useToast();
    const [visitors, setVisitors] = useState([]);
    const [form, setForm] = useState({ name: '', purpose: '', flat: '' });
    const [loading, setLoading] = useState(false);

    // Subscribe to all active visitors
    useEffect(() => {
        const unsubscribe = subscribeToAllVisitors((visitorsList) => {
            // Filter only active (checked in but not checked out) visitors
            const activeVisitors = visitorsList.filter(v => v.status === 'checked_in');
            setVisitors(activeVisitors);
        });

        return () => unsubscribe();
    }, []);

    const handleCheckIn = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.purpose.trim() || !form.flat.trim()) {
            toast.error('Please fill all fields', 'Missing Information');
            return;
        }

        setLoading(true);

        try {
            await checkInVisitor({
                visitorName: form.name,
                purpose: form.purpose,
                flatNumber: form.flat,
                phone: '', // Not required for manual check-in
            });

            toast.success(`${form.name} checked in for flat ${form.flat}!`, 'Visitor Checked In');
            setForm({ name: '', purpose: '', flat: '' });
        } catch (error) {
            toast.error('Check-in failed: ' + error.message, 'Error');
            console.error('Check-in error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async (visitorId, visitorName) => {
        try {
            await checkOutVisitor(visitorId);
            toast.info(`${visitorName} checked out`, 'Visitor Left');
        } catch (error) {
            toast.error('Check-out failed: ' + error.message, 'Error');
            console.error('Check-out error:', error);
        }
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
                                <input 
                                    type="text" 
                                    value={form.name} 
                                    onChange={e => setForm({ ...form, name: e.target.value })} 
                                    placeholder="Enter name" 
                                    required 
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Purpose</label>
                                <input 
                                    type="text" 
                                    value={form.purpose} 
                                    onChange={e => setForm({ ...form, purpose: e.target.value })} 
                                    placeholder="Purpose of visit" 
                                    required 
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Flat Number</label>
                                <input 
                                    type="text" 
                                    value={form.flat} 
                                    onChange={e => setForm({ ...form, flat: e.target.value })} 
                                    placeholder="e.g. A-101" 
                                    required 
                                    disabled={loading}
                                />
                            </div>
                            <Button 
                                variant="primary" 
                                type="submit" 
                                style={{ 
                                    width: '100%', 
                                    marginTop: '8px', 
                                    background: 'var(--success)', 
                                    border: 'none',
                                    opacity: loading ? 0.6 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                                disabled={loading}
                            >
                                {loading ? '⏳ Checking In...' : '✅ Check In Visitor'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Active Visitors" />
                    <CardContent>
                        {visitors.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
                                No active visitors at the moment.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {visitors.map(v => (
                                    <div 
                                        key={v.id} 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '12px', 
                                            padding: '12px', 
                                            borderRadius: '10px', 
                                            border: '1px solid var(--border)', 
                                            background: 'var(--bg-light)' 
                                        }}
                                    >
                                        <div 
                                            style={{ 
                                                width: '36px', 
                                                height: '36px', 
                                                borderRadius: '50%', 
                                                background: 'linear-gradient(135deg, #4f46e5, #6366f1)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                color: 'white', 
                                                fontWeight: 'bold', 
                                                fontSize: '14px', 
                                                flexShrink: 0 
                                            }}
                                        >
                                            {v.visitorName?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                                                {v.visitorName}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                {v.purpose} • Flat {v.flatNumber} • {v.entryTime ? new Date(v.entryTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Just now'}
                                            </div>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleCheckOut(v.id, v.visitorName)}
                                        >
                                            Check Out
                                        </Button>
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
