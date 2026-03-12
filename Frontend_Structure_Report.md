# Frontend Architecture & Detailed Structure
This document outlines every page, the buttons/actions available, form inputs, and backend API interactions found in the frontend codebase.

## Admin Portal
---
### Page/Component: `pages/admin/SmartSurveillance.jsx`
**Buttons / Actions:**
- Download Report (CSV)
- handleDelete(v.id)}                                     style={{                                    ...
- {scanning ? "🔍 AI Scanning..." : "Run AI Scan"}


### Page/Component: `pages/admin/VehicleVisitorLog.jsx`
**Buttons / Actions:**
- View All Logs
- Export List


### Page/Component: `pages/admin/FinderClaimReview.jsx`
**Buttons / Actions:**
- updateClaimStatus('rejected', rejectReason)} disabled={!rejectReason.trim()} style={{ flex: 1 }}>   ...
- updateClaimStatus('approved')} style={{ flex: 1 }}>                                  Approve Claim
- setShowRejectForm(false)} style={{ flex: 1 }}>Cancel
- setShowRejectForm(true)} style={{ flex: 1 }}>                                  Reject
- navigate(getTracebackPath(location.pathname, 'matches'))}>Back to Dashboard
- updateClaimStatus('info_requested')} style={{ flex: 1 }}>                                  Request M...


### Page/Component: `pages/admin/AdminSettings.jsx`
**Buttons / Actions:**
- openEditExpenseModal(category)}                         title="Edit"                       >
- deleteExpense(category.id)}                         title="Delete"                       >
- Save Maintenance Settings
- Add Category
- Save Changes
- Save Society Profile
- handleMaintenanceChange('autoBillGeneration', !maintenanceSettings.autoBillGeneration)}             ...
- Export All Residents
- Export Announcements
- handlePaymentChange('enableOnlinePayments')}             >
- Add Admin User
- Maintenance Collection Report
- Outstanding Dues
- Export Complaints
- Save Lost & Found Settings
- setModals(prev => ({ ...prev, addExpense: false }))}             >               Cancel
- handleLostFoundChange('enableFeature')}             >
- setModals(prev => ({ ...prev, editExpense: false }))}             >               Cancel
- Save Payment Settings
- Payment Summary
- Export Vehicles & Visitors
- Expense Report


### Page/Component: `pages/admin/EventsAnnouncements.jsx`
**Buttons / Actions:**
- setCreateModal(true)}>+ Create New
- setCreateModal(false)}>Cancel
- {                             setAnnouncements([]);                             toast.success('All n...
- toast.info(`Showing all ${events.length} events`, 'All Events')}>View All
- Create {createType === 'event' ? 'Event' : 'Notice'}


### Page/Component: `pages/admin/StaffManagement.jsx`
**Buttons / Actions:**
- openEditModal(staff)}>Edit
- + Add Employee
- setModalOpen(false)}>Cancel
- {editingStaff ? 'Save Changes' : 'Add Employee'}


### Page/Component: `pages/admin/ComplaintManagement.jsx`
**Buttons / Actions:**
- Close
- handleViewDetails(complaint)}                                                 >
- }                     >                         Export CSV
- }                     >                         Advanced
- Update Status
- handleDelete(complaint.id)}                                                 >


### Page/Component: `pages/admin/AdminDashboard.jsx`
**Buttons / Actions:**
- navigate('/admin/payments')}>View All →
- navigate('/admin/complaints')}>View All →
- 📥 Download Report


### Page/Component: `pages/admin/AssetBooking.jsx`
**Buttons / Actions:**
- handleOpenAssetModal(asset)}                         title="Edit"                       >
- {editingAsset ? 'Update Asset' : 'Create Asset'}
- setShowAssetModal(false)}>
- handleOpenAssetModal()}             >                Add New Asset
- handleApproveBooking(request.id)}                         >                            Approve
- setShowAssetModal(false)}>                 Cancel
- setActiveTab('history')}         >           📊 Booking History
- setActiveTab('requests')}         >           📋 Booking Requests ({bookingRequests.filter((b) => b.s...
- handleRejectBooking(request.id)}                         >                            Reject
- setActiveTab('assets')}         >           🏢 Manage Assets
- handleDeleteAsset(asset.id)}                         title="Delete"                       >


