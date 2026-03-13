# SMS-Aksh: Quick Start & Developer Guide
**For New Developers or AI Continuations**

---

## 1. QUICK SETUP (5 Minutes)

### 1.1 Environment Check
```bash
# Navigate to project
cd /Users/bhavesh/Desktop/SMS-Aksh

# Check Node version (need 16+)
node --version

# Check npm
npm --version
```

### 1.2 Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Go back to root
cd ..
```

### 1.3 Start Dev Server
```bash
cd frontend
npm run dev
# OR
npx vite --port 5176
```

**Expected Output:**
```
VITE v7.3.1  ready in 234 ms

➜  Local:   http://localhost:5177/
  use --host to expose
```

### 1.4 Open in Browser
Visit: http://localhost:5177/login

**Test Login Credentials:**
- Email: `admin@accordliving.com` / Password: `Admin@123`
- Email: `resident@accordliving.com` / Password: `Resident@123`

---

## 2. PROJECT STRUCTURE AT A GLANCE

```
SMS-Aksh/
├── frontend/                    ← All React code here
│   ├── src/
│   │   ├── App.jsx             Main router
│   │   ├── main.jsx            Entry point
│   │   ├── firebase/           Firebase services
│   │   ├── context/            React contexts (Auth)
│   │   ├── pages/              Page components
│   │   │   ├── Login.jsx
│   │   │   ├── admin/
│   │   │   ├── resident/
│   │   │   └── security/
│   │   ├── components/         Reusable UI
│   │   │   └── ui/             (Modal, Toast, etc.)
│   │   └── styles/             CSS files
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/                     ← Node.js (not active)
├── DATABASE_SCHEMA_FOR_AI.md   ← Firestore schema reference
├── PROJECT_CONTEXT_REPORT.md   ← Full context (read this!)
├── HACKATHON_DEMO_ROADMAP.md   ← Demo flows & roadmap
└── README files...
```

---

## 3. FIRESTORE QUICK REFERENCE

### Collections
1. **users** - User profiles with roles
2. **announcements** - Admin notices/events
3. **complaints** - Resident complaints
4. **bills** - (To be created)

### Query Examples
```javascript
// Get all complaints (admin view)
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './config';

const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snapshot) => {
  const complaints = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
  console.log(complaints);
});

// Get resident's complaints only
const q = query(
  collection(db, 'complaints'),
  where('residentUid', '==', 'user-uid')
);
```

---

## 4. COMMON DEVELOPMENT TASKS

### Task 1: Create a New Service (e.g., Bills)
```javascript
// File: src/firebase/billService.js

import { db } from './config';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, onSnapshot, serverTimestamp, where } from 'firebase/firestore';

const COLLECTION = 'bills';

// Create
export const createBill = (data) => {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    status: 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Subscribe (Admin view - all bills)
export const subscribeToAllBills = (callback) => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
    callback(items);
  }, (error) => {
    console.error('[Firestore Error]:', error);
    callback([]);
  });
};

// Subscribe (Resident view - own bills)
export const subscribeToResidentBills = (residentUid, callback) => {
  const q = query(
    collection(db, COLLECTION),
    where('residentUid', '==', residentUid)
  );
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
    callback(items);
  }, (error) => {
    console.error('[Firestore Error]:', error);
    callback([]);
  });
};

// Update status
export const markBillPaid = (id, paidAmount, paidDate) => {
  return updateDoc(doc(db, COLLECTION, id), {
    status: 'Paid',
    paidAmount,
    paidDate,
    updatedAt: serverTimestamp(),
  });
};
```

### Task 2: Wire a Page to Firestore
```javascript
// File: src/pages/resident/MyBills.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { subscribeToResidentBills, markBillPaid } from '../../firebase/billService';

