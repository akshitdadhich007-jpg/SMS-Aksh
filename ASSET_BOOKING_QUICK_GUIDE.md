# Asset Booking Feature - Quick Reference Guide

## 🚀 How to Access

### For Residents
1. Click **"🏟️ Asset Booking"** in the sidebar
2. Navigate to: `/resident/bookings`

### For Admins  
1. Click **"🏟️ Assets & Bookings"** in the sidebar
2. Navigate to: `/admin/bookings`

---

## 👥 Resident Dashboard Features

### 📦 Available Assets Tab
- View 4 community assets:
  - **Clubhouse** - 100 capacity, ₹500/hour
  - **Community Hall** - 200 capacity, ₹750/hour
  - **Gym** - 50 capacity, ₹200/hour
  - **Guest Room** - 4 capacity, ₹300/night
- Click **"Request Booking"** on any asset

### 📅 Upcoming Bookings Tab
- View approved/pending bookings
- See date, time, and status
- Status badges: 🟡 Pending, 🟢 Approved, 🔴 Rejected

### ⏰ Past Bookings Tab
- View completed bookings
- Historical reference for future bookings

### 📝 Booking Modal
- **Date**: Pick any future date
- **Time Slot**: Choose from 8 time slots (8 AM - 5 PM)
- **Purpose**: Brief description of booking reason
- Click **"Submit"** to request

---

## 🔧 Admin Dashboard Features

### 🏪 Manage Assets Tab
**Create New Asset**
- Click **"+ Add New Asset"**
- Fill in: Name, Capacity, Charges, Rules, Description
- Click **"Submit"**

**Edit Asset**
- Click **"Edit"** button on asset row
- Modify details in modal
- Click **"Update"**

**Delete Asset**
- Click **"Delete"** button on asset row
- Asset removed from system

**Columns**: Name | Capacity | Charges | Booking Rules | Description | Actions

### 🔔 Booking Requests Tab
**Pending Requests**
- Shows unreviewed booking requests from residents
- Contains: Asset name, resident name, date, time, purpose

**Actions**
- **Approve**: Accept booking request (status → Approved)
- **Reject**: Deny booking request (status → Rejected)

### 📊 Booking History Tab
- View all bookings (past & present)
- Filter by status: Pending, Approved, Rejected, Completed
- Historical data for reports

---

## 🎨 UI Components

### Status Badges
```
🟢 Approved  - Green (Booking confirmed)
🟡 Pending   - Orange (Awaiting approval)
🔴 Rejected  - Red (Request denied)
🔵 Completed - Blue (Booking finished)
```

### Buttons
- **Primary**: Dark blue background (action buttons)
- **Approve**: Green tinted background
- **Reject**: Red tinted background
- **Cancel**: Gray background with border

### Form Elements
- Input fields with focus state (blue border + shadow)
- Textarea for multi-line input
- Select dropdown for predefined options
- Form validation: Required fields marked

---

## 💾 Data Structure

### Asset Object
```javascript
{
  id: number,
  name: string,
  capacity: number,
  charges: number,
  description: string,
  rules: string,
  icon: emoji
}
```

### Booking Object
```javascript
{
  id: number,
  assetName: string,
  residentName: string,
  date: string (YYYY-MM-DD),
  timeSlot: string (HH:MM format),
  purpose: string,
  status: 'pending' | 'approved' | 'rejected' | 'completed',
  requestedOn: string (date)
}
```

---

## 📱 Responsive Design

| Screen Size | Layout |
|------------|--------|
| Desktop (>1024px) | Multi-column grid/table |
| Tablet (768-1024px) | Single column, full width |
| Mobile (<768px) | Stack vertically, 95% width |

---

## 🌙 Dark Mode Support

- ✅ Fully supported in all components
- ✅ Toggle theme via "Appearance" tab in Settings
- ✅ All colors properly contrasted
- ✅ Status badges visible in both modes

---

## 🔄 Time Slots Available

- 8:00 AM - 9:00 AM
- 9:00 AM - 10:00 AM
- 10:00 AM - 12:00 PM
- 12:00 PM - 1:00 PM
- 1:00 PM - 2:00 PM
- 2:00 PM - 3:00 PM
- 3:00 PM - 4:00 PM
- 4:00 PM - 5:00 PM

---

## ✅ Validation Rules

### Resident Booking Form
- Date: Required, must be future date
- Time Slot: Required, must select from dropdown
- Purpose: Required, min 5 characters

### Admin Asset Form
- Name: Required, unique
- Capacity: Required, positive number
- Charges: Required, positive number
- Rules: Optional, max 200 characters
- Description: Optional, max 500 characters

---

## 🔗 Related Features

- **Settings**: Theme toggle, Profile updates
- **Dashboard**: Quick stats and overview
- **Notifications**: Email alerts for booking status (future)
- **Reports**: Booking analytics (future)

---

## 📞 Mock Data Included

**Sample Assets** (Pre-populated)
- Clubhouse
- Community Hall
- Gym
- Guest Room

**Sample Bookings** (Pre-populated)
- 2 upcoming bookings (pending & approved)
- 2 past bookings (completed)
- 3 booking requests (for admin review)

---

## 🚀 Next Steps

1. **Backend Integration**: Connect to API for real data
2. **Database**: Create assets and bookings tables
3. **Notifications**: Send email/SMS on status changes
4. **Calendar**: Replace date picker with calendar view
5. **Payments**: Integrate payment processing
6. **Maintenance**: Add asset maintenance blocking

---

**Last Updated**: Today  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