### Page/Component: `pages/admin/VisitorAnalytics.jsx`
**Buttons / Actions:**
- e.target.style.background = '#4338CA'}             onMouseLeave={(e) => e.target.style.background = ...
- setDateRange(range)}                 style={{                   padding: '8px 14px',                ...


### Page/Component: `pages/admin/ProveOwnership.jsx`
**Buttons / Actions:**
- {isSubmitting ? 'Submitting...' : 'Submit Claim for Review'}


### Page/Component: `pages/admin/LostAndFoundTraceback.jsx`
**Buttons / Actions:**
- navigate(getTracebackPath(location.pathname, 'report-lost'))}>                             I Lost So...
- navigate(getTracebackPath(location.pathname, 'report-found'))}>                             I Found ...


### Page/Component: `pages/admin/EmergencyManagement.jsx`
**Buttons / Actions:**
- handleResolve(alert.id)}                                                 >                          ...
- Download Report
- Send Alert


### Page/Component: `pages/admin/BillManagement.jsx`
**Buttons / Actions:**
- Generate Bill
- setModalOpen(false)}>Cancel
- setViewModal(bill)}>View
- setModalOpen(true)}>+ Generate New Bill
- toast.success('Billing report exported as CSV!', 'Export Complete')}>📥 Export Report


### Page/Component: `pages/admin/ExpenseTracker.jsx`
**Buttons / Actions:**
- openEditModal(expense)}>Edit
- + Add Expense
- {editingExpense ? 'Save Changes' : 'Add Expense'}
- setModalOpen(false)}>Cancel


### Page/Component: `pages/admin/AttendanceLogs.jsx`
**Buttons / Actions:**
- Clear Old Records


### Page/Component: `pages/admin/ReportFoundItem.jsx`
**Buttons / Actions:**
- {isSubmitting ? 'Submitting...' : 'Submit Report'}
- removeImage(i)}>×


### Page/Component: `pages/admin/ResidentManagement.jsx`
**Buttons / Actions:**
- openEditModal(resident)}>Edit
- + Add Resident
- setModalOpen(false)}>Cancel
- {editingResident ? 'Save Changes' : 'Add Resident'}


### Page/Component: `pages/admin/DeliveryLog.jsx`
**Buttons / Actions:**
- handleNotify(delivery)}>Notify
- setModalOpen(false)}>Cancel
- Log Delivery
- setModalOpen(true)}>+ Log Delivery


### Page/Component: `pages/admin/TracebackMatches.jsx`
**Buttons / Actions:**
- setQuizOpen(false)}>
- setQrVisible(false)}>Close
- handleReportRedirect('lost')}>                          Report Lost
- handleReportRedirect('found')}>                          Report Found
- setQuizOpen(false)}>Cancel
- setQrVisible(false)}>
- setSearchTerm('')} className="btn-icon">
- Submit Claim for Review


### Page/Component: `pages/admin/PaymentRecords.jsx`
**Buttons / Actions:**
- toast.success('Payment ledger downloaded as PDF!', 'Ledger Downloaded')}>📥 Download Ledger
- navigate('/admin/bills')}>Record Payment


### Page/Component: `pages/admin/ReportLostItem.jsx`
**Buttons / Actions:**
- {isSubmitting ? 'Submitting...' : 'Submit Report'}
- removeImage(i)}>×
- Use my current location


### Page/Component: `pages/admin/CommitteeManagement.jsx`
**Buttons / Actions:**
- Update Role
- setRoleModal(true)}>🔄 Update Roles
- setViewMember(member)}>View
- setRoleModal(false)}>Cancel


### Page/Component: `pages/admin/DocumentRepo.jsx`
**Buttons / Actions:**
- setModalOpen(true)}>+ Upload Document
- handleDownload(doc)}>Download
- setModalOpen(false)}>Cancel
- Upload


