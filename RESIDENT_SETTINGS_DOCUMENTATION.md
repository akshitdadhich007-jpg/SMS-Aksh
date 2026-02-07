# Resident Settings Module - Complete Implementation

## Overview
The Resident Settings module is a production-ready configuration panel for residents to manage their profile, preferences, and account security. It provides a clean, intuitive interface for personal account management.

## Architecture

### Components
1. **ResidentSettings.jsx** - Main settings container with all tabs and modals
2. **SettingsTabs.jsx** - Reusable tab component (shared across all roles)
3. **Modal.jsx** - Reusable modal for forms and confirmations
4. **ThemeContext.jsx** - Dark mode state management (shared)

## Features Implemented

### 1. Profile Tab
**Purpose:** View and manage personal information

**Fields:**
- **Full Name** (Editable)
  - Text input for resident's full name
  
- **Phone Number** (Editable)
  - Tel input field with placeholder
  - Can be any valid phone format
  
- **Email Address** (Editable)
  - Email input field
  - Can update email for notifications
  
- **Flat Number** (Read-Only)
  - Displays flat/apartment number
  - Disabled input (cannot be changed)
  - Helper text explaining why it's read-only
  - Instruction to contact administrator for changes

**Functionality:**
- Edit personal information
- Save button to persist changes
- Cancel button to discard changes
- Data validation on save

### 2. Notifications Tab
**Purpose:** Control notification preferences

**Notification Types:**
1. **Maintenance Notifications**
   - Billing alerts
   - Due date reminders
   - Payment confirmation notifications
   
2. **Complaint Updates**
   - When complaints are updated
   - Resolution notifications
   - Status change alerts
   
3. **Announcements**
   - Important society announcements
   - Maintenance notices
   - Emergency alerts

**Features:**
- Toggle for each notification type
- Clear descriptions of what each notification covers
- Save button to persist preferences
- Info alert explaining notification control

### 3. Payment Tab
**Purpose:** Configure payment preferences

**Fields:**
1. **Default Payment Mode** (Dropdown)
   - UPI (Google Pay, PhonePe, PayTM)
   - Credit/Debit Card
   - Net Banking
   - Manual Transfer
   - Pre-selected: UPI

2. **Auto Payment Reminder** (Toggle)
   - Receive automatic reminders 3 days before due date
   - Toggle ON/OFF

**Features:**
- Dropdown selection for payment method
- Easy toggle for reminder settings
- Divider separating sections
- Save button to persist preferences
- Info alert about payment configuration

### 4. Security Tab
**Purpose:** Manage account security and sessions

**Sections:**

1. **Password Management**
   - Last password change date
   - "Change Password" button opens modal
   
2. **Active Sessions**
   - View current device information
   - Browser and OS details
   - Last active timestamp
   - Session status badge (Active)
   - Can be extended to show multiple devices

3. **Logout All Devices**
   - Button to logout from all active sessions
   - Confirmation dialog before proceeding
   - Security-focused red button

**Features:**
- Password change modal with validation
- Current device information display
- Session management
- Confirmation dialogs for critical actions

### 5. Appearance Tab
**Purpose:** Control visual theme

**Features:**
- Dark mode toggle (handled by SettingsTabs)
- Preference saved in localStorage
- Applies immediately across app
- Available on every settings page

## State Management

### useState Hooks
```javascript
// Profile Data
profileData: {
  name: string,
  phone: string,
  email: string,
  flatNo: string (read-only)
}

// Notification Settings
notificationSettings: {
  maintenanceNotifications: boolean,
  complaintUpdates: boolean,
  announcementNotifications: boolean
}

// Payment Preferences
paymentPreferences: {
  defaultPaymentMode: string ('upi'|'card'|'netbanking'|'manual'),
  autoReminder: boolean
}

// Security Data
securityData: {
  lastPasswordChange: string,
  lastLogin: string
}

// Modal States
modals: {
  changePassword: boolean,
  logoutDevices: boolean
}

// Password Form
passwordForm: {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}
```

## Modal Components

### 1. Change Password Modal
**Features:**
- Three password fields
- Current password validation
- New password confirmation
- Password strength requirements (8+ characters)
- Error messages for mismatches
- Cancel button to close without changes

**Validation:**
- All fields required
- New passwords must match
- Minimum 8 characters
- Security recommendations displayed

**Success Handling:**
- Updates lastPasswordChange date
- Shows confirmation message
- Closes modal on success

### 2. Logout All Devices Modal
**Features:**
- Confirmation dialog
- Warning alert explaining consequences
- Two-button confirmation (Yes/No)
- Red danger button for logout
- Clear messaging about session termination

**Functionality:**
- Logs user out from all devices
- Redirects to login page
- Clears all active sessions
- Forces re-authentication

## Styling

### CSS Classes
- `.resident-settings-page` - Main container
- `.settings-wrapper` - Tab wrapper
- `.settings-form-grid` - Responsive form grid
- `.toggle-switch` - Custom toggle component
- `.session-info` - Session information container
- `.session-item` - Individual session display
- `.session-badge` - Session status badge
- `.modal-form` - Modal form styling
- `.settings-button-danger` - Danger action button

