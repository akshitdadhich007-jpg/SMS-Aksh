import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../components/ui/NotificationPanel';
import { Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/admin-style.css';

const SecurityLayout = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useTheme();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="security-body">
            <aside className="sidebar">
                <div className="sidebar-brand" style={{ padding: '0 14px' }}>
                    <div className="sidebar-brand-content">
                        <h2 id="societyName">Greenfield Residency</h2>
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
                    <NavLink to="/security" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        🏠 Dashboard
                    </NavLink>
                    <NavLink to="/security/visitors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        👤 Visitor Entry
                    </NavLink>
                    <NavLink to="/security/preapproved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        🔍 Pre-Approved Visitors
                    </NavLink>
                    <NavLink to="/security/vehicles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        🚗 Vehicle Entry
                    </NavLink>
                    <NavLink to="/security/deliveries" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        📦 Deliveries
                    </NavLink>
                    <NavLink to="/security/emergency" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        🚨 Emergency Logs
                    </NavLink>
                    <NavLink to="/security/traceback" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        🧭 Lost & Found – Traceback
                    </NavLink>
                    <NavLink to="/security/attendance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        📍 Staff Attendance
                    </NavLink>
                </nav>
                <div className="sidebar-actions">
                    <NavLink
                        to="/security/settings"
                        className={({ isActive }) => `sidebar-action-btn ${isActive ? 'active' : ''}`}
                    >
                        <span className="icon"><Settings size={20} /></span>
                        Settings
                    </NavLink>
                </div>
                <div className="sidebar-footer">© 2026 CIVIORA</div>
            </aside>

            <div className="main">
                <header className="topbar">
                    <div className="left"><strong id="topSociety">Greenfield Residency</strong></div>
                    <div className="topbar-right">
                        <NotificationPanel />
                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>Security ▾</button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setProfileOpen(false); navigate('/security/settings'); }}>Profile</a>
                                <a href="/" id="logoutBtn" onClick={handleLogout}>Logout</a>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content container">
                    <Outlet />
                </main>

                <footer className="footer">Security Panel — quick actions for gate operations</footer>
            </div>
        </div>
    );
};

export default SecurityLayout;
