# SMS-Aksh: Complete Project Context Report
**Generated:** 13 March 2026  
**Project Status:** Hackathon Build (Phase 2 Complete - Step 4/12)  
**Last Updated:** After Complaint Bug Fixes

---

## 1. PROJECT OVERVIEW

### 1.1 Vision & Goal
**Civiora** (branded as **Accord Living**) is a **Society Management System** for a hackathon demo.

**Core Concept:** Real-time, multi-portal property management system with 3 user roles interacting through live bidirectional data sync.

**Hackathon Strategy:**
- **3-Portal System** (Admin / Resident / Security) running side-by-side
- **5 Live Demo Flows** showing <1 second real-time updates without page refresh
- **Data sync via Firestore subscriptions** - when one user updates data, other portals reflect instantly
- **Purpose:** Win judges with "WOW factor" of seamless real-time collaboration

### 1.2 Target Audience
- **Admin:** Building/community manager - posts notices, tracks complaints, manages bills
- **Resident:** Flat owner/tenant - views notices, submits complaints, pays bills, approves visitors
- **Security:** Guard/security staff - manages visitor pre-approval, tracks entry/exit

---

## 2. TECHNICAL ARCHITECTURE

### 2.1 Frontend Stack
| Component | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Vite | 7.3.1 | Dev server + build tool |
| React Router DOM | 7.x | SPA routing |
| Firebase SDK | Latest | Auth + Firestore |
| Lucide React | Icons | UI icons (Eye, Trash2, etc.) |

**Development Server:** http://localhost:5177/ (auto-fallback from 5176)  
**Build Status:** ✓ 2853 modules transformed, <3s build time, zero errors

### 2.2 Backend Architecture
- **Firebase Authentication:** Email/password auth for 3 demo users
- **Firestore Database:** Real-time NoSQL document store (asia-south1 region)
- **Real-Time Pattern:** `onSnapshot` listeners for live subscriptions

### 2.3 Project Structure
```
/Users/bhavesh/Desktop/SMS-Aksh/
├── frontend/                          # React app (Vite)
│   ├── src/
│   │   ├── App.jsx                   # Main router setup
│   │   ├── main.jsx                  # Entry point
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Firebase auth context (useAuth hook)
│   │   ├── firebase/
│   │   │   ├── config.js             # Firebase init + db/auth exports
│   │   │   ├── userService.js        # Assign roles by email
│   │   │   ├── announcementService.js # Announcements CRUD + subscriptions
│   │   │   └── complaintService.js   # Complaints CRUD + subscriptions (FIXED)
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Modal.jsx         # Modal dialog (display fixed)
│   │   │   │   ├── Toast.jsx         # Toast notifications
│   │   │   │   └── ...other UI
│   │   │   └── layouts/
│   │   │       ├── AdminLayout.jsx   # Sidebar + nav for admin
│   │   │       ├── ResidentLayout.jsx # Sidebar for resident
│   │   │       └── SecurityLayout.jsx # Sidebar for security
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Firebase email/password login
│   │   │   ├── AdminLayout.jsx       # Admin layout wrapper
│   │   │   ├── ResidentLayout.jsx    # Resident layout wrapper
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── EventsAnnouncements.jsx # FLOW 1: Posts notices (COMPLETE)
│   │   │   │   ├── ComplaintManagement.jsx # FLOW 2: Manages complaints (FIXED)
│   │   │   │   ├── BillManagement.jsx      # FLOW 4: Manages bills (TODO)
│   │   │   │   └── ...other pages
│   │   │   ├── resident/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Announcements.jsx  # FLOW 1: Sees notices (COMPLETE)
│   │   │   │   ├── Complaints.jsx     # FLOW 2: Submits complaints (FIXED)
│   │   │   │   ├── MyBills.jsx        # FLOW 4: Pays bills (TODO)
│   │   │   │   └── ...other pages
│   │   │   └── security/
│   │   │       └── ...pages
│   │   ├── pages/**/*.css             # Page-specific styles
│   │   └── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── ...config files
└── backend/                           # Node.js backend (not currently used)
    ├── app.js
    ├── package.json
    └── ...
```

