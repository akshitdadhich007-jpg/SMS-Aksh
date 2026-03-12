<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    CheckCircle2, ShieldQuestion, X, Lock, Clock, 
    LayoutDashboard, Search, Plus, Box, ShieldCheck,
    Filter, MapPin, Calendar, Tag, AlertCircle,
    ChevronRight, ArrowRight, User
} from 'lucide-react';
import { QRCodeDisplay } from '../../components/ui';
import { getTracebackPath } from '../../utils/tracebackHelper';

// --- Sub-Components (Internal for Modern UI) ---

const StatCard = ({ label, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-slate-50 text-slate-600'}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
                <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
        </div>
    );
};

const ItemCard = ({ item, type, onAction, actionLabel, secondaryAction }) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
        <div className="h-48 bg-slate-100 relative overflow-hidden shrink-0">
            {item.image_url ? (
                <img src={item.image_url} alt={item.description} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                    <Box size={48} strokeWidth={1} />
                </div>
            )}
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                ${item.status === 'matched' ? 'bg-emerald-500 text-white' : 
                  item.status === 'pending' ? 'bg-amber-500 text-white' : 
                  'bg-slate-900/80 text-white backdrop-blur-sm'}`}>
                {item.status}
            </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-slate-900 line-clamp-1" title={item.description}>{item.description}</h4>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit mb-4">
                {item.category}
            </span>
        
            <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center text-sm text-slate-500">
                    <MapPin size={14} className="mr-2 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location || 'Unknown Location'}</span>
                </div>
                <div className="flex items-center text-sm text-slate-500">
                    <Calendar size={14} className="mr-2 text-slate-400 shrink-0" />
                    <span>{item.date_lost || item.date_found}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                <button 
                    onClick={() => onAction(item)}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-indigo-200"
                >
                    {actionLabel}
                </button>
                {secondaryAction && (
                    <button 
                        onClick={() => secondaryAction(item)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    </div>
);

const EmptyState = ({ title, message, action, actionLabel }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
            <Search size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-slate-500 max-w-sm mb-6">{message}</p>
        {action && (
            <button 
                onClick={action}
                className="px-6 py-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-medium rounded-lg transition-all shadow-sm"
            >
                {actionLabel}
            </button>
        )}
    </div>
);


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
        const basePath = getTracebackPath(location.pathname).split('/traceback')[0] + '/traceback';
        navigate(`${basePath}/${subPath}`);
    };

    // Initial Load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/traceback/matches', { credentials: 'include' });
            if (!response.ok) throw new Error('Backend not available');
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
            console.warn('Backend unavailable, using Demo Mock Data');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const role = user.role || 'resident';
            const isUserAdmin = role === 'admin';
            
            setIsAdmin(isUserAdmin);
            
            const mockLost = [
                { id: 101, description: 'Black Leather Wallet', category: 'Wallet', location: 'Central Park', date_lost: '2026-02-12', status: 'matched', image_url: null },
                { id: 102, description: 'Blue Umbrella', category: 'Personal', location: 'Lobby', date_lost: '2026-02-10', status: 'reported', image_url: null }
            ];
            
            const mockFound = [
                { id: 201, description: 'Black Wallet found near bench', category: 'Wallet', location: 'Central Park', date_found: '2026-02-13', status: 'matched', image_url: null },
                { id: 202, description: 'Keys with Honda keychain', category: 'Keys', location: 'Parking B1', date_found: '2026-02-11', status: 'open', image_url: null }
            ];

            const mockMatches = [
                {
                    id: 1,
                    lost_item_id: 101,
                    found_item_id: 201,
                    similarity_score: 95,
                    status: 'pending',
                    lost_item: mockLost[0],
                    found_item: mockFound[0]
                }
            ];

            let finalIncomingClaims = [];
            if (role === 'security' || role === 'admin') {
                finalIncomingClaims = [
                    { 
                        id: 301, 
                        claimant_name: 'Raj Kumar', 
                        status: 'pending_approval', 
                        item_details: mockFound[0], 
                        security_answers: ['Black leather with a small scratch', 'Rs 500 note and some coins', 'No other distinctive marks']
                    }
                ];
            } else {
                 const itemIFound = { 
                    id: 999, 
                    description: 'Gold Samsung Watch', 
                    category: 'Electronics', 
                    location: 'Gym Locker Room', 
                    date_found: '2026-02-14', 
                    status: 'matched' 
                };
                const residentFoundItems = [...mockFound, itemIFound];
                setMyFoundItems(residentFoundItems);
                finalIncomingClaims = [
                    { 
                        id: 302, 
                        claimant_name: 'Amit Sharma', 
                        status: 'pending_approval', 
                        item_details: itemIFound,
                        security_answers: ['Samsung Galaxy Watch 4', 'Gold strap', 'Screen has a crack on top right']
                    }
                ];
            }

            setMatches(mockMatches);
            setMyLostItems(mockLost);
            if (role === 'security' || role === 'admin') setMyFoundItems(mockFound);
            setAllLostItems(mockLost);
            setAllFoundItems(mockFound);
            setIncomingClaims(finalIncomingClaims);
        } finally {
            setLoading(false);
        }
    };

    const getAIQuestions = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('phone') || cat.includes('mobile')) return ['What is the wallpaper?', 'What is the color of the case?', 'Any scratches?'];
        if (cat.includes('wallet') || cat.includes('card')) return ['What cards are inside?', 'What color is it?', 'Any cash amount?'];
        if (cat.includes('bag')) return ['Brand name?', 'Contents inside?', 'Color/Type?'];
        return ['Describe a unique feature.', 'When exactly did you lose it?', 'Color and Brand?'];
    };

    const initiateClaim = (matchOrItem) => {
        const item = matchOrItem.found_item || matchOrItem;
        const matchMock = { id: matchOrItem.id || 999, found_item: item };
        
        setActiveMatch(matchMock);
        setQuizOpen(true);
        setQuizAnswers({ q1: '', q2: '', q3: '' });
    };

    const submitAnswer = async (e) => {
        e.preventDefault();
        const demoSubmit = () => {
             setTimeout(() => {
                setQuizOpen(false);
                alert('Claim submitted for approval! (Demo Mode)');
                fetchData();
            }, 500);
        };

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
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.success) {
                setQuizOpen(false);
                alert('Claim submitted for approval!');
                fetchData();
            } else {
                alert(data.message);
            }
        } catch(e) {
             console.warn('Backend error or unavailable, using demo logic', e);
             demoSubmit();
        }
    };

    const approveClaim = async (claimId) => {
        setApproving(true);
        const demoApprove = () => {
             setTimeout(() => {
                alert('Claim Approved Successfully (Demo Mode)');
                fetchData();
                setApproving(false);
            }, 1000);
        };

        try {
            const response = await fetch('http://localhost:3001/api/traceback/claims/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ claim_id: claimId }),
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.success) {
                fetchData();
            } else {
                alert('Approval Failed: ' + data.message);
            }
        } catch (e) {
            console.warn('Backend error or unavailable, using demo logic', e);
            demoApprove();
        } finally {
            if(!approving) setApproving(false);
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

    // --- Modern Render ---

    const stats = {
        lost: isAdmin ? allLostItems.length : myLostItems.length,
        found: isAdmin ? allFoundItems.length : myFoundItems.length,
        claims: incomingClaims.length,
        returned: (isAdmin ? allLostItems : myLostItems).filter(i => ['collected', 'handed_over'].includes(i.status)).length
    };

    const displayItems = activeTab === 'lost' 
        ? (isAdmin ? allLostItems : myLostItems)
        : (isAdmin ? allFoundItems : myFoundItems);

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8 font-sans animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        {isAdmin ? 'Traceback Command Center' : 'Traceback'}
                    </h1>
                    <p className="mt-2 text-slate-500 text-lg">
                        {isAdmin ? 'Securely manage resident claims and item collection.' : 'Your personal lost & found dashboard.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleReportRedirect('lost')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 font-semibold text-sm transition-all shadow-sm"
                    >
                        <Search className="w-4 h-4" /> Report Lost
                    </button>
                    <button 
                        onClick={() => handleReportRedirect('found')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-all shadow-md shadow-indigo-200"
                    >
                        <Plus className="w-4 h-4" /> Report Found
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-slate-400">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p>Loading your data...</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Lost Items" value={stats.lost} icon={Search} color="blue" />
                        <StatCard label="Found Items" value={stats.found} icon={Box} color="purple" />
                        <StatCard label="Active Claims" value={stats.claims} icon={ShieldCheck} color="amber" />
                        <StatCard label="Returned" value={stats.returned} icon={CheckCircle2} color="green" />
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                        
                        {/* Tabs Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-2 border-b border-slate-100 bg-white">
                            <div className="flex p-1 gap-1 w-full sm:w-auto overflow-x-auto">
                                {[
                                    { id: 'lost', label: 'Lost Items', icon: AlertCircle },
                                    { id: 'found', label: 'Found Items', icon: Box },
                                    { id: 'claims', label: 'Claims', icon: ShieldQuestion }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                            ${activeTab === tab.id 
                                                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            
                            {/* Search (Visual Only for now) */}
                            <div className="relative w-full sm:w-64 m-2 sm:m-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search references..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/30 min-h-[400px]">
                            {/* Claims View */}
                            {activeTab === 'claims' ? (
                                <div className="space-y-4">
                                    {incomingClaims.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {incomingClaims.map(claim => (
                                                <div key={claim.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{claim.claimant_name}</h4>
                                                            <p className="text-sm text-slate-500">Claiming: {claim.item_details?.description}</p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                                            ${claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {claim.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    
                                                    {claim.security_answers && (
                                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 space-y-2">
                                                            {claim.security_answers.map((ans, idx) => (
                                                                <div key={idx} className="flex gap-2 text-sm">
                                                                    <span className="text-slate-400 font-mono w-4">{idx+1}.</span>
                                                                    <span className="text-slate-700">{ans}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2">
                                                        {claim.status === 'pending_approval' && isAdmin && (
                                                            <button 
                                                                onClick={() => approveClaim(claim.id)} 
                                                                disabled={approving}
                                                                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                                                            >
                                                                {approving ? 'Verifying...' : 'Approve Claim'}
                                                            </button>
                                                        )}
                                                        <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50">
                                                            <ChevronRight size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState 
                                            title="No Active Claims" 
                                            message="There are currently no claims requiring attention." 
                                        />
                                    )}
                                </div>
                            ) : (
                                // Lost or Found Grid
                                <>
                                    {displayItems.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {displayItems.map(item => (
                                                <ItemCard 
                                                    key={item.id} 
                                                    item={item} 
                                                    type={activeTab}
                                                    actionLabel={
                                                        activeTab === 'lost' 
                                                            ? (item.status === 'matched' ? 'View Match' : 'Edit Report')
                                                            : (item.status === 'matched' ? 'Verify Claim' : 'View Details')
                                                    }
                                                    onAction={(i) => {
                                                        if (activeTab === 'lost' && i.status === 'matched') {
                                                            // Find the match object for this item
                                                            const match = matches.find(m => m.lost_item_id === i.id);
                                                            if (match) initiateClaim(match);
                                                        } else {
                                                            // Standard action
                                                            console.log('Action on', i);
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState 
                                            title={activeTab === 'lost' ? "No Lost Items" : "Inventory Empty"}
                                            message={activeTab === 'lost' ? "You haven't reported any lost items yet." : "No items currently in the found inventory."}
                                            action={() => handleReportRedirect(activeTab)}
                                            actionLabel={activeTab === 'lost' ? "Report Lost Item" : "Report Found Item"}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Quiz Modal */}
            {quizOpen && activeMatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ShieldQuestion className="text-indigo-600" />
                                Proof of Ownership
                            </h3>
                            <button onClick={() => setQuizOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 bg-white space-y-6">
                            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm flex gap-3 items-start">
                                <Lock className="shrink-0 mt-0.5" size={16} />
                                <p>To verify ownership, please answer these security questions. Your answers will be reviewed by the finder or security personnel.</p>
                            </div>

                            <form onSubmit={submitAnswer} className="space-y-4">
                                {getAIQuestions(activeMatch.found_item?.category).map((question, idx) => (
                                    <div key={idx} className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 block">Question {idx + 1}</label>
                                        <p className="text-sm text-slate-500 italic mb-2">{question}</p>
                                        <textarea 
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none"
                                            rows={2}
                                            required
                                            value={quizAnswers[`q${idx+1}`]}
                                            onChange={(e) => setQuizAnswers({...quizAnswers, [`q${idx + 1}`]: e.target.value})}
                                            placeholder="Type your answer verification..."
                                        />
                                    </div>
                                ))}

                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setQuizOpen(false)}
                                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                                    >
                                        Submit Proof
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Modal */}
            {qrVisible && qrToken && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Claim Approved!</h3>
                        <p className="text-slate-500 mb-6 text-sm">Present this QR code to security or the finder to collect your item.</p>
                        
                        <div className="bg-white p-4 rounded-xl border-2 border-slate-100 inline-block mb-6">
                            <QRCodeDisplay token={qrToken} />
                        </div>
                        
                        <button 
                            onClick={() => setQrVisible(false)}
                            className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
=======
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  ShieldQuestion,
  X,
  Lock,
  Clock,
  LayoutDashboard,
  Search,
  Plus,
  Box,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { PageHeader, Button } from "../../components/ui";
import { getTracebackPath } from "../../utils/tracebackHelper";
import {
  fetchTracebackData,
  submitClaimAPI,
  approveClaimAPI,
  rejectClaimAPI,
  imageToBase64,
} from "../../utils/tracebackStorage";
import { getAIQuestions } from "../../utils/tracebackAI";
import { useToast } from "../../components/ui/Toast";
import TracebackTabs from "./traceback/TracebackTabs";
import LostItems from "./traceback/LostItems";
import FoundItems from "./traceback/FoundItems";
import ClaimsPanel from "./traceback/ClaimsPanel";
import TracebackAnalytics from "./traceback/TracebackAnalytics";
import "../../styles/Traceback.css";
const TracebackMatches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const isSecurity = location.pathname.includes("/security");
  const isAdmin = location.pathname.includes("/admin") || isSecurity;
  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState("lost");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [qrToken, setQrToken] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });
  const [proofImage, setProofImage] = useState("");
  const [approving, setApproving] = useState(false);

  // Sync route with tab
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/inventory") || path.includes("/report-found"))
      setActiveTab("found");
    else if (path.includes("/claims")) setActiveTab("claims");
    else setActiveTab("lost");
  }, [location.pathname]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // No navigation for analytics/archived — just switch tab
  };

  // Load data
  useEffect(() => {
    refreshData();
  }, []);
  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await fetchTracebackData();
      setDb(data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Derived data
  const allLostItems = useMemo(
    () =>
      db?.items?.filter(
        (i) => i.type === "lost" && !["expired", "archived"].includes(i.status),
      ) || [],
    [db],
  );
  const allFoundItems = useMemo(
    () =>
      db?.items?.filter(
        (i) => i.type === "found" && !["archived"].includes(i.status),
      ) || [],
    [db],
  );
  const archivedItems = useMemo(
    () =>
      db?.items?.filter((i) => ["expired", "archived"].includes(i.status)) ||
      [],
    [db],
  );
  const matches = useMemo(() => db?.matches || [], [db]);
  const claims = useMemo(() => db?.claims || [], [db]);
  const stats = {
    lost: allLostItems.length,
    found: allFoundItems.length,
    claims: claims.filter((c) => c.status === "under_review").length,
    returned: (db?.items || []).filter((i) =>
      ["collected", "handed_over", "returned"].includes(i.status),
    ).length,
    archived: archivedItems.length,
  };
  const handleReportRedirect = (type) => {
    const basePath =
      getTracebackPath(location.pathname).split("/traceback")[0] + "/traceback";
    navigate(`${basePath}/report-${type}`);
  };

  // ---- Claim Flow ----
  const initiateClaim = (match) => {
    // Check if already under review
    const existingClaim = claims.find(
      (c) => c.matchId === match.id && c.status === "under_review",
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
    );
    if (existingClaim) {
      toast.warning("This item already has a claim under review.");
      return;
    }
    setActiveMatch(match);
    setQuizOpen(true);
    setQuizAnswers({
      q1: "",
      q2: "",
      q3: "",
    });
    setProofImage("");
  };
  const handleProofUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Proof image must be under 5MB.");
      return;
    }
    try {
      const b64 = await imageToBase64(file);
      setProofImage(b64);
    } catch {
      toast.error("Failed to process image.");
    }
  };
  const submitClaim = async (e) => {
    e.preventDefault();
    if (!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3) {
      toast.error("Please answer all verification questions.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("match_id", activeMatch.id);
      formData.append("lost_item_id", activeMatch.lostId || activeMatch.lost_items?.id);
      formData.append("found_item_id", activeMatch.foundId || activeMatch.found_items?.id);
      formData.append("description", `Security Answers: ${quizAnswers.q1} | ${quizAnswers.q2} | ${quizAnswers.q3}`);

      if (proofImage) {
        const res = await fetch(proofImage);
        const blob = await res.blob();
        formData.append("proofImage", blob, "proof.jpg");
      }

      await submitClaimAPI(formData);

      setQuizOpen(false);
      toast.success("Claim submitted for review! Admin will verify your answers.");
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting claim.");
    }
  };
  const approveClaim = async (claimId) => {
    setApproving(true);
    try {
      await approveClaimAPI(claimId);
      toast.success("Claim approved! Pick-up token generated.");
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error("Error approving claim.");
    } finally {
      setApproving(false);
    }
  };
  const rejectClaim = async (claimId, reason) => {
    try {
      await rejectClaimAPI(claimId, reason);
      toast.info("Claim rejected. Item unlocked for other claims.");
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting claim.");
    }
  };
  const viewToken = (token) => {
    setQrToken(token);
    setQrVisible(true);
  };

  // Get questions for the active match
  const currentQuestions = activeMatch
    ? getAIQuestions(
      db?.items?.find((i) => i.id === activeMatch.foundId)?.category,
    )
    : [];
  return (
    <div className="traceback-page">
      {/* Header */}
      <div className="premium-header">
        <div className="header-title-group">
          <div className="header-icon-box">
            <LayoutDashboard size={24} />
          </div>
          <div className="header-text">
            <h1>
              {isAdmin ? "Security Control Center" : "Traceback Dashboard"}
            </h1>
            <p>
              {isAdmin
                ? "Monitor lost items and approve claims securely."
                : "Manage your reports and track item recovery."}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={() => handleReportRedirect("lost")}>
            <Search size={16} /> Report Lost
          </button>
          <button
            className="btn"
            style={{
              background: "white",
              color: "var(--primary)",
              border: "1px solid var(--border)",
            }}
            onClick={() => handleReportRedirect("found")}
          >
            <Plus size={16} /> Report Found
          </button>
        </div>
      </div>

      {loading ? (
        <div className="traceback-skeleton-container">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="traceback-skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="traceback-content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-icon">
                <Search />
              </div>
              <div className="stat-info">
                <h3>{stats.lost}</h3>
                <p>Lost Items</p>
              </div>
            </div>
            <div className="stat-card stat-purple">
              <div className="stat-icon">
                <Box />
              </div>
              <div className="stat-info">
                <h3>{stats.found}</h3>
                <p>Found Items</p>
              </div>
            </div>
            <div className="stat-card stat-orange">
              <div className="stat-icon">
                <ShieldCheck />
              </div>
              <div className="stat-info">
                <h3>{stats.claims}</h3>
                <p>Pending Claims</p>
              </div>
            </div>
            <div className="stat-card stat-green">
              <div className="stat-icon">
                <CheckCircle2 />
              </div>
              <div className="stat-info">
                <h3>{stats.returned}</h3>
                <p>Returned</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="traceback-search-bar">
            <Search size={16} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search items by description, category, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="btn">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Tabs */}
          <TracebackTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={stats}
            isAdmin={isAdmin}
          />

          {/* Tab Content */}
          {activeTab === "lost" && (
            <LostItems
              items={allLostItems}
              matches={matches}
              isAdmin={isAdmin}
              onViewToken={viewToken}
              onInitiateClaim={initiateClaim}
              onReportLost={() => handleReportRedirect("lost")}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === "found" && (
            <FoundItems
              items={allFoundItems}
              isAdmin={isAdmin}
              onReportFound={() => handleReportRedirect("found")}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === "claims" && (
            <ClaimsPanel
              claims={claims}
              approving={approving}
              onApproveClaim={approveClaim}
              onRejectClaim={rejectClaim}
            />
          )}

          {activeTab === "archived" && (
            <div>
              {archivedItems.length === 0 ? (
                <div className="premium-empty-state">
                  <div className="empty-icon-circle">
                    <Clock size={32} />
                  </div>
                  <h3>No Archived Items</h3>
                  <p>Items expire after 60 days (lost) or 90 days (found).</p>
                </div>
              ) : (
                <div className="traceback-grid-2col">
                  {archivedItems.map((item) => (
                    <div
                      key={item.id}
                      className="traceback-card item-card"
                      style={{
                        opacity: 0.7,
                      }}
                    >
                      <div className="item-header">
                        <span className="item-category">{item.category}</span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#b91c1c",
                            fontWeight: 600,
                          }}
                        >
                          {item.status === "expired" ? "Expired" : "Archived"}
                        </span>
                      </div>
                      <p className="item-desc">{item.description}</p>
                      <div className="item-meta">
                        <Clock size={12} /> {item.type} · {item.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && isAdmin && (
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
                <ShieldQuestion
                  size={24}
                  style={{
                    color: "var(--primary)",
                  }}
                  className="mr-16"
                />
                Proof of Ownership
              </h3>
              <button className="btn" onClick={() => setQuizOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="traceback-modal-body">
              <div className="traceback-info-box warning mb-16">
                <Lock
                  size={16}
                  style={{
                    verticalAlign: "middle",
                  }}
                  className="mr-16"
                />
                <span>
                  Answer these verification questions. Your claim will be
                  reviewed by an admin before approval.
                </span>
              </div>

              <form className="traceback-form" onSubmit={submitClaim}>
                {currentQuestions.map((question, idx) => (
                  <div key={idx} className="traceback-form-group">
                    <label className="traceback-form-label">
                      Question {idx + 1}
                    </label>
                    <div className="traceback-question-text">{question}</div>
                    <textarea
                      className="traceback-form-textarea"
                      rows={2}
                      required
                      value={quizAnswers[`q${idx + 1}`]}
                      onChange={(e) =>
                        setQuizAnswers({
                          ...quizAnswers,
                          [`q${idx + 1}`]: e.target.value,
                        })
                      }
                      placeholder="Type your answer..."
                    />
                  </div>
                ))}

                <div className="traceback-form-group">
                  <label className="traceback-form-label">
                    Proof Image (optional)
                  </label>
                  <div
                    className="traceback-upload-area"
                    onClick={() =>
                      document.getElementById("proof-upload")?.click()
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Upload size={20} color="var(--text-secondary)" />
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      Upload proof photo (receipt, photo with item, etc.)
                    </p>
                    <input
                      id="proof-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProofUpload}
                      style={{
                        display: "none",
                      }}
                    />
                  </div>
                  {proofImage && (
                    <div className="mt-16">
                      <img
                        src={proofImage}
                        alt="Proof"
                        style={{
                          maxHeight: 120,
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border)",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  className="gap-16 mt-16"
                >
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => setQuizOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Claim for Review
                  </Button>
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
              <button className="btn" onClick={() => setQrVisible(false)}>
                <X size={24} />
              </button>
            </div>
            <div
              className="traceback-modal-body"
              style={{
                textAlign: "center",
              }}
            >
              <div className="traceback-info-box success mb-16">
                ✅ Your claim was approved! Show this token to security for item
                pick-up.
              </div>
              <div className="fake-qr">{qrToken}</div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  margin: "8px 0 20px",
                }}
              >
                Token expires in 60 minutes. Present at security desk.
              </p>
              <Button variant="secondary" onClick={() => setQrVisible(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TracebackMatches;
