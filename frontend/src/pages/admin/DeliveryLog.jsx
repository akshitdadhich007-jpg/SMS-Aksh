import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge, Button } from '../../components/ui';

const DeliveryLog = () => {
    // Mock Data
    const [deliveries] = useState([
        { id: 1, courier: 'Amazon', flat: 'A-101', date: '06 Feb 2026, 10:00 AM', status: 'Collected' },
        { id: 2, courier: 'Flipkart', flat: 'B-205', date: '06 Feb 2026, 11:30 AM', status: 'Pending' },
        { id: 3, courier: 'Zomato', flat: 'C-304', date: '06 Feb 2026, 12:45 PM', status: 'Collected' },
        { id: 4, courier: 'BlueDart', flat: 'A-202', date: '05 Feb 2026, 04:00 PM', status: 'Collected' },
        { id: 5, courier: 'Swiggy Instamart', flat: 'B-105', date: '06 Feb 2026, 01:15 PM', status: 'Pending' },
    ]);

    return (
        <>
            <PageHeader
                title="Deliveries"
                subtitle="Package tracking and gate logs"
                action={<Button variant="primary">Log Delivery</Button>}
            />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                            <col style={{ width: '96px' }} />
                        </colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Courier</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Flat</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Date & Time</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((delivery) => (
                                <tr key={delivery.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{delivery.courier}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold', fontFamily: 'monospace', verticalAlign: 'middle' }}>{delivery.flat}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{delivery.date}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={delivery.status} /></td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm">Notify</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default DeliveryLog;
