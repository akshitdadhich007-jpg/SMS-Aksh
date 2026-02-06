import React, { useState } from 'react';
import { PageHeader, Card, StatusBadge } from '../../components/ui';

const ShopManagement = () => {
    // Mock Data
    const [shops] = useState([
        { id: 1, name: 'Fresh Mart', owner: 'Ramesh Gupta', contact: '9876543210', status: 'Active' },
        { id: 2, name: 'City Salon', owner: 'Priya Sharma', contact: '9898989898', status: 'Active' },
        { id: 3, name: 'MediPlus Pharmacy', owner: 'Dr. Vivek', contact: '9123456789', status: 'Active' },
        { id: 4, name: 'Vacant Unit S-04', owner: 'Society', contact: '-', status: 'Inactive' },
    ]);

    return (
        <>
            <PageHeader title="Shop Management" subtitle="Overview of commercial units" />

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                        </colgroup>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Shop Name</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Owner</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Contact</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shops.map((shop) => (
                                <tr key={shop.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>{shop.name}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{shop.owner}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', verticalAlign: 'middle' }}>{shop.contact}</td>
                                    <td style={{ padding: '16px', verticalAlign: 'middle' }}><StatusBadge status={shop.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default ShopManagement;
