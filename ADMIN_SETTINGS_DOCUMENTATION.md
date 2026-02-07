# Admin Settings Module - Complete Implementation

## Overview
The Admin Settings module is a production-ready, comprehensive configuration panel for society administrators. It allows complete management of society profile, financial settings, user roles, and system configurations.

## Architecture

### Components
1. **AdminSettings.jsx** - Main settings container with all tabs and modals
2. **SettingsTabs.jsx** - Reusable tab component used across all roles
3. **Modal.jsx** - Reusable modal for forms and dialogs
4. **ThemeContext.jsx** - Dark mode state management

### Features Implemented

#### 1. Society Profile
- **Fields:**
  - Society Name
  - Address
  - Blocks/Wings
  - Total Flats
  - Registration Number
  - Contact Email
  - Contact Phone

- **Functionality:**
  - View and edit society basic information
  - Save button to persist changes
  - Form validation on required fields

#### 2. Maintenance Settings
- **Configuration Options:**
  - Monthly Maintenance Amount (₹)
  - Due Date (Day of Month: 1-31)
  - Late Fee (₹)
  - Auto Bill Generation (Toggle ON/OFF)

- **Features:**
  - Automatic bill generation toggle
  - Flexible payment terms configuration
  - Late fee management

#### 3. Payment Settings
- **Payment Methods:**
  - Enable/Disable online payments (Master toggle)
  - UPI (Google Pay, PhonePe, PayTM, etc.)
  - Credit/Debit Card (Visa, Mastercard, RuPay)
  - Net Banking (All major Indian banks)

- **UI:**
  - Master toggle to enable/disable all online payments
  - Individual toggles for each payment method (shown when enabled)
  - Clear icons and descriptions

#### 4. Expense Categories
- **CRUD Operations:**
  - Add new expense categories
  - Edit existing categories
  - Delete categories

- **Fields:**
  - Category Name (required)
  - Monthly Budget Amount (optional)

- **UI:**
  - Table view of all categories
  - Edit/Delete action buttons
  - Modal form for adding/editing
  - Default categories: Security, Cleaning, Electricity, Water

- **Modal Features:**
  - Add Expense Modal (for creating new categories)
  - Edit Expense Modal (for updating existing categories)
  - Form validation for required fields

#### 5. Roles & Permissions
- **Admin User Management:**
  - View all admin users in table format
  - Display: Name, Email, Role, Permissions
  - Add new admin users
  - Edit admin users
  - Remove admin users

- **Role Types:**
  - Admin (All permissions)
  - Treasurer (Payments, Reports)
  - Secretary (Announcements, Complaints)

- **Features:**
  - Role badges with color coding
  - Action buttons for edit/delete
  - (Modal for add/edit role not fully implemented - can be extended)

#### 6. Lost & Found
- **Feature Configuration:**
  - Enable/Disable Lost & Found feature (Master toggle)
  - Require Approval for Claims (Checkbox)
  - Enable Dispute Handling (Checkbox)
  - PIN Expiry Days (Input field: 1-365)

- **Conditional Display:**
  - Additional options only shown when feature is enabled
  - Organized sections with dividers

#### 7. Notifications
- **Alert Types:**
  - Maintenance Reminders
  - Emergency Alerts
  - Complaint Updates
  - Announcement Notifications
  - Bill Reminders
  - Resident Updates

- **UI:**
  - Checkbox for each notification type
  - Clear descriptions for each setting

#### 8. Reports & Data Export
- **Financial Reports:**
  - Maintenance Collection Report
  - Expense Report
  - Payment Summary
  - Outstanding Dues

- **Data Exports:**
  - Export All Residents
  - Export Complaints
  - Export Announcements
  - Export Vehicles & Visitors

- **UI:**
  - Grid of report buttons
  - Download icon with descriptive labels
  - Organized in separate sections

#### 9. Appearance
- **Dark Mode:**
  - Toggle switch to enable/disable dark mode
  - Preference saved in localStorage
  - Applies immediately across all pages

## State Management

### useState Hooks
```javascript
// Society Profile
societyProfile: { name, address, blocks, totalFlats, registrationNo, email, phone }

// Maintenance Settings
maintenanceSettings: { monthlyAmount, dueDate, lateFee, autoBillGeneration }

// Payment Settings
paymentSettings: { enableOnlinePayments, upi, card, netBanking }

// Expense Categories
expenseCategories: [{ id, name, budget }, ...]

// Admin Users
adminUsers: [{ id, name, email, role, permissions }, ...]

// Lost & Found Settings
lostFoundSettings: { enableFeature, requireApproval, pinExpiry, enableDisputes }

// Notification Settings
notificationSettings: { maintenanceReminders, emergencyAlerts, complaintUpdates, ... }

// Modal States
modals: { addExpense, editExpense, addRole, editRole }

// Form States
expenseForm: { name, budget }
roleForm: { name, email, role, permissions }
```

