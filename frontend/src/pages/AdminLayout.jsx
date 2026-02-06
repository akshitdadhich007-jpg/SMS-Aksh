import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/admin-style.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', icon: '🏠', path: '/admin' },
        { name: 'Residents', icon: '👥', path: '/admin/residents' },
        { name: 'Shops', icon: '🛍️', path: '/admin/shops' },
        { name: 'Maintenance', icon: '🧾', path: '/admin/maintenance' },
        { name: 'Payments', icon: '💳', path: '/admin/payments' },
        { name: 'Expenses', icon: '📈', path: '/admin/expenses' },
        { name: 'Staff', icon: '👔', path: '/admin/staff' },
        { name: 'Committee', icon: '🤝', path: '/admin/committee' },
        { name: 'Vehicles', icon: '🚗', path: '/admin/vehicles' },
        { name: 'Deliveries', icon: '📦', path: '/admin/deliveries' },
        { name: 'Complaints', icon: '⚠️', path: '/admin/complaints' },
        { name: 'Notices', icon: '🎉', path: '/admin/notices' },
        { name: 'Documents', icon: '📂', path: '/admin/documents' },
        { name: 'Emergency', icon: '🚨', path: '/admin/emergency' },
        { name: 'Reports', icon: '📊', path: '/admin/reports' },
        { name: 'Settings', icon: '⚙️', path: '/admin/settings' },
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
                            end={item.path === '/admin'}
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
                            <span className="badge" id="notifCount">3</span>
                        </div>
                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>Admin ▾</button>
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

                <footer className="footer">Designed for demo — responsive and scalable UI</footer>
            </div>
        </div>
    );
};

export default AdminLayout;
