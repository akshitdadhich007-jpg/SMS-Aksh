import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../components/ui/NotificationPanel';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../context/ThemeContext';
import '../styles/admin-style.css';
import {
    LayoutDashboard,
    Receipt,
    CreditCard,
    History,
    MessageSquare,
    Bell,
    FileText,
    Phone,
    Users,
    Settings,
    Sun,
    Moon,
    Building,
    Search
} from 'lucide-react';

const ResidentLayout = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { isDarkMode, toggleDarkMode } = useTheme();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/resident', icon: <LayoutDashboard size={20} />, end: true },
        { name: 'My Bills', path: '/resident/bills', icon: <Receipt size={20} /> },
        { name: 'Pay Maintenance', path: '/resident/pay', icon: <CreditCard size={20} /> },
        { name: 'Payment History', path: '/resident/history', icon: <History size={20} /> },
        { name: 'Complaints', path: '/resident/complaints', icon: <MessageSquare size={20} /> },
        { name: 'Announcements', path: '/resident/announcements', icon: <Bell size={20} /> },
        { name: 'Documents', path: '/resident/documents', icon: <FileText size={20} /> },
        { name: 'Emergency', path: '/resident/emergency', icon: <Phone size={20} /> },
        { name: 'Staff & Services', path: '/resident/staff', icon: <Users size={20} /> },
        { name: 'Asset Booking', path: '/resident/bookings', icon: <Building size={20} /> },
        { name: 'Lost & Found – Traceback', path: '/resident/traceback', icon: <Search size={20} /> },
        { name: 'Visitor Pre-Approval', path: '/resident/visitor-approval', icon: '👥' },
        { name: 'My Fines', path: '/resident/fines', icon: '💰' }
    ];

    return (
        <div className="admin-body">
            <aside className={`sidebar ${sidebarOpen ? '' : 'hidden'}`} style={{ display: sidebarOpen ? 'flex' : 'none' }}>
                <div className="sidebar-brand">
                    <div className="sidebar-brand-content">
                        <h2 id="societyName">My Society</h2>
                        <button
                            className={`theme-shortcut ${isDarkMode ? 'active' : ''}`}
                            onClick={toggleDarkMode}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={isDarkMode ? 'Light mode' : 'Dark mode'}
                        >
                            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span> {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-actions">
                    <NavLink
                        to="/resident/settings"
                        className={({ isActive }) => `sidebar-action-btn ${isActive ? 'active' : ''}`}
                    >
                        <span className="icon"><Settings size={20} /></span>
                        Settings
                    </NavLink>
                </div>

                <div className="sidebar-footer">© 2026 Society Fintech</div>
            </aside>

            <div className="main" style={{ marginLeft: sidebarOpen ? '260px' : '0' }}>
                <header className="topbar">
                    <div className="topbar-left">
                        <button id="sidebarToggle" className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                    </div>
                    <div className="topbar-right">
                        <NotificationPanel />
                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>Resident ▾</button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setProfileOpen(false); navigate('/resident/settings'); }}>Profile</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setProfileOpen(false); toast.info('Navigate to Settings to change your password', 'Change Password'); navigate('/resident/settings'); }}>Change Password</a>
                                <a href="/" id="logoutBtn" onClick={handleLogout}>Logout</a>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="content container">
                    <Outlet />
                </section>

                <footer className="footer">Resident Portal — manage your society account</footer>
            </div>
        </div>
    );
};

export default ResidentLayout;
