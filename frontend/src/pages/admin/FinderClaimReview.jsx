import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Button, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import { getDB, saveDB, logAction } from '../../utils/tracebackStorage';
import { useToast } from '../../components/ui/Toast';
import TracebackStatusBadge from './traceback/TracebackStatusBadge';
import { ShieldCheck, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import '../../styles/Traceback.css';

const FinderClaimReview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [adminComment, setAdminComment] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    // Read from tracebackDB
    const db = getDB();
    const pendingClaims = db.claims.filter(c => ['under_review', 'info_requested'].includes(c.status));
    const currentClaim = pendingClaims[0] || null;

    // Get the associated items
    const lostItem = currentClaim?.lostId ? db.items.find(i => i.id === currentClaim.lostId) : null;
    const foundItem = currentClaim?.foundId ? db.items.find(i => i.id === currentClaim.foundId) : null;

    const updateClaimStatus = (status, reason = '') => {
        if (!currentClaim) return;
        const data = getDB();
        const claimIdx = data.claims.findIndex(c => c.id === currentClaim.id);
        if (claimIdx < 0) return;

        data.claims[claimIdx].status = status;
        data.claims[claimIdx].admin_comment = adminComment;

        if (status === 'rejected') {
            data.claims[claimIdx].reject_reason = reason;
            data.claims[claimIdx].rejected_at = new Date().toISOString();
            // Unlock found item
            if (currentClaim.foundId) {
                const fIdx = data.items.findIndex(i => i.id === currentClaim.foundId);
                if (fIdx >= 0) data.items[fIdx].status = 'matched';
            }
            // Unlock match
            if (currentClaim.matchId) {
                const mIdx = data.matches.findIndex(m => m.id === currentClaim.matchId);
                if (mIdx >= 0) data.matches[mIdx].claim_status = null;
            }
            logAction(data, 'claim_rejected', currentClaim.id, `Rejected: ${reason}`, 'admin');
            toast.info('Claim rejected.');
        } else if (status === 'approved') {
            data.claims[claimIdx].approved_at = new Date().toISOString();
            // Generate token
            const token = 'QR-' + Date.now();
            data.tokens.push({ id: token, claimId: currentClaim.id, expiresAt: Date.now() + 60 * 60 * 1000 });
            // Update items
            if (currentClaim.foundId) {
                const fIdx = data.items.findIndex(i => i.id === currentClaim.foundId);
                if (fIdx >= 0) data.items[fIdx].status = 'returned';
            }
            if (currentClaim.lostId) {
                const lIdx = data.items.findIndex(i => i.id === currentClaim.lostId);
                if (lIdx >= 0) data.items[lIdx].status = 'returned';
            }
            if (currentClaim.matchId) {
                const mIdx = data.matches.findIndex(m => m.id === currentClaim.matchId);
                if (mIdx >= 0) {
                    data.matches[mIdx].claim_status = 'approved';
                    data.matches[mIdx].claim_token = token;
                }
            }
            logAction(data, 'claim_approved', currentClaim.id, `Approved with token ${token}`, 'admin');
            toast.success('Claim approved! Token generated.');
        } else if (status === 'info_requested') {
            data.claims[claimIdx].admin_comment = adminComment || 'Additional information requested.';
            logAction(data, 'info_requested', currentClaim.id, `Requested more info`, 'admin');
            toast.info('Requested more info from claimant.');
        }

        saveDB(data);
        navigate(getTracebackPath(location.pathname, 'matches'));
    }

    if (!currentClaim) {
        return (
            <div className="traceback-page">
                <PageHeader title="Finder Claim Review" subtitle="Review claims for item ownership" />
                <TracebackNav />
                <div className="premium-empty-state">
                    <h3>No Pending Claims</h3>
                    <p>All claims have been reviewed.</p>
                    <Button variant="primary" onClick={() => navigate(getTracebackPath(location.pathname, 'matches'))}>Back to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="traceback-page">
            <PageHeader title="Finder Claim Review" subtitle="Review the claimant's answers before approving." />
            <TracebackNav />

            <div className="traceback-grid">
                {/* Item Details */}
                <div className="traceback-item-summary">
                    <div className="traceback-card-header">Claimed Item Details</div>
                    <div className="traceback-item-summary-meta">
                        <div>{currentClaim.item_details?.description || lostItem?.description || 'Item description'}</div>
                        <div>Category: {currentClaim.item_details?.category || lostItem?.category || 'N/A'}</div>
                        {lostItem?.color && <div>Color: {lostItem.color}</div>}
                        {lostItem?.event_date && <div>Date lost: {lostItem.event_date}</div>}
                        {lostItem?.location && <div>Location: {lostItem.location}</div>}
                    </div>

                    {/* Side-by-side image comparison */}
                    {(lostItem?.image_url || foundItem?.image_url) && (
                        <div style={{ marginTop: 16 }}>
                            <div className="traceback-card-header" style={{ fontSize: 14, marginBottom: 10 }}>📷 Image Comparison</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Lost Item</div>
                                    {lostItem?.image_url ? (
                                        <img src={lostItem.image_url} alt="Lost" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                                    ) : <div style={{ background: 'var(--hover-bg)', padding: 20, borderRadius: 8, textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>No image</div>}
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>Found Item</div>
                                    {foundItem?.image_url ? (
                                        <img src={foundItem.image_url} alt="Found" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                                    ) : <div style={{ background: 'var(--hover-bg)', padding: 20, borderRadius: 8, textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>No image</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div style={{ marginTop: 24, padding: 16, background: 'var(--hover-bg)', borderRadius: 8 }}>
                        <div className="traceback-card-header" style={{ fontSize: 14, marginBottom: 16 }}>Claim Timeline</div>
                        <div className="claim-timeline" style={{ paddingLeft: 12, borderLeft: '2px solid var(--border)' }}>
                            <div className="timeline-step" style={{ position: 'relative', marginBottom: 16 }}>
                                <span className="timeline-dot done" style={{ position: 'absolute', left: -19, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--success)', border: '2px solid white' }} />
                                <div style={{ fontWeight: 500, fontSize: 13 }}>Item Reported</div>
                                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>By Finder</div>
                            </div>
                            <div className="timeline-step" style={{ position: 'relative', marginBottom: 16 }}>
                                <span className="timeline-dot done" style={{ position: 'absolute', left: -19, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--success)', border: '2px solid white' }} />
                                <div style={{ fontWeight: 500, fontSize: 13 }}>Claim Submitted</div>
                                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{new Date(currentClaim.created_at).toLocaleString()}</div>
                            </div>
                            <div className="timeline-step" style={{ position: 'relative', marginBottom: 16 }}>
                                <span className="timeline-dot active" style={{ position: 'absolute', left: -19, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--primary)', border: '2px solid white' }} />
                                <div style={{ fontWeight: 500, fontSize: 13 }}>Under Review</div>
                                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Verification Pending</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Claimant Answers & Actions */}
                <div className="traceback-card">
                    <div className="traceback-card-header">Claimant's Verification Answers</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div className="claim-user-avatar">{currentClaim.claimant_name?.charAt(0) || 'R'}</div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{currentClaim.claimant_name || 'Resident'}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Submitted {new Date(currentClaim.created_at).toLocaleString()}</div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <TracebackStatusBadge status={currentClaim.status} />
                        </div>
                    </div>

                    <div className="traceback-card-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: '#f8fafc', padding: 16, borderRadius: 8 }}>
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label" style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, fontSize: 12 }}>Item Description</div>
                            <div className="traceback-answer-text" style={{ fontSize: 14 }}>{currentClaim.answers?.description || 'N/A'}</div>
                        </div>
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label" style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, fontSize: 12 }}>Lost Location</div>
                            <div className="traceback-answer-text" style={{ fontSize: 14 }}>{currentClaim.answers?.lostLocation || 'N/A'}</div>
                        </div>
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label" style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, fontSize: 12 }}>Unique Marks</div>
                            <div className="traceback-answer-text" style={{ fontSize: 14 }}>{currentClaim.answers?.uniqueMarks || 'N/A'}</div>
                        </div>
                        <div className="traceback-answer-box">
                            <div className="traceback-answer-label" style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, fontSize: 12 }}>Additional Notes</div>
                            <div className="traceback-answer-text" style={{ fontSize: 14 }}>{currentClaim.answers?.notes || 'None'}</div>
                        </div>
                    </div>

                    {/* Proof Image */}
                    {currentClaim.proof_image && (
                        <div style={{ marginTop: 16 }}>
                            <div className="traceback-answer-label">📷 Proof Image</div>
                            <img src={currentClaim.proof_image} alt="Proof" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid var(--border)', marginTop: 8 }} />
                        </div>
                    )}

                    {/* Admin Comment */}
                    <div style={{ marginTop: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Admin Comment (optional)</label>
                        <textarea
                            value={adminComment} onChange={e => setAdminComment(e.target.value)}
                            placeholder="Add review notes..."
                            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, resize: 'vertical', minHeight: 60 }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="traceback-actions" style={{ gap: 10 }}>
                    {showRejectForm ? (
                        <div style={{ width: '100%' }}>
                            <textarea
                                value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection (required)..."
                                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, resize: 'vertical', minHeight: 60, marginBottom: 8 }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Button variant="secondary" onClick={() => setShowRejectForm(false)} style={{ flex: 1 }}>Cancel</Button>
                                <Button variant="danger" onClick={() => updateClaimStatus('rejected', rejectReason)} disabled={!rejectReason.trim()} style={{ flex: 1 }}>
                                    <XCircle size={16} style={{ marginRight: 6 }} /> Confirm Reject
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                            <Button variant="danger" onClick={() => setShowRejectForm(true)} style={{ flex: 1 }}>
                                <XCircle size={16} style={{ marginRight: 6 }} /> Reject
                            </Button>
                            <Button variant="secondary" onClick={() => updateClaimStatus('info_requested')} style={{ flex: 1 }}>
                                <MessageSquare size={16} style={{ marginRight: 6 }} /> Request More Info
                            </Button>
                            <Button variant="primary" onClick={() => updateClaimStatus('approved')} style={{ flex: 1 }}>
                                <CheckCircle2 size={16} style={{ marginRight: 6 }} /> Approve Claim
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinderClaimReview;