## Styling

### CSS Classes
- `.admin-settings-page` - Main container
- `.settings-wrapper` - Tab wrapper
- `.settings-form-grid` - Responsive form grid layout
- `.toggle-switch` - Custom toggle switch component
- `.settings-table` - Table styling
- `.action-btn` - Action button styling
- `.role-badge` - Role indicator badges
- `.report-grid` - Report button grid
- `.report-btn` - Individual report button
- `.modal-form` - Modal form styling

### Responsive Design
- Mobile-first approach
- Grid columns adjust based on screen size
- Tables become scrollable on mobile
- Form layout changes to single column on small screens

## Dark Mode Support

All components fully support dark mode:
- `[data-theme="dark"]` CSS variables applied
- Toggle in Appearance tab
- Preference persisted in localStorage
- Automatic theme detection on first visit

## Usage in Application

### Accessing Admin Settings
1. Click Settings button at bottom of sidebar
2. Opens `/admin/settings` route
3. SettingsTabs component displays all configuration options

### Extending Features
To add new settings:

1. **Add new tab:**
   ```javascript
   {
     label: 'New Feature',
     icon: <SomeIcon size={18} />,
     content: (
       <div>
         {/* Your content */}
       </div>
     ),
   }
   ```

2. **Add state management:**
   ```javascript
   const [newFeature, setNewFeature] = useState({...});
   ```

3. **Add handlers:**
   ```javascript
   const handleNewFeatureChange = (key, value) => {
     setNewFeature(prev => ({ ...prev, [key]: value }));
   };
   ```

## Modals Currently Implemented

### Add Expense Category Modal
- Opens when clicking "Add Category" button
- Fields: Category Name, Monthly Budget
- Actions: Add Category, Cancel
- Validation: Both fields required

### Edit Expense Category Modal
- Opens when clicking Edit action button in table
- Pre-fills current values
- Actions: Save Changes, Cancel
- Updates existing category

### Placeholder Modals (Structure Ready)
- Add Role Modal
- Edit Role Modal
- (Can be implemented similar to Expense modals)

## Backend Integration Points

The following would need backend integration:

1. **Save Society Profile** - POST/PUT `/api/admin/society`
2. **Save Maintenance Settings** - POST/PUT `/api/admin/maintenance`
3. **Save Payment Settings** - POST/PUT `/api/admin/payments`
4. **CRUD Expense Categories** - GET/POST/PUT/DELETE `/api/admin/expenses`
5. **Manage Admin Users** - GET/POST/PUT/DELETE `/api/admin/users`
6. **Save Lost & Found Settings** - POST/PUT `/api/admin/lostfound`
7. **Save Notification Settings** - POST/PUT `/api/admin/notifications`
8. **Generate Reports** - GET `/api/admin/reports/{type}`
9. **Export Data** - GET `/api/admin/export/{type}`

## Production Checklist

- ✅ Complete responsive design
- ✅ Dark mode support
- ✅ Accessible UI with icons (no emojis)
- ✅ Modal dialogs for CRUD operations
- ✅ Form validation ready
- ✅ State management structure
- ✅ Reusable components
- ✅ Comprehensive styling
- ⏳ Backend API integration (next step)
- ⏳ Error handling (to be added)
- ⏳ Success/Loading states (to be added)
- ⏳ Form validation (to be added)

## Color Scheme

### Light Mode
- Background: #F8FAFC
- Card: #FFFFFF
- Primary Text: #0F172A
- Secondary Text: #475569
- Primary Action: #4F46E5
- Danger: #DC2626

### Dark Mode
- Background: #0F172A
- Card: #1E293B
- Primary Text: #F1F5F9
- Secondary Text: #94A3B8
- Primary Action: #4F46E5
- Border: #334155

## Files Structure

```
frontend/src/
├── pages/admin/
│   ├── AdminSettings.jsx (Main component)
│   └── AdminSettings.css (Styling)
├── components/ui/
│   ├── Modal.jsx (Reusable modal)
│   ├── Modal.css
│   ├── SettingsTabs.jsx (Reusable tabs)
│   └── SettingsTabs.css
├── context/
│   └── ThemeContext.jsx (Dark mode state)
├── styles/
│   ├── dark-mode.css (Theme variables)
│   └── components.css
└── main.jsx
```

## Notes

- All form data is currently stored in component state
- For production, implement backend API calls to persist data
- Add error handling and validation feedback
- Implement loading states during API calls
- Consider adding confirmation dialogs before deletions
- Add success/failure toast notifications
