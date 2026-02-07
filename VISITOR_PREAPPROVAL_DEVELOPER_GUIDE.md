# 👨‍💻 Visitor Pre-Approval - Developer Reference Guide

---

## 📚 Architecture Overview

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      React App (ThemeProvider)               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              VisitorProvider (Context)                   │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  localStorage: visitorApprovals, visitorHistory │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  Resident UI                                     │   │ │
│  │  │  - Create Approval Form                          │   │ │
│  │  │  - Upcoming/Expired/History Tabs                 │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  Security UI                                     │   │ │
│  │  │  - Search by Code/Mobile                         │   │ │
│  │  │  - Verification & Entry/Exit                     │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  Admin UI                                        │   │ │
│  │  │  - Analytics & Metrics                           │   │ │
│  │  │  - Suspicious Activities                         │   │ │
│  │  │  - CSV Export                                    │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Context API - VisitorContext.jsx

### File Location
```
frontend/src/context/VisitorContext.jsx (850+ lines)
```

### Exports

```javascript
// Context Object
export const VisitorContext = React.createContext();

// Provider Component
export const VisitorProvider = ({ children }) => { ... }

// Custom Hook
export const useVisitors = () => { ... }
```

### State Structure

```javascript
{
  approvals: [
    {
      id: "unique-id",
      approvalCode: "VPA000001",
      visitorName: "Amit Sharma",
      mobileNumber: "9876543210",
      purpose: "meeting", // meeting|personal|delivery|repair|guest|other
      vehicleNumber: "MH02AB1234",
      dateOfVisit: "2025-02-15",
      startTime: "10:00",
      endTime: "12:00",
      residentName: "Rajesh Kumar",
      flatNumber: "A-301",
      residerId: "RES001",
      status: "approved", // approved|expired|cancelled
      entryTime: "2025-02-15T10:05:00.000Z", // null if not entered
      exitTime: null, // timestamp if exited
      securityVerifiedBy: {
        id: "SEC001",
        name: "Vikram Singh"
      },
      createdAt: "2025-02-14T14:23:00.000Z"
    }
  ],
  visitorHistory: [
    {
      id: "history-id",
      approvalId: "unique-id",
      type: "entry", // entry|exit
      timestamp: "2025-02-15T10:05:00.000Z",
      verifiedBy: "Vikram Singh"
    }
  ]
}
```

### Key Methods

#### **1. generateApprovalCode()**
```javascript
// Returns next sequential approval code
const code = generateApprovalCode();
// Returns: "VPA000001", "VPA000002", etc.

// Logic:
// - Gets current count of approvals
// - Increments by 1
// - Pads with zeros to 6 digits
// - Prepends "VPA"
```

#### **2. createApproval(visitorData, residentInfo)**
```javascript
const approvalData = {
  visitorName: "Amit Sharma",
  mobileNumber: "9876543210",
  purpose: "meeting",
  vehicleNumber: "MH02AB1234",
  dateOfVisit: "2025-02-15",
  startTime: "10:00",
  endTime: "12:00"
};

const residentData = {
  residentName: "Rajesh Kumar",
  flatNumber: "A-301",
  residerId: "RES001"
};

createApproval(approvalData, residentData);
// Returns: { success: true, code: "VPA000001", id: "..." }

// Actions:
// 1. Validates all inputs
// 2. Generates unique approval code
// 3. Creates approval object with timestamp
// 4. Adds to approvals array
// 5. Saves to localStorage
// 6. Returns success with code
```

#### **3. getUpcomingApprovals(residerId)**
```javascript
const upcoming = getUpcomingApprovals("RES001");
// Returns: Array of approvals where:
// - status !== "cancelled"
// - status !== "expired"
// - endTime > current time
// - residerId matches

// Filters:
// - Removes cancelled
// - Removes time-expired
// - Current resident only
// - Sorted by date
```

