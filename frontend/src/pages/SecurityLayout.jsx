<<<<<<< HEAD
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../components/ui/NotificationPanel';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../context/ThemeContext';
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
=======
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import NotificationPanel from "../components/ui/NotificationPanel";
import { Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/admin-style.css";

const SecurityLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    navigate("/");
  };

<<<<<<< HEAD
    const pathnames = location.pathname.split('/').filter(x => x);
    const currentBreadcrumb = pathnames.length > 1 ? pathnames[1].charAt(0).toUpperCase() + pathnames[1].slice(1).replace('-', ' ') : 'Gate Operations';

    const menuGroups = [
        {
            title: "Operations",
            items: [
                { name: 'Dashboard', path: '/security', icon: <LayoutDashboard size={20} />, end: true },
                { name: 'Visitor Entry', path: '/security/visitors', icon: <Users size={20} /> },
                { name: 'Pre-Approved Entry', path: '/security/preapproved', icon: <ShieldCheck size={20} /> },
                { name: 'Vehicle Logs', path: '/security/vehicles', icon: <Car size={20} /> },
                { name: 'Deliveries', path: '/security/deliveries', icon: <Package size={20} /> },
            ]
        },
        {
            title: "Logs & Incidents",
            items: [
                { name: 'Emergency Logs', path: '/security/emergency', icon: <Phone size={20} /> },
                { name: 'Lost & Found', path: '/security/traceback', icon: <Search size={20} /> },
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
=======
  return (
    <div className="security-body">
      <aside className="sidebar">
        <div className="sidebar-brand" style={{ padding: "0 14px" }}>
          <div className="sidebar-brand-content">
            <h2 id="societyName">Greenfield Residency</h2>
            <button
              className={`theme-shortcut ${isDarkMode ? "active" : ""}`}
              onClick={toggleDarkMode}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/security"
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            🏠 Dashboard
          </NavLink>
          <NavLink
            to="/security/visitors"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            👤 Visitor Entry
          </NavLink>
          <NavLink
            to="/security/preapproved"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            🔍 Pre-Approved Visitors
          </NavLink>
          <NavLink
            to="/security/vehicles"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            🚗 Vehicle Entry
          </NavLink>
          <NavLink
            to="/security/deliveries"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            📦 Deliveries
          </NavLink>
          <NavLink
            to="/security/emergency"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            🚨 Emergency Logs
          </NavLink>
          <NavLink
            to="/security/traceback"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            🧭 Lost & Found – Traceback
          </NavLink>
          <NavLink
            to="/security/attendance"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            📍 Staff Attendance
          </NavLink>
        </nav>
        <div className="sidebar-actions">
          <NavLink
            to="/security/settings"
            className={({ isActive }) =>
              `sidebar-action-btn ${isActive ? "active" : ""}`
            }
          >
            <span className="icon">
              <Settings size={20} />
            </span>
            Settings
          </NavLink>
        </div>
        <div className="sidebar-footer">© 2026 Society Fintech</div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="left">
            <strong id="topSociety">Greenfield Residency</strong>
          </div>
          <div className="topbar-right">
            <NotificationPanel />
            <div className="profile">
              <button
                id="profileBtn"
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                Security ▾
              </button>
              <div
                id="profileMenu"
                className={`profile-menu ${profileOpen ? "show" : ""}`}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setProfileOpen(false);
                    navigate("/security/settings");
                  }}
                >
                  Profile
                </a>
                <a href="/" id="logoutBtn" onClick={handleLogout}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="content container">
          <Outlet />
        </main>

        <footer className="footer">
          Security Panel — quick actions for gate operations
        </footer>
      </div>
    </div>
  );
};

export default SecurityLayout;
