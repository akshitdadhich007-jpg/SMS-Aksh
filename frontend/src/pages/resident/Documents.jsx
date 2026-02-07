import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../../components/ui';
import { FileText, Download } from 'lucide-react';
import './Documents.css';

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
                <div className="documents-empty-state">
                    <h3>No documents uploaded yet</h3>
                    <p>Check back later.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader title="Documents" subtitle="Access important society files" />

            <div className="documents-grid">
                {documents.map((doc) => (
                    <div key={doc.id} className="document-card">
                        <div className="document-header">
                            <div className="document-icon-container">
                                <FileText />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 className="document-title">{doc.title}</h3>
                                <div className="document-metadata">
                                    <div className="document-metadata-item">
                                        <span>{doc.date}</span>
                                        <span>•</span>
                                        <span>{doc.size}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="document-actions">
                            <button
                                className="document-download-btn"
                                onClick={() => handleDownload(doc.title)}
                                type="button"
                            >
                                <Download />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Documents;