### Page/Component: `pages/admin/traceback/TracebackTabs.jsx`
**Buttons / Actions:**
- onTabChange(tab.id)}                 >                     {tab.icon}                     {tab.label...


### Page/Component: `pages/admin/traceback/ClaimsPanel.jsx`
**Buttons / Actions:**
- onApproveClaim(claim.id)} disabled={approving} className="btn-gradient" style={{ flex: 1, justifyCon...
- { setRejectId(null); setRejectReason(''); }} style={{ flex: 1 }}>Cancel
- setRejectId(claim.id)} style={{ flex: 1, justifyContent: 'center' }}>                               ...
- handleReject(claim.id)} disabled={!rejectReason.trim()} style={{ flex: 1 }}>                        ...


### Page/Component: `pages/admin/traceback/FoundItems.jsx`
**Buttons / Actions:**
- + Report Found Item


### Page/Component: `pages/admin/traceback/LostItems.jsx`
**Buttons / Actions:**
- onInitiateClaim(match)} style={{ width: '100%', fontSize: 12, padding: 6, justifyContent: 'center' }...
- Under Review
- toggleMatches(item.id)} style={{ justifyContent: 'center' }}>                                       ...
- + Report Lost Item
- onViewToken(match.claim_token || match.id)} style={{ width: '100%', fontSize: 12, justifyContent: 'c...


## Resident Portal
---
### Page/Component: `pages/resident/Complaints.jsx`
**Buttons / Actions:**
- Submit Complaint


### Page/Component: `pages/resident/Documents.jsx`
**Buttons / Actions:**
- handleDownload(doc.title)}                                 type="button"                            ...


### Page/Component: `pages/resident/AssetBooking.jsx`
**Buttons / Actions:**
- handleAssetSelect(asset)}               >                  Request Booking
- Submit Request
- setActiveTab('upcoming')}         >           📅 Upcoming Bookings ({upcomingBookings.length})
- setActiveTab('past')}         >           ✅ Past Bookings ({pastBookings.length})
- setActiveTab('available')}         >           📦 Available Assets
- setShowBookingModal(false)}>
- setShowBookingModal(false)}>                 Cancel


### Page/Component: `pages/resident/Staff.jsx`
**Buttons / Actions:**
- Call {person.name.split(' ')[0]}


### Page/Component: `pages/resident/ResidentDashboard.jsx`
**Buttons / Actions:**
- navigate(action.route)} style={{ padding: '12px 22px', fontSize: 14 }}>                         {act...


### Page/Component: `pages/resident/PayMaintenance.jsx`
**Buttons / Actions:**
- Pay ₹{totalAmount.toLocaleString()}

**Form Inputs (Data collected):**
- `method`


### Page/Component: `pages/resident/ResidentSettings.jsx`
**Buttons / Actions:**
- Cancel
- setModals(prev => ({ ...prev, changePassword: false }))}             >               Cancel
- handlePaymentChange('autoReminder', !paymentPreferences.autoReminder)}             >
- Yes, Logout All
- Save Profile
- Change Password
- setModals(prev => ({ ...prev, logoutDevices: true }))}             >               Logout All
- Save Payment Settings
- Save Preferences
- setModals(prev => ({ ...prev, logoutDevices: false }))}             >               Cancel


### Page/Component: `pages/resident/MyFines.jsx`
**Buttons / Actions:**
- handlePay(v.id)}                                 style={{                                     margin...


### Page/Component: `pages/resident/VisitorPreApproval.jsx`
**Buttons / Actions:**
- {submitting ? 'Creating...' : 'Generate Approval Code'}
- setActiveTab('upcoming')}           >                          Upcoming             {upcomingApprova...
- handleCopyCode(approval.approvalCode)}                           title="Copy code"                  ...
- setSuccessMessage(null)}             className="close-message"             aria-label="Close"       ...
- setActiveTab('expired')}           >                          Expired             {expiredApprovals....
- {                       setShowForm(false);                       setFormData({                     ...
- {               setActiveTab('create');               setShowForm(false);             }}           >...
- cancelApproval(approval.id)}                       >                                                ...
- setShowForm(true)}                 >                                      Create Pre-Approval
- setActiveTab('history')}           >             History

**Form Inputs (Data collected):**
- `dateOfVisit`
- `visitorName`
- `purpose`
- `vehicleNumber`
- `startTime`
- `endTime`
- `mobileNumber`


