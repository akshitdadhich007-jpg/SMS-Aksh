# Quick Start: Visitor Pre-Approval Testing & Deployment

## 🚀 Ready-to-Deploy Checklist

- ✅ visitorService.js complete (370 lines, 23 functions)
- ✅ VisitorPreApproval.jsx rewritten (resident page done)
- ✅ PreApprovedVisitors.jsx updated (security search page done)
- ✅ VisitorEntry.jsx updated (security check-in page done)
- ✅ CSS styles added (110+ lines)
- ✅ Build passes (2858 modules)
- ⏳ **Firestore rules need deployment** (5 minutes)

---

## 📋 Step 1: Deploy Firestore Security Rules (5 minutes)

### Option A: Manual (Firebase Console)

1. Open: https://console.firebase.google.com
2. Select project: **accord-living-cf585**
3. Navigate: **Firestore → Rules** tab
4. Copy all content from file: `/Users/bhavesh/Desktop/SMS-Aksh/firestore.rules`
5. Paste into console (replace existing rules)
6. Click **Publish**
7. Wait for deployment confirmation

### Option B: Using Firebase CLI (if installed)

```bash
cd /Users/bhavesh/Desktop/SMS-Aksh
firebase deploy --only firestore:rules
```

**Note:** Firebase CLI not currently installed. Run `npm install -g firebase-tools` to enable this.

---

## 🧪 Step 2: Manual Testing (15 minutes)

### Test Scenario 1: Create Pre-Approval

**What to do:**
1. Open app at http://localhost:5177
2. Login as **resident** (flatNumber: A-101)
3. Navigate to: **Resident → Visitor Pre-Approvals**
4. Click **+ New Pre-Approval**
5. Fill form:
   - Visitor Name: "Jane Smith"
   - Phone: "9876543210"
   - Date: Tomorrow
   - Time: 2:00 PM - 3:30 PM
   - Purpose: "Meeting"
6. Click **Create Pre-Approval**

**Expected Results:**
- ✅ Approval appears in list (status: pending)
- ✅ Approval code generated (e.g., VPA000123)
- ✅ Cards show real-time update
- ✅ No errors in console

---

### Test Scenario 2: Approve Pre-Approval

**What to do:**
1. Login as **admin**
2. Navigate to: **Resident → Visitor Pre-Approvals** (or admin dashboard if different)
3. Find the pre-approval created above
4. Click **Approve** button

**Expected Results:**
- ✅ Status changes from "pending" → "approved"
- ✅ Resident's page shows real-time update
- ✅ Approval code ready for security

---

### Test Scenario 3: Search & Verify (Security)

**What to do:**
1. Login as **security**
2. Navigate to: **Security → Pre-Approved Visitors**
3. Try two searches:
   - **By code:** "VPA000123" (approval code)
   - **By mobile:** "9876543210"

**Expected Results:**
- ✅ Both searches return the pre-approval
- ✅ Visitor details displayed correctly
- ✅ Mark Entry button appears (if current time is within window)
- ✅ Time window status shows: "valid" or "upcoming" or "expired"

---

### Test Scenario 4: Mark Entry/Exit

**What to do:**
1. On pre-approved visitor card (from test 3)
2. Click **Mark Entry** button
3. Wait a few seconds
4. Click **Mark Exit** button

**Expected Results:**
- ✅ Entry time recorded
- ✅ Exit button appears
- ✅ Exit time recorded
- ✅ Stay duration calculated (e.g., "5 minutes")
- ✅ Status progresses: pending → checked_in → completed
- ✅ Real-time updates on all pages

---

### Test Scenario 5: Manual Check-In (Walk-in Visitor)

**What to do:**
1. Login as **security**
2. Navigate to: **Security → Visitor Entry**
3. Fill form:
   - Visitor Name: "John Doe"
   - Purpose: "Delivery"
   - Flat: "B-202"
4. Click **Check In Visitor**
5. Click **Check Out** button in the list

**Expected Results:**
- ✅ Visitor appears in "Active Visitors" list immediately
- ✅ Entry time recorded
- ✅ Click check out removes from list
- ✅ No errors, smooth operation

---

### Test Scenario 6: Real-Time Sync (Multiple Browser Windows)

**What to do:**
1. Open app in **two browser windows**
2. In window 1: Login as **resident**
3. In window 2: Login as **security**
4. In window 1: Create a new pre-approval
5. In window 2: Watch **Pre-Approved Visitors** page

**Expected Results:**
- ✅ Pre-approval appears in security page within 2 seconds
- ✅ Changes on resident page reflect on security page in real-time
- ✅ No page refresh needed
- ✅ No console errors

---

## 📱 UI Component Testing

### Pre-Approval Cards (Resident Page)

**Elements to verify:**
- [ ] Stats grid shows: Pending, Checked-in, Completed counts
- [ ] Each approval card shows:
  - [ ] Visitor name
  - [ ] Phone number
  - [ ] Purpose
  - [ ] Date & time window
  - [ ] Approval code (monospace font)
  - [ ] Status badge (color-coded)
