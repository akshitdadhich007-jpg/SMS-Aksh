import React from 'react';
import { PageHeader, Card, Button, CardHeader, CardContent } from '../../components/ui';

const VisitorEntry = () => {
    return (
        <>
            <PageHeader title="Visitor Entry" subtitle="Log and manage visitors" />

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <Card>
                    <CardHeader title="New Visitor Log" />
                    <CardContent>
                        <form className="form" style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>Visitor Name</label>
                                <input placeholder="Enter name" required className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>Purpose</label>
                                <input placeholder="Purpose of visit" required className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>Flat Number</label>
                                <input placeholder="e.g. A-101" required className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                            </div>
                            <Button variant="primary" type="submit" style={{ background: 'var(--success)', borderColor: 'var(--success)', width: '100%', marginTop: '8px' }}>Check In Visitor</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Recent Visitors" />
                    <CardContent>
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>No active visitors at the moment.</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default VisitorEntry;