### Page/Component: `pages/resident/MyBills.jsx`
**Buttons / Actions:**
- Pay Now via UPI
- window.location.href = '/resident/history'} variant="outline">View History
- Download Invoice


### Page/Component: `pages/resident/Emergency.jsx`
**Buttons / Actions:**
- Call Manager
- Call Now


## Security Portal
---
### Page/Component: `pages/security/SecurityDashboard.jsx`
**Buttons / Actions:**
- navigate('/security/deliveries')}>Log Delivery
- navigate('/security/visitors')}>Add Visitor Entry
- Send Alert
- setEmergencyModal(false)}>Cancel
- setEmergencyModal(true)}>🚨 Emergency Alert
- navigate('/security/vehicles')}>Add Vehicle Entry


### Page/Component: `pages/security/EmergencyLogs.jsx`
**Buttons / Actions:**
- setDrillModal(false)}>Cancel
- Start Drill
- setDrillModal(true)}>🔔 Trigger Manual Drill


### Page/Component: `pages/security/StaffAttendance.jsx`
**Buttons / Actions:**
- Capture Photo
- Get Live Location
- Open Camera
- Mark Attendance


### Page/Component: `pages/security/VisitorEntry.jsx`
**Buttons / Actions:**
- handleCheckOut(v.id)}>Check Out
- ✅ Check In Visitor


### Page/Component: `pages/security/SecuritySettings.jsx`
**Buttons / Actions:**
- handleAccessToggle('visitorEntry')}             >
- Cancel
- Save Profile
- Save Access Controls
- Save Alert Settings
- handleAlertToggle('emergencySound')}             >
- handleAccessToggle('deliveryEntry')}             >
- handleAccessToggle('vehicleEntry')}             >
- handleAlertToggle('nightMode')}             >


### Page/Component: `pages/security/VehicleEntry.jsx`
**Buttons / Actions:**
- Log Entry


### Page/Component: `pages/security/PreApprovedVisitors.jsx`
**Buttons / Actions:**
- handleMarkEntry(approval.id)}                             disabled={timeStatus?.color !== 'valid' &&...
- Search
- handleMarkExit(approval.id)}                             >                                          ...


## Marketplace Module
---
### Page/Component: `modules/marketplace/components/ImageCarousel.jsx`
**Buttons / Actions:**
- goTo(current - 1)} aria-label="Previous image">
- goTo(current + 1)} aria-label="Next image">


### Page/Component: `modules/marketplace/components/ListingCard.jsx`
**Buttons / Actions:**
- View Details
- Enquire


### Page/Component: `modules/marketplace/components/ConfirmModal.jsx`
**Buttons / Actions:**
- {cancelText}
- {confirmText}


### Page/Component: `modules/marketplace/pages/MarketplaceAnalytics.jsx`
**Buttons / Actions:**
- navigate('/admin/marketplace')}>                      Back


### Page/Component: `modules/marketplace/pages/MyListings.jsx`
**Buttons / Actions:**
- navigate('/resident/marketplace')}> Back
- handlePriceUpdate(listing.id)}>Save
- setActiveTab(key)}>                         {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + k...
- navigate(`/resident/marketplace/${listing.id}`)}>
- setEditPriceId(null)}>✕
- navigate('/resident/marketplace/create')}> New Listing
- setDeleteId(listing.id)}>
- navigate('/resident/marketplace/create')}> Create Listing


### Page/Component: `modules/marketplace/pages/Favorites.jsx`
**Buttons / Actions:**
- Clear All
- navigate('/resident/marketplace')}>                          Back
- navigate('/resident/marketplace')}>Browse Marketplace


### Page/Component: `modules/marketplace/pages/PendingListings.jsx`
**Buttons / Actions:**
- navigate('/admin/marketplace')}> Back
- { rejectListing(l.id); toast.warning(`Flat ${l.flatNumber} rejected`); }}> Reject
- navigate(`/resident/marketplace/${l.id}`)}>
- { approveListing(l.id); toast.success(`Flat ${l.flatNumber} approved`); }}> Approve
- Approve All


