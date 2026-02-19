# 🏢 Society Fintech — Smart Management System

> **Smart management for modern residential societies.**

Society Fintech is a **full-stack web application** built to digitize and streamline the daily operations of residential gated communities. It replaces scattered manual processes (paper logs, WhatsApp groups, Excel sheets) with a single, role-based platform.

---

## 📌 Table of Contents
- [Tech Stack](#-tech-stack)
- [How to Run](#-how-to-run)
- [Project Architecture](#-project-architecture)
- [User Roles & Dashboards](#-user-roles--dashboards)
  - [Admin Dashboard](#1%EF%B8%8F⃣-admin-dashboard)
  - [Resident Portal](#2%EF%B8%8F⃣-resident-portal)
  - [Security Panel](#3%EF%B8%8F⃣-security-panel)
- [Smart Surveillance System](#-smart-surveillance-system-ai-powered)
- [Discipline Score System](#-discipline-score-system)
- [Lost & Found Traceback](#-lost--found-traceback)
- [Visitor Pre-Approval System](#-visitor-pre-approval-system)
- [Authentication](#-authentication)
- [File Structure](#-file-structure)
- [Data Flow Diagram](#-data-flow-diagram)

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React.js (Vite)                   |
| Routing     | React Router v6 (Nested Routes)   |
| Styling     | Custom CSS + Inline Styles        |
| State       | React Context API + localStorage  |
| Backend     | Node.js + Express.js              |
| Database    | Supabase (PostgreSQL)             |
| Auth        | Email/Password + Google OAuth     |
| Icons       | Lucide React + Emoji Icons        |

---

## 🚀 How to Run

```bash
# 1. Install all dependencies (root + frontend + backend)
npm run install:all

# 2. Start both frontend & backend concurrently
npm run dev
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5175       |
| Backend  | http://localhost:3001       |

---

## 🏗 Project Architecture

The application follows a **role-based architecture** with three separate layout wrappers, each with its own sidebar, routes, and pages:

```
App.jsx
├── "/" → LandingPage (Login + Hero Section)
├── "/admin" → AdminLayout
│   ├── Dashboard, Residents, Maintenance, Payments...
│   ├── Smart Surveillance (AI Scan + Violations)
│   └── Lost & Found Traceback
├── "/resident" → ResidentLayout
│   ├── Dashboard, Bills, Pay, Complaints...
│   ├── My Fines (View + Pay Violations)
│   └── Lost & Found Traceback
└── "/security" → SecurityLayout
    ├── Dashboard, Visitor Entry, Vehicles...
    └── Lost & Found Traceback
```

### Context Providers
- **ThemeProvider** → Manages dark/light mode globally
- **VisitorProvider** → Manages visitor pre-approval state

---

## 👥 User Roles & Dashboards

### 1️⃣ Admin Dashboard (`/admin`)

The admin has full control over society operations:

| Feature | Path | Description |
|---------|------|-------------|
| 🏠 Dashboard | `/admin` | Overview with key stats and analytics |
| 👤 Residents | `/admin/residents` | Add, edit, manage resident records |
| 🏪 Shops | `/admin/shops` | Manage commercial spaces |
| 💰 Maintenance | `/admin/maintenance` | Create and manage billing cycles |
| 💳 Payments | `/admin/payments` | Track all payment records |
| 📒 Expenses | `/admin/expenses` | Society expense tracking |
| 👷 Staff | `/admin/staff` | Manage society staff members |
| 🧑‍💼 Committee | `/admin/committee` | Committee member management |
| 🚗 Vehicles | `/admin/vehicles` | Vehicle and visitor logs |
| 📦 Deliveries | `/admin/deliveries` | Delivery tracking log |
| 📢 Complaints | `/admin/complaints` | View and resolve resident complaints |
| 📋 Notices | `/admin/notices` | Publish events and announcements |
| 📁 Documents | `/admin/documents` | Document repository |
| 🆘 Emergency | `/admin/emergency` | Emergency contact management |
| 📈 Reports | `/admin/reports` | Analytics and reports |
| 🏟️ Asset Booking | `/admin/bookings` | Approve/reject facility bookings |
| 📊 Visitor Analytics | `/admin/visitor-analytics` | Visitor data insights |
| 🚨 **Smart Surveillance** | `/admin/surveillance` | AI-powered violation detection |
| 🧭 Lost & Found | `/admin/traceback` | Lost item tracking system |
| ⚙️ Settings | `/admin/settings` | Admin preferences |

### 2️⃣ Resident Portal (`/resident`)

Residents can manage their society life:

| Feature | Path | Description |
|---------|------|-------------|
| 🏠 Dashboard | `/resident` | Personal overview |
| 🧾 My Bills | `/resident/bills` | View maintenance bills |
| 💳 Pay Maintenance | `/resident/pay` | Make payments |
| 📜 Payment History | `/resident/history` | Past payment records |
| 💬 Complaints | `/resident/complaints` | Raise complaints |
| 📢 Announcements | `/resident/announcements` | Society notices |
| 📁 Documents | `/resident/documents` | Access shared documents |
| 📞 Emergency | `/resident/emergency` | Emergency contacts |
| 👷 Staff & Services | `/resident/staff` | View staff directory |
| 🏟️ Asset Booking | `/resident/bookings` | Book community facilities |
| 🧭 Lost & Found | `/resident/traceback` | Report/track lost items |
| 👥 Visitor Pre-Approval | `/resident/visitor-approval` | Pre-approve visitors |
| 💰 **My Fines** | `/resident/fines` | View and pay violation fines |
| ⚙️ Settings | `/resident/settings` | Profile, password, appearance |

### 3️⃣ Security Panel (`/security`)

Security guards manage gate operations:

| Feature | Path | Description |
|---------|------|-------------|
| 🏠 Dashboard | `/security` | Quick overview |
| 👤 Visitor Entry | `/security/visitors` | Log visitor check-in/out |
| 🔍 Pre-Approved | `/security/preapproved` | Verify pre-approved visitors |
| 🚗 Vehicle Entry | `/security/vehicles` | Log vehicle entries |
| 📦 Deliveries | `/security/deliveries` | Track deliveries |
| 🚨 Emergency Logs | `/security/emergency` | Emergency incident logs |
| 🧭 Lost & Found | `/security/traceback` | Report found items |
| ⚙️ Settings | `/security/settings` | Security preferences |

---

## 🚨 Smart Surveillance System (AI-Powered)

This is the flagship feature. It simulates AI-based surveillance for rule enforcement.

### Admin Side (`SmartSurveillance.jsx`)

**How it works:**
1. Admin uploads an image (e.g., CCTV screenshot)
2. Selects violation type (Wrong Parking, Littering)
3. Clicks "Run AI Scan" → System simulates AI detection
4. Violation is created with auto-generated fine (₹50)
5. 🚨 Instant notification popup confirms the action

**Features:**
- **Analytics Cards** — Total Violations count + Total Collected amount
- **Violation Type Selector** — Choose between Wrong Parking / Littering
- **Live Alert Popup** — Red banner appears for 3 seconds after detection
- **Violation Records Table** — Filterable by status (All/Pending/Paid)
- **Delete Violations** — Remove incorrect entries
- **Download CSV Report** — Export all violation data as `.csv`
- **Discipline Leaderboard** — Shows Top 5 residents ranked by discipline score

### Resident Side (`MyFines.jsx`)

**How it works:**
1. Resident logs in → sees fines assigned to their flat (A-102)
2. Each violation shows: image proof, type, fine amount, date, status
3. Click "Pay Fine" → status changes from "Pending" to "Paid"
4. Discipline Score updates in real-time

**Features:**
- **Discipline Score Display** — Starts at 100, loses 10 per violation
- **Color-Coded Score** — Green (≥70) / Red (<70)
- **Warning Badge** — Shows "⚠ Warning: Low Discipline Score" when score < 70
- **Booking Restriction** — Shows "🚫 Facility Booking Restricted" when score < 60

### Data Flow

```
Admin uploads image → AI Scan → Violation saved to localStorage
                                        ↓
                              Resident sees fine in "My Fines"
                                        ↓
                              Resident clicks "Pay Fine"
                                        ↓
                              Status updates to "Paid"
                                        ↓
                              Admin sees "Total Collected" increase
```

---

## 🎯 Discipline Score System

Every resident starts with a **Discipline Score of 100**.

| Event | Impact |
|-------|--------|
| Each violation detected | **-10 points** |
| Score < 70 | ⚠ Warning badge appears |
| Score < 60 | 🚫 Facility booking restricted |

The score is calculated from `scoreImpact` field stored with each violation:

```javascript
const totalImpact = violations.reduce(
  (sum, v) => sum + (v.scoreImpact || 0), 0
);
const score = 100 + totalImpact;
```

---

## 🧭 Lost & Found Traceback

A comprehensive system for tracking lost and found items within the society:

- **Report Lost Item** — Residents/Admin can report missing items with details
- **Report Found Item** — Security/Admin can log found items
- **Smart Matching** — System attempts to match lost and found items
- **Prove Ownership** — Claimants can submit proof of ownership
- **Claim Review** — Admin reviews and approves/rejects claims
- **Shared across all roles** — Admin, Resident, and Security all have access

---

## 👥 Visitor Pre-Approval System

Residents can pre-approve expected visitors:

1. Resident creates a visitor pass with name, phone, time window
2. A unique code is generated
3. Security can search by code or phone number at the gate
4. System validates the time window automatically
5. Entry/exit timestamps are recorded

---

## 🔐 Authentication

| Method | Description |
|--------|-------------|
| Email/Password | Traditional login with role selection |
| Google OAuth | One-click login via Google account |

After login, users are redirected to their role-specific dashboard:
- Admin → `/admin`
- Resident → `/resident`
- Security → `/security`

---

## 📁 File Structure

```
SMS-Aksh/
├── package.json                    # Root scripts (concurrently runs both)
├── backend/
│   ├── server.js                   # Express API server
│   ├── db.js                       # Supabase database connection
│   ├── database.json               # Local data store
│   └── .env                        # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main routing configuration
│   │   ├── App.css                 # Global styles
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx     # Dark/Light mode
│   │   │   └── VisitorContext.jsx   # Visitor state management
│   │   ├── components/
│   │   │   ├── features/
│   │   │   │   └── Login.jsx       # Login component
│   │   │   └── ui/
│   │   │       ├── NotificationPanel.jsx
│   │   │       └── Toast.jsx
│   │   ├── utils/
│   │   │   └── violationStorage.js # localStorage CRUD for violations
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Hero + Login page
│   │   │   ├── AdminLayout.jsx     # Admin sidebar + layout
│   │   │   ├── ResidentLayout.jsx  # Resident sidebar + layout
│   │   │   ├── SecurityLayout.jsx  # Security sidebar + layout
│   │   │   ├── admin/              # 28 admin page components
│   │   │   │   ├── SmartSurveillance.jsx  ★
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── LostAndFoundTraceback.jsx
│   │   │   │   └── ...
│   │   │   ├── resident/           # 15 resident page components
│   │   │   │   ├── MyFines.jsx     ★
│   │   │   │   ├── ResidentDashboard.jsx
│   │   │   │   ├── VisitorPreApproval.jsx
│   │   │   │   └── ...
│   │   │   └── security/           # 9 security page components
│   │   │       ├── SecurityDashboard.jsx
│   │   │       ├── PreApprovedVisitors.jsx
│   │   │       └── ...
│   │   └── styles/
│   │       ├── admin-style.css
│   │       └── LandingPage.css
│   └── index.html
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   ADMIN PANEL   │     │    localStorage       │     │ RESIDENT PORTAL │
│                 │     │                      │     │                 │
│ Smart           │────▶│  "violations" key     │◀────│ My Fines        │
│ Surveillance    │     │  [{id, type, fine,    │     │ (View + Pay)    │
│ (Create + Scan) │     │    status, image,     │     │                 │
│                 │     │    scoreImpact, date}] │     │ Discipline      │
│ CSV Download    │     │                      │     │ Score Display   │
│ Leaderboard     │     └──────────────────────┘     │                 │
└─────────────────┘                                   └─────────────────┘

┌─────────────────┐     ┌──────────────────────┐
│ SECURITY PANEL  │     │   Supabase (Backend)  │
│                 │────▶│                      │
│ Visitor Entry   │     │ Residents, Bills,     │
│ Vehicle Logs    │     │ Payments, Staff,      │
│ Found Items     │     │ Complaints, etc.      │
└─────────────────┘     └──────────────────────┘
```

---

## 🏆 Key Highlights

| Feature | Why It Matters |
|---------|---------------|
| Role-Based Access | Each user sees only what they need |
| Smart Surveillance | AI-simulated violation detection with image proof |
| Discipline Score | Gamified compliance system (100 → warning at 70 → restriction at 60) |
| CSV Export | Admin can download violation reports anytime |
| Leaderboard | Encourages good behavior among residents |
| Real-Time Alerts | Instant feedback when violations are recorded |
| Dark Mode | Full dark/light theme toggle across all dashboards |
| Google OAuth | One-click secure login |
| Lost & Found | Smart matching system for community items |
| Visitor Pre-Approval | Digital visitor passes with time-window validation |

---

> **Society Fintech** — Because society management depends on trust, transparency, and technology. 🚀
