import React from 'react';
import { PageHeader, Card } from '../../components/ui';

const AdminSettings = () => {
    return (
        <>
            <PageHeader title="Settings" subtitle="Application configuration" />
            <Card className="p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-700">Configurations</h3>
                <p className="text-gray-500 mt-2">Feature coming soon.</p>
            </Card>
        </>
    );
};
export default AdminSettings;