---

## 3. FIREBASE SETUP & AUTHENTICATION

### 3.1 Firebase Project
- **Project ID:** `accord-living-cf585`
- **Region:** asia-south1
- **Auth Method:** Email/Password
- **Database:** Firestore (real-time NoSQL)

### 3.2 Demo User Credentials (For Testing)
| Email | Password | Role | Flat Number | Purpose |
|-------|----------|------|-------------|---------|
| admin@accordliving.com | Admin@123 | admin | - | Posts notices, manages complaints, bills |
| resident@accordliving.com | Resident@123 | resident | A-101 | Views notices, submits complaints, pays bills |
| security@accordliving.com | Security@123 | security | - | Views visitor pre-approvals, entry logs |

**Login URL:** http://localhost:5177/login

### 3.3 Firestore Collections Schema

#### Collection: `users/{uid}`
```javascript
{
  uid: "firebase-user-id",
  email: "admin@accordliving.com",
  name: "Admin Name",
  role: "admin",                    // "admin" | "resident" | "security"
  flatNumber: "A-101",              // Only for residents
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Collection: `announcements`
```javascript
{
  id: "doc-id",
  category: "event" | "notice",
  title: "Annual General Meeting",
  description: "Please attend our AGM on...",
  type: "info" | "maintenance" | "alert" | "meeting" | "event",
  date: "2026-03-15",
  time: "6:00 PM",
  location: "Community Hall",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Collection: `complaints`
```javascript
{
  id: "doc-id",
  residentUid: "user-uid",
  residentName: "Resident Name",
  residentFlat: "A-101",
  category: "Plumbing" | "Electrical" | "Security" | "Housekeeping" | "Maintenance" | "Other",
  description: "Water leak in bathroom",
  status: "Pending" | "In Progress" | "Resolved",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  displayDate: "13 Mar 2026"         // Server-side formatted
}
```

#### Collection: `bills` (TODO)
```javascript
{
  id: "doc-id",
  residentUid: "user-uid",
  residentName: "Resident Name",
  residentFlat: "A-101",
  amount: 2500,
  dueDate: Timestamp,
  status: "Pending" | "Paid",
  month: "Mar 2026",
  category: "Maintenance" | "Additional",
  paidDate: Timestamp (optional),
  paidAmount: number (optional),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 4. COMPLETED WORK (Phases 1-2, Steps 1-4)

### Phase 1: Supabase Removal & Frontend Cleanup ✅
- **Scope:** Removed all 80 Supabase references from previous implementation
- **Outcome:** ~68 files deleted (marketplace, traceback, payment modules); frontend passing with 2832 modules
- **Duration:** Previous sessions

### Phase 2A: Firebase Integration ✅
**Step 1 & 2: Authentication Setup**
- Created `src/firebase/config.js` → exports `auth`, `db` with real Firebase credentials
- Created `src/firebase/userService.js` → assigns roles based on email
- Rewrote `AuthContext.jsx` → Firebase Auth + `onAuthStateChanged` listener
- Rewrote `Login.jsx` → 3 demo users with Firebase credentials
- Fixed all layout files (AdminLayout, ResidentLayout, SecurityLayout) → `signOut()` works
- **Outcome:** Login/logout fully working; Auth persists across page refreshes

### Phase 2B: Announcements Real-Time Flow (FLOW 1) ✅
**Step 3: Posts & Announcements**
- Created `src/firebase/announcementService.js` → Firestore CRUD + `onSnapshot` subscriptions
  - `postAnnouncement(data)` → async post to Firestore
  - `subscribeToAnnouncements(callback)` → live updates
  - `deleteAnnouncement(id)` → async delete
- Rewrote Admin `EventsAnnouncements.jsx` → removed mock data, added Firestore sync
  - Form captures event/announcement type, title, description
  - Grid shows "Publishing..." state during async post
  - Trash delete button with async delete
  - Stats auto-calculate from live Firestore data
- Rewrote Resident `Announcements.jsx` → removed mock data, added live subscription
  - Loading spinner while data arrives
  - Cards grouped by: Pinned / Recent (Unread) / Older
  - "Mark as read" local state (doesn't persist to Firestore)
  - "Read more" button collapsed to 2 lines with `-webkit-line-clamp`
  - Type badges with colour-coded styling
  - Real-time updates from `onSnapshot`
- Fixed Modal component → Added `open` class to `.modal-overlay` JSX (was invisible)
- Rewrote `src/pages/resident/Announcements.css` (250+ lines)
  - Proper `ac-*` class names matching JSX
  - Type-based colours: info=#2563eb, maintenance=#ea580c, alert=#dc2626, meeting=#16a34a, event=#7c3aed
  - Unread indicator: left-border + blue dot
  - Collapsed text, loading spinner, dark mode, responsive mobile
- **Outcome:** Admin posts notice → Resident sees in <1 second with no refresh (DEMONSTRABLE)

### Phase 2C: Complaints Real-Time Flow (FLOW 2) ✅
**Step 4: Resident Complaints & Admin Management (FIXED 13 MAR)**
- Created `src/firebase/complaintService.js` → Firestore CRUD + subscriptions
  - `submitComplaint(data)` → auto status='Pending'
  - `subscribeToAllComplaints(callback)` → Admin view, all complaints
  - `subscribeToResidentComplaints(uid, callback)` → Resident view, filtered by uid
  - `updateComplaintStatus(id, status)` → status change with timestamp
  - `deleteComplaint(id)` → async delete
  - **FIXED:** Removed `orderBy` from resident query (avoided composite index error); added client-side sort
  - **FIXED:** Added error handlers with console logging
- Rewrote Resident `Complaints.jsx` → removed mock data
  - Form captures category, description
  - `useAuth()` hook gets user data (uid, name, flatNumber)
  - `useEffect` subscribes to `subscribeToResidentComplaints(user.uid, ...)`
  - Async `handleSubmit()` with `submitComplaint()` call + form reset
  - Table shows real complaints with status badges (Pending/In Progress/Resolved)
  - Toast feedback on success/error
- Rewrote Admin `ComplaintManagement.jsx` → removed mock data (FIXED 13 MAR)
  - `useEffect` subscribes to all complaints via `subscribeToAllComplaints(...)`
  - Search + status filter (All/Pending/In Progress/Resolved)
  - Stats cards auto-calculate from real data (Total/Pending/In Progress/Resolved)
  - Table displays all fields with correct mapping:
    - `id.substring(0, 8).toUpperCase()` for display ID
    - `displayDate` for formatted date
    - `residentName` and `residentFlat` for resident info
    - `category`, `description`, `status`
  - Modal with dropdown to change status → `handleStatusChange()` calls `updateComplaintStatus()` → Firestore write → Resident's `onSnapshot` fires → resident sees status update in real-time
  - Delete button with async delete
  - **FIXED (13 MAR):** Field name mismatches resolved:
    - `resident` → `residentName`
    - `date` → `displayDate`
    - Removed non-existent `priority` field (defaults to "Medium")
    - Added `residentFlat` display
- **Outcome:** Resident submits complaint → Admin sees instantly → Admin changes status → Resident sees status update instantly (DEMONSTRABLE)

---

## 5. CURRENT STATE (13 MAR 2026)

### 5.1 Build & Deployment
- **Frontend Build:** ✓ 2853 modules transformed
- **Build Time:** 2.83 seconds
- **Errors:** Zero (passing)
- **Dev Server:** Running at http://localhost:5177/ (port fallback from 5176)
- **Hot Reload:** Active (changes auto-refresh browser)

### 5.2 Working Features
| Feature | Module | Status | Real-Time? |
|---------|--------|--------|-----------|
| Login/Logout | AuthContext | ✅ COMPLETE | N/A |
| Announcements (Admin post) | EventsAnnouncements | ✅ COMPLETE | ✅ YES |
| Announcements (Resident view) | Announcements | ✅ COMPLETE | ✅ YES |
| Complaints (Resident submit) | Complaints | ✅ COMPLETE (FIXED) | ✅ YES |
| Complaints (Admin manage) | ComplaintManagement | ✅ COMPLETE (FIXED) | ✅ YES |
| Complaint Status Updates | ComplaintManagement → Firestore | ✅ COMPLETE | ✅ YES |
| Bill Management | BillManagement / MyBills | ❌ TODO | - |
| Visitor Pre-Approval | VisitorPreapproval | ❌ TODO | - |
| Emergency SOS | EmergencyManagement | ❌ TODO | - |

### 5.3 Known Issues (FIXED 13 MAR)
1. ~~Resident complaints stuck on "Loading your complaints..."~~ → **FIXED:** Removed `orderBy` from where-filtered query
2. ~~Admin complaints tab crashes on click~~ → **FIXED:** Field name mapping corrected (resident → residentName, date → displayDate)

---

## 6. FIRESTORE SUBSCRIPTIONS ARCHITECTURE (Real-Time Pattern)

### 6.1 How Real-Time Works
```
Admin Page (EventsAnnouncements.jsx)
    ↓
    useEffect → subscribeToAnnouncements()
    ↓
    onSnapshot(query(...), callback)  ← LISTENER #1
    ↓
    setItems(data)
    ↓
    [Renders cards with live data]

Resident Page (Announcements.jsx)
    ↓
    useEffect → subscribeToAnnouncements()
    ↓
    onSnapshot(query(...), callback)  ← LISTENER #2
    ↓
    setAnnouncements(data)
    ↓
    [Renders cards with live data]

Admin posts new announcement:
    ↓
    postAnnouncement({...})
    ↓
    addDoc(collection(db, 'announcements'), {...})  ← FIRESTORE WRITE
    ↓
    onSnapshot fires on BOTH listeners simultaneously
    ↓
    LISTENER #1 re-renders admin page with new card
    LISTENER #2 re-renders resident page with new card
    ↓
    <1 second latency
```

### 6.2 Subscription Unsubscribe Pattern
```javascript
useEffect(() => {
    if (!user?.uid) return;
    
    // Subscribe and get unsubscribe function
    const unsub = subscribeToComplaints(user.uid, (data) => {
        setComplaints(data);
        setLoading(false);
    });
    
    // Cleanup: unsubscribe when component unmounts
    return () => unsub();
}, [user?.uid]);
```

### 6.3 Error Handling
All service functions have error handlers:
```javascript
return onSnapshot(q, 
    (snapshot) => { /* success */ },
    (error) => { 
        console.error('[Firestore Error]:', error);
        callback([]);  // Fallback empty array
    }
);
```

---

## 7. KEY CODE PATTERNS & CONVENTIONS

### 7.1 Service Layer Pattern
**File:** `src/firebase/*Service.js`
```javascript
// CRUD Operations
export const submitComplaint = (data) => addDoc(collection(...), {...});
export const updateComplaintStatus = (id, status) => updateDoc(doc(...), {...});
export const deleteComplaint = (id) => deleteDoc(doc(...));

// Real-time Subscriptions
export const subscribeToResidentComplaints = (uid, callback) => {
    return onSnapshot(query(...), (snapshot) => {
        const items = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
        callback(items);
    }, errorHandler);
};
```

### 7.2 Page Component Pattern
**File:** `src/pages/resident/Complaints.jsx`
```javascript
const Complaints = () => {
    const { user } = useAuth();                    // Get logged-in user
    const toast = useToast();                      // Toast notifications
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Subscribe to live data
    useEffect(() => {
        if (!user?.uid) return;
        const unsub = subscribeToResidentComplaints(user.uid, (data) => {
            setComplaints(data);
            setLoading(false);
        });
        return () => unsub();
    }, [user?.uid]);
    
    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitComplaint({...});
            toast.success('Success!', 'Title');
            setFormData({...});  // Reset form
        } catch (err) {
            toast.error('Error message', 'Error');
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <>
            <PageHeader ... />
            {loading ? <LoadingSpinner /> : 
             complaints.length === 0 ? <EmptyState /> :
             <Table data={complaints} />}
        </>
    );
};
```

### 7.3 Toast Notifications
```javascript
const toast = useToast();
toast.success('Complaint submitted!', 'Success');
toast.error('Failed to submit', 'Error');
```

### 7.4 Modal Usage
```javascript
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Details">
    {selectedItem && (
        <div>
            <input value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)} />
            <button onClick={handleStatusChange}>Save</button>
        </div>
    )}
</Modal>
```

---

## 8. WHAT'S COMPLETED (4 of 12 Steps)

### ✅ Completed Steps
1. **Step 1:** Firebase Auth Setup (Email/Password, 3 demo users)
2. **Step 2:** Login/Logout Pages (AuthContext, role-based routing)
3. **Step 3:** Announcements Real-Time Flow (Admin posts → Resident sees <1s)
4. **Step 4:** Complaints Real-Time Flow (Resident submits → Admin manages → status updates live) **FIXED 13 MAR**

---

## 9. WHAT'S REMAINING (8 of 12 Steps)

### ⬜ Step 5: Bill Management (NEXT)
**FLOW 4: Bill Creation & Payment**

**Admin Side:**
- Page: `BillManagement.jsx`
- Service: Create `billService.js` with:
  - `createBill(data)` → Firestore
  - `subscribeToAllBills(callback)` → All bills for all residents
  - `markBillPaid(billId, paidAmount, paymentDate)` → Status change
  - `deleteBill(id)` → Remove bill
- Features:
  - Form to create bill (flat, amount, month, category)
  - Table with search/filter by resident/status
  - Stats: Total Due, Paid This Month, Outstanding
  - Admin sees "Paid" status update in real-time when resident pays

**Resident Side:**
- Page: `MyBills.jsx`
- Features:
  - Shows current month bill (pending)
  - "Pay Now" button → Modal with payment form
  - Async `markBillPaid()` call → Status instant update
  - Admin sees it immediately (real-time)
  - Payment history table

**Demo Highlight:** Admin creates bill → Resident refreshes and sees new bill in <1 second → Resident clicks "Pay" → Admin sees "Paid" status instantly

**Firestore Schema:**
```javascript
{
  id: "doc-id",
  residentUid: "user-uid",
  residentName: "Name",
  residentFlat: "A-101",
  amount: 2500,
  dueDate: Timestamp,
  status: "Pending" | "Paid",
  month: "Mar 2026",
  category: "Maintenance" | "Additional",
  paidDate: Timestamp (optional),
  paidAmount: number (optional),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Estimated Time:** 1-2 hours (follows same pattern as announcements/complaints)

### ⬜ Step 6: Visitor Pre-Approval
**FLOW 3: Resident Approves Visitors → Security Sees**

**Resident Side:**
- Page: `VisitorApprovals.jsx` (or similar)
- Features:
  - Form to pre-approve visitor (name, vehicle no., date/time, purpose)
  - `approveVisitor(data)` → Firestore
  - Table of approved visitors
  - Delete button

**Security Side:**
- Page: `VisitorPreapproval.jsx`
- Features:
  - Real-time list of approved visitors
  - "Mark as Entered" button → updates status to "Entered"
  - "Check Out" button → status to "Exited"
  - Entry log with timestamps

**Demo Highlight:** Resident approves visitor → Security refreshes and sees visitor in <1 second → Security marks "Entered" → Resident sees "Entered" status instantly

**Estimated Time:** 1.5-2 hours

### ⬜ Step 7: Emergency SOS
**FLOW 5: Resident Red Button → Admin/Security Alert Flash**

**Resident Side:**
- Page: `EmergencyAlert.jsx`
- Features:
  - Big red "EMERGENCY" button
  - Async `triggerEmergency({message, location})` → Firestore
  - Shows "Alert Sent!" message

**Admin & Security Side:**
- Page: `EmergencyManagement.jsx` (Admin) / `EmergencyAlerts.jsx` (Security)
- Features:
  - Real-time alert box (flashing red, audio beep optional)
  - Shows: Resident name, flat, message, timestamp
  - "Acknowledge" button → updates status to "Acknowledged"
  - History of past alerts

**Demo Highlight:** Resident clicks SOS → Admin/Security pages get instant red flash with alert details → Click acknowledge → Status changes

**Estimated Time:** 1.5 hours

### ⬜ Steps 8-12: Polish & Additional Features
8. **Dashboards:** Real-time stats (total complaints, pending bills, recent notices)
9. **Staff Attendance:** Guard/staff attendance logging
10. **Visitor Entry Log:** Full visitor entry/exit tracking
11. **Reports & Analytics:** Charts, export CSV
12. **UI Polish + PWA:** Responsive design, offline support, app install prompt

---

## 10. FILE CHANGES SUMMARY (13 MAR Session)

### Created Files (This Session)
1. `src/firebase/complaintService.js` (76 lines) - Firestore complaints layer

### Modified Files (This Session)
1. `src/pages/resident/Complaints.jsx` - Firebase wiring
2. `src/pages/admin/ComplaintManagement.jsx` - Firebase wiring + field name fixes
3. `src/firebase/complaintService.js` - Error handling + composite index fix

### Build Status
- ✓ 2853 modules
- ✓ Zero errors
- ✓ 2.83s build time
- ✓ Hot reload active

---

## 11. GIT INFORMATION

**Repository:** `/Users/bhavesh/Desktop/SMS-Aksh`  
**Current Branch:** `bhavesh`  
**Remote:** `origin/bhavesh`  
**Last Commit:** Complaint bug fixes (13 MAR)  
**Commits This Session:** Multiple (auth setup, announcements, complaints, fixes)

---

## 12. TESTING CHECKLIST

### ✅ Already Tested
- [x] Login with 3 users (admin/resident/security)
- [x] Logout functionality
- [x] Admin can post announcement
- [x] Resident sees announcement in <1 second
- [x] Delete announcement works
- [x] Resident can submit complaint
- [x] Admin sees complaint instantly
- [x] Admin can change complaint status
- [x] Resident sees status update instantly
- [x] Toast notifications work
- [x] Modal opens/closes correctly

### ⬜ Still Need to Test
- [ ] Bills: Create bill → Resident sees instantly
- [ ] Bills: Resident pays → Admin sees "Paid" instantly
- [ ] Visitor pre-approval: Resident approves → Security sees
- [ ] Emergency SOS: Alert triggers → Admin/Security get flash
- [ ] Dark mode (if applicable)
- [ ] Mobile responsiveness
- [ ] Cross-browser testing

---

## 13. DEPENDENCY & IMPORTS

### Core Imports
```javascript
// Auth & Firebase
import { auth, db } from './firebase/config';
import { useAuth } from './context/AuthContext';
import { subscribeToComplaints, submitComplaint } from './firebase/complaintService';

// UI Components
import { PageHeader, Card, Button, StatusBadge } from './components/ui';
import { useToast } from './components/ui/Toast';
import Modal from './components/ui/Modal';

// Icons
import { Eye, Trash2, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// React
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
```

### Firestore Imports
```javascript
import { db } from './config';
import {
    collection, addDoc, deleteDoc, doc, updateDoc,
    query, where, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
```

---

## 14. PERFORMANCE NOTES

### Current Metrics
- **Dev Server Startup:** ~5 seconds
- **Build Time:** 2.83 seconds
- **Page Load:** <2 seconds
- **Real-Time Latency:** <1 second (Firestore → onSnapshot → setState → re-render)
- **Module Count:** 2853 (warnings about 500KB+ chunk, but acceptable for now)

### Optimization Opportunities (For Later)
- Code-split with dynamic imports
- Lazy load Firestore subscriptions
- Add pagination to large tables
- Implement virtual scrolling for long lists

---

## 15. KNOWN LIMITATIONS & TECH DEBT

### Current Limitations
1. **No persistent "read" status** for announcements (only local Set state)
2. **No priority field** for complaints (hardcoded to "Medium")
3. **No payment method** for bills (just marks "Paid" status, no actual payment processing)
4. **No SMS/email notifications** (could be added via Firebase Functions)
5. **No offline support** (Firebase could have offline persistence enabled)

### Code Quality Notes
- All async operations have try/catch + toast feedback
- All Firestore subscriptions unsubscribe on component unmount
- Error handling added to all service layer functions
- Firestore composite index issue fixed (client-side sort instead)

---

## 16. NEXT IMMEDIATE ACTIONS

### Priority 1 (Do Next)
1. **Step 5 - Bills:** Create `billService.js` with CRUD + subscriptions
2. Update `BillManagement.jsx` (admin) and `MyBills.jsx` (resident)
3. Test bill creation → real-time sync
4. Test bill payment → status update on both sides

### Priority 2 (After Bills)
1. **Step 6 - Visitor Pre-Approval:** Create visitor flow
2. **Step 7 - Emergency SOS:** Create alert system

### Priority 3 (Polish)
1. Dashboards with real-time stats
2. Additional features (attendance, reports, etc.)
3. UI polish and mobile optimization

---

## 17. COMMAND REFERENCE

### Development
```bash
# Terminal in /frontend directory

# Start dev server
npm run dev
# OR
npx vite --port 5176

# Build for production
npx vite build

# Check build size
npx vite build 2>&1 | tail -30
```

### Git
```bash
# Check status
git status

# Commit changes
git add .
git commit -m "Step 4: Fix complaint bugs"

# Push to remote
git push -u origin bhavesh

# View recent logs
git log --oneline -3
```

### Testing URLs
- **Login:** http://localhost:5177/login
- **Admin Dashboard:** http://localhost:5177/admin/dashboard
- **Admin Complaints:** http://localhost:5177/admin/complaints
- **Resident Dashboard:** http://localhost:5177/resident/dashboard
- **Resident Complaints:** http://localhost:5177/resident/complaints

---

## 18. SUMMARY FOR AI HANDOFF

**If another AI picks up this project:**

1. **Current State:** Steps 1-4 complete (Auth + Announcements + Complaints, all working with real-time Firestore sync)
2. **What to do next:** Build Step 5 (Bills) following the existing pattern (service file → Firestore CRUD → admin page → resident page)
3. **Key Pattern:** All features use `onSnapshot` subscriptions for real-time data; each page has `useEffect` that cleans up with unsubscribe
4. **Testing:** Open 2 browser tabs (admin in one, resident in other) and verify <1 second sync
5. **Build:** Always `npx vite build` to check for errors (currently 2853 modules, zero errors)
6. **Firebase:** Project ID `accord-living-cf585`, use 3 demo users to test

**Current Build Status:** ✅ PASSING (2853 modules, <3s build, zero errors)  
**Last Session:** 13 MAR 2026 (fixed complaint tab bugs)  
**Ready for:** Step 5 (Bills) or any other feature continuation

---

**End of Context Report**
