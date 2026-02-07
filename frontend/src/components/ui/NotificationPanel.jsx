import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import './NotificationPanel.css';

const NotificationPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'alert',
            title: 'Maintenance Alert',
            message: 'Water tank cleaning scheduled for tomorrow at 10 AM',
            timestamp: '5 minutes ago',
            read: false
        },
        {
            id: 2,
            type: 'info',
            title: 'New Payment Received',
            message: 'Payment received from Apartment 102 for maintenance',
            timestamp: '1 hour ago',
            read: false
        },
        {
            id: 3,
            type: 'success',
            title: 'Document Approved',
            message: 'Your budget proposal has been approved',
            timestamp: '2 hours ago',
            read: true
        }
    ]);

    const panelRef = useRef(null);
    const buttonRef = useRef(null);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside the panel and button
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        // Only add listener when panel is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Close panel on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const handleDeleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const handleClearAll = () => {
        setNotifications([]);
        setIsOpen(false);
    };

    const unreadCount = notifications.filter(notif => !notif.read).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'alert':
                return <AlertCircle size={18} />;
            case 'success':
                return <CheckCircle size={18} />;
            case 'info':
            default:
                return <Info size={18} />;
        }
    };

    return (
        <div className="notification-container">
            {/* Bell Button */}
            <button
                ref={buttonRef}
                className={`notification-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <Bell size={20} strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div
                    ref={panelRef}
                    className="notification-panel"
                    role="dialog"
                    aria-label="Notifications"
                >
                    {/* Header */}
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <button
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close notifications"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="notification-content">
                        {notifications.length === 0 ? (
                            <div className="empty-state">
                                <Bell size={32} strokeWidth={1.5} />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="notifications-list">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`notification-item ${notif.type} ${!notif.read ? 'unread' : ''}`}
                                    >
                                        <div className="notification-icon">
                                            {getNotificationIcon(notif.type)}
                                        </div>
                                        <div className="notification-body">
                                            <div className="notification-title">{notif.title}</div>
                                            <div className="notification-message">{notif.message}</div>
                                            <div className="notification-time">{notif.timestamp}</div>
                                        </div>
                                        <div className="notification-actions">
                                            {!notif.read && (
                                                <button
                                                    className="action-btn mark-read"
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                    title="Mark as read"
                                                    aria-label="Mark as read"
                                                >
                                                    ✓
                                                </button>
                                            )}
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteNotification(notif.id)}
                                                title="Delete notification"
                                                aria-label="Delete notification"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="notification-footer">
                            <button
                                className="clear-all-btn"
                                onClick={handleClearAll}
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Overlay (for mobile) */}
            {isOpen && <div className="notification-overlay" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default NotificationPanel;