const MyBills = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to own bills
  useEffect(() => {
    if (!user?.uid) return;
    
    const unsub = subscribeToResidentBills(user.uid, (data) => {
      setBills(data);
      setLoading(false);
    });
    
    return () => unsub();
  }, [user?.uid]);

  // Handle payment
  const handlePayBill = async (billId, amount) => {
    try {
      await markBillPaid(billId, amount, new Date());
      toast.success('Bill marked as paid!', 'Payment Successful');
    } catch (err) {
      toast.error('Failed to mark bill as paid', 'Error');
    }
  };

  if (loading) return <div>Loading bills...</div>;

  return (
    <div className="my-bills">
      <h1>My Bills</h1>
      {bills.length === 0 ? (
        <p>No bills assigned.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill.id}>
                <td>{bill.month}</td>
                <td>₹{bill.amount}</td>
                <td>{bill.status}</td>
                <td>
                  {bill.status === 'Pending' && (
                    <button onClick={() => handlePayBill(bill.id, bill.amount)}>
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBills;
```

### Task 3: Add Error Handling
```javascript
// All async operations should catch errors
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  
  try {
    // Do something async
    await submitComplaint({...});
    
    // Success feedback
    toast.success('Success message!', 'Success');
    setFormData({...}); // Reset form
    
  } catch (err) {
    // Error feedback
    console.error('Error:', err);
    toast.error(err.message || 'Something went wrong', 'Error');
    
  } finally {
    setSubmitting(false);
  }
};
```

---

## 5. GIT WORKFLOW

### Check Current Status
```bash
git status
git log --oneline -5
```

### Make Changes & Commit
```bash
# See what changed
git diff

# Add all changes
git add .

# Commit with message
git commit -m "Step 5: Add bill management feature"

# Push to origin
git push -u origin bhavesh

# Verify on GitHub
# https://github.com/bhavesh.../SMS-Aksh/commits/bhavesh
```

---

## 6. BUILD & DEPLOY

### Development Build (Hot Reload)
```bash
cd frontend
npm run dev
# Changes auto-compile, browser auto-refreshes
```

### Production Build
```bash
cd frontend
npx vite build
# Creates dist/ folder with optimized bundle
```

### Check for Errors
```bash
npx vite build 2>&1 | tail -30
# Should show: ✓ [number] modules transformed, ✓ built in [time]s
```

### Verify No Errors
```bash
npx vite build 2>&1 | grep -i error
# Should return nothing (empty = no errors)
```

---

## 7. DEBUGGING TIPS

### 1. Check Browser Console
- Open DevTools: `F12` or `Cmd+Option+I` (Mac)
- Go to **Console** tab
- Look for red error messages
- Firebase errors usually say `[Firestore Error]` (see error logs)

### 2. Check Server Logs
```bash
# Terminal running `npm run dev` shows compilation errors
# Look for "error" in red text
```

### 3. Common Issues & Fixes

**Issue:** "Cannot find module 'firebase/firestore'"
```bash
cd frontend
npm install firebase
```

**Issue:** "Firestore composite index missing"
```
→ Use client-side sorting instead of orderBy with where
→ Already fixed in complaintService.js (see how it's done)
```

**Issue:** "Modal not showing"
```
→ Check Modal.jsx has className="modal-overlay open"
→ Already fixed (line 9)
```

**Issue:** "Real-time subscriptions not updating"
```
→ Check useEffect returns unsub() function
→ Check onSnapshot error handler for Firestore errors
→ Check Firestore collection exists and has data
```

### 4. Test Real-Time Sync
```javascript
// In browser console, manually test:
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

getDocs(collection(db, 'complaints')).then(snap => {
  console.log(snap.docs.length, 'complaints in Firestore');
});
```

---

## 8. CODING STANDARDS

### File Naming
- Pages: PascalCase (e.g., `Complaints.jsx`, `ComplaintManagement.jsx`)
- Services: camelCase + Service (e.g., `complaintService.js`)
- Components: PascalCase (e.g., `Modal.jsx`, `Card.jsx`)
- Styles: match filename (e.g., `Complaints.css`)

### Import Groups (Order)
```javascript
// 1. React imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Firebase imports
import { useAuth } from '../../context/AuthContext';
import { subscribeToComplaints } from '../../firebase/complaintService';

// 3. UI imports
import { PageHeader, Button, Card } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

// 4. Icon imports
import { Eye, Trash2, Search } from 'lucide-react';

// 5. Style imports
import './Complaints.css';
```

### Component Structure
```javascript
const ComponentName = () => {
  // 1. Hooks
  const { user } = useAuth();
  const toast = useToast();
  
  // 2. State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 3. Effects
  useEffect(() => {
    // Subscribe or fetch
    return () => {
      // Cleanup
    };
  }, [deps]);
  
  // 4. Handlers
  const handleSubmit = async (e) => {
    // Handler logic
  };
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### CSS Standards
- Use class names: `page`, `container`, `header`, `button`, etc.
- Avoid inline styles (put in CSS file instead)
- Mobile-first responsive design
- Dark mode support with `[data-theme="dark"]` selector

---

## 9. TESTING CHECKLIST

### Before Committing
- [ ] `npx vite build` passes with 0 errors
- [ ] No red errors in browser console
- [ ] Feature works locally
- [ ] Real-time sync works (open 2 tabs)
- [ ] Form submissions work with toast feedback
- [ ] Delete operations work
- [ ] No unused imports
- [ ] Code is readable and commented

### Demo Testing
- [ ] Admin tab works
- [ ] Resident tab works
- [ ] Security tab works
- [ ] Real-time sync <1 second
- [ ] No page refreshes needed
- [ ] Mobile responsive (shrink window)

---

## 10. KEY FIREBASE PATTERNS

### Pattern 1: Subscribe & Unsubscribe
```javascript
useEffect(() => {
  const unsub = subscribeToData(callback);
  return () => unsub();  // ← IMPORTANT: cleanup
}, []);
```

### Pattern 2: Error Handling
```javascript
onSnapshot(q, 
  (snapshot) => { /* success */ },
  (error) => {
    console.error('[Firestore Error]:', error);
    callback([]);  // Fallback
  }
);
```

### Pattern 3: Async Form Submit
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    await submitData({...});
    toast.success('Success!', 'Title');
    resetForm();
  } catch (err) {
    toast.error(err.message, 'Error');
  } finally {
    setSubmitting(false);
  }
};
```

### Pattern 4: Real-Time Updates
```javascript
// When admin updates data:
await updateComplaintStatus(id, 'In Progress');
// ↓
// Firestore doc updates
// ↓
// All onSnapshot listeners fire automatically
// ↓
// Resident page re-renders with new status
```

---

## 11. PERFORMANCE CHECKLIST

- [x] Build time <5 seconds
- [x] Dev server startup <10 seconds
- [x] Real-time sync <1 second
- [x] Zero console errors
- [x] Module count reasonable (2853)
- [ ] Code-split large pages (optional, not critical)
- [ ] Lazy load Firestore subscriptions (optional)

---

## 12. WHAT TO DO NEXT

### Immediate (Next Session)
1. **Build Step 5 (Bills)**
   - Copy `complaintService.js` pattern → Create `billService.js`
   - Update `BillManagement.jsx` and `MyBills.jsx`
   - Test real-time sync
   - Commit & push

### Short Term (After Bills)
2. **Build Step 6 (Visitor Pre-Approval)**
3. **Build Step 7 (Emergency SOS)**

### Later
4. Dashboards with stats
5. Additional features
6. UI polish & mobile optimization
7. PWA setup

---

## 13. USEFUL COMMANDS CHEAT SHEET

```bash
# Development
cd frontend && npm run dev          # Start dev server
npx vite build                      # Build for prod
npm install [package-name]          # Add dependency

# Git
git status                          # Check changes
git add .                           # Stage all
git commit -m "message"             # Commit
git push origin bhavesh             # Push to GitHub
git log --oneline -5                # View recent commits

# Debug
npx vite build 2>&1 | tail -30      # See build output
npx vite build 2>&1 | grep error    # Find errors
ls -la dist/                        # Check build artifacts

# Clean
rm -rf node_modules                 # Remove dependencies
npm install                         # Reinstall
npm cache clean --force             # Clear cache
```

---

## 14. RESOURCES & REFERENCES

### Firebase Docs
- Auth: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore
- Web SDK: https://firebase.google.com/docs/web/setup

### React Docs
- Hooks: https://react.dev/reference/react
- Router: https://reactrouter.com/

### Project Files
- Main context report: `PROJECT_CONTEXT_REPORT.md`
- Demo roadmap: `HACKATHON_DEMO_ROADMAP.md`
- Database schema: `DATABASE_SCHEMA_FOR_AI.md`

---

## 15. FINAL CHECKLIST BEFORE STARTING

- [ ] Cloned repo or have it locally
- [ ] Node 16+ installed
- [ ] Firebase config correct (accord-living-cf585)
- [ ] Dev server runs without errors
- [ ] Can login with test credentials
- [ ] Announcements/Complaints flows work
- [ ] Build passes (2853 modules, 0 errors)
- [ ] Git setup correctly
- [ ] Terminal ready for development

---

**Ready to Code? Start with:**
```bash
cd /Users/bhavesh/Desktop/SMS-Aksh/frontend
npm run dev
```

**Questions?** Check PROJECT_CONTEXT_REPORT.md for more details.
