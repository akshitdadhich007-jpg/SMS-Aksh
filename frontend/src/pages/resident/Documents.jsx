import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { FileText, Download } from 'lucide-react';

const Documents = () => {
    // Mock Data
    const [documents] = useState([
        { id: 1, title: 'Society Bylaws 2026', type: 'PDF', size: '2.4 MB', date: '01 Jan 2026' },
        { id: 2, title: 'Feb 2026 Maintenance Receipt', type: 'PDF', size: '150 KB', date: '05 Feb 2026' },
        { id: 3, title: 'Circular - Parking Rules', type: 'PDF', size: '500 KB', date: '20 Jan 2026' },
        { id: 4, title: 'Annual Budget Report 2025', type: 'XLSX', size: '1.2 MB', date: '10 Jan 2026' },
    ]);

    const handleDownload = (docName) => {
        alert(`Downloading ${docName}...`);
    };

    if (!documents || documents.length === 0) {
        return (
            <>
                <PageHeader title="Documents" subtitle="Access important society files" />
                <Card className="text-center p-8">
                    <h3 className="text-lg font-semibold text-gray-700">No documents uploaded yet</h3>
                    <p className="text-gray-500 mt-2">Check back later.</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <PageHeader title="Documents" subtitle="Access important society files" />

            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', height: '100%' }}>
                            <div style={{
                                background: 'var(--bg-light)',
                                padding: '12px',
                                borderRadius: '8px',
                                color: 'var(--brand-blue)',
                                flexShrink: 0
                            }}>
                                <FileText size={24} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{doc.title}</h3>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1 }}>
                                    {doc.date} • {doc.size}
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleDownload(doc.title)}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Download size={16} /> Download
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default Documents;
