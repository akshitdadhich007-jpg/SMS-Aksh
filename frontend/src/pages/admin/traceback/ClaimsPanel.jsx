import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';
import { Button } from '../../../components/ui';
import TracebackStatusBadge from './TracebackStatusBadge';

const ClaimsPanel = ({ claims, approving, onApproveClaim, onRejectClaim }) => {
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const handleReject = (claimId) => {
        if (!rejectReason.trim()) return;
        onRejectClaim(claimId, rejectReason.trim());
        setRejectId(null);
        setRejectReason('');
    };

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div>
            {claims.length === 0 ? (
                <div className="premium-empty-state">
                    <div className="empty-icon-circle"><ShieldCheck size={32} /></div>
                    <h3>No Claims</h3>
                    <p>All claims have been processed or none have been submitted yet.</p>
                </div>
            ) : (
                <div className="traceback-grid">
                    {claims.map((claim) => (
                        <div key={claim.id} className="traceback-claim-card">
                            <div className="claim-header">
                                <div className="claim-user-avatar">{claim.claimant_name?.charAt(0).toUpperCase() || 'R'}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="claim-user-name">{claim.claimant_name || 'Resident'}</div>
                                    <div className="claim-item-ref">
                                        Claiming: {claim.item_details?.description?.substring(0, 60) || 'Item'}
                                        {claim.item_details?.description?.length > 60 && '...'}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                                        <Clock size={10} /> {timeAgo(claim.created_at)}
                                    </div>
                                </div>
                                <TracebackStatusBadge status={claim.status} />
                            </div>

                            {/* Claim Timeline */}
                            <div className="claim-timeline" style={{ margin: '16px 0', paddingLeft: 16, borderLeft: '2px solid var(--border)' }}>
                                <div className="timeline-step">
                                    <span className="timeline-dot done" />
                                    <span>Claim submitted — {timeAgo(claim.created_at)}</span>
                                </div>
                                {claim.status === 'under_review' && (
                                    <div className="timeline-step">
                                        <span className="timeline-dot active" />
                                        <span>Under admin review</span>
                                    </div>
                                )}
                                {claim.status === 'approved' && (
                                    <div className="timeline-step">
                                        <span className="timeline-dot done" />
                                        <span>Approved — Token generated</span>
                                    </div>
                                )}
                                {claim.status === 'rejected' && (
                                    <div className="timeline-step">
                                        <span className="timeline-dot rejected" />
                                        <span>Rejected{claim.reject_reason ? `: ${claim.reject_reason}` : ''}</span>
                                    </div>
                                )}
                            </div>

                            {/* Verification Answers */}
                            <div className="claim-qa-section" style={{ background: 'var(--hover-bg)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                                <h4 style={{ fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <ShieldCheck size={14} color="#6366f1" /> Verification Answers
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
                                    {claim.security_answers?.map((ans, i) => (
                                        <li key={i} style={{ marginBottom: 4 }}>{ans || 'No answer provided'}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Proof Image */}
                            {claim.proof_image && (
                                <div style={{ marginBottom: 16 }}>
                                    <h4 style={{ fontSize: 13, marginBottom: 8, color: 'var(--text-secondary)' }}>📷 Proof Image:</h4>
                                    <img src={claim.proof_image} alt="Proof" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--border)' }} />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="claim-actions">
                                {claim.status === 'under_review' ? (
                                    <>
                                        {rejectId === claim.id ? (
                                            <div style={{ width: '100%' }}>
                                                <textarea
                                                    value={rejectReason}
                                                    onChange={e => setRejectReason(e.target.value)}
                                                    placeholder="Reason for rejection..."
                                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)', marginBottom: 8, fontSize: 13, resize: 'vertical', minHeight: 60 }}
                                                />
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <Button variant="secondary" onClick={() => { setRejectId(null); setRejectReason(''); }} style={{ flex: 1 }}>Cancel</Button>
                                                    <Button variant="danger" onClick={() => handleReject(claim.id)} disabled={!rejectReason.trim()} style={{ flex: 1 }}>
                                                        <XCircle size={14} /> Confirm Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                                                <Button variant="secondary" onClick={() => setRejectId(claim.id)} style={{ flex: 1, justifyContent: 'center' }}>
                                                    <XCircle size={14} /> Reject
                                                </Button>
                                                <Button variant="primary" onClick={() => onApproveClaim(claim.id)} disabled={approving} className="btn-gradient" style={{ flex: 1, justifyContent: 'center' }}>
                                                    <CheckCircle2 size={14} /> Approve & Generate Token
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : claim.status === 'approved' ? (
                                    <div className="traceback-info-box success text-center">
                                        ✅ Approved — Token generated. Wait for claimant to show QR code.
                                    </div>
                                ) : claim.status === 'rejected' ? (
                                    <div className="traceback-info-box error text-center">
                                        ❌ Rejected{claim.reject_reason ? ` — ${claim.reject_reason}` : ''}
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
