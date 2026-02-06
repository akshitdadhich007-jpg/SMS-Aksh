import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';

const DocumentRepo = () => {
    // Mock Data
    const [documents] = useState([
        { id: 1, name: 'Society Bye-Laws v2025.pdf', type: 'PDF', date: '01 Jan 2026', size: '2.4 MB' },
        { id: 2, name: 'AGM Minutes - 2025.docx', type: 'DOCX', date: '15 Jan 2026', size: '1.1 MB' },
        { id: 3, name: 'AMC Contract - Lifts.pdf', type: 'PDF', date: '10 Feb 2026', size: '3.5 MB' },
        { id: 4, name: 'Financial Audit Report 2025.xlsx', type: 'Excel', date: '20 Jan 2026', size: '4.2 MB' },
        { id: 5, name: 'Parking Allocation Plan.jpg', type: 'Image', date: '05 Jan 2026', size: '8.5 MB' },
    ]);

    return (
        <>
            <PageHeader
                title="Documents"
                subtitle="Society document repository"
                action={<Button variant="primary">Upload Document</Button>}
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
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Document Name</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Type</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Uploaded Date</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', verticalAlign: 'middle' }}>Size</th>
                                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-primary)', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '16px' }}>📄</span>
                                            {doc.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{doc.type}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>{doc.date}</td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px', verticalAlign: 'middle' }}>{doc.size}</td>
                                    <td style={{ padding: '16px', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="secondary" size="sm">Download</Button>
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

export default DocumentRepo;
