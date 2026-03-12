<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from '../components/ui/NotificationPanel';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../context/ThemeContext';
import '../styles/admin-style.css';
import {
    LayoutDashboard, Receipt, CreditCard, History, MessageSquare,
    Bell, Settings,
    Building, Search, Store, Calendar, X, ChevronDown
} from 'lucide-react';

const ResidentLayout = () => {
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
                { name: 'Pay Maintenance', path: '/resident/pay', icon: <CreditCard size={20} /> },
                { name: 'Payment History', path: '/resident/history', icon: <History size={20} /> },
                { name: 'My Fines', path: '/resident/fines', icon: <Receipt size={20} /> },
                { name: 'My Violations', path: '/resident/violations', icon: <Receipt size={20} /> },
            ]
        },
        {
            title: "Community",
            items: [
                { name: 'Marketplace', path: '/resident/marketplace', icon: <Store size={20} /> },
                { name: 'Asset Booking', path: '/resident/bookings', icon: <Calendar size={20} /> },
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
=======
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import NotificationPanel from "../components/ui/NotificationPanel";
import { useToast } from "../components/ui/Toast";
import { useTheme } from "../context/ThemeContext";
import "../styles/admin-style.css";
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
  Search,
  Store,
} from "lucide-react";
const ResidentLayout = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      path: "/resident",
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    {
      name: "My Bills",
      path: "/resident/bills",
      icon: <Receipt size={20} />,
    },
    {
      name: "Pay Maintenance",
      path: "/resident/pay",
      icon: <CreditCard size={20} />,
    },
    {
      name: "Payment History",
      path: "/resident/history",
      icon: <History size={20} />,
    },
    {
      name: "Complaints",
      path: "/resident/complaints",
      icon: <MessageSquare size={20} />,
    },
    {
      name: "Announcements",
      path: "/resident/announcements",
      icon: <Bell size={20} />,
    },
    {
      name: "Documents",
      path: "/resident/documents",
      icon: <FileText size={20} />,
    },
    {
      name: "Emergency",
      path: "/resident/emergency",
      icon: <Phone size={20} />,
    },
    {
      name: "Staff & Services",
      path: "/resident/staff",
      icon: <Users size={20} />,
    },
    {
      name: "Asset Booking",
      path: "/resident/bookings",
      icon: <Building size={20} />,
    },
    {
      name: "Lost & Found – Traceback",
      path: "/resident/traceback",
      icon: <Search size={20} />,
    },
    {
      name: "Visitor Pre-Approval",
      path: "/resident/visitor-approval",
      icon: "👥",
    },
    {
      name: "My Fines",
      path: "/resident/fines",
      icon: "💰",
    },
    {
      name: "Marketplace",
      path: "/resident/marketplace",
      icon: <Store size={20} />,
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
              end={item.end}
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
            to="/resident/settings"
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
                Resident ▾
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
                    navigate("/resident/settings");
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
                    navigate("/resident/settings");
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

        <footer className="footer">
          Resident Portal — manage your society account
        </footer>
      </div>
    </div>
  );
};
export default ResidentLayout;
