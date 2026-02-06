import React from 'react';
import { PageHeader, Card, Button, CardHeader, CardContent } from '../../components/ui';

const VehicleEntry = () => {
    return (
        <>
            <PageHeader title="Vehicle Entry" subtitle="Track incoming and outgoing vehicles" />

            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '24px' }}>
                <Card>
                    <CardHeader title="Log Vehicle" />
                    <CardContent>
                        <form className="form" style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>Vehicle Number</label>
                                <input placeholder="MH 12 AB 1234" required className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>Type</label>
                                <select className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%', background: 'var(--bg-card)' }}>
                                    <option>Guest Vehicle</option>
                                    <option>Delivery Vehicle</option>
                                    <option>Cab / Taxi</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>Flat Number (Optional)</label>
                                <input placeholder="e.g. B-202" className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                            </div>
                            <Button variant="primary" type="submit" style={{ background: 'var(--brand-blue)', width: '100%', marginTop: '8px' }}>Log Entry</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title="Vehicle Log" />
                    <CardContent className="p-0">
                        <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                            <colgroup>
                                <col style={{ width: '150px' }} />
                                <col style={{ width: '140px' }} />
                                <col style={{ width: '140px' }} />
                                <col />
                            </colgroup>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Vehicle No.</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Type</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Entry Time</th>
                                    <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', verticalAlign: 'middle' }}>MH 14 HG 5566</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}>Cab</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}>10:30 AM</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><span style={{ background: '#ecfdf5', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>In Premises</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default VehicleEntry;