- [ ] Buttons only show for appropriate statuses
- [ ] Hover effect on cards (blue border + shadow)

### Search Results (Security Page)

**Elements to verify:**
- [ ] Header shows visitor name + status (color-coded)
- [ ] Time window status badge (valid/warning/expired)
- [ ] Approval details displayed completely
- [ ] Mark Entry button enabled during valid window
- [ ] Mark Exit button only after entry marked
- [ ] Stay duration calculated correctly

### Visitor Entry (Walk-in)

**Elements to verify:**
- [ ] Form fields: Name, Purpose, Flat (required markers)
- [ ] Submit button disabled during loading
- [ ] "Active Visitors" list updates in real-time
- [ ] Avatar circle shows first letter
- [ ] Check Out button clickable for active visitors

---

## 🐛 Debugging Checklist

If something doesn't work:

1. **Check console for errors:**
   ```
   Open DevTools (F12) → Console tab
   Look for red error messages
   ```

2. **Verify Firestore rules deployed:**
   - Go to Firebase Console → Firestore → Rules
   - Check if new rules are published (green checkmark)

3. **Check user roles:**
   - Ensure accounts have correct role: "resident", "admin", "security"
   - Check in Firebase Console → Firestore → users collection

4. **Verify real-time listener:**
   - Check browser DevTools Network tab
   - Should see active WebSocket connections
   - (Google Cloud Firestore uses WebSocket for real-time)

5. **Test data creation:**
   - Manually add test document to Firebase Firestore
   - Check if it appears in the app within 2 seconds

---

## 📊 Expected Data in Firebase

After completing test scenarios, Firestore should contain:

**Collections:**
```
├── visitor_preapprovals/
│   └── {docId}
│       ├── residentUid: "user_123"
│       ├── visitorName: "Jane Smith"
│       ├── approvalCode: "VPA000123"
│       ├── status: "completed"
│       ├── entryTime: timestamp
│       ├── exitTime: timestamp
│       └── ...
│
└── visitors/
    └── {docId}
        ├── visitorName: "John Doe"
        ├── purpose: "Delivery"
        ├── flatNumber: "B-202"
        ├── status: "completed"
        ├── entryTime: timestamp
        └── ...
```

---

## ✅ Common Issues & Fixes

### Issue: "No pre-approved visitors showing"
**Solution:** 
- Check user is logged in with correct role
- Verify at least one pre-approval exists in Firestore
- Check browser console for errors

### Issue: "Mark Entry button disabled"
**Solution:**
- Current time must be within scheduled window
- If testing outside window, create approval for current time
- Check browser clock is synchronized

### Issue: "Real-time updates not working"
**Solution:**
- Refresh the page
- Check internet connection
- Verify Firestore connection in Network tab
- Check user has read permissions in rules

### Issue: "Form submission hanging"
**Solution:**
- Check Firebase project is active (not paused)
- Verify user has write permissions
- Check internet connectivity
- Look for errors in DevTools

---

## 📝 Testing Checklist

Using this checklist, mark off each test as you complete:

- [ ] Create pre-approval (resident)
- [ ] Approve pre-approval (admin)
- [ ] Search by code (security)
- [ ] Search by mobile (security)
- [ ] Mark entry (security)
- [ ] Mark exit (security)
- [ ] Manual check-in (security)
- [ ] Real-time sync (multi-window)
- [ ] UI looks correct (no broken styles)
- [ ] No console errors
- [ ] Data appears in Firestore
- [ ] Roles work correctly
- [ ] Time window validation works

---

## 🎓 Understanding the Data Flow

```
RESIDENT Creates Pre-Approval
    ↓
Firebase writes to: visitor_preapprovals collection
    ↓
Status = "pending"
Approval Code = "VPA000123"
    ↓
ADMIN Approves
    ↓
Status changes to: "approved"
    ↓
SECURITY searches and finds it
Real-time subscription: subscribeToAllPreApprovals()
    ↓
SECURITY marks entry
entryTime = now
Status = "checked_in"
    ↓
SECURITY marks exit
exitTime = now
Status = "completed"
Stay Duration = calculated from (exitTime - entryTime)
    ↓
Complete!
```

---

## 🚀 Next Steps After Step 6

Once testing is complete and working:

1. **Optional:** Add notifications for role-based alerts
2. **Optional:** Add photo/ID scanning for security check
3. **Move to Step 7:** Emergency SOS feature
4. **Move to Step 8:** Dashboards and analytics

---

## 📞 Support

**Reference Files:**
- Service functions: `/frontend/src/firebase/visitorService.js`
- Security rules: `/firestore.rules`
- Complete docs: `/STEP_6_VISITOR_PREAPPROVAL_COMPLETE.md`

**Key Timestamps:**
- Firestore writes: serverTimestamp() at doc root
- Frontend displays: new Date() for user-friendly format
- All times stored in ISO format for consistency