#### **4. getExpiredApprovals(residerId)**
```javascript
const expired = getExpiredApprovals("RES001");
// Returns: Array of approvals where:
// - status !== "cancelled"
// - status === "expired" OR endTime < current time
// - residerId matches

// Shows:
// - Approvals past their end time
// - But not cancelled
// - Whether visitor entered late or not
```

#### **5. getVisitorHistory(residerId)**
```javascript
const history = getVisitorHistory("RES001");
// Returns: Array of completed visits where:
// - Visitor actually entered (entryTime exists)
// - Current resident only
// - Sorted by entry time (newest first)

// Each record shows:
// - Visitor details
// - Entry and exit times
// - Duration calculation
// - Status: "visited"
```

#### **6. cancelApproval(approvalId)**
```javascript
cancelApproval("unique-id");
// Returns: { success: true, message: "..." }

// Actions:
// 1. Finds approval by ID
// 2. Sets status to "cancelled"
// 3. Saves to localStorage
// 4. Removes from upcoming list

// Prevents:
// - Can't cancel if visitor already entered
// - Can't cancel non-existent approval
```

#### **7. getApprovalByCode(approvalCode)**
```javascript
const approval = getApprovalByCode("VPA000001");
// Returns: Single approval object or null

// Used by Security for:
// - Quick lookup by code
// - Verification before entry
// - Entry/exit tracking
```

#### **8. getApprovalsByMobile(mobileNumber)**
```javascript
const approvals = getApprovalsByMobile("9876543210");
// Returns: Array of all approvals for this mobile number

// Used by Security for:
// - If visitor doesn't have code
// - Show all their pending approvals
// - Select the correct one by date
```

#### **9. getPreApprovedVisitors()**
```javascript
const visitors = getPreApprovedVisitors();
// Returns: Array of all active pre-approvals waiting for entry

// Filters:
// - status === "approved"
// - entryTime === null (not entered yet)
// - Not expired yet
// - Sorted by dateOfVisit

// Used by Security for:
// - Dashboard: who's expected to arrive?
// - Quick reference list
// - Pre-planning for busy times
```

#### **10. markEntry(approvalId, securityOfficerId, officerName)**
```javascript
markEntry("unique-id", "SEC001", "Vikram Singh");
// Returns: { success: true, timestamp: "..." }

// Actions:
// 1. Finds approval by ID
// 2. Records entry timestamp
// 3. Stores security officer details
// 4. Creates history entry
// 5. Saves to localStorage

// Validation:
// - Approval must exist
// - Time window must be valid (or within reason)
// - Can't mark entry twice

// Result:
// - Approval shows "Inside Compound"
// - "Mark Exit" button becomes available
// - History logged
```

#### **11. markExit(approvalId, securityOfficerId, officerName)**
```javascript
markExit("unique-id", "SEC001", "Vikram Singh");
// Returns: { success: true, duration: 65 }

// Actions:
// 1. Finds approval by ID
// 2. Records exit timestamp
// 3. Stores security officer details
// 4. Calculates stay duration
// 5. Updates status to "visited"
// 6. Creates history entry
// 7. Saves to localStorage

// Calculation:
// duration = (exitTime - entryTime) in minutes
// Example: 10:05 AM to 11:10 AM = 65 minutes

// Result:
// - Approval moves to "History"
// - Shows in resident's visited list
// - Admin can analyze for patterns
```

#### **12. getAnalyticsData(dateRange, filters)**
```javascript
const analytics = getAnalyticsData("30days");
// Returns: {
//   totalApprovals: 245,
//   entriesCompleted: 198,
//   conversionRate: 80.8,
//   averageStayTime: 45,
//   approvedCount: 23,
//   cancelledCount: 24,
//   purposeDistribution: { ... },
//   frequentVisitors: [ ... ],
//   activeResidents: [ ... ],
//   dateRange: "30days"
// }

// Date Range Options:
// - "30days" → last 30 days
// - "90days" → last 90 days
// - "alltime" → all approvals

// Calculations:
// - Total: Count all approvals in range
// - Entries: Count where exitTime exists
// - Conversion: (entries / total) * 100
// - AvgStay: Sum(duration) / count(entries)
// - Approved: Count status="approved"
// - Cancelled: Count status="cancelled"
```

