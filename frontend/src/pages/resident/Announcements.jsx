import React, { useState, useEffect } from 'react';
import {
    Bell, Calendar, Clock, AlertCircle,
    Wrench, Users, Info, ChevronDown, ChevronUp,
    Check, CheckCircle2, Loader2
} from 'lucide-react';
import { subscribeToAnnouncements } from '../../firebase/announcementService';
import './Announcements.css';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState([]);
    const [readIds, setReadIds] = useState(new Set());

    useEffect(() => {
        const unsub = subscribeToAnnouncements((items) => {
            // Map Firestore fields to UI shape
            const mapped = items.map(item => ({
                id: item.id,
                title: item.title,
                type: item.type || 'info',
                date: item.displayDate,
                description: item.message || '',
                isPinned: false,
            }));
            setAnnouncements(mapped);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // ── Handlers ──
    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const markAsRead = (id) => {
        setReadIds(prev => new Set([...prev, id]));
    };

    const markAllAsRead = () => {
        setReadIds(new Set(announcements.map(a => a.id)));
    };

    // ── Derived Data ──
    const enriched = announcements.map(a => ({ ...a, isRead: readIds.has(a.id) }));
    const unreadCount = enriched.filter(a => !a.isRead).length;
    const pinnedAnnouncements = enriched.filter(a => a.isPinned);
    const recentAnnouncements = enriched.filter(a => !a.isPinned && !a.isRead);
    const olderAnnouncements = enriched.filter(a => !a.isPinned && a.isRead);

    // ── Helpers ──
    const getIconForType = (type) => {
        switch (type) {
            case 'meeting':     return <Users size={22} />;
            case 'maintenance': return <Wrench size={22} />;
            case 'event':       return <Calendar size={22} />;
            case 'alert':       return <AlertCircle size={22} />;
            case 'notice':      return <Bell size={22} />;
            case 'info': default: return <Info size={22} />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'meeting':     return { emoji: '✅', label: 'Meeting' };
            case 'maintenance': return { emoji: '🔧', label: 'Maintenance' };
            case 'event':       return { emoji: '📅', label: 'Event' };
            case 'alert':       return { emoji: '⚠️', label: 'Alert' };
            case 'notice':      return { emoji: '📋', label: 'Notice' };
            case 'info': default: return { emoji: 'ℹ️', label: 'Info' };
        }
    };

    // ── Card Component ──
    const AnnouncementCard = ({ item }) => {
        const isExpanded = expandedIds.includes(item.id);
        const isLongText = item.description.length > 100;
        const { emoji, label } = getTypeLabel(item.type);

        return (
            <div className={`ac-card type-${item.type} ${!item.isRead ? 'unread' : ''}`}>
                {!item.isRead && <div className="ac-unread-dot" />}

                <div className="ac-icon-wrap">
                    {getIconForType(item.type)}
                </div>

                <div className="ac-content">
                    <div className="ac-top-row">
                        <h3 className="ac-title">{item.title}</h3>
                        <div className="ac-date-badge">
                            <Clock size={11} /> {item.date}
                        </div>
                    </div>

                    <span className="ac-type-badge">
                        <span>{emoji}</span> {label}
                    </span>

                    <div className={`ac-description ${!isExpanded ? 'collapsed' : ''}`}>
                        {item.description}
                    </div>

                    <div className="ac-actions">
                        {isLongText && (
                            <button className="ac-btn-text" onClick={() => toggleExpand(item.id)}>
                                {isExpanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Read more</>}
                            </button>
                        )}
                        {!item.isRead && (
                            <button className="ac-btn-text muted" onClick={() => markAsRead(item.id)}>
                                <Check size={14} /> Mark as read
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ── Loading State ──
    if (loading) {
        return (
            <div className="ac-page">
                <div className="ac-container">
                    <div className="ac-header">
                        <div className="ac-title-wrap">
                            <h1><Bell size={28} /> Announcements</h1>
                            <p>Updates and news from the society</p>
                        </div>
                    </div>
                    <div className="ac-empty-state">
                        <div className="ac-empty-icon">
                            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                        <h3>Loading announcements...</h3>
                        <p>Connecting to real-time updates</p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Empty State ──
    if (!announcements || announcements.length === 0) {
        return (
            <div className="ac-page">
                <div className="ac-container">
                    <div className="ac-header">
                        <div className="ac-title-wrap">
                            <h1><Bell size={28} /> Announcements</h1>
                            <p>Updates and news from the society</p>
                        </div>
                    </div>

                    <div className="ac-empty-state">
                        <div className="ac-empty-icon">
                            <Bell size={32} />
                        </div>
                        <h3>No announcements yet</h3>
                        <p>You're all caught up! We'll notify you when there's an update.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ac-page">
            <div className="ac-container">

                {/* ── Header ── */}
                <div className="ac-header">
                    <div className="ac-title-wrap">
                        <h1><Bell size={28} className="text-blue-600" /> Notifications</h1>
                        <p>Important updates and news from the society</p>
                    </div>
                    {unreadCount > 0 && (
                        <div className="ac-badge-count">
                            <div className="ac-badge-icon">
                                <Bell size={16} />
                                <div className="ac-badge-dot" />
                            </div>
                            {unreadCount} New
                        </div>
                    )}
                </div>

                {/* Mark all as read button */}
                {unreadCount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button className="ac-btn-text muted" onClick={markAllAsRead}>
                            <CheckCircle2 size={16} /> Mark all as read
                        </button>
                    </div>
                )}

                {/* ── List ── */}
                <div className="ac-list">

                    {/* Pinned Section */}
                    {pinnedAnnouncements.length > 0 && (
                        <div className="ac-section">
                            <div className="ac-section-title">Pinned</div>
                            <div className="ac-list">
                                {pinnedAnnouncements.map(item => (
                                    <AnnouncementCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent (Unread) Section */}
                    {recentAnnouncements.length > 0 && (
                        <div className="ac-section">
                            <div className="ac-section-title">Recent</div>
                            <div className="ac-list">
                                {recentAnnouncements.map(item => (
                                    <AnnouncementCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Older (Read) Section */}
                    {olderAnnouncements.length > 0 && (
                        <div className="ac-section">
                            <div className="ac-section-title">Older</div>
                            <div className="ac-list">
                                {olderAnnouncements.map(item => (
                                    <AnnouncementCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Announcements;
