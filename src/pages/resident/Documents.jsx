import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui';
import { FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { subscribeToResidentDocuments } from '../../firebase/documentService';
import './Documents.css';

const Documents = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToResidentDocuments(user?.societyId || 'default-society', setDocuments);
        return () => unsubscribe && unsubscribe();
    }, [user?.societyId]);

    const handleDownload = (doc) => {
        if (!doc.fileUrl) {
            toast.error('Document file URL is missing', 'Download Failed');
            return;
        }
        window.open(doc.fileUrl, '_blank', 'noopener,noreferrer');
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
                                onClick={() => handleDownload(doc)}
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