#### **13. getSuspiciousActivities(dateRange)**
```javascript
const suspicious = getSuspiciousActivities("30days");
// Returns: [{
//   type: "multiple_same_day_visitors", // or late_entry, extended_stay
//   mobile: "9876543210",
//   description: "5 different visitors from this number on Feb 14"
//   severity: "high", // high|medium|low
//   details: { ... }
// }]

// Detection Rules:
// 1. Multiple Same-Day Visitors:
//    - Same mobile number
//    - 2+ different visitors on same date
//    - Flag: Possible unauthorized access
//
// 2. Late Entry:
//    - Entry time after approval endTime
//    - Flag: Time window violation
//    - Severity: minutes late
//
// 3. Extended Stay:
//    - Exit time 2+ hours after approval endTime
//    - Flag: Unauthorized extended presence
//    - Severity: hours over limit

// Used by Admin for:
// - Audit trail
// - Security reports
// - Pattern detection
```

#### **14. calculateAvgEntryTime() [Helper]**
```javascript
// Internal method for analytics
// Calculates average stay duration
// Formula: Sum of all durations / Number of completed visits
// Returns: minutes (integer)
```

#### **15. clearAllData() [Development Only]**
```javascript
// NOT for production
// Clears all localStorage for testing
// Use: Development/testing environment only
```

### localStorage Structure

```javascript
// Key: 'visitorApprovals'
// Value: JSON stringified array of approval objects
localStorage.setItem('visitorApprovals', JSON.stringify(approvals));

// Key: 'visitorHistory'
// Value: JSON stringified array of history entries
localStorage.setItem('visitorHistory', JSON.stringify(visitorHistory));

// On app load:
// 1. Check localStorage for existing data
// 2. Parse JSON if present
// 3. Load into context state
// 4. Subsequent changes auto-sync to localStorage
```

### Usage Hook

```javascript
// In any component:
import { useVisitors } from '../context/VisitorContext';

export function MyComponent() {
  const {
    approvals,
    createApproval,
    getUpcomingApprovals,
    markEntry,
    getAnalyticsData,
    // ... other methods
  } = useVisitors();

  // Use any method:
  const upcoming = getUpcomingApprovals("RES001");
}
```

---

## 🎨 Component Files

### Resident Component: `VisitorPreApproval.jsx`

**Location:** `frontend/src/pages/resident/VisitorPreApproval.jsx`

**Size:** 500+ lines

**Key Sections:**

```javascript
// 1. Form Component
<form onSubmit={handleSubmit}>
  <input name="visitorName" ... />
  <input name="mobileNumber" ... />
  <select name="purpose" ... />
  <input name="dateOfVisit" ... />
  <input name="startTime" ... />
  <input name="endTime" ... />
  <input name="vehicleNumber" ... />
</form>

// 2. Validation Logic
const validateForm = () => {
  // Check required fields
  // Check field formats
  // Check time window
  // Return errors object
}

// 3. Tab Navigation
<div className="preapproval-tabs">
  <button className={activeTab === 'create' ? 'active' : ''}>
    Create Pre-Approval
  </button>
  <button className={activeTab === 'upcoming' ? 'active' : ''}>
    Upcoming
  </button>
  {/* ... other tabs ... */}
</div>

// 4. Tab Content
{activeTab === 'create' && <CreateForm />}
{activeTab === 'upcoming' && <UpcomingApprovals />}
{activeTab === 'expired' && <ExpiredApprovals />}
{activeTab === 'history' && <VisitorHistory />}
```

**Key Features:**

- Form validation with error display
- Approval code generation & copying
- Tab-based UI
- Time countdown for upcoming approvals
- Cancel functionality
- Success/error notifications

**State Management:**

