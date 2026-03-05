import React, { useState, useEffect } from "react";
import { PageHeader, Card, Button } from "../../components/ui";
import { useToast } from "../../components/ui/Toast";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
const DocumentRepo = () => {
  const toast = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/documents")
      .then((res) => setDocuments(res.data || []))
      .catch((err) => console.error("Failed to load documents:", err))
      .finally(() => setLoading(false));
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "PDF",
    size: "",
  });
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/admin/documents", {
        name: form.name,
        type: form.type,
        size: form.size,
      });
      setDocuments((prev) => [data, ...prev]);
      toast.success(
        `"${form.name}" uploaded successfully!`,
        "Document Uploaded",
      );
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    }
    setModalOpen(false);
    setForm({
      name: "",
      type: "PDF",
      size: "",
    });
  };
  const handleDownload = async (doc) => {
    try {
      const { data } = await api.get(`/api/admin/documents/${doc.id}/download`);
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        toast.info(`Downloading "${doc.name}"...`, "Download Started");
      }
    } catch {
      toast.info(
        `Downloading "${doc.name}" (${doc.size})...`,
        "Download Started",
      );
    }
  };
  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Society document repository"
        action={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Upload Document
          </Button>
        }
      />

      <Card>
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            className="table"
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col
                style={{
                  width: "96px",
                }}
              />
            </colgroup>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Document Name
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Type
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Uploaded Date
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Size
                </th>
                <th
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "14px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                  className="p-16"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  style={{
                    borderBottom: "1px solid var(--border-light)",
                  }}
                >
                  <td
                    style={{
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="gap-16"
                    >
                      <span
                        style={{
                          fontSize: "16px",
                        }}
                      >
                        📄
                      </span>
                      {doc.name}
                    </div>
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {doc.type}
                  </td>
                  <td
                    style={{
                      color: "var(--text-secondary)",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {doc.date}
                  </td>
                  <td
                    style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    {doc.size}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                    className="p-16"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        title="Upload New Document"
        onClose={() => setModalOpen(false)}
      >
        <form className="modal-form" onSubmit={handleUpload}>
          <div className="form-group">
            <label>Document Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="e.g. Annual Report 2026.pdf"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>File Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="Excel">Excel</option>
                <option value="Image">Image</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>File Size</label>
              <input
                type="text"
                value={form.size}
                onChange={(e) =>
                  setForm({
                    ...form,
                    size: e.target.value,
                  })
                }
                placeholder="e.g. 2.5 MB"
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default DocumentRepo;
