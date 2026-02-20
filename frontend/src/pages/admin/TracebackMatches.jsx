import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CheckCircle2, ShieldQuestion, X, Lock, Clock,
    LayoutDashboard, Search, Plus, Box, ShieldCheck, Upload
} from 'lucide-react';
import { PageHeader, Button } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import { getDB, saveDB, logAction, checkExpiry, imageToBase64 } from '../../utils/tracebackStorage';
import { getAIQuestions } from '../../utils/tracebackAI';
import { useToast } from '../../components/ui/Toast';
import TracebackTabs from './traceback/TracebackTabs';
import LostItems from './traceback/LostItems';
import FoundItems from './traceback/FoundItems';
import ClaimsPanel from './traceback/ClaimsPanel';
import TracebackAnalytics from './traceback/TracebackAnalytics';
import '../../styles/Traceback.css';

const TracebackMatches = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const isSecurity = location.pathname.includes('/security');
    const isAdmin = location.pathname.includes('/admin') || isSecurity;

    const [db, setDb] = useState(null);
    const [activeTab, setActiveTab] = useState('lost');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modals
    const [qrToken, setQrToken] = useState('');
    const [qrVisible, setQrVisible] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);
    const [activeMatch, setActiveMatch] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '' });
    const [proofImage, setProofImage] = useState('');
    const [approving, setApproving] = useState(false);

    // Sync route with tab
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/inventory') || path.includes('/report-found')) setActiveTab('found');
        else if (path.includes('/claims')) setActiveTab('claims');
        else setActiveTab('lost');
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // No navigation for analytics/archived — just switch tab
    };

    // Load data
    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        try {
            let data = getDB();
            data = checkExpiry(data);
            setDb(data);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Derived data
    const allLostItems = useMemo(() => db?.items?.filter(i => i.type === 'lost' && !['expired', 'archived'].includes(i.status)) || [], [db]);
    const allFoundItems = useMemo(() => db?.items?.filter(i => i.type === 'found' && !['archived'].includes(i.status)) || [], [db]);
    const archivedItems = useMemo(() => db?.items?.filter(i => ['expired', 'archived'].includes(i.status)) || [], [db]);
    const matches = useMemo(() => db?.matches || [], [db]);
    const claims = useMemo(() => db?.claims || [], [db]);

    const stats = {
        lost: allLostItems.length,
        found: allFoundItems.length,
        claims: claims.filter(c => c.status === 'under_review').length,
        returned: (db?.items || []).filter(i => ['collected', 'handed_over', 'returned'].includes(i.status)).length,
        archived: archivedItems.length,
    };

    const handleReportRedirect = (type) => {
        const basePath = getTracebackPath(location.pathname).split('/traceback')[0] + '/traceback';
        navigate(`${basePath}/report-${type}`);
    };

    // ---- Claim Flow ----
    const initiateClaim = (match) => {
        // Check if already under review
        const existingClaim = claims.find(c => c.matchId === match.id && c.status === 'under_review');
        if (existingClaim) {
            toast.warning('This item already has a claim under review.');
            return;
        }
        setActiveMatch(match);
        setQuizOpen(true);
        setQuizAnswers({ q1: '', q2: '', q3: '' });
        setProofImage('');
    };

    const handleProofUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Proof image must be under 5MB.'); return; }
        try {
            const b64 = await imageToBase64(file);
            setProofImage(b64);
        } catch { toast.error('Failed to process image.'); }
    };

    const submitClaim = (e) => {
        e.preventDefault();
        if (!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3) {
            toast.error('Please answer all verification questions.');
            return;
        }

        try {
            const data = getDB();

            // Find the found item for description snapshot
            const foundItem = data.items.find(i => i.id === activeMatch.foundId) || {};

            const newClaim = {
                id: 'TC' + Date.now(),
                matchId: activeMatch.id,
                lostId: activeMatch.lostId,
                foundId: activeMatch.foundId,
                item_details: { description: foundItem.description, category: foundItem.category },
                claimant_name: 'Resident (You)',
                security_answers: [quizAnswers.q1, quizAnswers.q2, quizAnswers.q3],
                proof_image: proofImage || '',
                confidenceScore: 50 + Math.floor(Math.random() * 40),
                status: 'under_review',
                reject_reason: '',
                created_at: new Date().toISOString(),
            };

            data.claims.push(newClaim);

            // Update match status
            const mIdx = data.matches.findIndex(m => m.id === activeMatch.id);
            if (mIdx >= 0) data.matches[mIdx].claim_status = 'under_review';

            // Lock the found item
            const fIdx = data.items.findIndex(i => i.id === activeMatch.foundId);
            if (fIdx >= 0) data.items[fIdx].status = 'under_review';

            logAction(data, 'claim_submitted', newClaim.id, `Claim submitted for match ${activeMatch.id}`, 'current_user');
            saveDB(data);

            setQuizOpen(false);
            toast.success('Claim submitted for review! Admin will verify your answers.');
            refreshData();
        } catch (err) {
            console.error(err);
            toast.error('Error submitting claim.');
        }
    };

    const approveClaim = (claimId) => {
        setApproving(true);
        try {
            const data = getDB();
            const claim = data.claims.find(c => c.id === claimId);
            if (!claim) return;

            claim.status = 'approved';
            claim.approved_at = new Date().toISOString();

            // Generate Token
            const token = 'QR-' + Date.now();
            data.tokens.push({ id: token, claimId, expiresAt: Date.now() + 60 * 60 * 1000 });

            // Update match
            const mIdx = data.matches.findIndex(m => m.id === claim.matchId);
            if (mIdx >= 0) {
                data.matches[mIdx].claim_status = 'approved';
                data.matches[mIdx].claim_token = token;
            }

            // Update items to returned
            const fIdx = data.items.findIndex(i => i.id === claim.foundId);
            if (fIdx >= 0) data.items[fIdx].status = 'returned';
            const lIdx = data.items.findIndex(i => i.id === claim.lostId);
            if (lIdx >= 0) data.items[lIdx].status = 'returned';

            logAction(data, 'claim_approved', claimId, `Claim ${claimId} approved, token ${token} generated`, isAdmin ? 'admin' : 'security');
            saveDB(data);

            toast.success('Claim approved! Pick-up token generated.');
            refreshData();
        } catch (err) {
            console.error(err);
            toast.error('Error approving claim.');
        } finally {
            setApproving(false);
        }
    };

    const rejectClaim = (claimId, reason) => {
        try {
            const data = getDB();
            const claim = data.claims.find(c => c.id === claimId);
            if (!claim) return;

            claim.status = 'rejected';
            claim.reject_reason = reason;
            claim.rejected_at = new Date().toISOString();

            // Unlock the found item
            const fIdx = data.items.findIndex(i => i.id === claim.foundId);
            if (fIdx >= 0) data.items[fIdx].status = 'matched';

            // Unlock match for future claims
            const mIdx = data.matches.findIndex(m => m.id === claim.matchId);
            if (mIdx >= 0) data.matches[mIdx].claim_status = null;

            logAction(data, 'claim_rejected', claimId, `Claim ${claimId} rejected: ${reason}`, isAdmin ? 'admin' : 'security');
            saveDB(data);

            toast.info('Claim rejected. Item unlocked for other claims.');
            refreshData();
        } catch (err) {
            console.error(err);
            toast.error('Error rejecting claim.');
        }
    };

    const viewToken = (token) => { setQrToken(token); setQrVisible(true); };

    // Get questions for the active match
    const currentQuestions = activeMatch
        ? getAIQuestions(db?.items?.find(i => i.id === activeMatch.foundId)?.category)
        : [];

    return (
        <div className="traceback-page">
            {/* Header */}
            <div className="premium-header">
                <div className="header-title-group">
                    <div className="header-icon-box"><LayoutDashboard size={24} /></div>
                    <div className="header-text">
                        <h1>{isAdmin ? 'Security Control Center' : 'Traceback Dashboard'}</h1>
                        <p>{isAdmin ? 'Monitor lost items and approve claims securely.' : 'Manage your reports and track item recovery.'}</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-gradient" onClick={() => handleReportRedirect('lost')}>
                        <Search size={16} /> Report Lost
                    </button>
                    <button className="btn-gradient" style={{ background: 'white', color: '#4f46e5', border: '1px solid #e2e8f0' }} onClick={() => handleReportRedirect('found')}>
                        <Plus size={16} /> Report Found
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="traceback-skeleton-container">
                    {[1, 2, 3, 4].map(i => <div key={i} className="traceback-skeleton-card" />)}
                </div>
            ) : (
                <div className="traceback-content">
                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card stat-blue"><div className="stat-icon"><Search /></div>
                            <div className="stat-info"><h3>{stats.lost}</h3><p>Lost Items</p></div></div>
                        <div className="stat-card stat-purple"><div className="stat-icon"><Box /></div>
                            <div className="stat-info"><h3>{stats.found}</h3><p>Found Items</p></div></div>
                        <div className="stat-card stat-orange"><div className="stat-icon"><ShieldCheck /></div>
                            <div className="stat-info"><h3>{stats.claims}</h3><p>Pending Claims</p></div></div>
                        <div className="stat-card stat-green"><div className="stat-icon"><CheckCircle2 /></div>
                            <div className="stat-info"><h3>{stats.returned}</h3><p>Returned</p></div></div>
                    </div>

                    {/* Search */}
                    <div className="traceback-search-bar">
                        <Search size={16} color="var(--text-secondary)" />
                        <input
                            type="text" placeholder="Search items by description, category, location..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="btn-icon"><X size={16} /></button>}
                    </div>

                    {/* Tabs */}
                    <TracebackTabs
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        counts={stats}
                        isAdmin={isAdmin}
                    />

                    {/* Tab Content */}
                    {activeTab === 'lost' && (
                        <LostItems
                            items={allLostItems}
                            matches={matches}
                            isAdmin={isAdmin}
                            onViewToken={viewToken}
                            onInitiateClaim={initiateClaim}
                            onReportLost={() => handleReportRedirect('lost')}
                            searchTerm={searchTerm}
                        />
                    )}

                    {activeTab === 'found' && (
                        <FoundItems
                            items={allFoundItems}
                            isAdmin={isAdmin}
                            onReportFound={() => handleReportRedirect('found')}
                            searchTerm={searchTerm}
                        />
                    )}

                    {activeTab === 'claims' && (
                        <ClaimsPanel
                            claims={claims}
                            approving={approving}
                            onApproveClaim={approveClaim}
                            onRejectClaim={rejectClaim}
                        />
                    )}

                    {activeTab === 'archived' && (
                        <div>
                            {archivedItems.length === 0 ? (
                                <div className="premium-empty-state">
                                    <div className="empty-icon-circle"><Clock size={32} /></div>
                                    <h3>No Archived Items</h3>
                                    <p>Items expire after 60 days (lost) or 90 days (found).</p>
                                </div>
                            ) : (
                                <div className="traceback-grid-2col">
                                    {archivedItems.map(item => (
                                        <div key={item.id} className="traceback-card item-card" style={{ opacity: 0.7 }}>
                                            <div className="item-header">
                                                <span className="item-category">{item.category}</span>
                                                <span style={{ fontSize: 11, color: '#b91c1c', fontWeight: 600 }}>{item.status === 'expired' ? 'Expired' : 'Archived'}</span>
                                            </div>
                                            <p className="item-desc">{item.description}</p>
                                            <div className="item-meta"><Clock size={12} /> {item.type} · {item.location}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'analytics' && isAdmin && (
                        <TracebackAnalytics db={db} />
                    )}
                </div>
            )}

            {/* Claim Quiz Modal */}
            {quizOpen && activeMatch && (
                <div className="traceback-modal-overlay">
                    <div className="traceback-modal">
                        <div className="traceback-modal-header">
                            <h3 className="traceback-modal-title">
                                <ShieldQuestion size={24} style={{ marginRight: 8, color: '#4f46e5' }} />
                                Proof of Ownership
                            </h3>
                            <button className="btn-icon" onClick={() => setQuizOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="traceback-modal-body">
                            <div className="traceback-info-box warning" style={{ marginBottom: 20 }}>
                                <Lock size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                <span>Answer these verification questions. Your claim will be reviewed by an admin before approval.</span>
                            </div>

                            <form className="traceback-form" onSubmit={submitClaim}>
                                {currentQuestions.map((question, idx) => (
                                    <div key={idx} className="traceback-form-group">
                                        <label className="traceback-form-label">Question {idx + 1}</label>
                                        <div className="traceback-question-text">{question}</div>
                                        <textarea
                                            className="traceback-form-textarea"
                                            rows={2} required
                                            value={quizAnswers[`q${idx + 1}`]}
                                            onChange={e => setQuizAnswers({ ...quizAnswers, [`q${idx + 1}`]: e.target.value })}
                                            placeholder="Type your answer..."
                                        />
                                    </div>
                                ))}

                                <div className="traceback-form-group">
                                    <label className="traceback-form-label">Proof Image (optional)</label>
                                    <div className="traceback-upload-area" onClick={() => document.getElementById('proof-upload')?.click()} style={{ cursor: 'pointer' }}>
                                        <Upload size={20} color="var(--text-secondary)" />
                                        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Upload proof photo (receipt, photo with item, etc.)</p>
                                        <input id="proof-upload" type="file" accept="image/*" onChange={handleProofUpload} style={{ display: 'none' }} />
                                    </div>
                                    {proofImage && (
                                        <div style={{ marginTop: 8 }}>
                                            <img src={proofImage} alt="Proof" style={{ maxHeight: 120, borderRadius: 8, border: '1px solid var(--border)' }} />
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                                    <Button variant="secondary" type="button" onClick={() => setQuizOpen(false)}>Cancel</Button>
                                    <Button variant="primary" type="submit">Submit Claim for Review</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Token Modal */}
            {qrVisible && qrToken && (
                <div className="traceback-modal-overlay">
                    <div className="traceback-modal">
                        <div className="traceback-modal-header">
                            <h3>Pick-up Token (Approved)</h3>
                            <button className="btn-icon" onClick={() => setQrVisible(false)}><X size={24} /></button>
                        </div>
                        <div className="traceback-modal-body" style={{ textAlign: 'center' }}>
                            <div className="traceback-info-box success" style={{ marginBottom: 20 }}>
                                ✅ Your claim was approved! Show this token to security for item pick-up.
                            </div>
                            <div className="fake-qr">{qrToken}</div>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
                                Token expires in 60 minutes. Present at security desk.
                            </p>
                            <Button variant="secondary" onClick={() => setQrVisible(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TracebackMatches;
