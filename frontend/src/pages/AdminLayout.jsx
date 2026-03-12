<<<<<<< HEAD
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
import '../styles/admin-style.css';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 768 : true));
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { isDarkMode, toggleDarkMode } = useTheme();

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

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
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
                { name: 'Committee', icon: <Building size={20} />, path: '/admin/committee' },
                { name: 'Shops Area', icon: <Store size={20} />, path: '/admin/shops' },
            ]
        },
        {
            title: "Operations",
            items: [
                { name: 'Maintenance', icon: <FileText size={20} />, path: '/admin/maintenance' },
                { name: 'Payments', icon: <BadgeIndianRupee size={20} />, path: '/admin/payments' },
                { name: 'Expenses', icon: <BadgeIndianRupee size={20} />, path: '/admin/expenses' },
                { name: 'Complaints', icon: <MailWarning size={20} />, path: '/admin/complaints' },
                { name: 'Lost & Found', icon: <Compass size={20} />, path: '/admin/traceback' },
                { name: 'Asset Bookings', icon: <Calendar size={20} />, path: '/admin/bookings' },
                { name: 'Marketplace', icon: <ShoppingBagIcon size={20} />, path: '/admin/marketplace' },
            ]
        },
        {
            title: "Security Logs",
            items: [
                { name: 'CivicGuard AI', icon: <ShieldAlert size={20} />, path: '/admin/surveillance' },
                { name: 'Visitor Analytics', icon: <BarChart size={20} />, path: '/admin/visitor-analytics' },
                { name: 'Staff Attendance', icon: <FileText size={20} />, path: '/admin/attendance' },
                { name: 'Vehicles', icon: <Package size={20} />, path: '/admin/vehicles' },
                { name: 'Deliveries', icon: <Package size={20} />, path: '/admin/deliveries' },
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
=======
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import NotificationPanel from "../components/ui/NotificationPanel";
import { useToast } from "../components/ui/Toast";
import { Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "../styles/admin-style.css";
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    navigate("/");
  };
  const menuItems = [
    {
      name: "Dashboard",
      icon: "🏠",
      path: "/admin",
    },
    {
      name: "Residents",
      icon: "👥",
      path: "/admin/residents",
    },
    {
      name: "Shops",
      icon: "🛍️",
      path: "/admin/shops",
    },
    {
      name: "Maintenance",
      icon: "🧾",
      path: "/admin/maintenance",
    },
    {
      name: "Payments",
      icon: "💳",
      path: "/admin/payments",
    },
    {
      name: "Expenses",
      icon: "📈",
      path: "/admin/expenses",
    },
    {
      name: "Staff",
      icon: "👔",
      path: "/admin/staff",
    },
    {
      name: "Committee",
      icon: "🤝",
      path: "/admin/committee",
    },
    {
      name: "Vehicles",
      icon: "🚗",
      path: "/admin/vehicles",
    },
    {
      name: "Deliveries",
      icon: "📦",
      path: "/admin/deliveries",
    },
    {
      name: "Complaints",
      icon: "⚠️",
      path: "/admin/complaints",
    },
    {
      name: "Notices",
      icon: "🎉",
      path: "/admin/notices",
    },
    {
      name: "Documents",
      icon: "📂",
      path: "/admin/documents",
    },
    {
      name: "Emergency",
      icon: "🚨",
      path: "/admin/emergency",
    },
    {
      name: "Assets & Bookings",
      icon: "🏟️",
      path: "/admin/bookings",
    },
    {
      name: "Lost & Found – Traceback",
      icon: "🧭",
      path: "/admin/traceback",
    },
    {
      name: "Visitor Analytics",
      icon: "📊",
      path: "/admin/visitor-analytics",
    },
    {
      name: "Reports",
      icon: "📈",
      path: "/admin/reports",
    },
    {
      name: "CivicGuard AI",
      icon: "🚨",
      path: "/admin/surveillance",
    },
    {
      name: "Staff Attendance Logs",
      icon: "📋",
      path: "/admin/attendance",
    },
    {
      name: "Marketplace",
      icon: "🏘️",
      path: "/admin/marketplace",
    },
  ];
  return (
    <div className="admin-body">
      <aside
        className={`sidebar ${sidebarOpen ? "" : "hidden"}`}
        style={{
          display: sidebarOpen ? "flex" : "none",
        }}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-content">
            <h2 id="societyName">My Society</h2>
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
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">{item.icon}</span> {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-actions">
          <NavLink
            to="/admin/settings"
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

      <div
        className="main"
        style={{
          marginLeft: sidebarOpen ? "260px" : "0",
        }}
      >
        <header className="topbar">
          <div className="topbar-left">
            <button
              id="sidebarToggle"
              className="btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          </div>
          <div className="topbar-right">
            <NotificationPanel />
            <div className="profile">
              <button
                id="profileBtn"
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                Admin ▾
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
                    navigate("/admin/settings");
                  }}
                >
                  Profile
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setProfileOpen(false);
                    toast.info(
                      "Navigate to Settings to change your password",
                      "Change Password",
                    );
                    navigate("/admin/settings");
                  }}
                >
                  Change Password
                </a>
                <a href="/" id="logoutBtn" onClick={handleLogout}>
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
export default AdminLayout;
