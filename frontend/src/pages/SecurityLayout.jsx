import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../components/ui/NotificationPanel';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-style.css';
import {
    ShieldCheck, Users, Car, Package, Phone, Search,
    Settings, X, LayoutDashboard,
    ClipboardCheck
} from 'lucide-react';

const SecurityLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { signOut } = useAuth();

    const handleLogout = async (e) => {
        e.preventDefault();
        await signOut();
        navigate('/');
    };

    const pathnames = location.pathname.split('/').filter(x => x);
    const currentBreadcrumb = pathnames.length > 1 ? pathnames[1].charAt(0).toUpperCase() + pathnames[1].slice(1).replace('-', ' ') : 'Gate Operations';

    const menuGroups = [
        {
            title: "Operations",
            items: [
                { name: 'Dashboard', path: '/security', icon: <LayoutDashboard size={20} />, end: true },
                { name: 'Visitor Entry', path: '/security/visitors', icon: <Users size={20} /> },
                { name: 'Pre-Approved Entry', path: '/security/preapproved', icon: <ShieldCheck size={20} /> },
                { name: 'Emergency Alerts', path: '/security/emergency-alerts', icon: <ShieldCheck size={20} /> },
            ]
        },
        {
            title: "Logs & Incidents",
            items: [
                { name: 'Staff Attendance', path: '/security/attendance', icon: <ClipboardCheck size={20} /> },
            ]
        }
    ];

    return (
        <div className="admin-body">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'hidden'}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-content">
                        <div className="brand-logo">
                            <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)' }}>
                                <ShieldCheck size={16} />
                            </div>
                            <h2 id="societyName">CIVIORA</h2>
                        </div>
                        <div className="mobile-close-btn" style={{ display: 'none' }} onClick={() => setSidebarOpen(false)}>
                            <X size={20} color="var(--sidebar-muted)" />
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuGroups.map((group, idx) => (
                        <div className="nav-group" key={idx}>
                            <div className="nav-group-title">{group.title}</div>
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.end}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                                >
                                    <span className="icon">{item.icon}</span>
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <NavLink
                        to="/security/settings"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        style={{ width: 'calc(100% - 48px)', marginBottom: '8px' }}
                    >
                        <span className="icon"><Settings size={20} /></span>
                        Settings
                    </NavLink>

                    <button
                        className={`theme-shortcut ${isDarkMode ? 'active' : ''}`}
                        onClick={toggleDarkMode}
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={isDarkMode ? 'Light mode' : 'Dark mode'}
                    >
                        <span className="theme-shortcut-symbol" aria-hidden="true">
                            {isDarkMode ? '🌙' : '☀️'}
                        </span>
                    </button>
                </div>
            </aside>

            <div className="main">
                <header className="topbar">
                    <div className="topbar-left">
                        <button id="sidebarToggle" className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <span className="hamburger-glyph" aria-hidden="true">☰</span>
                        </button>
                        <div className="breadcrumbs">
                            Security <span>/</span> <span>{currentBreadcrumb}</span>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <NotificationPanel />

                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                                <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)' }}>S</div>
                                Security
                            </button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setProfileOpen(false); navigate('/security/settings'); }}>
                                    <Settings size={16} /> Settings
                                </a>
                                <hr />
                                <a href="/" className="danger" id="logoutBtn" onClick={handleLogout}>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="content container">
                    <Outlet />
                </section>
            </div>
        </div>
    );
};

export default SecurityLayout;
