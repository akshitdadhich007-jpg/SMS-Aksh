import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Building,
  Wallet,
  Bell,
  LogOut,
  Menu,
  Search,
  MoreVertical,
} from "lucide-react";
import { Card, PageHeader, StatusBadge } from "../components/ui";
const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      active: true,
    },
    {
      icon: <Users size={20} />,
      label: "Residents",
    },
    {
      icon: <Building size={20} />,
      label: "Flats & Units",
    },
    {
      icon: <Wallet size={20} />,
      label: "Accounts",
    },
    {
      icon: <FileText size={20} />,
      label: "Reports",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];
  const stats = [
    {
      label: "Total Residents",
      value: "450",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Pending Dues",
      value: "₹1.2L",
      change: "-5%",
      trend: "down",
    },
    {
      label: "Complaints",
      value: "8",
      change: "3 New",
      trend: "neutral",
    },
    {
      label: "Occupancy",
      value: "92%",
      change: "+2%",
      trend: "up",
    },
  ];
  return (
    <div
      className="layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-main)",
      }}
    >
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""} `}
        style={{
          width: "260px",
          background: "#1a1c23",
          // Admin dark sidebar
          color: "white",
          position: "fixed",
          height: "100vh",
          zIndex: 50,
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
          left: 0,
          top: 0,
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #2d3748",
          }}
          className="p-24"
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
            }}
            className="gap-16"
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "var(--primary)",
                borderRadius: "var(--radius-md)",
              }}
            ></div>
            AdminPanel
          </div>
        </div>

        <nav
          style={{
            flex: 1,
            padding: "24px 16px",
            overflowY: "auto",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
            }}
            className="gap-16"
          >
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    color: item.active ? "white" : "#a0aec0",
                    background: item.active ? "var(--primary)" : "transparent",
                    textDecoration: "none",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                  className="gap-16"
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          style={{
            borderTop: "1px solid #2d3748",
          }}
          className="p-24"
        >
          <button
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              border: "none",
              background: "transparent",
              color: "#fc8181",
              cursor: "pointer",
              fontWeight: "500",
            }}
            className="gap-16 p-16"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        className="ml-64"
      >
        {/* Header */}
        <header
          style={{
            height: "64px",
            background: "white",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
            className="gap-16"
          >
            <button
              onClick={toggleSidebar}
              style={{
                display: "none",
              }}
              className="mobile-toggle"
            >
              <Menu size={24} />
            </button>

            <div
              style={{
                position: "relative",
                width: "300px",
              }}
            >
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-secondary)",
                }}
              />
              <input
                type="text"
                placeholder="Search residents, flats, reports..."
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 40px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-light)",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
            className="gap-24"
          >
            <div
              style={{
                position: "relative",
                cursor: "pointer",
              }}
            >
              <Bell size={20} color="var(--text-secondary)" />
              <span
                style={{
                  position: "absolute",
                  top: "-1px",
                  right: "-1px",
                  width: "8px",
                  height: "8px",
                  background: "var(--danger)",
                  borderRadius: "50%",
                }}
              ></span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
              className="gap-16"
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#4a5568",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="page-container pt-32 pb-32">
          <PageHeader
            title="Dashboard Overview"
            subtitle="Welcome back, Administrator"
            action={
              <button className="btn-primary btn">Generate Report</button>
            }
          />

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
            className="gap-24 mb-32"
          >
            {stats.map((stat, i) => (
              <Card key={i}>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  className="mb-16"
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1a202c",
                  }}
                  className="mb-16"
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                  className="gap-16"
                >
                  <span
                    style={{
                      color:
                        stat.trend === "up"
                          ? "var(--success)"
                          : stat.trend === "down"
                            ? "var(--danger)"
                            : "var(--text-secondary)",
                      fontWeight: "600",
                    }}
                  >
                    {stat.change}
                  </span>
                  <span
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    vs last month
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
            }}
            className="gap-24"
          >
            {/* Recent Activity */}
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="mb-16"
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  Recent Payments
                </h3>
                <button
                  style={{
                    color: "var(--primary)",
                    background: "none",
                    border: "none",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  View All
                </button>
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--border)",
                      textAlign: "left",
                    }}
                  >
                    <th
                      style={{
                        padding: "12px 0",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Resident
                    </th>
                    <th
                      style={{
                        padding: "12px 0",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Flat
                    </th>
                    <th
                      style={{
                        padding: "12px 0",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: "12px 0",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 0",
                          fontWeight: "500",
                        }}
                      >
                        Amit Sharma
                      </td>
                      <td
                        style={{
                          padding: "16px 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        A-10{i}
                      </td>
                      <td
                        style={{
                          padding: "16px 0",
                          fontWeight: "600",
                        }}
                      >
                        ₹2,500
                      </td>
                      <td
                        style={{
                          padding: "16px 0",
                        }}
                      >
                        <StatusBadge status="Paid" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Quick Actions / Notices */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              className="gap-24"
            >
              <Card>
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  Quick Actions
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="gap-16"
                >
                  <button
                    style={{
                      width: "100%",
                      background: "var(--bg-light)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      textAlign: "left",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }}
                    className="p-16"
                  >
                    + Add New Resident
                  </button>
                  <button
                    style={{
                      width: "100%",
                      background: "var(--bg-light)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      textAlign: "left",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }}
                    className="p-16"
                  >
                    📢 Create Announcement
                  </button>
                  <button
                    style={{
                      width: "100%",
                      background: "var(--bg-light)",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      textAlign: "left",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                    }}
                    className="p-16"
                  >
                    ⚠️ View Emergency Logs
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Admin;