### Page/Component: `modules/marketplace/pages/ListingDetails.jsx`
**Buttons / Actions:**
- setShowVisitModal(false)}>✕
- Share Listing
- setShowEnquiryModal(false)}>Cancel
- Send Enquiry
- { toggleFavorite(id); toast.success(isFav ? 'Removed from favorites' : 'Added to favorites'); }}>   ...
- Schedule
- navigate('/resident/marketplace')} style={{ marginBottom: 20 }}>                  Back to Marketplac...
- setShowVisitModal(false)}>Cancel
- setShowEnquiryModal(true)}> Send Enquiry
- setShowFeaturesModal(true)} style={{ marginTop: 8 }}>                                      Add Custo...
- setShowFeaturesModal(false)}>Cancel
- navigate('/resident/marketplace')}>Browse Marketplace
- Save Features
- removeFeature(idx)} style={{ color: '#ef4444', padding: 4 }}>
- setShowEnquiryModal(false)}>✕
- setShowWithdrawModal(true)}> Withdraw Listing
- setShowVisitModal(true)}> Schedule Visit
- setShowFeaturesModal(false)}>✕


### Page/Component: `modules/marketplace/pages/AdminMarketplace.jsx`
**Buttons / Actions:**
- setDeleteId(l.id)} title="Delete">
- handleApprove(l.id)} title="Approve">
- setActiveTab(key)}>                         {key.charAt(0).toUpperCase() + key.slice(1)} {items.leng...
- handleRented(l.id)} title="Mark Rented">
- handleReject(l.id)} title="Reject">
- navigate(`/resident/marketplace/${l.id}`)} title="View">
- setShowEnquiries(!showEnquiries)}>                         📩 Enquiries ({state.enquiries.length})
- { deleteEnquiry(e.id); toast.success('Enquiry deleted'); }}>
- handleSold(l.id)} title="Mark Sold">
- handleFeatured(l.id)} title="Toggle Featured">
- navigate('/admin/marketplace/pending')}>                          Pending ({tabFilters.pending.lengt...
- navigate('/admin/marketplace/analytics')}>                         📊 Analytics


### Page/Component: `modules/marketplace/pages/MarketplaceList.jsx`
**Buttons / Actions:**
- navigate('/resident/marketplace/favorites')}>❤️ Favorites ({state.favorites.length})
- setTypeFilter('sale')}>Buy
- setDebouncedSearch(searchTerm)}>Search
- { setCustomBedroom(false); setBedroomFilter('all'); }} title="Back to list">
- setTypeFilter('rent')}>Rent
- navigate('/resident/marketplace/my-listings')}>📋 My Listings
- { setCustomFurnishing(false); setFurnishingFilter('all'); }} title="Back to list">
- navigate('/resident/marketplace/create')}> List Property
- setPage(i + 1)}>{i + 1}
- setPage(p => p - 1)}>‹
- { setCustomPrice(false); setPriceRange('all'); }} title="Back to list">
- setTypeFilter('all')}>All
- setPage(p => p + 1)}>›


### Page/Component: `modules/marketplace/pages/CreateListing.jsx`
**Buttons / Actions:**
- handleChange('type', 'sale')}>🏷️ Sale
- Clear Form
- handleSubmit('draft')}> Save Draft
- removeImage(i)} aria-label="Remove image">×
- handleChange('type', 'rent')}>🔑 Rent
- handleSubmit('pending')}> Submit for Approval


## Main/Shared Pages
---
### Page/Component: `pages/SecurityLayout.jsx`
**Buttons / Actions:**
- {isDarkMode ?  : }
- setProfileOpen(!profileOpen)}>Security ▾


### Page/Component: `pages/AdminLayout.jsx`
**Buttons / Actions:**
- setProfileOpen(!profileOpen)}>Admin ▾
- {isDarkMode ?  : }
- setSidebarOpen(!sidebarOpen)}>☰


### Page/Component: `pages/Admin.jsx`
**Buttons / Actions:**
- + Add New Resident
- View All
- Generate Report
- ⚠️ View Emergency Logs
- Logout
- 📢 Create Announcement


### Page/Component: `pages/ResidentLayout.jsx`
**Buttons / Actions:**
- {isDarkMode ?  : }
- setProfileOpen(!profileOpen)}>Resident ▾
- setSidebarOpen(!sidebarOpen)}>☰

