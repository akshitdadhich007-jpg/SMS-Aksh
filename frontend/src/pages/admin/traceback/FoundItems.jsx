<<<<<<< HEAD
import React from 'react';
import { Box } from 'lucide-react';

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
        'open': { bg: '#e0f2fe', color: '#0369a1', label: 'Searching...' },
        'unclaimed_archive': { bg: '#fee2e2', color: '#b91c1c', label: 'Archived' }
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

const FoundItems = ({ items, isAdmin, onReportFound }) => {
    return (
        <div>
             {items.length === 0 ? (
                <div className="premium-empty-state">
                    <div className="empty-icon-circle"><Box size={32} /></div>
                    <h3>No Found Items Reported</h3>
                    <p>Thank you for keeping our community safe. Report items you find here.</p>
                    <button className="btn-gradient" style={{margin:'0 auto'}} onClick={onReportFound}>
                        + Report Found Item
                    </button>
                </div>
             ) : (
                <div className="traceback-grid-2col">
                    {items.map(item => (
                        <div key={item.id} className="traceback-card item-card">
                            <div className="item-header">
                                <span className="item-category found-category">{item.category}</span>
                                <StatusBadge status={item.status} />
                            </div>
                            <p className="item-desc">{item.description}</p>
                            <div className="item-meta">
                                <Box size={12} style={{marginRight:5}} /> Found at: {item.location} <br/>
                                {isAdmin && <span style={{fontWeight:'bold'}}>Held by: {item.reporter_id === 'security' || item.reporter_id === 'admin' ? 'Security Office' : 'Resident'}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
=======
import React from "react";
import { Box, Clock, Image as ImageIcon } from "lucide-react";
import TracebackStatusBadge from "./TracebackStatusBadge";
const FoundItems = ({ items, isAdmin, onReportFound, searchTerm }) => {
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
            <Box size={32} />
          </div>
          <h3>
            {searchTerm ? "No Matching Found Items" : "No Found Items Reported"}
          </h3>
          <p>
            {searchTerm
              ? "Try adjusting your search."
              : "Thank you for keeping our community safe. Report items you find here."}
          </p>
          {!searchTerm && (
            <button
              className="btn"
              style={{
                margin: "0 auto",
              }}
              onClick={onReportFound}
            >
              + Report Found Item
            </button>
          )}
        </div>
      ) : (
        <div className="traceback-grid-2col">
          {filtered.map((item) => (
            <div key={item.id} className="traceback-card item-card">
              {item.image_url && (
                <div className="traceback-card-thumb">
                  <img src={item.image_url} alt={item.category} />
                </div>
              )}
              <div className="item-header">
                <span className="item-category found-category">
                  {item.category}
                </span>
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
                {timeAgo(item.created_at)} · Found at: {item.location}
                {isAdmin && (
                  <span
                    style={{
                      fontWeight: "bold",
                      display: "block",
                    }}
                    className="mt-16"
                  >
                    Held by:{" "}
                    {item.reporter_id === "security" ||
                    item.reporter_id === "admin"
                      ? "Security Office"
                      : "Resident"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FoundItems;