```javascript
const [activeTab, setActiveTab] = useState('create');
const [formData, setFormData] = useState({
  visitorName: '',
  mobileNumber: '',
  purpose: '',
  dateOfVisit: '',
  startTime: '',
  endTime: '',
  vehicleNumber: ''
});
const [errors, setErrors] = useState({});
const [successMessage, setSuccessMessage] = useState('');
```

### Security Component: `PreApprovedVisitors.jsx`

**Location:** `frontend/src/pages/security/PreApprovedVisitors.jsx`

**Size:** 450+ lines

**Key Sections:**

```javascript
// 1. Search Section
<div className="search-form">
  <select value={searchType} onChange={...}>
    <option value="code">Search by Code</option>
    <option value="mobile">Search by Mobile</option>
  </select>
  <input value={searchInput} onChange={...} />
  <button onClick={handleSearch}>Search</button>
</div>

// 2. Verification Display
{searchResult && (
  <div className="verification-result">
    <div className="visitor-info">
      <p>Visitor: {searchResult.visitorName}</p>
      <p>Resident: {searchResult.residentName}</p>
      {/* ... more details ... */}
    </div>
    <div className="time-window-status">
      {/* Shows VALID/UPCOMING/EXPIRED */}
    </div>
    <div className="entry-exit-buttons">
      <button onClick={handleMarkEntry}>Mark Entry</button>
      <button onClick={handleMarkExit}>Mark Exit</button>
    </div>
  </div>
)}

// 3. Pre-Approved List
<div className="preapproved-list">
  {preApprovedVisitors.map(visitor => (
    <div className="visitor-card" key={visitor.id}>
      {/* Card content */}
    </div>
  ))}
</div>
```

**Key Features:**

- Search by code or mobile
- Time window validation
- Entry/exit tracking
- Pre-approved visitors list
- Status indicators
- Countdown timer

**State Management:**

```javascript
const [searchType, setSearchType] = useState('code');
const [searchInput, setSearchInput] = useState('');
const [searchResult, setSearchResult] = useState(null);
const [preApprovedVisitors, setPreApprovedVisitors] = useState([]);
const [currentTime, setCurrentTime] = useState(new Date());
```

### Admin Component: `VisitorAnalytics.jsx`

**Location:** `frontend/src/pages/admin/VisitorAnalytics.jsx`

**Size:** 400+ lines

**Key Sections:**

```javascript
// 1. Date Range Filter
<div className="date-filter">
  <button onClick={() => handleDateRange('30days')}>
    Last 30 Days
  </button>
  <button onClick={() => handleDateRange('90days')}>
    Last 90 Days
  </button>
  <button onClick={() => handleDateRange('alltime')}>
    All Time
  </button>
</div>

// 2. Metrics Cards
<div className="analytics-grid">
  <div className="stat-card">
    <div className="stat-value">{analyticsData.totalApprovals}</div>
    <div className="stat-label">Total Approvals</div>
  </div>
  {/* ... other metrics ... */}
</div>

// 3. Purpose Distribution
<div className="purpose-distribution">
  {analyticsData.purposeDistribution.map(purpose => (
    <div className="purpose-item" key={purpose.name}>
      <span>{purpose.name}</span>
      <div className="progress-bar">
        <div style={{ width: purpose.percentage + '%' }}></div>
      </div>
      <span>{purpose.percentage}%</span>
    </div>
  ))}
</div>

// 4. Suspicious Activities
<div className="suspicious-activities">
  {suspiciousActivities.map(activity => (
    <div className="alert-card" key={activity.id}>
      <div className="alert-type">{activity.type}</div>
      <div className="alert-description">{activity.description}</div>
    </div>
  ))}
</div>

// 5. Export Button
<button onClick={handleExportCSV}>
  ⬇️ Export CSV
</button>
```

**Key Features:**

- Key metrics display (6 cards)
- Date range filtering
- Purpose distribution analysis
- Frequent visitors table
- Active residents table
- Suspicious activities detection
- CSV export functionality

**State Management:**

