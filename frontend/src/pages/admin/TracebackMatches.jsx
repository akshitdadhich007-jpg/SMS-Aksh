import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    CheckCircle2, ShieldQuestion, X, Lock, Clock, 
    LayoutDashboard, Search, Plus, Box, ShieldCheck 
} from 'lucide-react';
import { PageHeader, Card, Button, QRCodeDisplay, TracebackNav } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';
import TracebackTabs from './traceback/TracebackTabs';
import LostItems from './traceback/LostItems';
import FoundItems from './traceback/FoundItems';
import ClaimsPanel from './traceback/ClaimsPanel';
import '../../styles/Traceback.css';

const TracebackMatches = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

    // Initial Load & SSE
    useEffect(() => {
        fetchData();
        const eventSource = new EventSource('http://localhost:3001/api/traceback/events', { withCredentials: true });
        eventSource.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                if (['new_item', 'claim_update', 'claim_approved', 'item_handover'].includes(parsed.type)) {
                    fetchData();
                }
            } catch (e) {
                console.error('SSE Parse Error', e);
            }
        };
        return () => eventSource.close();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/traceback/matches', { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setMatches(data.matches || []);
                setMyLostItems(data.my_lost_items || []);
                setMyFoundItems(data.my_found_items || []);
                setIncomingClaims(data.incoming_claims || []);
                setIsAdmin(data.is_admin || false);
                setAllLostItems(data.all_lost_reports || []);
                setAllFoundItems(data.all_found_reports || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const submitAnswer = async (e) => {
        e.preventDefault();
        try {
             const response = await fetch('http://localhost:3001/api/traceback/claims', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    match_id: activeMatch.id,
                    security_answers: [quizAnswers.q1, quizAnswers.q2, quizAnswers.q3]
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setQuizOpen(false);
                alert('Claim submitted for approval!');
                fetchData();
            } else {
                alert(data.message);
            }
        } catch(e) {
             console.error(e);
             alert('Error submitting claim');
        }
    };

    const approveClaim = async (claimId) => {
        setApproving(true);
        try {
            const response = await fetch('http://localhost:3001/api/traceback/claims/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claim_id: claimId }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                fetchData();
            } else {
                alert('Approval Failed: ' + data.message);
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
                    <button className="btn-gradient" style={{background: 'white', color: '#4f46e5', border: '1px solid #e2e8f0'}} onClick={() => handleReportRedirect('found')}>
                        <Plus size={16} /> Report Found Item
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="traceback-loading" style={{textAlign:'center', padding: '100px', color: '#64748b'}}>
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
                                            value={quizAnswers[`q${idx+1}`]}
                                            onChange={(e) => setQuizAnswers({...quizAnswers, [`q${idx + 1}`]: e.target.value})}
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
                        <div className="traceback-modal-body" style={{textAlign:'center'}}>
                            <div className="traceback-info-box success" style={{marginBottom:'20px'}}>
                                Your claim was approved! Show this to the finder/security.
                            </div>
                            <QRCodeDisplay token={qrToken} />
                            <Button variant="secondary" style={{marginTop:'20px'}} onClick={() => setQrVisible(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TracebackMatches;
