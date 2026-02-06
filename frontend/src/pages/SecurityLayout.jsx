import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/admin-style.css';

const SecurityLayout = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="security-body">
            <aside className="sidebar">
                <div className="sidebar-brand" style={{ padding: '0 14px' }}><h2 id="societyName">Greenfield Residency</h2></div>
                <nav className="sidebar-nav">
                    <NavLink to="/security" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        🏠 Dashboard
                    </NavLink>
                    <NavLink to="/security/visitors" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        👤 Visitor Entry
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
                </nav>
                <div className="sidebar-footer">© 2026 Society Fintech</div>
            </aside>

            <div className="main">
                <header className="topbar">
                    <div className="left"><strong id="topSociety">Greenfield Residency</strong></div>
                    <div className="topbar-right">
                        <div className="notif" id="notifBtn">
                            <span className="bell">🔔</span>
                            <span className="badge" id="notifCount">1</span>
                        </div>
                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>Security ▾</button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#">Profile</a>
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
