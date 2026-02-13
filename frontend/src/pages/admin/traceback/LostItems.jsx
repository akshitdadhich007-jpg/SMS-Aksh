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
    );
};

export default LostItems;