```javascript
const [dateRange, setDateRange] = useState('30days');
const [analyticsData, setAnalyticsData] = useState(null);
const [suspiciousActivities, setSuspiciousActivities] = useState([]);
const [isLoading, setIsLoading] = useState(true);
```

---

## 🎨 Styling: VisitorPreApproval.css

**Location:** `frontend/src/pages/resident/VisitorPreApproval.css`

**Size:** 400+ lines

**Key Classes:**

```css
/* Main Containers */
.visitor-preapproval-page { /* Resident page */ }
.security-preapproved-page { /* Security page */ }
.admin-visitor-analytics-page { /* Admin page */ }

/* Form Styling */
.approval-form { /* Main form */ }
.form-group { /* Each form field */ }
.form-input, .form-select { /* Input styling */ }
.error-message { /* Error text */ }

/* Tabs */
.preapproval-tabs { /* Tab container */ }
.tab-btn { /* Individual tab button */ }
.tab-btn.active { /* Active tab */ }
.tab-content { /* Tab content area */ }

/* Status Badges */
.status-badge { /* Base badge */ }
.status-badge.approved { /* Green */ }
.status-badge.expired { /* Red */ }
.status-badge.cancelled { /* Gray */ }
.status-badge.visited { /* Green */ }

/* Cards */
.approval-card { /* Approval display */ }
.history-card { /* History item */ }
.resident-info-card { /* Header card */ }

/* Notifications */
.success-message { /* Success notification */ }
.error-notification { /* Error notification */ }

/* Search & Verification */
.search-form { /* Search container */ }
.search-input { /* Search field */ }
.verification-result { /* Result display */ }
.time-window-status { /* Time status indicator */ }

/* Analytics */
.analytics-grid { /* Metrics container */ }
.stat-card { /* Metric card */ }
.analytics-table { /* Table display */ }

/* Responsive */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Dark Mode */
:root[data-theme="dark"] {
  --bg-color: #1e1e1e;
  --text-color: #ffffff;
  /* ... other variables ... */
}
```

**CSS Variables:**

```css
/* Colors */
--primary-color: #3b82f6;
--success-color: #16a34a;
--warning-color: #d97706;
--danger-color: #dc2626;

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Borders & Shadows */
--border-radius: 0.5rem;
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
```

---

## 🔌 Route Configuration

**File:** `frontend/src/App.jsx`

```javascript
// Import VisitorProvider
import { VisitorProvider } from './context/VisitorContext';

// Wrap Router with Provider
<ThemeProvider>
  <VisitorProvider>
    <Router>
      <Routes>
        {/* Existing routes ... */}
        
        {/* New routes */}
        <Route path="/resident/visitor-approval" 
               element={<ResidentPages.VisitorPreApproval />} />
        <Route path="/security/preapproved" 
               element={<SecurityPages.PreApprovedVisitors />} />
        <Route path="/admin/visitor-analytics" 
               element={<AdminPages.VisitorAnalytics />} />
      </Routes>
    </Router>
  </VisitorProvider>
</ThemeProvider>
```

---

## 📤 Exports

### Resident Exports

**File:** `frontend/src/pages/resident/index.js`

```javascript
export { default as VisitorPreApproval } from './VisitorPreApproval';
// Usage: ResidentPages.VisitorPreApproval
```

### Security Exports

**File:** `frontend/src/pages/security/index.js`

```javascript
export { default as PreApprovedVisitors } from './PreApprovedVisitors';
// Usage: SecurityPages.PreApprovedVisitors
```

### Admin Exports

**File:** `frontend/src/pages/admin/index.js`

```javascript
export { default as VisitorAnalytics } from './VisitorAnalytics';
// Usage: AdminPages.VisitorAnalytics
```

---

## 🧪 Testing & Development

### Mock Data Structure

