import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
    Users
} from 'lucide-react';

const ResidentLayout = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

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
        { name: 'Staff & Services', path: '/resident/staff', icon: <Users size={20} /> }
    ];

    return (
        <div className="admin-body">
            <aside className={`sidebar ${sidebarOpen ? '' : 'hidden'}`} style={{ display: sidebarOpen ? 'flex' : 'none' }}>
                <div className="sidebar-brand">
                    <h2 id="societyName">My Society</h2>
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

                <div className="sidebar-footer">© 2026 Society Fintech</div>
            </aside>

            <div className="main" style={{ marginLeft: sidebarOpen ? '260px' : '0' }}>
                <header className="topbar">
                    <div className="topbar-left">
                        <button id="sidebarToggle" className="btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                    </div>
                    <div className="topbar-right">
                        <div className="notif" id="notifBtn">
                            <span className="bell">🔔</span>
                            <span className="badge" id="notifCount">2</span>
                        </div>
                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>Resident ▾</button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#">Profile</a>
                                <a href="#">Change Password</a>
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
