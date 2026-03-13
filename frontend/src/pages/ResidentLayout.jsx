import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../components/ui/NotificationPanel';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-style.css';
import {
    LayoutDashboard, Receipt, CreditCard, History, MessageSquare,
    Bell, Settings, UserCheck,
    Building, Search, Store, Calendar, X, ChevronDown
} from 'lucide-react';

const ResidentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 768 : true));
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { signOut } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        await signOut();
        navigate('/');
    };

    const pathnames = location.pathname.split('/').filter(x => x);
    const currentBreadcrumb = pathnames.length > 1 ? pathnames[1].charAt(0).toUpperCase() + pathnames[1].slice(1).replace('-', ' ') : 'Dashboard';

    const menuGroups = [
        {
            title: "General",
            items: [
                { name: 'Dashboard', path: '/resident', icon: <LayoutDashboard size={20} />, end: true },
                { name: 'Announcements', path: '/resident/announcements', icon: <Bell size={20} /> },
                { name: 'Complaints', path: '/resident/complaints', icon: <MessageSquare size={20} /> },
            ]
        },
        {
            title: "Finance",
            items: [
                { name: 'My Bills', path: '/resident/bills', icon: <Receipt size={20} /> },
            ]
        },
        {
            title: "Community",
            items: [
                { name: 'Visitor Pre-Approval', path: '/resident/visitor-approval', icon: <UserCheck size={20} /> },
                { name: 'Emergency SOS', path: '/resident/emergency-sos', icon: <Bell size={20} /> },
                { name: 'Settings', path: '/resident/settings', icon: <Settings size={20} /> },
            ]
        }
    ];

    return (
        <div className="admin-body">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'hidden'}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-content">
                        <div className="brand-logo">
                            <div className="brand-icon resident-brand-icon">
                                <Building size={16} />
                            </div>
                            <h2 id="societyName">CIVIORA</h2>
                        </div>
                        <div className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
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
                        to="/resident/settings"
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

            <div
                className={`sidebar-backdrop ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />

            <div className="main">
                <header className="topbar">
                    <div className="topbar-left">
                        <button id="sidebarToggle" className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <span className="hamburger-glyph" aria-hidden="true">☰</span>
                        </button>
                        <div className="breadcrumbs">
                            Resident <span>/</span> <span>{currentBreadcrumb}</span>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <div className="search-bar">
                            <Search size={16} className="search-icon" />
                            <input type="text" placeholder="Search society..." className="search-input" />
                        </div>

                        <NotificationPanel />

                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                                <div className="profile-avatar resident-profile-avatar">R</div>
                                <span className="profile-name">Resident</span>
                                <ChevronDown size={14} className={`profile-chevron ${profileOpen ? 'open' : ''}`} />
                            </button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setProfileOpen(false); navigate('/resident/settings'); }}>
                                    <Settings size={16} /> Profile & Settings
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

export default ResidentLayout;