```javascript
// Sample approval for testing
const mockApproval = {
  id: "1234567890",
  approvalCode: "VPA000001",
  visitorName: "Amit Sharma",
  mobileNumber: "9876543210",
  purpose: "meeting",
  vehicleNumber: "MH02AB1234",
  dateOfVisit: "2025-02-15",
  startTime: "10:00",
  endTime: "12:00",
  residentName: "Rajesh Kumar",
  flatNumber: "A-301",
  residerId: "RES001",
  status: "approved",
  entryTime: null,
  exitTime: null,
  securityVerifiedBy: null,
  createdAt: new Date().toISOString()
};
```

### Testing in Console

```javascript
// Get context state (from React DevTools)
const context = useVisitors();

// Create approval
context.createApproval({
  visitorName: "Test Visitor",
  mobileNumber: "9999999999",
  purpose: "meeting",
  vehicleNumber: "",
  dateOfVisit: "2025-02-20",
  startTime: "10:00",
  endTime: "11:00"
}, {
  residentName: "Test Resident",
  flatNumber: "T-101",
  residerId: "TEST001"
});

// Get analytics
const analytics = context.getAnalyticsData("30days");
console.log(analytics);

// Get suspicious activities
const suspicious = context.getSuspiciousActivities("30days");
console.log(suspicious);
```

### Debugging Tips

**localStorage Issues:**
```javascript
// Check stored data
console.log(JSON.parse(localStorage.getItem('visitorApprovals')));

// Clear data
localStorage.removeItem('visitorApprovals');
localStorage.removeItem('visitorHistory');

// Reload
window.location.reload();
```

**Time Window Calculations:**
```javascript
// Check current time
console.log(new Date());

// Check approval window
const approval = approvals[0];
console.log('Start:', approval.startTime);
console.log('End:', approval.endTime);
console.log('Current:', new Date().toLocaleTimeString());
```

**Form Validation:**
```javascript
// Check validation errors
console.log(errors);

// Test specific validation
console.log(validateMobileNumber("9876543210")); // true
console.log(validateMobileNumber("123")); // false
```

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **localStorage Limits**
   - localStorage has ~5-10MB limit per domain
   - With 1000 approvals: ~500KB used
   - Sufficient for production use

2. **Re-render Optimization**
   - Use `useMemo` for expensive calculations
   - useCallback for event handlers
   - useRef for unchanged values

3. **Lazy Loading**
   - Analytics data loaded on demand
   - Large lists paginated if needed
   - Charts rendered only when visible

### Code Splitting (Future)

```javascript
const VisitorPreApproval = lazy(() => import('./VisitorPreApproval'));
const PreApprovedVisitors = lazy(() => import('./PreApprovedVisitors'));
const VisitorAnalytics = lazy(() => import('./VisitorAnalytics'));

// With Suspense fallback
<Suspense fallback={<Loading />}>
  <Route path="/resident/visitor-approval" 
         element={<VisitorPreApproval />} />
</Suspense>
```

---

## 🔄 Backend Integration Path

### API Contract (JSON)

```javascript
// POST /api/approvals/create
{
  visitorName: string,
  mobileNumber: string (10 digits),
  purpose: enum,
  vehicleNumber?: string,
  dateOfVisit: date,
  startTime: time,
  endTime: time,
  residentId: string
}

Response:
{
  success: boolean,
  approvalCode: string,
  id: string
}

// GET /api/approvals/resident/:id
Response:
[
  {
    id: string,
    approvalCode: string,
    ... (full approval object)
  }
]

// GET /api/approvals/search?code=VPA000001
// GET /api/approvals/search?mobile=9876543210
Response:
{
  success: boolean,
  approvals: [...]
}

// PATCH /api/approvals/:id/entry
{
  securityOfficerId: string,
  securityOfficerName: string
}

Response:
{
  success: boolean,
  entryTime: timestamp
}

// PATCH /api/approvals/:id/exit
{
  securityOfficerId: string,
  securityOfficerName: string
}

Response:
{
  success: boolean,
  exitTime: timestamp,
  duration: minutes
}

// GET /api/analytics/visitors?dateRange=30days
Response:
{
  totalApprovals: number,
  entriesCompleted: number,
  conversionRate: number,
  averageStayTime: number,
  ...
}

// GET /api/analytics/suspicious?dateRange=30days
Response:
[
  {
    type: enum,
    severity: enum,
    description: string,
    ...
  }
]
```

