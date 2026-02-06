import React from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { TriangleAlert } from 'lucide-react';

const EmergencyLogs = () => {
    return (
        <>
            <PageHeader title="Emergency Logs" subtitle="History of alarms and alerts" />

            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px', flexDirection: 'column', alignItems: 'center', background: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                <TriangleAlert size={48} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No recent emergencies</h3>
                <p className="text-gray-500 mt-2">All systems running normal.</p>
                <Button variant="danger" style={{ marginTop: '24px' }}>Trigger Manual Drill</Button>
            </div>
        </>
    );
};

export default EmergencyLogs;
