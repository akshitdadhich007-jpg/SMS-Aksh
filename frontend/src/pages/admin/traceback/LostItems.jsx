<<<<<<< HEAD
import React, { useState } from 'react';
import { Clock, Search, Box, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../../components/ui';

const StatusBadge = ({ status }) => {
    const styles = {
        'reported': { bg: '#e0f2fe', color: '#0369a1', label: 'Reported / Open' },
        'matched': { bg: '#f0f9ff', color: '#0284c7', label: 'Match Found' },
        'claimed': { bg: '#fff7ed', color: '#c2410c', label: 'Claim Pending' },
        'claim_pending': { bg: '#fff7ed', color: '#c2410c', label: 'Verification Needed' },
        'approved': { bg: '#dcfce7', color: '#15803d', label: 'Approved' },
        'collected': { bg: '#f3f4f6', color: '#374151', label: 'Collected' },
        'handed_over': { bg: '#f3f4f6', color: '#374151', label: 'Handed Over' },
        'closed': { bg: '#94a3b8', color: '#ffffff', label: 'Closed' },
        'expired': { bg: '#fee2e2', color: '#b91c1c', label: 'Expired' },
        'open': { bg: '#e0f2fe', color: '#0369a1', label: 'Reported' } 
    };
    const s = styles[status] || { bg: '#f3f4f6', color: '#4b5563', label: status };
    return (
        <span style={{ 
            backgroundColor: s.bg, color: s.color, 
            padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' 
        }}>
            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: s.color}}></span>
            {s.label}
        </span>
    );
};

const LostItems = ({ items, matches, isAdmin, onViewToken, onInitiateClaim, onReportLost }) => {
    const [expandedItemId, setExpandedItemId] = useState(null);

    const toggleMatches = (itemId) => {
        if (expandedItemId === itemId) {
            setExpandedItemId(null);
        } else {
            setExpandedItemId(itemId);
        }
    };

    const getMatchesForItem = (itemId) => {
        if (!matches) return [];
        return matches.filter(m => m.lost_item_id === itemId);
    };

    return (
        <div>
            {items.length === 0 ? (
                <div className="premium-empty-state">
                    <div className="empty-icon-circle"><Search size={32} /></div>
                    <h3>No Active Lost Reports</h3>
                    <p>Report a lost item to start tracking.</p>
                    <button className="btn-gradient" style={{margin:'0 auto'}} onClick={onReportLost}>
                        + Report Lost Item
                    </button>
                </div>
            ) : (
                <div className="traceback-grid-2col">
                    {items.map(item => {
                        const itemMatches = getMatchesForItem(item.id);
                        const isExpanded = expandedItemId === item.id;
                        
                        return (
                            <div key={item.id} className="traceback-card item-card" style={{display:'flex', flexDirection:'column'}}>
                                <div className="item-header">
                                    <span className="item-category">{item.category}</span>
                                    <StatusBadge status={item.status} />
                                </div>
                                <p className="item-desc">{item.description}</p>
                                <div className="item-meta">
                                    <Clock size={12} style={{marginRight:5}} /> Reported: {new Date(item.event_date || item.created_at).toLocaleDateString()} <br/>
                                    {isAdmin && <span style={{fontWeight:'bold', color: '#6366f1'}}>By User: {item.reporter_id?.substring(0,8)}...</span>}
                                </div>
                                
                                {!isAdmin && (
                                    <div style={{marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f5f9'}}>
                                        <Button 
                                            variant="secondary" 
                                            className="full-width-btn" 
                                            onClick={() => toggleMatches(item.id)}
                                            style={{justifyContent: 'center'}}
                                        >
                                            {isExpanded ? <ChevronUp size={16}/> : <Search size={16} />}
                                            {isExpanded ? 'Hide Potential Matches' : 'Check for Matches'}
                                        </Button>
                                        
                                        {isExpanded && (
                                            <div className="manual-matches-container" style={{marginTop: '15px', background: '#f8fafc', padding: '10px', borderRadius: '8px'}}>
                                                {itemMatches.length > 0 ? (
                                                    <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                                                        <div style={{fontSize:'12px', fontWeight:'bold', color:'#64748b'}}>FOUND {itemMatches.length} POTENTIAL MATCH(ES)</div>
                                                        {itemMatches.map(match => (
                                                            <div key={match.id} className="manual-match-item" style={{background:'white', padding:'10px', borderRadius:'6px', border:'1px solid #e2e8f0'}}>
                                                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                                                                    <span style={{fontWeight:'600', fontSize:'13px'}}>Found Item #{match.found_item?.id}</span>
                                                                    <span className="match-score-pill" style={{marginBottom:0, fontSize:'10px'}}>{match.match_score}% Match</span>
                                                                </div>
                                                                <p style={{fontSize:'12px', color:'#475569', marginBottom:'8px'}}>{match.found_item?.description}</p>
                                                                
                                                                {match.claim_status === 'approved' ? (
                                                                    <Button variant="success" size="sm" onClick={() => onViewToken(match.claim_token)} style={{width:'100%', fontSize:'12px'}}>
                                                                        <CheckCircle2 size={12} /> Pick-up Token
                                                                    </Button>
                                                                ) : match.claim_status === 'pending_approval' ? (
                                                                    <Button variant="secondary" disabled size="sm" style={{width:'100%', fontSize:'12px'}}>
                                                                        <Clock size={12} /> Pending
                                                                    </Button>
                                                                ) : (
                                                                    <Button className="btn-gradient" size="sm" onClick={() => onInitiateClaim(match)} style={{width:'100%', fontSize:'12px', padding:'6px'}}>
                                                                        It's Mine (Verify)
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div style={{textAlign:'center', color:'#94a3b8', fontSize:'13px', padding:'10px'}}>
                                                        No matches found at this time.
                                                    </div>
                                                )}
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
=======
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
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
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
