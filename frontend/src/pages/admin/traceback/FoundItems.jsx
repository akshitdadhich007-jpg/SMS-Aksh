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
    );
};

export default FoundItems;
