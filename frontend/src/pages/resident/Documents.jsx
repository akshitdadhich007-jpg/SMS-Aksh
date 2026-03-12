import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import { FileText, Download } from "lucide-react";
import "./Documents.css";
import api from "../../services/api";

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    api
      .get("/api/resident/documents")
      .then((res) => setDocuments(res.data || []))
      .catch((err) => console.error("Failed to load documents:", err));
  }, []);

  const handleDownload = async (doc) => {
    try {
      const { data } = await api.get(
        `/api/resident/documents/${doc.id}/download`,
      );
      if (data.url) window.open(data.url, "_blank");
      else alert(`Downloading ${doc.title}...`);
    } catch {
      alert(`Downloading ${doc.title}...`);
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <>
        <PageHeader
          title="Documents"
          subtitle="Access important society files"
        />
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