### Migration from localStorage

```javascript
// Step 1: Add API calls
const createApproval = async (data) => {
  const response = await fetch('/api/approvals/create', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
};

// Step 2: Update context to use API
// Step 3: Remove localStorage dependency
// Step 4: Add error handling & loading states
// Step 5: Add real-time sync (WebSocket or polling)
```

---

## 🔒 Security Notes

### Client-Side Security

1. **Input Validation**
   - All inputs validated before use
   - Format validation (mobile, vehicle number)
   - Range validation (time, date)

2. **localStorage Security**
   - No sensitive data (no passwords)
   - Data encrypted by browser (HTTPS)
   - Still vulnerable to XSS attacks
   - Add Content Security Policy headers

3. **Role-Based Access**
   - Each role has limited access
   - Resident can only see own data
   - Security read-only
   - Admin read-only (client-side)

### Backend Security (When Added)

1. **Authentication**
   - JWT tokens for API calls
   - Validate user identity

2. **Authorization**
   - Role-based access control (RBAC)
   - Verify resident owns approval
   - Audit all modifications

3. **Data Protection**
   - Encrypt sensitive fields
   - Hash mobile numbers if needed
   - Limit data exposure

4. **Rate Limiting**
   - API rate limits
   - Prevent brute force searches
   - Limit CSV exports

---

## 📝 Code Style & Conventions

### Component Structure

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useVisitors } from '../context/VisitorContext';
import './VisitorPreApproval.css';

// 2. Component Definition
export default function VisitorPreApproval() {
  // 3. Hooks
  const { createApproval, getUpcomingApprovals } = useVisitors();
  const [approvals, setApprovals] = useState([]);

  // 4. Effects
  useEffect(() => {
    setApprovals(getUpcomingApprovals());
  }, []);

  // 5. Handler Functions
  const handleSubmit = (e) => {
    e.preventDefault();
    // ... logic
  };

  // 6. Render
  return (
    <div className="visitor-preapproval-page">
      {/* JSX */}
    </div>
  );
}
```

### Naming Conventions

```javascript
// Components: PascalCase
VisitorPreApproval
PreApprovedVisitors
VisitorAnalytics

// Functions: camelCase
getUpcomingApprovals
validateMobileNumber
handleMarkEntry

// Constants: UPPER_SNAKE_CASE
const APPROVAL_PURPOSES = ['meeting', 'personal', ...];
const MAX_APPROVAL_HOURS = 8;

// CSS Classes: kebab-case
.visitor-preapproval-page
.tab-btn
.status-badge.approved
```

---

## 📚 Additional Resources

### File Structure
```
frontend/src/
├── context/
│   └── VisitorContext.jsx (Context + Hook)
├── pages/
│   ├── resident/
│   │   ├── VisitorPreApproval.jsx
│   │   ├── VisitorPreApproval.css
│   │   └── index.js
│   ├── security/
│   │   ├── PreApprovedVisitors.jsx
│   │   └── index.js
│   ├── admin/
│   │   ├── VisitorAnalytics.jsx
│   │   └── index.js
│   └── (Layout files updated)
└── App.jsx (Routes + Provider)
```

### Key Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| VisitorContext.jsx | 850+ | State management, all logic |
| VisitorPreApproval.jsx | 500+ | Resident UI |
| PreApprovedVisitors.jsx | 450+ | Security UI |
| VisitorAnalytics.jsx | 400+ | Admin UI |
| VisitorPreApproval.css | 400+ | All styling |
| App.jsx | ±30 | Routes + Provider |
| **/index.js | ±5 | Exports |

---

**Version:** 1.0  
**Last Updated:** February 2025  
**Status:** ✅ Production Ready  
**Tech Stack:** React 19.2.0 | React Router 7.13.0 | Lucide React | CSS3
