import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { Button } from "../../../components/ui";
import TracebackStatusBadge from "./TracebackStatusBadge";
const ClaimsPanel = ({ claims, approving, onApproveClaim, onRejectClaim }) => {
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const handleReject = (claimId) => {
    if (!rejectReason.trim()) return;
    onRejectClaim(claimId, rejectReason.trim());
    setRejectId(null);
    setRejectReason("");
  };
  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  return (
    <div>
      {claims.length === 0 ? (
        <div className="premium-empty-state">
          <div className="empty-icon-circle">
            <ShieldCheck size={32} />
          </div>
          <h3>No Claims</h3>
          <p>All claims have been processed or none have been submitted yet.</p>
        </div>
      ) : (
        <div className="traceback-grid">
          {claims.map((claim) => (
            <div key={claim.id} className="traceback-claim-card">
              <div className="claim-header">
                <div className="claim-user-avatar">
                  {claim.claimant_name?.charAt(0).toUpperCase() || "R"}
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <div className="claim-user-name">
                    {claim.claimant_name || "Resident"}
                  </div>
                  <div className="claim-item-ref">
                    Claiming:{" "}
                    {claim.item_details?.description?.substring(0, 60) ||
                      "Item"}
                    {claim.item_details?.description?.length > 60 && "..."}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                    }}
                    className="mt-16"
                  >
                    <Clock size={10} /> {timeAgo(claim.created_at)}
                  </div>
                </div>
                <TracebackStatusBadge status={claim.status} />
              </div>

              {/* Claim Timeline */}
              <div
                className="claim-timeline pl-16"
                style={{
                  margin: "16px 0",
                  borderLeft: "2px solid var(--border)",
                }}
              >
                <div className="timeline-step">
                  <span className="timeline-dot done" />
                  <span>Claim submitted — {timeAgo(claim.created_at)}</span>
                </div>
                {claim.status === "under_review" && (
                  <div className="timeline-step">
                    <span className="timeline-dot active" />
                    <span>Under admin review</span>
                  </div>
                )}
                {claim.status === "approved" && (
                  <div className="timeline-step">
                    <span className="timeline-dot done" />
                    <span>Approved — Token generated</span>
                  </div>
                )}
                {claim.status === "rejected" && (
                  <div className="timeline-step">
                    <span className="timeline-dot rejected" />
                    <span>
                      Rejected
                      {claim.reject_reason ? `: ${claim.reject_reason}` : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Verification Answers */}
              <div
                className="claim-qa-section p-16 mb-16"
                style={{
                  background: "var(--background)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <h4
                  style={{
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="mb-16 gap-16"
                >
                  <ShieldCheck size={14} color="var(--primary)" /> Verification
                  Answers
                </h4>
                <ul
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                  }}
                  className="pl-16"
                >
                  {claim.security_answers?.map((ans, i) => (
                    <li key={i} className="mb-16">
                      {ans || "No answer provided"}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Proof Image */}
              {claim.proof_image && (
                <div className="mb-16">
                  <h4
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                    className="mb-16"
                  >
                    📷 Proof Image:
                  </h4>
                  <img
                    src={claim.proof_image}
                    alt="Proof"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="claim-actions">
                {claim.status === "under_review" ? (
                  <>
                    {rejectId === claim.id ? (
                      <div
                        style={{
                          width: "100%",
                        }}
                      >
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection..."
                          style={{
                            width: "100%",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border)",
                            fontSize: 13,
                            resize: "vertical",
                            minHeight: 60,
                          }}
                          className="p-16 mb-16"
                        />
                        <div
                          style={{
                            display: "flex",
                          }}
                          className="gap-16"
                        >
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setRejectId(null);
                              setRejectReason("");
                            }}
                            style={{
                              flex: 1,
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleReject(claim.id)}
                            disabled={!rejectReason.trim()}
                            style={{
                              flex: 1,
                            }}
                          >
                            <XCircle size={14} /> Confirm Reject
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                        }}
                        className="gap-16"
                      >
                        <Button
                          variant="secondary"
                          onClick={() => setRejectId(claim.id)}
                          style={{
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <XCircle size={14} /> Reject
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => onApproveClaim(claim.id)}
                          disabled={approving}
                          className="btn"
                          style={{
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <CheckCircle2 size={14} /> Approve & Generate Token
                        </Button>
                      </div>
                    )}
                  </>
                ) : claim.status === "approved" ? (
                  <div className="traceback-info-box success text-center">
                    ✅ Approved — Token generated. Wait for claimant to show QR
                    code.
                  </div>
                ) : claim.status === "rejected" ? (
                  <div className="traceback-info-box error text-center">
                    ❌ Rejected
                    {claim.reject_reason ? ` — ${claim.reject_reason}` : ""}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ClaimsPanel;
