import React from 'react';
import { PageHeader, Card, Button } from '../../components/ui';

const SecurityDashboard = () => {
    return (
        <>
            <PageHeader title="Security Dashboard" subtitle="Overview of gate activities" />

            <div className="quick-actions" style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button variant="primary" style={{ padding: '12px 20px' }}>Add Visitor Entry</Button>
                <Button variant="primary" style={{ padding: '12px 20px' }}>Add Vehicle Entry</Button>
                <Button variant="primary" style={{ padding: '12px 20px' }}>Log Delivery</Button>
                <Button variant="danger" style={{ padding: '12px 20px' }}>Emergency Alert</Button>
            </div>

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <Card>
                    <h3 style={{ margin: '0 0 16px 0' }}>Visitors Today</h3>
                    <div className="text-3xl font-bold">12</div>
                    <div className="text-sm text-gray-500 mt-2">Active: 4</div>
                </Card>
                <Card>
                    <h3 style={{ margin: '0 0 16px 0' }}>Deliveries</h3>
                    <div className="text-3xl font-bold">25</div>
                    <div className="text-sm text-gray-500 mt-2">Pending Collection: 3</div>
                </Card>
                <Card>
                    <h3 style={{ margin: '0 0 16px 0' }}>Vehicles In/Out</h3>
                    <div className="text-3xl font-bold">45</div>
                </Card>
            </div>
        </>
    );
};

export default SecurityDashboard;
