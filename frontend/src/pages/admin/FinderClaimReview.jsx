import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader, Button, TracebackNav } from "../../components/ui";
import { getTracebackPath } from "../../utils/tracebackHelper";
import { fetchTracebackData } from "../../utils/tracebackStorage";
import api from "../../services/api";
import { useToast } from "../../components/ui/Toast";
import TracebackStatusBadge from "./traceback/TracebackStatusBadge";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";
import "../../styles/Traceback.css";
const FinderClaimReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [adminComment, setAdminComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const [data, setData] = React.useState({ items: [], matches: [], claims: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchTracebackData().then(res => {
      setData(res);
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
      toast.error("Failed to load claims.");
    });
  }, []);

  const pendingClaims = data.claims.filter((c) =>
    ["under_review", "info_requested"].includes(c.status),
  );
  const currentClaim = pendingClaims[0] || null;

  // Get the associated items
  const lostItem = currentClaim?.lostId || currentClaim?.lost_item_id
    ? data.items.find((i) => i.id === (currentClaim.lostId || currentClaim.lost_item_id))
    : null;
  const foundItem = currentClaim?.foundId || currentClaim?.found_item_id
    ? data.items.find((i) => i.id === (currentClaim.foundId || currentClaim.found_item_id))
    : null;

  const updateClaimStatus = async (status, reason = "") => {
    if (!currentClaim) return;
    try {
      await api.put(`/api/traceback/claim/${currentClaim.id}`, {
        status,
        adminComment,
        rejectReason: reason
      });

      if (status === "rejected") {
        toast.info("Claim rejected.");
      } else if (status === "approved") {
        toast.success("Claim approved! Token generated.");
      } else if (status === "info_requested") {
        toast.info("Requested more info from claimant.");
      }

      navigate(getTracebackPath(location.pathname, "matches"));
    } catch (err) {
      toast.error("Failed to update claim.");
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-32">Loading...</div>;
  if (!currentClaim) {
    return (
      <div className="traceback-page">
        <PageHeader
          title="Finder Claim Review"
          subtitle="Review claims for item ownership"
        />
        <TracebackNav />
        <div className="premium-empty-state">
          <h3>No Pending Claims</h3>
          <p>All claims have been reviewed.</p>
          <Button
            variant="primary"
            onClick={() =>
              navigate(getTracebackPath(location.pathname, "matches"))
            }
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="traceback-page">
      <PageHeader
        title="Finder Claim Review"
        subtitle="Review the claimant's answers before approving."
      />
      <TracebackNav />

      <div className="traceback-grid">
        {/* Item Details */}
        <div className="traceback-item-summary">
          <div className="traceback-card-header">Claimed Item Details</div>
          <div className="traceback-item-summary-meta">
            <div>
              {currentClaim.item_details?.description ||
                lostItem?.description ||
                "Item description"}
            </div>
            <div>
              Category:{" "}
              {currentClaim.item_details?.category ||
                lostItem?.category ||
                "N/A"}
            </div>
            {lostItem?.color && <div>Color: {lostItem.color}</div>}
            {lostItem?.event_date && (
              <div>Date lost: {lostItem.event_date}</div>
            )}
            {lostItem?.location && <div>Location: {lostItem.location}</div>}
          </div>

          {/* Side-by-side image comparison */}
          {(lostItem?.image_url || foundItem?.image_url) && (
            <div className="mt-16">
              <div
                className="traceback-card-header mb-16"
                style={{
                  fontSize: 14,
                }}
              >
                📷 Image Comparison
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                }}
                className="gap-16"
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                    className="mb-16"
                  >
                    Lost Item
                  </div>
                  {lostItem?.image_url ? (
                    <img
                      src={lostItem.image_url}
                      alt="Lost"
                      style={{
                        width: "100%",
                        maxHeight: 150,
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: "var(--background)",
                        borderRadius: "var(--radius-md)",
                        textAlign: "center",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                      className="p-16"
                    >
                      No image
                    </div>
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                    className="mb-16"
                  >
                    Found Item
                  </div>
                  {foundItem?.image_url ? (
                    <img
                      src={foundItem.image_url}
                      alt="Found"
                      style={{
                        width: "100%",
                        maxHeight: 150,
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: "var(--background)",
                        borderRadius: "var(--radius-md)",
                        textAlign: "center",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                      className="p-16"
                    >
                      No image
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div
            style={{
              background: "var(--background)",
              borderRadius: 8,
            }}
            className="mt-24 p-16"
          >
            <div
              className="traceback-card-header mb-16"
              style={{
                fontSize: 14,
              }}
            >
              Claim Timeline
            </div>
            <div
              className="claim-timeline pl-16"
              style={{
                borderLeft: "2px solid var(--border)",
              }}
            >
              <div
                className="timeline-step mb-16"
                style={{
                  position: "relative",
                }}
              >
                <span
                  className="timeline-dot done"
                  style={{
                    position: "absolute",
                    left: -19,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "var(--success)",
                    border: "2px solid white",
                  }}
                />
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  Item Reported
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  By Finder
                </div>
              </div>
              <div
                className="timeline-step mb-16"
                style={{
                  position: "relative",
                }}
              >
                <span
                  className="timeline-dot done"
                  style={{
                    position: "absolute",
                    left: -19,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "var(--success)",
                    border: "2px solid white",
                  }}
                />
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  Claim Submitted
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  {new Date(currentClaim.created_at).toLocaleString()}
                </div>
              </div>
              <div
                className="timeline-step mb-16"
                style={{
                  position: "relative",
                }}
              >
                <span
                  className="timeline-dot active"
                  style={{
                    position: "absolute",
                    left: -19,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    border: "2px solid white",
                  }}
                />
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  Under Review
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  Verification Pending
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claimant Answers & Actions */}
        <div className="traceback-card">
          <div className="traceback-card-header">
            Claimant's Verification Answers
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
            className="gap-16 mb-16"
          >
            <div className="claim-user-avatar">
              {currentClaim.claimant_name?.charAt(0) || "R"}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                }}
              >
                {currentClaim.claimant_name || "Resident"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                Submitted {new Date(currentClaim.created_at).toLocaleString()}
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
              }}
            >
              <TracebackStatusBadge status={currentClaim.status} />
            </div>
          </div>

          <div
            className="traceback-card-section gap-16 p-16"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "var(--background)",
              borderRadius: 8,
            }}
          >
            <div className="traceback-answer-box">
              <div
                className="traceback-answer-label mb-16"
                style={{
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  fontSize: 12,
                }}
              >
                Item Description
              </div>
              <div
                className="traceback-answer-text"
                style={{
                  fontSize: 14,
                }}
              >
                {currentClaim.answers?.description || "N/A"}
              </div>
            </div>
            <div className="traceback-answer-box">
              <div
                className="traceback-answer-label mb-16"
                style={{
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  fontSize: 12,
                }}
              >
                Lost Location
              </div>
              <div
                className="traceback-answer-text"
                style={{
                  fontSize: 14,
                }}
              >
                {currentClaim.answers?.lostLocation || "N/A"}
              </div>
            </div>
            <div className="traceback-answer-box">
              <div
                className="traceback-answer-label mb-16"
                style={{
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  fontSize: 12,
                }}
              >
                Unique Marks
              </div>
              <div
                className="traceback-answer-text"
                style={{
                  fontSize: 14,
                }}
              >
                {currentClaim.answers?.uniqueMarks || "N/A"}
              </div>
            </div>
            <div className="traceback-answer-box">
              <div
                className="traceback-answer-label mb-16"
                style={{
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  fontSize: 12,
                }}
              >
                Additional Notes
              </div>
              <div
                className="traceback-answer-text"
                style={{
                  fontSize: 14,
                }}
              >
                {currentClaim.answers?.notes || "None"}
              </div>
            </div>
          </div>

          {/* Proof Image */}
          {currentClaim.proof_image && (
            <div className="mt-16">
              <div className="traceback-answer-label">📷 Proof Image</div>
              <img
                src={currentClaim.proof_image}
                alt="Proof"
                style={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                }}
                className="mt-16"
              />
            </div>
          )}

          {/* Admin Comment */}
          <div className="mt-16">
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "block",
              }}
              className="mb-16"
            >
              Admin Comment (optional)
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Add review notes..."
              style={{
                width: "100%",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                fontSize: 13,
                resize: "vertical",
                minHeight: 60,
              }}
              className="p-16"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="traceback-actions gap-16">
          {showRejectForm ? (
            <div
              style={{
                width: "100%",
              }}
            >
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (required)..."
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
                  onClick={() => setShowRejectForm(false)}
                  style={{
                    flex: 1,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => updateClaimStatus("rejected", rejectReason)}
                  disabled={!rejectReason.trim()}
                  style={{
                    flex: 1,
                  }}
                >
                  <XCircle size={16} className="mr-16" /> Confirm Reject
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
                variant="danger"
                onClick={() => setShowRejectForm(true)}
                style={{
                  flex: 1,
                }}
              >
                <XCircle size={16} className="mr-16" /> Reject
              </Button>
              <Button
                variant="secondary"
                onClick={() => updateClaimStatus("info_requested")}
                style={{
                  flex: 1,
                }}
              >
                <MessageSquare size={16} className="mr-16" /> Request More Info
              </Button>
              <Button
                variant="primary"
                onClick={() => updateClaimStatus("approved")}
                style={{
                  flex: 1,
                }}
              >
                <CheckCircle2 size={16} className="mr-16" /> Approve Claim
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FinderClaimReview;
