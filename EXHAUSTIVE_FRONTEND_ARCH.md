# Exhaustive Frontend Node Architecture
> **Note for Backend Team:** This document details *every single React component* found in the frontend source code. It lists internal states, props received, form inputs, button interactions, and expected backend API interaction points.

---

## Main App & Providers
===
### 📄 Node: `App`
**Path:** `App.jsx`

---

### 📄 Node: `main`
**Path:** `main.jsx`

---

## Context Providers
===
### 📄 Node: `ThemeProvider`
**Path:** `context/ThemeContext.jsx`

**💾 Internal State (Variables):**
- `isDarkMode`
- `isLoading`

---

### 📄 Node: `VisitorProvider`
**Path:** `context/VisitorContext.jsx`

**💾 Internal State (Variables):**
- `approvals`
- `visitorHistory`

---

## UI Components
===
### 📄 Node: `Login`
**Path:** `components/features/Login.jsx`

**💾 Internal State (Variables):**
- `email`
- `password`
- `successMsg`
- `activeRole`
- `errorMsg`
- `demoExpanded`
- `autoLoginEnabled`

**🖱️ Buttons / Visual Triggers:**
- { setActiveRole('admin'); fillCredentials('admin@society.local', 'Admin@12345', ...
- { setActiveRole('security'); fillCredentials('security@society.local', 'Security...
- { setActiveRole('resident'); fillCredentials('resident1@society.local', 'Residen...
- Login

**⚡ Event Handlers (User Actions):**
- `onClick: () => fillCredentials('admin@society.local', 'Admin@12345', 'admin')`
- `onClick: () => fillCredentials('resident1@society.local', 'Resident@123', 'resident')`
- `onClick: () => { setActiveRole('resident'); fillCredentials('resident1@society.local', 'Resident@123', 'resident'); if (...`
- `onChange: (e) => setAutoLoginEnabled(e.target.checked)`
- `onChange: (e) => setPassword(e.target.value)`
- `onChange: (e) => setEmail(e.target.value)`
- `onClick: () => { setActiveRole('security'); fillCredentials('security@society.local', 'Security@123', 'security'); if (a...`
- `onClick: () => { setActiveRole('admin'); fillCredentials('admin@society.local', 'Admin@12345', 'admin'); if (autoLoginEn...`
- `onClick: () => fillCredentials('security@society.local', 'Security@123', 'security')`
- `onSubmit: handleLogin`
- `onClick: () => setDemoExpanded(!demoExpanded)`

**🔌 Backend API Interactions:**
- `fetch('http://localhost:3001/api/login', {`

---

### 📄 Node: `Button`
**Path:** `components/ui/Button.jsx`

**🖱️ Buttons / Visual Triggers:**
- {children}

---

### 📄 Node: `Card`
**Path:** `components/ui/Card.jsx`

---

### 📄 Node: `ClaimProgress`
**Path:** `components/ui/ClaimProgress.jsx`

---

### 📄 Node: `Modal`
**Path:** `components/ui/Modal.jsx`

**📥 Props (Data Passed In):**
- `isOpen`
- `title`
- `onClose`
- `children`
- `size = 'md'`

**⚡ Event Handlers (User Actions):**
- `onClick: (e) => e.stopPropagation()`
- `onClick: onClose`

---

### 📄 Node: `NotificationPanel`
**Path:** `components/ui/NotificationPanel.jsx`

**💾 Internal State (Variables):**
- `isOpen`
- `notifications`

**🖱️ Buttons / Visual Triggers:**
- setIsOpen(!isOpen)}                 aria-label="Notifications"                 a...
- handleMarkAsRead(notif.id)}                                                     ...
- handleDeleteNotification(notif.id)}                                             ...
- setIsOpen(false)}                             aria-label="Close notifications"  ...
- Clear All

**⚡ Event Handlers (User Actions):**
- `onClick: () => handleMarkAsRead(notif.id)`
- `onClick: () => setIsOpen(false)`
- `onClick: () => setIsOpen(!isOpen)`
- `onClick: handleClearAll`
- `onClick: () => handleDeleteNotification(notif.id)`

---

### 📄 Node: `PageHeader`
**Path:** `components/ui/PageHeader.jsx`

---

### 📄 Node: `QRCodeDisplay`
**Path:** `components/ui/QRCodeDisplay.jsx`

**💾 Internal State (Variables):**
- `qrImageUrl`
- `error`

---

### 📄 Node: `QRCodeScanner`
**Path:** `components/ui/QRCodeScanner.jsx`

**💾 Internal State (Variables):**
- `scanning`
- `error`

**🖱️ Buttons / Visual Triggers:**
- {                         stopCamera();                         onClose();      ...
- Enter Manually

**⚡ Event Handlers (User Actions):**
- `onClick: handleManualInput`
- `onClick: () => {
                        stopCamera();
                        onClose();`

---

### 📄 Node: `SettingsTabs`
**Path:** `components/ui/SettingsTabs.jsx`

**📥 Props (Data Passed In):**
- `tabs`

**💾 Internal State (Variables):**
- `activeTab`

**🖱️ Buttons / Visual Triggers:**
- {isDarkMode ? (                                    ) : (                        ...
- setActiveTab(index)}             className={`settings-tab ${activeTab === index ...

**⚡ Event Handlers (User Actions):**
- `onClick: toggleDarkMode`
- `onClick: () => setActiveTab(index)`

---

### 📄 Node: `StatCard`
**Path:** `components/ui/StatCard.jsx`

---

### 📄 Node: `StatusBadge`
**Path:** `components/ui/StatusBadge.jsx`

---

### 📄 Node: `ToastProvider`
**Path:** `components/ui/Toast.jsx`

**📥 Props (Data Passed In):**
- `children`

**💾 Internal State (Variables):**
- `toasts`

**🖱️ Buttons / Visual Triggers:**
- removeToast(t.id)}>

**⚡ Event Handlers (User Actions):**
- `onClick: () => removeToast(t.id)`

---

### 📄 Node: `TracebackNav`
**Path:** `components/ui/TracebackNav.jsx`

**🖱️ Buttons / Visual Triggers:**
- Home
- Dashboard

**⚡ Event Handlers (User Actions):**
- `onClick: handleDashboard`
- `onClick: handleHome`

---

## Admin Pages
===
### 📄 Node: `AdminDashboard`
**Path:** `pages/admin/AdminDashboard.jsx`

**🖱️ Buttons / Visual Triggers:**
- navigate('/admin/payments')}>View All →
- navigate('/admin/complaints')}>View All →
- 📥 Download Report

**⚡ Event Handlers (User Actions):**
- `onClick: () => navigate('/admin/complaints')`
- `onClick: () => navigate('/admin/payments')`
- `onClick: handleDownloadReport`

---

### 📄 Node: `AdminSettings`
**Path:** `pages/admin/AdminSettings.jsx`

**💾 Internal State (Variables):**
- `societyProfile`
- `maintenanceSettings`
- `paymentSettings`
- `expenseCategories`
- `adminUsers`
- `lostFoundSettings`
- `notificationSettings`
- `modals`
- `currentEditingItem`
- `expenseForm`
- `roleForm`

**🖱️ Buttons / Visual Triggers:**
- Save Payment Settings
- openEditExpenseModal(category)}                         title="Edit"            ...
- Maintenance Collection Report
- Export Complaints
- deleteExpense(category.id)}                         title="Delete"              ...
- Payment Summary
- Export All Residents
- Export Announcements
- handleMaintenanceChange('autoBillGeneration', !maintenanceSettings.autoBillGener...
- Expense Report
- Save Society Profile
- Add Admin User
- handlePaymentChange('enableOnlinePayments')}             >
- handleLostFoundChange('enableFeature')}             >
- Outstanding Dues
- setModals(prev => ({ ...prev, addExpense: false }))}             >              ...
- Save Changes
- Add Category
- setModals(prev => ({ ...prev, editExpense: false }))}             >             ...
- Save Maintenance Settings
- Save Lost & Found Settings
- Export Vehicles & Visitors

**⚡ Event Handlers (User Actions):**
- `onClick: () => handleLostFoundChange('enableFeature')`
- `onChange: (e) => handleSocietyProfile('email', e.target.value)`
- `onChange: () => handlePaymentChange('upi')`
- `onClick: () => setModals(prev => ({ ...prev, addExpense: false`
- `onClick: () => setModals(prev => ({ ...prev, editExpense: false`
- `onClick: () => openEditExpenseModal(category)`
- `onClick: () => deleteExpense(category.id)`
- `onChange: () => handleNotificationChange('emergencyAlerts')`
- `onChange: (e) => handleSocietyProfile('address', e.target.value)`
- `onChange: (e) => handleSocietyProfile('blocks', e.target.value)`
- `onClick: saveExpense`
- `onChange: (e) => setExpenseForm(prev => ({ ...prev, budget: e.target.value`
- `onChange: () => handleNotificationChange('billReminders')`
- `onChange: () => handleNotificationChange('maintenanceReminders')`
- `onChange: (e) => handleSocietyProfile('name', e.target.value)`
- `onChange: (e) => handleMaintenanceChange('lateFee', e.target.value)`
- `onChange: () => handleNotificationChange('complaintUpdates')`
- `onClick: () => handleMaintenanceChange('autoBillGeneration', !maintenanceSettings.autoBillGeneration)`
- `onChange: (e) => handleSocietyProfile('registrationNo', e.target.value)`
- `onChange: () => handleNotificationChange('residentUpdates')`
- `onChange: (e) => setExpenseForm(prev => ({ ...prev, name: e.target.value`
- `onChange: (e) => handleMaintenanceChange('monthlyAmount', e.target.value)`
- `onChange: () => handlePaymentChange('card')`
- `onChange: () => handlePaymentChange('netBanking')`
- `onClick: () => handlePaymentChange('enableOnlinePayments')`
- `onClick: openAddExpenseModal`
- `onChange: (e) => handleSocietyProfile('totalFlats', e.target.value)`
- `onChange: (e) => setLostFoundSettings(prev => ({ ...prev, pinExpiry: e.target.value`
- `onChange: (e) => handleMaintenanceChange('dueDate', e.target.value)`
- `onChange: () => handleLostFoundChange('enableDisputes')`
- `onChange: (e) => handleSocietyProfile('phone', e.target.value)`
- `onChange: () => handleLostFoundChange('requireApproval')`
- `onChange: () => handleNotificationChange('announcementNotifications')`

---

### 📄 Node: `AdminAssetBooking`
**Path:** `pages/admin/AssetBooking.jsx`

**💾 Internal State (Variables):**
- `activeTab`
- `showAssetModal`
- `editingAsset`
- `assetForm`
- `assets`

**🖱️ Buttons / Visual Triggers:**
- handleOpenAssetModal()}             >                Add New Asset
- handleOpenAssetModal(asset)}                         title="Edit"               ...
- setActiveTab('history')}         >           📊 Booking History
- setActiveTab('assets')}         >           🏢 Manage Assets
- setShowAssetModal(false)}>                 Cancel
- setShowAssetModal(false)}>
- handleApproveBooking(request.id)}                         >                     ...
- setActiveTab('requests')}         >           📋 Booking Requests ({bookingReques...
- {editingAsset ? 'Update Asset' : 'Create Asset'}
- handleDeleteAsset(asset.id)}                         title="Delete"             ...
- handleRejectBooking(request.id)}                         >                      ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => handleDeleteAsset(asset.id)`
- `onClick: () => setActiveTab('requests')`
- `onChange: (e) => handleAssetChange('name', e.target.value)`
- `onChange: (e) => handleAssetChange('description', e.target.value)`
- `onClick: () => handleRejectBooking(request.id)`
- `onClick: () => setShowAssetModal(false)`
- `onChange: (e) => handleAssetChange('capacity', e.target.value)`
- `onChange: (e) => handleAssetChange('charges', e.target.value)`
- `onChange: (e) => handleAssetChange('bookingRules', e.target.value)`
- `onClick: handleSaveAsset`
- `onClick: () => handleApproveBooking(request.id)`
- `onClick: () => handleOpenAssetModal()`
- `onClick: () => setActiveTab('history')`
- `onClick: () => handleOpenAssetModal(asset)`
- `onClick: () => setActiveTab('assets')`

---

### 📄 Node: `AttendanceLogs`
**Path:** `pages/admin/AttendanceLogs.jsx`

**💾 Internal State (Variables):**
- `records`

**🖱️ Buttons / Visual Triggers:**
- Clear Old Records

**⚡ Event Handlers (User Actions):**
- `onClick: clearLogs`

---

### 📄 Node: `BillManagement`
**Path:** `pages/admin/BillManagement.jsx`

**💾 Internal State (Variables):**
- `bills`
- `modalOpen`
- `viewModal`
- `form`

**🖱️ Buttons / Visual Triggers:**
- setModalOpen(false)}>Cancel
- setModalOpen(true)}>+ Generate New Bill
- Generate Bill
- toast.success('Billing report exported as CSV!', 'Export Complete')}>📥 Export Re...
- setViewModal(bill)}>View

**⚡ Event Handlers (User Actions):**
- `onChange: e => setForm({ ...form, month: e.target.value`
- `onClick: () => toast.success('Billing report exported as CSV!', 'Export Complete')`
- `onClick: () => setViewModal(bill)`
- `onChange: e => setForm({ ...form, totalAmount: e.target.value`
- `onClick: () => setModalOpen(true)`
- `onClick: () => setModalOpen(false)`
- `onSubmit: handleGenerate`

---

### 📄 Node: `CommitteeManagement`
**Path:** `pages/admin/CommitteeManagement.jsx`

**💾 Internal State (Variables):**
- `members`
- `viewMember`
- `roleModal`
- `roleForm`

**🖱️ Buttons / Visual Triggers:**
- Update Role
- setRoleModal(false)}>Cancel
- setViewMember(member)}>View
- setRoleModal(true)}>🔄 Update Roles

**⚡ Event Handlers (User Actions):**
- `onClick: () => setRoleModal(false)`
- `onSubmit: handleRoleUpdate`
- `onChange: e => setRoleForm({ ...roleForm, position: e.target.value`
- `onClick: () => setViewMember(member)`
- `onClick: () => setRoleModal(true)`
- `onChange: e => setRoleForm({ ...roleForm, memberId: e.target.value`

---

### 📄 Node: `ComplaintManagement`
**Path:** `pages/admin/ComplaintManagement.jsx`

**💾 Internal State (Variables):**
- `complaints`
- `searchTerm`
- `statusFilter`
- `selectedComplaint`
- `isModalOpen`

**🖱️ Buttons / Visual Triggers:**
- Close
- }                     >                         Export CSV
- Update Status
- }                     >                         Advanced
- handleDelete(complaint.id)}                                                 >
- handleViewDetails(complaint)}                                                 >

**⚡ Event Handlers (User Actions):**
- `onClick: () => handleViewDetails(complaint)`
- `onClick: () => handleDelete(complaint.id)`
- `onClick: handleCloseModal`
- `onChange: (e) => setStatusFilter(e.target.value)`
- `onChange: (e) => setSearchTerm(e.target.value)`

---

### 📄 Node: `DeliveryLog`
**Path:** `pages/admin/DeliveryLog.jsx`

**💾 Internal State (Variables):**
- `deliveries`
- `modalOpen`
- `form`

**🖱️ Buttons / Visual Triggers:**
- Log Delivery
- handleNotify(delivery)}>Notify
- setModalOpen(false)}>Cancel
- setModalOpen(true)}>+ Log Delivery

**⚡ Event Handlers (User Actions):**
- `onChange: e => setForm({ ...form, flat: e.target.value`
- `onClick: () => setModalOpen(true)`
- `onChange: e => setForm({ ...form, courier: e.target.value`
- `onChange: e => setForm({ ...form, date: e.target.value`
- `onClick: () => handleNotify(delivery)`
- `onSubmit: handleLogDelivery`
- `onClick: () => setModalOpen(false)`

---

### 📄 Node: `DocumentRepo`
**Path:** `pages/admin/DocumentRepo.jsx`

**💾 Internal State (Variables):**
- `documents`
- `modalOpen`
- `form`

**🖱️ Buttons / Visual Triggers:**
- setModalOpen(false)}>Cancel
- handleDownload(doc)}>Download
- setModalOpen(true)}>+ Upload Document
- Upload

**⚡ Event Handlers (User Actions):**
- `onChange: e => setForm({ ...form, type: e.target.value`
- `onClick: () => handleDownload(doc)`
- `onClick: () => setModalOpen(true)`
- `onSubmit: handleUpload`
- `onChange: e => setForm({ ...form, size: e.target.value`
- `onChange: e => setForm({ ...form, name: e.target.value`
- `onClick: () => setModalOpen(false)`

---

### 📄 Node: `EmergencyManagement`
**Path:** `pages/admin/EmergencyManagement.jsx`

**💾 Internal State (Variables):**
- `alerts`
- `broadcastMessage`

**🖱️ Buttons / Visual Triggers:**
- Send Alert
- Download Report
- handleResolve(alert.id)}                                                 >      ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => handleResolve(alert.id)`
- `onChange: (e) => setBroadcastMessage(e.target.value)`

---

### 📄 Node: `EventsAnnouncements`
**Path:** `pages/admin/EventsAnnouncements.jsx`

**💾 Internal State (Variables):**
- `events`
- `announcements`
- `createModal`
- `createType`
- `form`

**🖱️ Buttons / Visual Triggers:**
- {                             setAnnouncements([]);                             ...
- Create {createType === 'event' ? 'Event' : 'Notice'}
- setCreateModal(false)}>Cancel
- setCreateModal(true)}>+ Create New
- toast.info(`Showing all ${events.length} events`, 'All Events')}>View All

**⚡ Event Handlers (User Actions):**
- `onChange: e => setCreateType(e.target.value)`
- `onClick: () => {
                            setAnnouncements([]);
                            toast.success('All notice...`
- `onChange: e => setForm({ ...form, location: e.target.value`
- `onSubmit: handleCreate`
- `onChange: e => setForm({ ...form, time: e.target.value`
- `onChange: e => setForm({ ...form, title: e.target.value`
- `onClick: () => setCreateModal(true)`
- `onClick: () => setCreateModal(false)`
- `onChange: e => setForm({ ...form, date: e.target.value`
- `onChange: e => setForm({ ...form, message: e.target.value`
- `onClick: () => toast.info(`Showing all ${events.length`

---

### 📄 Node: `ExpenseTracker`
**Path:** `pages/admin/ExpenseTracker.jsx`

**💾 Internal State (Variables):**
- `expenses`
- `modalOpen`
- `editingExpense`
- `form`

**🖱️ Buttons / Visual Triggers:**
- + Add Expense
- openEditModal(expense)}>Edit
- setModalOpen(false)}>Cancel
- {editingExpense ? 'Save Changes' : 'Add Expense'}

**⚡ Event Handlers (User Actions):**
- `onChange: e => setForm({ ...form, date: e.target.value`
- `onChange: e => setForm({ ...form, category: e.target.value`
- `onSubmit: handleSubmit`
- `onClick: openAddModal`
- `onChange: e => setForm({ ...form, description: e.target.value`
- `onClick: () => openEditModal(expense)`
- `onClick: () => setModalOpen(false)`
- `onChange: e => setForm({ ...form, amount: e.target.value`

---

### 📄 Node: `FinderClaimReview`
**Path:** `pages/admin/FinderClaimReview.jsx`

**💾 Internal State (Variables):**
- `adminComment`
- `rejectReason`
- `showRejectForm`

**🖱️ Buttons / Visual Triggers:**
- navigate(getTracebackPath(location.pathname, 'matches'))}>Back to Dashboard
- setShowRejectForm(false)} style={{ flex: 1 }}>Cancel
- setShowRejectForm(true)} style={{ flex: 1 }}>                                  R...
- updateClaimStatus('rejected', rejectReason)} disabled={!rejectReason.trim()} sty...
- updateClaimStatus('info_requested')} style={{ flex: 1 }}>                       ...
- updateClaimStatus('approved')} style={{ flex: 1 }}>                             ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => navigate(getTracebackPath(location.pathname, 'matches'))`
- `onChange: e => setRejectReason(e.target.value)`
- `onClick: () => updateClaimStatus('rejected', rejectReason)`
- `onClick: () => setShowRejectForm(true)`
- `onClick: () => setShowRejectForm(false)`
- `onClick: () => updateClaimStatus('approved')`
- `onChange: e => setAdminComment(e.target.value)`
- `onClick: () => updateClaimStatus('info_requested')`

---

### 📄 Node: `LostAndFoundTraceback`
**Path:** `pages/admin/LostAndFoundTraceback.jsx`

**🖱️ Buttons / Visual Triggers:**
- navigate(getTracebackPath(location.pathname, 'report-found'))}>                 ...
- navigate(getTracebackPath(location.pathname, 'report-lost'))}>                  ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => navigate(getTracebackPath(location.pathname, 'report-found'))`
- `onClick: () => navigate(getTracebackPath(location.pathname, 'report-lost'))`

---

### 📄 Node: `PaymentRecords`
**Path:** `pages/admin/PaymentRecords.jsx`

**🖱️ Buttons / Visual Triggers:**
- navigate('/admin/bills')}>Record Payment
- toast.success('Payment ledger downloaded as PDF!', 'Ledger Downloaded')}>📥 Downl...

**⚡ Event Handlers (User Actions):**
- `onClick: () => toast.success('Payment ledger downloaded as PDF!', 'Ledger Downloaded')`
- `onClick: () => navigate('/admin/bills')`

---

### 📄 Node: `ProveOwnership`
**Path:** `pages/admin/ProveOwnership.jsx`

**💾 Internal State (Variables):**
- `answers`
- `proofImage`
- `isSubmitting`

**🖱️ Buttons / Visual Triggers:**
- {isSubmitting ? 'Submitting...' : 'Submit Claim for Review'}

**⚡ Event Handlers (User Actions):**
- `onChange: e => handleChange('uniqueMarks', e.target.value)`
- `onChange: e => handleChange('notes', e.target.value)`
- `onSubmit: handleSubmit`
- `onChange: e => handleChange('description', e.target.value)`
- `onClick: () => fileInputRef.current?.click()`
- `onChange: handleProofUpload`
- `onChange: e => handleChange('lostLocation', e.target.value)`

---

### 📄 Node: `ReportFoundItem`
**Path:** `pages/admin/ReportFoundItem.jsx`

**💾 Internal State (Variables):**
- `formData`
- `images`
- `errorMsg`
- `isSubmitting`

**🖱️ Buttons / Visual Triggers:**
- {isSubmitting ? 'Submitting...' : 'Submit Report'}
- removeImage(i)}>×

**⚡ Event Handlers (User Actions):**
- `onChange: e => handleChange('color', e.target.value)`
- `onClick: () => removeImage(i)`
- `onChange: handleFileChange`
- `onChange: e => handleChange('dateFound', e.target.value)`
- `onSubmit: handleSubmit`
- `onChange: e => handleChange('contact', e.target.value)`
- `onChange: e => handleChange('description', e.target.value)`
- `onChange: e => handleChange('locationFound', e.target.value)`
- `onClick: () => fileInputRef.current?.click()`
- `onChange: e => handleChange('category', e.target.value)`

---

### 📄 Node: `ReportLostItem`
**Path:** `pages/admin/ReportLostItem.jsx`

**💾 Internal State (Variables):**
- `formData`
- `images`
- `errorMsg`
- `isSubmitting`

**🖱️ Buttons / Visual Triggers:**
- {isSubmitting ? 'Submitting...' : 'Submit Report'}
- removeImage(i)}>×
- Use my current location

**⚡ Event Handlers (User Actions):**
- `onChange: e => handleChange('color', e.target.value)`
- `onClick: () => removeImage(i)`
- `onChange: handleFileChange`
- `onChange: e => handleChange('dateLost', e.target.value)`
- `onChange: e => handleChange('locationLost', e.target.value)`
- `onSubmit: handleSubmit`
- `onClick: handleUseLocation`
- `onChange: e => handleChange('description', e.target.value)`
- `onChange: e => handleChange('contact', e.target.value)`
- `onChange: e => handleChange('consent', e.target.checked)`
- `onClick: () => fileInputRef.current?.click()`
- `onChange: e => handleChange('category', e.target.value)`

---

### 📄 Node: `ReportsAnalytics`
**Path:** `pages/admin/ReportsAnalytics.jsx`

---

### 📄 Node: `ResidentManagement`
**Path:** `pages/admin/ResidentManagement.jsx`

**💾 Internal State (Variables):**
- `residents`
- `modalOpen`
- `editingResident`
- `form`

**🖱️ Buttons / Visual Triggers:**
- setModalOpen(false)}>Cancel
- openEditModal(resident)}>Edit
- {editingResident ? 'Save Changes' : 'Add Resident'}
- + Add Resident

**⚡ Event Handlers (User Actions):**
- `onChange: e => setForm({ ...form, email: e.target.value`
- `onClick: () => openEditModal(resident)`
- `onChange: e => setForm({ ...form, flat: e.target.value`
- `onChange: e => setForm({ ...form, phone: e.target.value`
- `onSubmit: handleSubmit`
- `onClick: openAddModal`
- `onChange: e => setForm({ ...form, status: e.target.value`
- `onChange: e => setForm({ ...form, name: e.target.value`
- `onClick: () => setModalOpen(false)`

---

### 📄 Node: `ShopManagement`
**Path:** `pages/admin/ShopManagement.jsx`

---

### 📄 Node: `SmartSurveillance`
**Path:** `pages/admin/SmartSurveillance.jsx`

**💾 Internal State (Variables):**
- `image`
- `scanning`
- `result`
- `allViolations`
- `violationType`
- `filter`
- `showAlert`
- `customType`

**🖱️ Buttons / Visual Triggers:**
- handleDelete(v.id)}                                     style={{                ...
- {scanning ? "🔍 AI Scanning..." : "Run AI Scan"}
- Download Report (CSV)

**⚡ Event Handlers (User Actions):**
- `onChange: (e) =>
                        setImage(URL.createObjectURL(e.target.files[0]))`
- `onChange: (e) => setCustomType(e.target.value)`
- `onClick: () => handleDelete(v.id)`
- `onClick: downloadCSV`
- `onChange: (e) => setFilter(e.target.value)`
- `onClick: handleScan`
- `onChange: (e) => setViolationType(e.target.value)`

---

### 📄 Node: `StaffManagement`
**Path:** `pages/admin/StaffManagement.jsx`

**💾 Internal State (Variables):**
- `staffList`
- `modalOpen`
- `editingStaff`
- `form`

**🖱️ Buttons / Visual Triggers:**
- {editingStaff ? 'Save Changes' : 'Add Employee'}
- setModalOpen(false)}>Cancel
- + Add Employee
- openEditModal(staff)}>Edit

**⚡ Event Handlers (User Actions):**
- `onChange: e => setForm({ ...form, salary: e.target.value`
- `onClick: () => openEditModal(staff)`
- `onSubmit: handleSubmit`
- `onClick: openAddModal`
- `onChange: e => setForm({ ...form, role: e.target.value`
- `onChange: e => setForm({ ...form, status: e.target.value`
- `onChange: e => setForm({ ...form, name: e.target.value`
- `onClick: () => setModalOpen(false)`

---

### 📄 Node: `TracebackMatches`
**Path:** `pages/admin/TracebackMatches.jsx`

**💾 Internal State (Variables):**
- `db`
- `activeTab`
- `loading`
- `searchTerm`
- `qrToken`
- `qrVisible`
- `quizOpen`
- `activeMatch`
- `quizAnswers`
- `proofImage`
- `approving`

**🖱️ Buttons / Visual Triggers:**
- setQrVisible(false)}>
- Submit Claim for Review
- setQrVisible(false)}>Close
- handleReportRedirect('found')}>                          Report Found
- handleReportRedirect('lost')}>                          Report Lost
- setQuizOpen(false)}>
- setSearchTerm('')} className="btn-icon">
- setQuizOpen(false)}>Cancel

**⚡ Event Handlers (User Actions):**
- `onClick: () => setSearchTerm('')`
- `onChange: e => setQuizAnswers({ ...quizAnswers, [`q${idx + 1`
- `onClick: () => document.getElementById('proof-upload')?.click()`
- `onClick: () => handleReportRedirect('found')`
- `onChange: e => setSearchTerm(e.target.value)`
- `onClick: () => setQuizOpen(false)`
- `onChange: handleProofUpload`
- `onClick: () => setQrVisible(false)`
- `onSubmit: submitClaim`
- `onClick: () => handleReportRedirect('lost')`

---

### 📄 Node: `VehicleVisitorLog`
**Path:** `pages/admin/VehicleVisitorLog.jsx`

**🖱️ Buttons / Visual Triggers:**
- View All Logs
- Export List

---

### 📄 Node: `VisitorAnalytics`
**Path:** `pages/admin/VisitorAnalytics.jsx`

**💾 Internal State (Variables):**
- `dateRange`

**🖱️ Buttons / Visual Triggers:**
- setDateRange(range)}                 style={{                   padding: '8px 14...
- e.target.style.background = '#4338CA'}             onMouseLeave={(e) => e.target...

**⚡ Event Handlers (User Actions):**
- `onClick: handleExportCSV`
- `onClick: () => setDateRange(range)`

---

### 📄 Node: `ClaimsPanel`
**Path:** `pages/admin/traceback/ClaimsPanel.jsx`

**💾 Internal State (Variables):**
- `rejectId`
- `rejectReason`

**🖱️ Buttons / Visual Triggers:**
- handleReject(claim.id)} disabled={!rejectReason.trim()} style={{ flex: 1 }}>    ...
- { setRejectId(null); setRejectReason(''); }} style={{ flex: 1 }}>Cancel
- onApproveClaim(claim.id)} disabled={approving} className="btn-gradient" style={{...
- setRejectId(claim.id)} style={{ flex: 1, justifyContent: 'center' }}>           ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => setRejectId(claim.id)`
- `onChange: e => setRejectReason(e.target.value)`
- `onClick: () => { setRejectId(null); setRejectReason('');`
- `onClick: () => onApproveClaim(claim.id)`
- `onClick: () => handleReject(claim.id)`

---

### 📄 Node: `FoundItems`
**Path:** `pages/admin/traceback/FoundItems.jsx`

**🖱️ Buttons / Visual Triggers:**
- + Report Found Item

**⚡ Event Handlers (User Actions):**
- `onClick: onReportFound`

---

### 📄 Node: `LostItems`
**Path:** `pages/admin/traceback/LostItems.jsx`

**🖱️ Buttons / Visual Triggers:**
- + Report Lost Item
- Under Review
- onInitiateClaim(match)} style={{ width: '100%', fontSize: 12, padding: 6, justif...
- toggleMatches(item.id)} style={{ justifyContent: 'center' }}>                   ...
- onViewToken(match.claim_token || match.id)} style={{ width: '100%', fontSize: 12...

**⚡ Event Handlers (User Actions):**
- `onClick: () => onViewToken(match.claim_token || match.id)`
- `onClick: onReportLost`
- `onClick: () => onInitiateClaim(match)`
- `onClick: () => toggleMatches(item.id)`

---

### 📄 Node: `TracebackAnalytics`
**Path:** `pages/admin/traceback/TracebackAnalytics.jsx`

---

### 📄 Node: `TracebackStatusBadge`
**Path:** `pages/admin/traceback/TracebackStatusBadge.jsx`

---

### 📄 Node: `TracebackTabs`
**Path:** `pages/admin/traceback/TracebackTabs.jsx`

**🖱️ Buttons / Visual Triggers:**
- onTabChange(tab.id)}                 >                     {tab.icon}           ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => onTabChange(tab.id)`

---

## Resident Pages
===
### 📄 Node: `Announcements`
**Path:** `pages/resident/Announcements.jsx`

---

### 📄 Node: `AssetBooking`
**Path:** `pages/resident/AssetBooking.jsx`

**💾 Internal State (Variables):**
- `selectedAsset`
- `showBookingModal`
- `activeTab`
- `bookingForm`

**🖱️ Buttons / Visual Triggers:**
- setShowBookingModal(false)}>
- setActiveTab('available')}         >           📦 Available Assets
- setActiveTab('past')}         >           ✅ Past Bookings ({pastBookings.length}...
- handleAssetSelect(asset)}               >                  Request Booking
- setActiveTab('upcoming')}         >           📅 Upcoming Bookings ({upcomingBook...
- Submit Request
- setShowBookingModal(false)}>                 Cancel

**⚡ Event Handlers (User Actions):**
- `onClick: () => setActiveTab('past')`
- `onChange: (e) => handleBookingChange('timeSlot', e.target.value)`
- `onClick: handleSubmitBooking`
- `onClick: () => setShowBookingModal(false)`
- `onClick: () => setActiveTab('upcoming')`
- `onClick: () => handleAssetSelect(asset)`
- `onChange: (e) => handleBookingChange('date', e.target.value)`
- `onChange: (e) => handleBookingChange('purpose', e.target.value)`
- `onClick: () => setActiveTab('available')`

---

### 📄 Node: `Complaints`
**Path:** `pages/resident/Complaints.jsx`

**🖱️ Buttons / Visual Triggers:**
- Submit Complaint

**⚡ Event Handlers (User Actions):**
- `onSubmit: handleSubmit`

---

### 📄 Node: `Documents`
**Path:** `pages/resident/Documents.jsx`

**🖱️ Buttons / Visual Triggers:**
- handleDownload(doc.title)}                                 type="button"        ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => handleDownload(doc.title)`

---

### 📄 Node: `Emergency`
**Path:** `pages/resident/Emergency.jsx`

**🖱️ Buttons / Visual Triggers:**
- Call Now
- Call Manager

---

### 📄 Node: `MyBills`
**Path:** `pages/resident/MyBills.jsx`

**🖱️ Buttons / Visual Triggers:**
- window.location.href = '/resident/history'} variant="outline">View History
- Download Invoice
- Pay Now via UPI

**⚡ Event Handlers (User Actions):**
- `onClick: () => window.location.href = '/resident/history'`

---

### 📄 Node: `MyFines`
**Path:** `pages/resident/MyFines.jsx`

**💾 Internal State (Variables):**
- `violations`
- `score`

**🖱️ Buttons / Visual Triggers:**
- handlePay(v.id)}                                 style={{                       ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => handlePay(v.id)`

---

### 📄 Node: `PayMaintenance`
**Path:** `pages/resident/PayMaintenance.jsx`

**💾 Internal State (Variables):**
- `selectedMethod`

**📝 Form Inputs (Data Collected):**
- `method`

**🖱️ Buttons / Visual Triggers:**
- Pay ₹{totalAmount.toLocaleString()}

**⚡ Event Handlers (User Actions):**
- `onChange: (e) => setSelectedMethod(e.target.value)`

---

### 📄 Node: `PaymentHistory`
**Path:** `pages/resident/PaymentHistory.jsx`

---

### 📄 Node: `ResidentDashboard`
**Path:** `pages/resident/ResidentDashboard.jsx`

**🖱️ Buttons / Visual Triggers:**
- navigate(action.route)} style={{ padding: '12px 22px', fontSize: 14 }}>         ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => navigate(action.route)`

---

### 📄 Node: `ResidentSettings`
**Path:** `pages/resident/ResidentSettings.jsx`

**💾 Internal State (Variables):**
- `profileData`
- `notificationSettings`
- `paymentPreferences`
- `securityData`
- `modals`
- `passwordForm`

**🖱️ Buttons / Visual Triggers:**
- Yes, Logout All
- Cancel
- Save Payment Settings
- setModals(prev => ({ ...prev, changePassword: false }))}             >          ...
- handlePaymentChange('autoReminder', !paymentPreferences.autoReminder)}          ...
- Change Password
- Save Profile
- setModals(prev => ({ ...prev, logoutDevices: true }))}             >            ...
- setModals(prev => ({ ...prev, logoutDevices: false }))}             >           ...
- Save Preferences

**⚡ Event Handlers (User Actions):**
- `onChange: (e) => handleProfileChange('phone', e.target.value)`
- `onClick: handleLogoutAllDevices`
- `onChange: (e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value`
- `onClick: () => setModals(prev => ({ ...prev, changePassword: false`
- `onClick: handleSavePaymentPreferences`
- `onClick: () => setModals(prev => ({ ...prev, logoutDevices: true`
- `onChange: () => handleNotificationChange('complaintUpdates')`
- `onChange: () => handleNotificationChange('maintenanceNotifications')`
- `onChange: (e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value`
- `onChange: (e) => handleProfileChange('name', e.target.value)`
- `onClick: () => handlePaymentChange('autoReminder', !paymentPreferences.autoReminder)`
- `onChange: (e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value`
- `onClick: openChangePasswordModal`
- `onClick: handleSaveNotifications`
- `onClick: handleChangePassword`
- `onClick: () => setModals(prev => ({ ...prev, logoutDevices: false`
- `onClick: handleSaveProfile`
- `onChange: (e) => handlePaymentChange('defaultPaymentMode', e.target.value)`
- `onChange: (e) => handleProfileChange('email', e.target.value)`
- `onChange: () => handleNotificationChange('announcementNotifications')`

---

### 📄 Node: `Staff`
**Path:** `pages/resident/Staff.jsx`

**🖱️ Buttons / Visual Triggers:**
- Call {person.name.split(' ')[0]}

---

### 📄 Node: `Vehicles`
**Path:** `pages/resident/Vehicles.jsx`

---

### 📄 Node: `VisitorPreApproval`
**Path:** `pages/resident/VisitorPreApproval.jsx`

**💾 Internal State (Variables):**
- `activeTab`
- `showForm`
- `copiedCode`
- `formData`
- `errors`
- `submitting`
- `successMessage`

**📝 Form Inputs (Data Collected):**
- `visitorName`
- `mobileNumber`
- `purpose`
- `endTime`
- `dateOfVisit`
- `vehicleNumber`
- `startTime`

**🖱️ Buttons / Visual Triggers:**
- setSuccessMessage(null)}             className="close-message"             aria-...
- {               setActiveTab('create');               setShowForm(false);       ...
- {                       setShowForm(false);                       setFormData({ ...
- setActiveTab('history')}           >             History
- handleCopyCode(approval.approvalCode)}                           title="Copy cod...
- {submitting ? 'Creating...' : 'Generate Approval Code'}
- setActiveTab('expired')}           >                          Expired           ...
- cancelApproval(approval.id)}                       >                            ...
- setShowForm(true)}                 >                                      Create...
- setActiveTab('upcoming')}           >                          Upcoming         ...

**⚡ Event Handlers (User Actions):**
- `onClick: () => cancelApproval(approval.id)`
- `onClick: () => setSuccessMessage(null)`
- `onClick: () => {
                      setShowForm(false);
                      setFormData({
                        v...`
- `onChange: handleInputChange`
- `onClick: () => handleCopyCode(approval.approvalCode)`
- `onSubmit: handleSubmit`
- `onClick: () => setActiveTab('upcoming')`
- `onClick: () => {
              setActiveTab('create');
              setShowForm(false);`
- `onClick: () => setActiveTab('history')`
- `onClick: () => setShowForm(true)`
- `onClick: () => setActiveTab('expired')`

---

### 📄 Node: `Visitors`
**Path:** `pages/resident/Visitors.jsx`

---

## Security Pages
===
### 📄 Node: `Deliveries`
**Path:** `pages/security/Deliveries.jsx`

---

### 📄 Node: `EmergencyLogs`
**Path:** `pages/security/EmergencyLogs.jsx`

**💾 Internal State (Variables):**
- `drillModal`
- `drills`

**🖱️ Buttons / Visual Triggers:**
- setDrillModal(true)}>🔔 Trigger Manual Drill
- setDrillModal(false)}>Cancel
- Start Drill

**⚡ Event Handlers (User Actions):**
- `onClick: () => setDrillModal(true)`
- `onClick: handleDrill`
- `onClick: () => setDrillModal(false)`

---

### 📄 Node: `PreApprovedVisitors`
**Path:** `pages/security/PreApprovedVisitors.jsx`

**💾 Internal State (Variables):**
- `searchType`
- `searchQuery`
- `searchResults`
- `selectedApproval`

**🖱️ Buttons / Visual Triggers:**
- Search
- handleMarkExit(approval.id)}                             >                      ...
- handleMarkEntry(approval.id)}                             disabled={timeStatus?....

**⚡ Event Handlers (User Actions):**
- `onChange: (e) => setSearchQuery(e.target.value)`
- `onClick: () => handleMarkExit(approval.id)`
- `onChange: (e) => {
                  setSearchType(e.target.value);
                  setSearchQuery('');
              ...`
- `onClick: () => {
                          setSelectedApproval(approval);
                          setSearchQuery(appro...`
- `onSubmit: handleSearch`
- `onClick: () => handleMarkEntry(approval.id)`

---

### 📄 Node: `SecurityDashboard`
**Path:** `pages/security/SecurityDashboard.jsx`

**💾 Internal State (Variables):**
- `emergencyModal`

**🖱️ Buttons / Visual Triggers:**
- setEmergencyModal(false)}>Cancel
- setEmergencyModal(true)}>🚨 Emergency Alert
- navigate('/security/visitors')}>Add Visitor Entry
- navigate('/security/vehicles')}>Add Vehicle Entry
- navigate('/security/deliveries')}>Log Delivery
- Send Alert

**⚡ Event Handlers (User Actions):**
- `onClick: () => navigate('/security/deliveries')`
- `onClick: () => navigate('/security/visitors')`
- `onClick: handleEmergencyAlert`
- `onClick: () => setEmergencyModal(false)`
- `onClick: () => setEmergencyModal(true)`
- `onClick: () => navigate('/security/vehicles')`

---

### 📄 Node: `SecuritySettings`
**Path:** `pages/security/SecuritySettings.jsx`

**💾 Internal State (Variables):**
- `profileData`
- `accessControls`
- `alertSettings`

**🖱️ Buttons / Visual Triggers:**
- handleAlertToggle('emergencySound')}             >
- Cancel
- handleAlertToggle('nightMode')}             >
- Save Access Controls
- handleAccessToggle('visitorEntry')}             >
- Save Profile
- handleAccessToggle('vehicleEntry')}             >
- Save Alert Settings
- handleAccessToggle('deliveryEntry')}             >

**⚡ Event Handlers (User Actions):**
- `onChange: (e) => handleProfileChange('name', e.target.value)`
- `onChange: (e) => handleProfileChange('shiftStart', e.target.value)`
- `onClick: () => handleAlertToggle('emergencySound')`
- `onClick: handleSaveAccessControls`
- `onClick: () => handleAccessToggle('deliveryEntry')`
- `onChange: (e) => handleProfileChange('shiftEnd', e.target.value)`
- `onClick: () => handleAlertToggle('nightMode')`
- `onClick: handleSaveProfile`
- `onClick: () => handleAccessToggle('vehicleEntry')`
- `onChange: (e) => handleProfileChange('contact', e.target.value)`
- `onClick: () => handleAccessToggle('visitorEntry')`
- `onClick: handleSaveAlerts`

---

### 📄 Node: `StaffAttendance`
**Path:** `pages/security/StaffAttendance.jsx`

**💾 Internal State (Variables):**
- `location`
- `image`
- `status`
- `stream`
- `scanningFace`

**🖱️ Buttons / Visual Triggers:**
- Capture Photo
- Mark Attendance
- Open Camera
- Get Live Location

**⚡ Event Handlers (User Actions):**
- `onClick: capturePhoto`
- `onClick: markAttendance`
- `onClick: getLocation`
- `onClick: startCamera`

---

### 📄 Node: `VehicleEntry`
**Path:** `pages/security/VehicleEntry.jsx`

**🖱️ Buttons / Visual Triggers:**
- Log Entry

---

### 📄 Node: `VisitorEntry`
**Path:** `pages/security/VisitorEntry.jsx`

**💾 Internal State (Variables):**
- `visitors`
- `form`

**🖱️ Buttons / Visual Triggers:**
- ✅ Check In Visitor
- handleCheckOut(v.id)}>Check Out

**⚡ Event Handlers (User Actions):**
- `onChange: e => setForm({ ...form, flat: e.target.value`
- `onClick: () => handleCheckOut(v.id)`
- `onChange: e => setForm({ ...form, purpose: e.target.value`
- `onSubmit: handleCheckIn`
- `onChange: e => setForm({ ...form, name: e.target.value`

---

## Marketplace Module
===
### 📄 Node: `ConfirmModal`
**Path:** `modules/marketplace/components/ConfirmModal.jsx`

**🖱️ Buttons / Visual Triggers:**
- {confirmText}
- {cancelText}

**⚡ Event Handlers (User Actions):**
- `onClick: onConfirm`
- `onClick: onCancel`
- `onClick: e => e.stopPropagation()`

---

### 📄 Node: `EmptyState`
**Path:** `modules/marketplace/components/EmptyState.jsx`

---

### 📄 Node: `ImageCarousel`
**Path:** `modules/marketplace/components/ImageCarousel.jsx`

**💾 Internal State (Variables):**
- `current`

**🖱️ Buttons / Visual Triggers:**
- goTo(current + 1)} aria-label="Next image">
- goTo(current - 1)} aria-label="Previous image">

**⚡ Event Handlers (User Actions):**
- `onClick: () => goTo(current + 1)`
- `onClick: () => goTo(i)`
- `onClick: () => goTo(current - 1)`

---

### 📄 Node: `ListingCard`
**Path:** `modules/marketplace/components/ListingCard.jsx`

**🖱️ Buttons / Visual Triggers:**
- Enquire
- View Details

**⚡ Event Handlers (User Actions):**
- `onClick: handleCardClick`
- `onClick: handleEnquire`
- `onClick: handleFav`

---

### 📄 Node: `SkeletonLoader`
**Path:** `modules/marketplace/components/SkeletonLoader.jsx`

---

### 📄 Node: `StatusBadge`
**Path:** `modules/marketplace/components/StatusBadge.jsx`

---

### 📄 Node: `MarketplaceProvider`
**Path:** `modules/marketplace/context/MarketplaceContext.jsx`

**📥 Props (Data Passed In):**
- `children`

---

### 📄 Node: `AdminMarketplace`
**Path:** `modules/marketplace/pages/AdminMarketplace.jsx`

**💾 Internal State (Variables):**
- `activeTab`
- `deleteId`
- `showEnquiries`

**🖱️ Buttons / Visual Triggers:**
- handleSold(l.id)} title="Mark Sold">
- handleRented(l.id)} title="Mark Rented">
- setActiveTab(key)}>                         {key.charAt(0).toUpperCase() + key.s...
- handleFeatured(l.id)} title="Toggle Featured">
- setDeleteId(l.id)} title="Delete">
- handleReject(l.id)} title="Reject">
- navigate('/admin/marketplace/pending')}>                          Pending ({tabF...
- setShowEnquiries(!showEnquiries)}>                         📩 Enquiries ({state.e...
- handleApprove(l.id)} title="Approve">
- navigate('/admin/marketplace/analytics')}>                         📊 Analytics
- { deleteEnquiry(e.id); toast.success('Enquiry deleted'); }}>
- navigate(`/resident/marketplace/${l.id}`)} title="View">

**⚡ Event Handlers (User Actions):**
- `onClick: () => { deleteEnquiry(e.id); toast.success('Enquiry deleted');`
- `onClick: () => navigate('/admin/marketplace/pending')`
- `onClick: () => setShowEnquiries(!showEnquiries)`
- `onClick: () => setDeleteId(l.id)`
- `onClick: () => navigate('/admin/marketplace/analytics')`
- `onClick: () => handleApprove(l.id)`
- `onClick: () => handleReject(l.id)`
- `onClick: () => handleFeatured(l.id)`
- `onClick: () => setActiveTab(key)`
- `onClick: () => handleSold(l.id)`
- `onClick: () => handleRented(l.id)`
- `onClick: () => navigate(`/resident/marketplace/${l.id`

---

### 📄 Node: `CreateListing`
**Path:** `modules/marketplace/pages/CreateListing.jsx`

**💾 Internal State (Variables):**
- `form`
- `errors`

**🖱️ Buttons / Visual Triggers:**
- handleChange('type', 'rent')}>🔑 Rent
- handleSubmit('draft')}> Save Draft
- Clear Form
- removeImage(i)} aria-label="Remove image">×
- handleChange('type', 'sale')}>🏷️ Sale
- handleSubmit('pending')}> Submit for Approval

**⚡ Event Handlers (User Actions):**
- `onChange: e => handleChange('parking', e.target.value)`
- `onChange: e => handleChange('flatNumber', e.target.value)`
- `onChange: e => handleChange('description', e.target.value)`
- `onChange: e => handleChange('floor', e.target.value)`
- `onChange: e => handleChange('area', e.target.value)`
- `onClick: () => removeImage(i)`
- `onChange: e => handleChange('deposit', e.target.value)`
- `onClick: clearForm`
- `onChange: e => handleChange('bathrooms', e.target.value)`
- `onChange: e => handleChange('furnishing', e.target.value)`
- `onChange: e => handleChange('price', e.target.value)`
- `onChange: handleImageUpload`
- `onChange: e => handleChange('rent', e.target.value)`
- `onClick: () => handleChange('type', 'rent')`
- `onClick: () => fileInputRef.current?.click()`
- `onClick: () => handleSubmit('pending')`
- `onClick: () => handleSubmit('draft')`
- `onChange: e => handleChange('bedrooms', e.target.value)`
- `onClick: () => handleChange('type', 'sale')`

---

### 📄 Node: `Favorites`
**Path:** `modules/marketplace/pages/Favorites.jsx`

**🖱️ Buttons / Visual Triggers:**
- navigate('/resident/marketplace')}>Browse Marketplace
- Clear All
- navigate('/resident/marketplace')}>                          Back

**⚡ Event Handlers (User Actions):**
- `onClick: clearAll`
- `onClick: () => navigate('/resident/marketplace')`

---

### 📄 Node: `ListingDetails`
**Path:** `modules/marketplace/pages/ListingDetails.jsx`

**💾 Internal State (Variables):**
- `showEnquiryModal`
- `showVisitModal`
- `showWithdrawModal`
- `enquiryForm`
- `visitForm`
- `showFeaturesModal`
- `customFeatures`
- `newFeature`

**🖱️ Buttons / Visual Triggers:**
- setShowWithdrawModal(true)}> Withdraw Listing
- setShowVisitModal(false)}>✕
- setShowVisitModal(false)}>Cancel
- setShowFeaturesModal(false)}>✕
- setShowFeaturesModal(false)}>Cancel
- setShowFeaturesModal(true)} style={{ marginTop: 8 }}>                           ...
- setShowVisitModal(true)}> Schedule Visit
- Schedule
- Save Features
- setShowEnquiryModal(false)}>✕
- Send Enquiry
- removeFeature(idx)} style={{ color: '#ef4444', padding: 4 }}>
- Share Listing
- navigate('/resident/marketplace')} style={{ marginBottom: 20 }}>                ...
- navigate('/resident/marketplace')}>Browse Marketplace
- setShowEnquiryModal(false)}>Cancel
- { toggleFavorite(id); toast.success(isFav ? 'Removed from favorites' : 'Added to...
- setShowEnquiryModal(true)}> Send Enquiry

**⚡ Event Handlers (User Actions):**
- `onClick: () => setShowFeaturesModal(true)`
- `onClick: () => setShowFeaturesModal(false)`
- `onChange: e => setNewFeature({ ...newFeature, label: e.target.value`
- `onClick: () => navigate('/resident/marketplace')`
- `onChange: e => setVisitForm(prev => ({ ...prev, name: e.target.value`
- `onClick: handleEnquiry`
- `onClick: handleVisit`
- `onChange: e => setEnquiryForm(prev => ({ ...prev, message: e.target.value`
- `onClick: handleShare`
- `onClick: () => setShowVisitModal(false)`
- `onClick: () => removeFeature(idx)`
- `onClick: saveCustomFeatures`
- `onChange: e => setVisitForm(prev => ({ ...prev, date: e.target.value`
- `onClick: e => e.stopPropagation()`
- `onChange: e => setVisitForm(prev => ({ ...prev, time: e.target.value`
- `onClick: () => { toggleFavorite(id); toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');`
- `onChange: e => setEnquiryForm(prev => ({ ...prev, phone: e.target.value`
- `onChange: e => setVisitForm(prev => ({ ...prev, notes: e.target.value`
- `onClick: handleAddFeature`
- `onChange: e => setNewFeature({ ...newFeature, value: e.target.value`
- `onChange: e => setEnquiryForm(prev => ({ ...prev, name: e.target.value`
- `onClick: () => setShowEnquiryModal(true)`
- `onClick: () => setShowWithdrawModal(true)`
- `onClick: () => setShowEnquiryModal(false)`
- `onClick: () => setShowVisitModal(true)`

---

### 📄 Node: `MarketplaceAnalytics`
**Path:** `modules/marketplace/pages/MarketplaceAnalytics.jsx`

**🖱️ Buttons / Visual Triggers:**
- navigate('/admin/marketplace')}>                      Back

**⚡ Event Handlers (User Actions):**
- `onClick: () => navigate('/admin/marketplace')`

---

### 📄 Node: `MarketplaceList`
**Path:** `modules/marketplace/pages/MarketplaceList.jsx`

**💾 Internal State (Variables):**
- `loading`
- `searchTerm`
- `debouncedSearch`
- `typeFilter`
- `bedroomFilter`
- `furnishingFilter`
- `priceRange`
- `sortBy`
- `page`
- `customBedroom`
- `customFurnishing`
- `customPrice`

**🖱️ Buttons / Visual Triggers:**
- navigate('/resident/marketplace/favorites')}>❤️ Favorites ({state.favorites.leng...
- navigate('/resident/marketplace/my-listings')}>📋 My Listings
- { setCustomPrice(false); setPriceRange('all'); }} title="Back to list">
- { setCustomBedroom(false); setBedroomFilter('all'); }} title="Back to list">
- setPage(p => p + 1)}>›
- setTypeFilter('rent')}>Rent
- navigate('/resident/marketplace/create')}> List Property
- setDebouncedSearch(searchTerm)}>Search
- setPage(p => p - 1)}>‹
- setTypeFilter('all')}>All
- setPage(i + 1)}>{i + 1}
- { setCustomFurnishing(false); setFurnishingFilter('all'); }} title="Back to list...
- setTypeFilter('sale')}>Buy

**⚡ Event Handlers (User Actions):**
- `onClick: () => setPage(p => p + 1)`
- `onChange: e => setSearchTerm(e.target.value)`
- `onChange: e => setSortBy(e.target.value)`
- `onClick: () => setDebouncedSearch(searchTerm)`
- `onClick: () => navigate('/resident/marketplace/my-listings')`
- `onChange: e => setFurnishingFilter(e.target.value || 'all')`
- `onChange: e => { if (e.target.value === '__custom__') { setCustomBedroom(true); setBedroomFilter('all');`
- `onClick: () => setTypeFilter('all')`
- `onClick: () => setPage(i + 1)`
- `onClick: () => { setCustomPrice(false); setPriceRange('all');`
- `onClick: () => setTypeFilter('sale')`
- `onClick: () => { setCustomBedroom(false); setBedroomFilter('all');`
- `onClick: () => navigate('/resident/marketplace/favorites')`
- `onClick: () => setTypeFilter('rent')`
- `onClick: () => { setCustomFurnishing(false); setFurnishingFilter('all');`
- `onChange: e => setBedroomFilter(e.target.value || 'all')`
- `onClick: () => setPage(p => p - 1)`
- `onChange: e => { if (e.target.value === '__custom__') { setCustomFurnishing(true); setFurnishingFilter('all');`
- `onChange: e => { if (e.target.value === '__custom__') { setCustomPrice(true); setPriceRange('all');`
- `onChange: e => setPriceRange(e.target.value || 'all')`
- `onClick: () => navigate('/resident/marketplace/create')`

---

### 📄 Node: `MyListings`
**Path:** `modules/marketplace/pages/MyListings.jsx`

**💾 Internal State (Variables):**
- `deleteId`
- `editPriceId`
- `editPrice`
- `activeTab`

**🖱️ Buttons / Visual Triggers:**
- setDeleteId(listing.id)}>
- navigate('/resident/marketplace')}> Back
- navigate('/resident/marketplace/create')}> Create Listing
- setEditPriceId(null)}>✕
- navigate('/resident/marketplace/create')}> New Listing
- navigate(`/resident/marketplace/${listing.id}`)}>
- setActiveTab(key)}>                         {key === 'all' ? 'All' : key.charAt(...
- handlePriceUpdate(listing.id)}>Save

**⚡ Event Handlers (User Actions):**
- `onClick: () => setDeleteId(listing.id)`
- `onClick: () => setEditPriceId(null)`
- `onClick: () => handlePriceUpdate(listing.id)`
- `onClick: () => navigate('/resident/marketplace')`
- `onClick: () => { setEditPriceId(listing.id); setEditPrice(listing.type === 'sale' ? listing.price : listing.rent);`
- `onClick: () => setActiveTab(key)`
- `onClick: () => navigate(`/resident/marketplace/${listing.id`
- `onChange: e => setEditPrice(e.target.value)`
- `onClick: () => navigate('/resident/marketplace/create')`

---

### 📄 Node: `PendingListings`
**Path:** `modules/marketplace/pages/PendingListings.jsx`

**🖱️ Buttons / Visual Triggers:**
- { rejectListing(l.id); toast.warning(`Flat ${l.flatNumber} rejected`); }}> Rejec...
- navigate('/admin/marketplace')}> Back
- { approveListing(l.id); toast.success(`Flat ${l.flatNumber} approved`); }}> Appr...
- Approve All
- navigate(`/resident/marketplace/${l.id}`)}>

**⚡ Event Handlers (User Actions):**
- `onClick: () => { rejectListing(l.id); toast.warning(`Flat ${l.flatNumber`
- `onClick: handleApproveAll`
- `onClick: () => { approveListing(l.id); toast.success(`Flat ${l.flatNumber`
- `onClick: () => navigate(`/resident/marketplace/${l.id`
- `onClick: () => navigate('/admin/marketplace')`

---

### 📄 Node: `helpers.js`
**Path:** `modules/marketplace/utils/helpers.js`

---

## Shared Pages
===
### 📄 Node: `Admin`
**Path:** `pages/Admin.jsx`

**💾 Internal State (Variables):**
- `isSidebarOpen`

**🖱️ Buttons / Visual Triggers:**
- Generate Report
- ⚠️ View Emergency Logs
- Logout
- View All
- + Add New Resident
- 📢 Create Announcement

**⚡ Event Handlers (User Actions):**
- `onClick: toggleSidebar`
- `onClick: () => setIsSidebarOpen(false)`

---

### 📄 Node: `AdminLayout`
**Path:** `pages/AdminLayout.jsx`

**💾 Internal State (Variables):**
- `sidebarOpen`
- `profileOpen`

**🖱️ Buttons / Visual Triggers:**
- setProfileOpen(!profileOpen)}>Admin ▾
- {isDarkMode ?  : }
- setSidebarOpen(!sidebarOpen)}>☰

**⚡ Event Handlers (User Actions):**
- `onClick: () => setProfileOpen(!profileOpen)`
- `onClick: (e) => { e.preventDefault(); setProfileOpen(false); navigate('/admin/settings');`
- `onClick: () => setSidebarOpen(!sidebarOpen)`
- `onClick: (e) => { e.preventDefault(); setProfileOpen(false); toast.info('Navigate to Settings to change your password', ...`
- `onClick: handleLogout`
- `onClick: toggleDarkMode`

---

### 📄 Node: `LandingPage`
**Path:** `pages/LandingPage.jsx`

---

### 📄 Node: `ResidentLayout`
**Path:** `pages/ResidentLayout.jsx`

**💾 Internal State (Variables):**
- `profileOpen`
- `sidebarOpen`

**🖱️ Buttons / Visual Triggers:**
- setProfileOpen(!profileOpen)}>Resident ▾
- {isDarkMode ?  : }
- setSidebarOpen(!sidebarOpen)}>☰

**⚡ Event Handlers (User Actions):**
- `onClick: (e) => { e.preventDefault(); setProfileOpen(false); navigate('/resident/settings');`
- `onClick: () => setProfileOpen(!profileOpen)`
- `onClick: () => setSidebarOpen(!sidebarOpen)`
- `onClick: (e) => { e.preventDefault(); setProfileOpen(false); toast.info('Navigate to Settings to change your password', ...`
- `onClick: handleLogout`
- `onClick: toggleDarkMode`

---

### 📄 Node: `SecurityLayout`
**Path:** `pages/SecurityLayout.jsx`

**💾 Internal State (Variables):**
- `profileOpen`

**🖱️ Buttons / Visual Triggers:**
- {isDarkMode ?  : }
- setProfileOpen(!profileOpen)}>Security ▾

**⚡ Event Handlers (User Actions):**
- `onClick: (e) => { e.preventDefault(); setProfileOpen(false); navigate('/security/settings');`
- `onClick: toggleDarkMode`
- `onClick: handleLogout`
- `onClick: () => setProfileOpen(!profileOpen)`

---
