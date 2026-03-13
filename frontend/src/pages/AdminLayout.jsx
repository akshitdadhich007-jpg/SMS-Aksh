import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../components/ui/NotificationPanel';
import { useToast } from '../components/ui/Toast';
import {
    Settings, Bell, Search, ChevronDown,
    X, LayoutDashboard, Users, UserCog, Building,
    FileText, ShieldAlert, BadgeIndianRupee, Package,
    MailWarning, Compass, BarChart, Store, Calendar
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-style.css';

const AdminLayout = () => {
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

    // Generating breadcrumbs based on the current path
    const pathnames = location.pathname.split('/').filter(x => x);
    const currentBreadcrumb = pathnames.length > 1 ? pathnames[1].charAt(0).toUpperCase() + pathnames[1].slice(1).replace('-', ' ') : 'Overview';

    const menuGroups = [
        {
            title: "General",
            items: [
                { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
                { name: 'Reports', icon: <BarChart size={20} />, path: '/admin/reports' },
                { name: 'Notices', icon: <Bell size={20} />, path: '/admin/notices' },
            ]
        },
        {
            title: "Management",
            items: [
                { name: 'Residents', icon: <Users size={20} />, path: '/admin/residents' },
                { name: 'Staff & Roles', icon: <UserCog size={20} />, path: '/admin/staff' },
            ]
        },
        {
            title: "Operations",
            items: [
                { name: 'Maintenance', icon: <FileText size={20} />, path: '/admin/maintenance' },
                { name: 'Complaints', icon: <MailWarning size={20} />, path: '/admin/complaints' },
            ]
        },
        {
            title: "Security Logs",
            items: [
                { name: 'Staff Attendance', icon: <FileText size={20} />, path: '/admin/attendance' },
                { name: 'Emergency', icon: <ShieldAlert size={20} />, path: '/admin/emergency' },
            ]
        }
    ];

    function ShoppingBagIcon(props) {
        return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;
    }

    return (
        <div className="admin-body">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'hidden'}`}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-content">
                        <div className="brand-logo">
                            <div className="brand-icon">
                                <Building size={16} />
                            </div>
                            <h2 id="societyName">CIVIORA</h2>
                        </div>
                        {/* Mobile close button inside brand header */}
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
                                    end={item.path === '/admin'}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                                >
                                    <span className="icon">{item.icon}</span>
                                    {item.name}
                                    {item.path === '/admin/notices' && <span className="nav-badge">3</span>}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <NavLink
                        to="/admin/settings"
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
                            <span className="hamburger-glyph" aria-hidden="true">
                                ☰
                            </span>
                        </button>
                        <div className="breadcrumbs">
                            Admin <span>/</span> <span>{currentBreadcrumb}</span>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <div className="search-bar">
                            <Search size={16} className="search-icon" />
                            <input type="text" placeholder="Search system..." className="search-input" />
                        </div>

                        <NotificationPanel />

                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                                <div className="profile-avatar">AD</div>
                                <span className="profile-name">Admin</span>
                                <ChevronDown size={14} className={`profile-chevron ${profileOpen ? 'open' : ''}`} />
                            </button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setProfileOpen(false); navigate('/admin/settings'); }}>
                                    <Settings size={16} /> Config Settings
                                </a>
                                <hr />
                                <a href="/" className="danger" id="logoutBtn" onClick={handleLogout}>
                                    Logout safely
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

export default AdminLayout;
