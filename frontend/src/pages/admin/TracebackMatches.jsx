import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CheckCircle2, ShieldQuestion, X, Lock, Clock,
    LayoutDashboard, Search, Plus, Box, ShieldCheck
} from 'lucide-react';
import { PageHeader, Card, Button, QRCodeDisplay, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import { getDB, saveDB } from '../../utils/tracebackStorage';
import TracebackTabs from './traceback/TracebackTabs';
import LostItems from './traceback/LostItems';
import FoundItems from './traceback/FoundItems';
import ClaimsPanel from './traceback/ClaimsPanel';
import '../../styles/Traceback.css';

const TracebackMatches = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Simulate user ID for demo
    const userId = "current_user_id";
    const isSecurity = location.pathname.includes('/security');

    // State
    const [matches, setMatches] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [myLostItems, setMyLostItems] = useState([]);
    const [myFoundItems, setMyFoundItems] = useState([]);
    const [allLostItems, setAllLostItems] = useState([]);
    const [allFoundItems, setAllFoundItems] = useState([]);
    const [incomingClaims, setIncomingClaims] = useState([]);
    const [activeTab, setActiveTab] = useState('lost');
    const [loading, setLoading] = useState(true);

    // Modals
    const [qrToken, setQrToken] = useState('');
    const [qrVisible, setQrVisible] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);
    const [activeMatch, setActiveMatch] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({ q1: '', q2: '', q3: '' });
    const [approving, setApproving] = useState(false);

    // Sync Route with Tab
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/inventory') || path.includes('/report-found')) {
            setActiveTab('found');
        } else if (path.includes('/claims')) {
            setActiveTab('claims');
        } else {
            setActiveTab('lost');
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        let subPath = 'matches';
        if (tab === 'found') subPath = 'inventory';
        if (tab === 'claims') subPath = 'claims';
        // Navigate using helper
        const basePath = getTracebackPath(location.pathname).split('/traceback')[0] + '/traceback';
        navigate(`${basePath}/${subPath}`);
    };

    // Initial Load
    useEffect(() => {
        fetchData();
        // Poll for updates (simulating SSE)
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = () => {
        try {
            const db = getDB();

            // Filter items for current user view
            // In a real app, we'd filter by userId. For demo, we show all or simulate filtering.

            setMatches(db.matches || []);
            setAllLostItems(db.items.filter(i => i.type === 'lost') || []);
            setAllFoundItems(db.items.filter(i => i.type === 'found') || []);

            // For demo purposes, "my items" are just all items
            setMyLostItems(db.items.filter(i => i.type === 'lost') || []);
            setMyFoundItems(db.items.filter(i => i.type === 'found') || []);

            // Check claims
            const claims = db.claims || [];
            setIncomingClaims(claims);

            setIsAdmin(isSecurity);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Logic Functions
    const getAIQuestions = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('phone') || cat.includes('mobile')) return ['What is the wallpaper?', 'What is the color of the case?', 'Any scratches?'];
        if (cat.includes('wallet') || cat.includes('card')) return ['What cards are inside?', 'What color is it?', 'Any cash amount?'];
        if (cat.includes('bag')) return ['Brand name?', 'Contents inside?', 'Color/Type?'];
        return ['Describe a unique feature.', 'When exactly did you lose it?', 'Color and Brand?'];
    };

    const initiateClaim = (match) => {
        setActiveMatch(match);
        setQuizOpen(true);
        setQuizAnswers({ q1: '', q2: '', q3: '' });
    };

    const submitAnswer = (e) => {
        e.preventDefault();
        try {
            const db = getDB();

            const newClaim = {
                id: Date.now(),
                matchId: activeMatch.id,
                item_details: activeMatch.found_item || activeMatch.lost_item || {}, // store snapshot
                claimant_name: 'Resident (You)',
                security_answers: [quizAnswers.q1, quizAnswers.q2, quizAnswers.q3],
                confidenceScore: 50 + Math.floor(Math.random() * 50),
                status: 'approved', // Auto-approve for demo!
                created_at: new Date().toISOString()
            };

            db.claims.push(newClaim);

            // Generate fake QR token immediately since we auto-approved
            const token = "QR-" + Date.now();
            db.tokens.push({
                id: token,
                claimId: newClaim.id,
                expiresAt: Date.now() + 15 * 60 * 1000
            });

            // Update match/item statuses
            const mIndex = db.matches.findIndex(m => m.id === activeMatch.id);
            if (mIndex >= 0) db.matches[mIndex].claim_status = 'approved';

            // Update found item to approved/claimed
            const fIndex = db.items.findIndex(i => i.id === activeMatch.foundId);
            if (fIndex >= 0) db.items[fIndex].status = 'approved';

            // Update lost item to approved/claimed
            const lIndex = db.items.findIndex(i => i.id === activeMatch.lostId);
            if (lIndex >= 0) db.items[lIndex].status = 'approved';

            saveDB(db);

            setQuizOpen(false);
            alert('Claim Verified & Approved instantly! Token generated.');
            fetchData();

            // Show token immediately
            setQrToken(token);
            setQrVisible(true);

        } catch (e) {
            console.error(e);
            alert('Error submitting claim');
        }
    };

    const approveClaim = (claimId) => {
        setApproving(true);
        try {
            const db = getDB();
            const claim = db.claims.find(c => c.id === claimId);
            if (claim) {
                claim.status = 'approved';

                // Generate Token if not exists
                if (!db.tokens.find(t => t.claimId === claimId)) {
                    db.tokens.push({
                        id: "QR-" + Date.now(),
                        claimId: claimId,
                        expiresAt: Date.now() + 15 * 60 * 1000
                    });
                }
                saveDB(db);
                alert('Claim Manually Approved');
                fetchData();
            }
        } catch (e) {
            console.error(e);
            alert('Error approving claim');
        } finally {
            setApproving(false);
        }
    };

    const viewToken = (token) => {
        setQrToken(token);
        setQrVisible(true);
    };

    const handleReportRedirect = (type) => {
        const basePath = getTracebackPath(location.pathname).split('/traceback')[0] + '/traceback';
        navigate(`${basePath}/report-${type}`);
    }

    // Stats
    const stats = {
        lost: isAdmin ? allLostItems.length : myLostItems.length,
        found: isAdmin ? allFoundItems.length : myFoundItems.length,
        claims: incomingClaims.length,
        returned: (isAdmin ? allLostItems : myLostItems).filter(i => ['collected', 'handed_over'].includes(i.status)).length
    };

    return (
        <div className="traceback-page">
            {/* Header */}
            <div className="premium-header">
                <div className="header-title-group">
                    <div className="header-icon-box"><LayoutDashboard size={24} /></div>
                    <div className="header-text">
                        <h1>{isAdmin ? "Security Control Center" : "Traceback Dashboard"}</h1>
                        <p>{isAdmin ? "Monitor lost items and approve claims securely." : "Manage your reports and track item recovery."}</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-gradient" onClick={() => handleReportRedirect('lost')}>
                        <Search size={16} /> Report Lost Item
                    </button>
                    <button className="btn-gradient" style={{ background: 'white', color: '#4f46e5', border: '1px solid #e2e8f0' }} onClick={() => handleReportRedirect('found')}>
                        <Plus size={16} /> Report Found Item
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="traceback-loading" style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>
                    <div className="spinner"></div> Loading secure dashboard data...
                </div>
            ) : (
                <div className="traceback-content">
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card stat-blue">
                            <div className="stat-icon"><Search /></div>
                            <div className="stat-info"><h3>{stats.lost}</h3><p>Lost Items</p></div>
                        </div>
                        <div className="stat-card stat-purple">
                            <div className="stat-icon"><Box /></div>
                            <div className="stat-info"><h3>{stats.found}</h3><p>Found Items</p></div>
                        </div>
                        <div className="stat-card stat-orange">
                            <div className="stat-icon"><ShieldCheck /></div>
                            <div className="stat-info"><h3>{stats.claims}</h3><p>Pending Claims</p></div>
                        </div>
                        <div className="stat-card stat-green">
                            <div className="stat-icon"><CheckCircle2 /></div>
                            <div className="stat-info"><h3>{stats.returned}</h3><p>Returned</p></div>
                        </div>
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
                            items={isAdmin ? allLostItems : myLostItems}
                            matches={matches}
                            isAdmin={isAdmin}
                            onViewToken={viewToken}
                            onInitiateClaim={initiateClaim}
                            onReportLost={() => handleReportRedirect('lost')}
                        />
                    )}

                    {activeTab === 'found' && (
                        <FoundItems
                            items={isAdmin ? allFoundItems : myFoundItems}
                            isAdmin={isAdmin}
                            onReportFound={() => handleReportRedirect('found')}
                        />
                    )}

                    {activeTab === 'claims' && (
                        <ClaimsPanel
                            claims={incomingClaims}
                            approving={approving}
                            onApproveClaim={approveClaim}
                        />
                    )}
                </div>
            )}

            {/* Modals */}
            {quizOpen && activeMatch && (
                <div className="traceback-modal-overlay">
                    <div className="traceback-modal">
                        <div className="traceback-modal-header">
                            <h3 className="traceback-modal-title">
                                <ShieldQuestion size={24} style={{ marginRight: '8px', color: '#4f46e5' }} />
                                Proof of Ownership
                            </h3>
                            <button className="btn-icon" onClick={() => setQuizOpen(false)}><X size={24} /></button>
                        </div>
                        <div className="traceback-modal-body">
                            <div className="traceback-info-box warning" style={{ marginBottom: '20px' }}>
                                <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                <span>Answer these questions correctly. Your answers will be sent to the finder for verification.</span>
                            </div>

                            <form className="traceback-form" onSubmit={submitAnswer}>
                                {getAIQuestions(activeMatch.found_item?.category).map((question, idx) => (
                                    <div key={idx} className="traceback-form-group">
                                        <label className="traceback-form-label">Question {idx + 1}</label>
                                        <div className="traceback-question-text">{question}</div>
                                        <textarea
                                            className="traceback-form-textarea"
                                            rows={2}
                                            required
                                            value={quizAnswers[`q${idx + 1}`]}
                                            onChange={(e) => setQuizAnswers({ ...quizAnswers, [`q${idx + 1}`]: e.target.value })}
                                            placeholder="Type your answer verification..."
                                        />
                                    </div>
                                ))}

                                <div className="traceback-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                    <Button variant="secondary" type="button" onClick={() => setQuizOpen(false)}>Cancel</Button>
                                    <Button variant="primary" type="submit">Send to Finder</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {qrVisible && qrToken && (
                <div className="traceback-modal-overlay">
                    <div className="traceback-modal">
                        <div className="traceback-modal-header">
                            <h3>Claim Token (Approved)</h3>
                            <button className="btn-icon" onClick={() => setQrVisible(false)}><X size={24} /></button>
                        </div>
                        <div className="traceback-modal-body" style={{ textAlign: 'center' }}>
                            <div className="traceback-info-box success" style={{ marginBottom: '20px' }}>
                                Your claim was approved! Show this to the finder/security.
                            </div>

                            {/* <QRCodeDisplay token={qrToken} /> */}
                            {/* Step 5 - QR Display Component */}
                            <div>
                                <h3>Pickup QR Code</h3>
                                <div className="fake-qr">
                                    {qrToken}
                                </div>
                            </div>

                            <Button variant="secondary" style={{ marginTop: '20px' }} onClick={() => setQrVisible(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TracebackMatches;