### Color Scheme
- **Primary Action**: #4F46E5
- **Danger Action**: #DC2626 (red)
- **Success**: #16A34A (green)
- **Warning**: #D97706 (orange)

### Responsive Design
- Mobile-first approach
- Grid columns adjust on smaller screens
- Form fields stack vertically on mobile
- Session items layout changes on small screens

## Dark Mode Support

All elements fully support dark mode:
- `[data-theme="dark"]` CSS applied
- Custom colors for dark backgrounds
- Proper contrast for readability
- Toggle in Appearance tab
- Preference persisted in localStorage

## Usage in Application

### Accessing Resident Settings
1. Click Settings button at bottom of sidebar
2. Navigates to `/resident/settings` route
3. SettingsTabs component displays all options

### Navigation Flow
```
Resident Dashboard
    ↓
Settings Button (Sidebar)
    ↓
/resident/settings
    ↓
ResidentSettings Component
    ↓
Tabs: Profile → Notifications → Payment → Security → Appearance
```

## Handler Functions

### Profile Management
```javascript
handleProfileChange(key, value) // Update profile field
handleSaveProfile() // Save to backend
```

### Notifications
```javascript
handleNotificationChange(key) // Toggle notification type
handleSaveNotifications() // Save preferences
```

### Payment
```javascript
handlePaymentChange(key, value) // Update payment setting
handleSavePaymentPreferences() // Save preferences
```

### Security
```javascript
openChangePasswordModal() // Opens change password modal
handleChangePassword() // Validates and saves new password
handleLogoutAllDevices() // Logs out from all sessions
```

## Backend Integration Points

The following would need backend API integration:

1. **Save Profile** - PUT `/api/resident/{id}/profile`
   ```json
   { name, phone, email }
   ```

2. **Save Notifications** - PUT `/api/resident/{id}/notifications`
   ```json
   { maintenanceNotifications, complaintUpdates, announcementNotifications }
   ```

3. **Save Payment Preferences** - PUT `/api/resident/{id}/payment-preferences`
   ```json
   { defaultPaymentMode, autoReminder }
   ```

4. **Change Password** - POST `/api/resident/{id}/change-password`
   ```json
   { currentPassword, newPassword }
   ```

5. **Logout All Devices** - POST `/api/resident/{id}/logout-all`

6. **Get Security Info** - GET `/api/resident/{id}/security`

## Password Change Validation

```javascript
Validation Rules:
✓ Current password required
✓ New password required
✓ Confirm password required
✓ Passwords must match
✓ Minimum 8 characters
✓ Recommended: mix of upper, lower, numbers
```

## User Experience Flow

### Editing Profile
1. User opens Settings
2. Clicks Profile tab
3. Edits name/phone/email (flat number disabled)
4. Clicks "Save Profile"
5. Data validated
6. API call made
7. Success message shown
8. Form updated with new data

### Changing Password
1. User opens Settings
2. Clicks Security tab
3. Clicks "Change Password"
4. Modal opens with password fields
5. User enters current and new passwords
6. Clicks "Change Password"
7. Validation runs
8. API call made
9. Success message and modal close
10. lastPasswordChange date updated

### Logout All Devices
1. User clicks "Logout All" button
2. Confirmation modal appears
3. User confirms
4. API call to logout
5. User redirected to login
6. All sessions terminated

## Production Checklist

- ✅ Complete responsive design
- ✅ Dark mode support
- ✅ Accessible UI with icons (no emojis)
- ✅ Modal dialogs for confirmations
- ✅ Form validation logic
- ✅ State management structure
- ✅ Reusable components
- ✅ Comprehensive styling
- ✅ Read-only field handling
- ✅ Security-focused features
- ⏳ Backend API integration (next step)
- ⏳ Error handling (to be added)
- ⏳ Success/Loading states (to be added)
- ⏳ Form validation messages (to be added)

## Security Considerations

1. **Password Change**
   - Requires current password verification
   - Passwords compared on backend
   - Should use HTTPS
   - Consider 2FA for sensitive operations

2. **Logout All Devices**
   - Invalidates all session tokens
   - Clears authentication cookies
   - User must re-login
   - Log this action for audit trail

3. **Profile Visibility**
   - Flat number cannot be changed by user
   - Email/phone are non-sensitive but verified
   - Contact admin for major changes

4. **Read-Only Fields**
   - Flat number disabled and marked as read-only
   - Clear explanation for why it's read-only
   - Instructions to contact administrator

## Files Structure

```
frontend/src/
├── pages/resident/
│   ├── ResidentSettings.jsx (Main component)
│   └── ResidentSettings.css (Styling)
├── components/ui/
│   ├── Modal.jsx (Reusable modal)
│   ├── SettingsTabs.jsx (Reusable tabs)
│   └── ... (other components)
├── context/
│   └── ThemeContext.jsx (Dark mode)
└── ... (other files)
```

## Notes

- All form data currently stored in component state
- For production, implement backend API calls
- Add proper error handling and user feedback
- Implement loading states during API calls
- Consider session timeout handling
- Add activity logging for security
- Implement email verification for email changes
- Add password strength indicator
- Consider implementing 2FA
