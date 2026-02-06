import React from 'react';
import { PageHeader, Card, StatusBadge } from '../../components/ui';

const Deliveries = () => {
    return (
        <>
            <PageHeader title="Deliveries" subtitle="Manage incoming packages" />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                        </colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Courier</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Flat</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Time</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Gate Keeper</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '16px', color: 'var(--text-primary)', verticalAlign: 'middle' }}>Amazon</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>A-101</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status="Arrived" /></td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>10:00 AM</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>Ramesh</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '16px', color: 'var(--text-primary)', verticalAlign: 'middle' }}>Zomato</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>B-404</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status="Pending" /></td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>11:45 AM</td>
                                <td style={{ padding: '16px', verticalAlign: 'middle' }}>Suresh</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default Deliveries;
