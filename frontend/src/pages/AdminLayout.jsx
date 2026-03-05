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
