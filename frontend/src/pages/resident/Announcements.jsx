<<<<<<< HEAD
import React, { useState } from 'react';
import {
    Bell, Calendar, Clock, AlertCircle,
    Wrench, Users, Info, ChevronDown, ChevronUp,
    Check, CheckCircle2
} from 'lucide-react';
import './Announcements.css';

const Announcements = () => {
    // ── Enhanced Mock Data ──
    // Added type, isPinned, and isRead to support the new UI
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Annual General Meeting',
            type: 'meeting',
            date: '15 Feb 2026',
            description: 'The AGM will be held at the Community Hall at 10:00 AM. All members are requested to attend. Agenda includes election of new committee members and approval of annual budget.',
            isPinned: true,
            isRead: false
        },
        {
            id: 2,
            title: 'Water Supply Interruption',
            type: 'alert',
            date: '12 Feb 2026',
            description: 'Emergency repair work on the main pipeline. Water supply will be suspended in Block A and B between 2 PM and 6 PM today.',
            isPinned: false,
            isRead: false
        },
        {
            id: 3,
            title: 'Swimming Pool Maintenance',
            type: 'maintenance',
            date: '10 Feb 2026',
            description: 'The swimming pool will be closed for quarterly deep-cleaning and maintenance from 10th Feb to 12th Feb. We apologize for the inconvenience.',
            isPinned: false,
            isRead: true
        },
        {
            id: 4,
            title: 'Ganesh Chaturthi Celebrations',
            type: 'event',
            date: '02 Feb 2026',
            description: 'Join us for the Ganesh Chaturthi celebrations starting from 5th Feb. Detailed schedule has been mailed to all residents. Please contact the cultural committee for participation.',
            isPinned: false,
            isRead: true
        },
        {
            id: 5,
            title: 'New Visitor Parking Rules',
            type: 'info',
            date: '28 Jan 2026',
            description: 'Effective immediately, all visitor vehicles must be parked in the designated V-Zone. Maximum allowed duration without prior approval is 6 hours.',
            isPinned: false,
            isRead: true
        }
    ]);

    const [expandedIds, setExpandedIds] = useState([]);

    // ── Handlers ──
    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const markAsRead = (id) => {
        setAnnouncements(prev =>
            prev.map(ann => ann.id === id ? { ...ann, isRead: true } : ann)
        );
    };

    const markAllAsRead = () => {
        setAnnouncements(prev => prev.map(ann => ({ ...ann, isRead: true })));
    };

    // ── Derived Data ──
    const unreadCount = announcements.filter(a => !a.isRead).length;
    const pinnedAnnouncements = announcements.filter(a => a.isPinned);
    const recentAnnouncements = announcements.filter(a => !a.isPinned && !a.isRead);
    const olderAnnouncements = announcements.filter(a => !a.isPinned && a.isRead);

    // ── Helper ──
    const getIconForType = (type) => {
        switch (type) {
            case 'meeting': return <Users size={20} />;
            case 'maintenance': return <Wrench size={20} />;
            case 'event': return <Calendar size={20} />;
            case 'alert': return <AlertCircle size={20} />;
            case 'info': default: return <Info size={20} />;
        }
    };

    // ── Card Component ──
    const AnnouncementCard = ({ item }) => {
        const isExpanded = expandedIds.includes(item.id);
        const isLongText = item.description.length > 100;

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
                            <Clock size={12} /> {item.date}
                        </div>
                    </div>

                    <div className={`ac-description ${!isExpanded ? 'collapsed' : ''}`}>
                        {item.description}
                    </div>

                    <div className="ac-actions">
                        {isLongText && (
                            <button className="ac-btn-text" onClick={() => toggleExpand(item.id)}>
                                {isExpanded ? 'Show less' : 'Read more'}
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
=======
import React, { useState, useEffect } from "react";
import { PageHeader, Card } from "../../components/ui";
import "./Announcements.css";
import api from "../../services/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api
      .get("/api/resident/announcements")
      .then((res) => setAnnouncements(res.data || []))
      .catch((err) => console.error("Failed to load announcements:", err));
  }, []);
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

  if (!announcements || announcements.length === 0) {
    return (
<<<<<<< HEAD
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
=======
      <>
        <PageHeader
          title="Announcements"
          subtitle="Updates and news from the society"
        />
        <div className="announcements-empty-state">
          <h3>No announcements at the moment</h3>
          <p>Check back later for updates.</p>
        </div>
      </>
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
    );
  }

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Updates and news from the society"
      />

      <div className="announcements-container">
        {announcements.map((item) => (
          <div key={item.id} className="announcement-card">
            <div className="announcement-header">
              <h3 className="announcement-title">{item.title}</h3>
              <span className="announcement-date">{item.date}</span>
            </div>
            <p className="announcement-description">{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Announcements;
