import React from "react";
import {
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "../../../components/ui";
import TracebackStatusBadge from "./TracebackStatusBadge";
const LostItems = ({
  items,
  matches,
  isAdmin,
  onViewToken,
  onInitiateClaim,
  onReportLost,
  searchTerm,
}) => {
  const [expandedItemId, setExpandedItemId] = React.useState(null);
  const toggleMatches = (itemId) =>
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  const getMatchesForItem = (itemId) => {
    if (!matches) return [];
    return matches.filter((m) => m.lostId === itemId);
  };
  const filtered = items.filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      item.description?.toLowerCase().includes(s) ||
      item.category?.toLowerCase().includes(s) ||
      item.location?.toLowerCase().includes(s)
    );
  });
  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)} month(s) ago`;
  };
  return (
    <div>
      {filtered.length === 0 ? (
        <div className="premium-empty-state">
          <div className="empty-icon-circle">
            <Search size={32} />
          </div>
          <h3>
            {searchTerm ? "No Matching Lost Reports" : "No Active Lost Reports"}
          </h3>
          <p>
            {searchTerm
              ? "Try adjusting your search."
              : "Report a lost item to start tracking."}
          </p>
          {!searchTerm && (
            <button
              className="btn"
              style={{
                margin: "0 auto",
              }}
              onClick={onReportLost}
            >
              + Report Lost Item
            </button>
          )}
        </div>
      ) : (
        <div className="traceback-grid-2col">
          {filtered.map((item) => {
            const itemMatches = getMatchesForItem(item.id);
            const isExpanded = expandedItemId === item.id;
            return (
              <div
                key={item.id}
                className="traceback-card item-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image thumbnail */}
                {item.image_url && (
                  <div className="traceback-card-thumb">
                    <img src={item.image_url} alt={item.category} />
                  </div>
                )}

                <div className="item-header">
                  <span className="item-category">{item.category}</span>
                  <TracebackStatusBadge status={item.status} />
                </div>
                <p className="item-desc">{item.description}</p>
                {item.color && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                    className="mb-16"
                  >
                    Color: {item.color}
                  </div>
                )}
                <div className="item-meta">
                  <Clock size={12} className="mr-16" />
                  {timeAgo(item.created_at)} · {item.location}
                  {isAdmin && item.reporter_id && (
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "var(--primary)",
                        display: "block",
                      }}
                      className="mt-16"
                    >
                      Reporter: {item.reporter_id}
                    </span>
                  )}
                </div>

                {itemMatches.length > 0 && (
                  <div
                    className="traceback-match-indicator"
                    onClick={() => toggleMatches(item.id)}
                  >
                    <span>
                      🔗 {itemMatches.length} match
                      {itemMatches.length > 1 ? "es" : ""} found
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </div>
                )}

                {!isAdmin &&
                  !itemMatches.length &&
                  item.status === "reported" && (
                    <div
                      style={{
                        borderTop: "1px solid var(--border)",
                      }}
                      className="mt-16 pt-16"
                    >
                      <Button
                        variant="secondary"
                        className="full-width-btn"
                        onClick={() => toggleMatches(item.id)}
                        style={{
                          justifyContent: "center",
                        }}
                      >
                        <Search size={14} /> Check for Matches
                      </Button>
                    </div>
                  )}

                {isExpanded && (
                  <div
                    className="manual-matches-container mt-16 p-16"
                    style={{
                      background: "var(--background)",
                      borderRadius: 8,
                    }}
                  >
                    {itemMatches.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                        className="gap-16"
                      >
                        {itemMatches.map((match) => (
                          <div
                            key={match.id}
                            style={{
                              background: "var(--card-bg)",
                              borderRadius: "var(--radius-md)",
                              border: "1px solid var(--border)",
                            }}
                            className="p-16"
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                              className="mb-16"
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: 13,
                                }}
                              >
                                Match #{match.foundId}
                              </span>
                              <span className="match-score-pill">
                                {match.score}%
                              </span>
                            </div>
                            {match.claim_status === "approved" ||
                            match.claim_status === "claim_verified" ? (
                              <Button
                                variant="primary"
                                onClick={() =>
                                  onViewToken(match.claim_token || match.id)
                                }
                                style={{
                                  width: "100%",
                                  fontSize: 12,
                                  justifyContent: "center",
                                }}
                              >
                                <CheckCircle2 size={12} /> View Pick-up Token
                              </Button>
                            ) : match.claim_status === "under_review" ? (
                              <Button
                                variant="secondary"
                                disabled
                                style={{
                                  width: "100%",
                                  fontSize: 12,
                                  justifyContent: "center",
                                }}
                              >
                                <Clock size={12} /> Under Review
                              </Button>
                            ) : (
                              <Button
                                className="btn p-16"
                                onClick={() => onInitiateClaim(match)}
                                style={{
                                  width: "100%",
                                  fontSize: 12,
                                  justifyContent: "center",
                                }}
                              >
                                It's Mine — Verify Claim
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "var(--text-secondary)",
                          fontSize: 13,
                        }}
                        className="p-16"
                      >
                        No matches found yet. We'll keep scanning.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default LostItems;
