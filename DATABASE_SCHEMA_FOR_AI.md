
# SMS-Aksh — Database Architecture & Supabase Setup

This document is designed for AI Assistants (like Gemini) to understand the database structure, frontend connections, and backend routes. It also contains the exact SQL queries required to set up the Supabase database.

## 1. Supabase Setup Instructions (For the Developer)
1. **Create Project**: Go to Supabase.com and create a new project.
2. **Configure Auth**: Go to Authentication > Providers > Email. Disable "Confirm email" to allow instant logins during testing.
3. **Run SQL Scripts**: Copy the SQL queries from Section 3 and Section 4 of this document and run them in the Supabase SQL Editor.
4. **Create Buckets**: Go to Storage and create the following PUBLIC buckets: `surveillance-images`, `lost-found-images`, `proof-uploads`, `marketplace-images`, `attendance-images`, `documents`.
5. **Get Keys**: Go to Project Settings > API. Copy the Project URL, anon key, and service_role key into your `backend/.env` file.

## 2. Table-to-Application Mapping (For AI Reference)

### Authentication & Profiles
* **`profiles`**: Stores user roles (admin, resident, security). 
  * Frontend: `Login.jsx`, `AdminSettings.jsx`, `ResidentManagement.jsx`
  * Backend: `routes/auth.js`, `routes/admin/settings.js`
* **`residents`**: Physical flat details linked to profiles.
  * Frontend: `ResidentManagement.jsx`
  * Backend: `routes/admin/residents.js`

### Society Configuration
* **`society_settings`, `maintenance_settings`, `payment_settings`, `notification_settings`, `lost_found_settings`, `expense_categories`**
  * Frontend: `AdminSettings.jsx`
  * Backend: `routes/admin/settings.js`

### Financials
* **`bills` & `payments`**: Maintenance billing and transactions.
  * Frontend: `BillManagement.jsx` (Admin), `MyBills.jsx`, `PayMaintenance.jsx`
  * Backend: `routes/admin/bills.js`, `routes/resident/bills.js`
* **`fines`**: Penalties.
  * Frontend: `MyFines.jsx`
  * Backend: `routes/resident/fines.js`
* **`expenses`**: Society outgoings.
  * Frontend: `ExpenseTracker.jsx`
  * Backend: `routes/admin/expenses.js`

### Facility & Service Management
* **`complaints`**: Resident issues.
  * Frontend: `ComplaintManagement.jsx`, `Complaints.jsx`
  * Backend: `routes/admin/complaints.js`, `routes/resident/complaints.js`
* **`assets` & `asset_bookings`**: Clubhouse/Gym booking.
  * Frontend: `AssetBooking.jsx`
  * Backend: `routes/admin/assetBooking.js`, `routes/resident/assetBooking.js`
* **`documents`**: Circulars.
  * Frontend: `DocumentRepo.jsx`, `Documents.jsx`
  * Backend: `routes/admin/documents.js`, `routes/resident/documents.js`
* **`events`**: Announcements.
  * Frontend: `EventsAnnouncements.jsx`, `Announcements.jsx`
  * Backend: `routes/admin/events.js`, `routes/resident/announcements.js`
* **`committee_members`**:
  * Frontend: `CommitteeManagement.jsx`
  * Backend: `routes/admin/committee.js`

### Security & Logs
* **`staff` & `attendance_logs`**:
  * Frontend: `StaffManagement.jsx`, `StaffAttendance.jsx`, `AttendanceLogs.jsx`
  * Backend: `routes/admin/staff.js`, `routes/security/attendance.js`
* **`visitor_logs` & `vehicle_logs` & `visitor_preapprovals`**:
  * Frontend: `VehicleVisitorLog.jsx`, `VisitorEntry.jsx`, `VisitorPreApproval.jsx`
  * Backend: `routes/security/visitorEntry.js`, `routes/security/vehicleEntry.js`, `routes/resident/visitorPreApproval.js`
* **`deliveries`**:
  * Frontend: `DeliveryLog.jsx`, `Deliveries.jsx`
  * Backend: `routes/admin/deliveries.js`, `routes/security/deliveries.js`
* **`emergency_alerts`**:
  * Frontend: `EmergencyManagement.jsx`, `Emergency.jsx`, `EmergencyLogs.jsx`
  * Backend: `routes/resident/emergency.js`, `routes/admin/emergency.js`
* **`violations`**:
  * Frontend: `SmartSurveillance.jsx`
  * Backend: `routes/admin/surveillance.js`

### Traceback (Lost & Found)
* **`lost_items`, `found_items`, `traceback_matches`, `claims`**:
  * Frontend: `ReportLostItem.jsx`, `ReportFoundItem.jsx`, `TracebackMatches.jsx`, `ProveOwnership.jsx`
  * Backend: `routes/traceback.js`

### Marketplace
* **`listings`, `enquiries`, `favorites`, `marketplace_visits`**:
  * Frontend: `CreateListing.jsx`, `MarketplaceList.jsx`, `ListingDetails.jsx`
  * Backend: `routes/admin/marketplace.js`, `routes/resident/marketplace.js`

### Core System
* **`notifications`**:
  * Frontend: `NotificationPanel.jsx`
  * Backend: `routes/notifications.js`

---

## 3. SQL Schema Queries (Run this first)
```sql
-- ============================================
-- SMS-Aksh Society Management System
-- Complete Supabase SQL Schema
-- ============================================
-- Run this in your Supabase SQL Editor.
-- Order matters: tables with no foreign keys first.
-- ============================================

-- ─── 1. PROFILES ────────────────────────────
-- Connected to: Login.jsx, AdminSettings.jsx (adminUsers), ResidentManagement.jsx
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'resident', 'security')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. SOCIETY SETTINGS ────────────────────
-- Connected to: AdminSettings.jsx → societyProfile state
CREATE TABLE society_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'My Society',
  address TEXT,
  registration_no TEXT,
  email TEXT,
  phone TEXT,
  total_flats INTEGER DEFAULT 0,
  blocks TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. MAINTENANCE SETTINGS ────────────────
-- Connected to: AdminSettings.jsx → maintenanceSettings state
CREATE TABLE maintenance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_amount NUMERIC(10,2) DEFAULT 0,
  due_date INTEGER DEFAULT 10,
  late_fee NUMERIC(10,2) DEFAULT 0,
  auto_bill_generation BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. PAYMENT SETTINGS ────────────────────
-- Connected to: AdminSettings.jsx → paymentSettings state
CREATE TABLE payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enable_online_payments BOOLEAN DEFAULT true,
  upi BOOLEAN DEFAULT true,
  card BOOLEAN DEFAULT false,
  net_banking BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 5. NOTIFICATION SETTINGS ───────────────
-- Connected to: AdminSettings.jsx → notificationSettings state
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_reminders BOOLEAN DEFAULT true,
  maintenance_reminders BOOLEAN DEFAULT true,
  complaint_updates BOOLEAN DEFAULT true,
  resident_updates BOOLEAN DEFAULT true,
  announcement_notifications BOOLEAN DEFAULT true,
  emergency_alerts BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 6. LOST & FOUND SETTINGS ───────────────
-- Connected to: AdminSettings.jsx → lostFoundSettings state
CREATE TABLE lost_found_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enable_feature BOOLEAN DEFAULT true,
  require_approval BOOLEAN DEFAULT true,
  enable_disputes BOOLEAN DEFAULT false,
  pin_expiry INTEGER DEFAULT 72,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 7. EXPENSE CATEGORIES ─────────────────
-- Connected to: AdminSettings.jsx → expenseCategories state
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  budget NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 8. RESIDENTS ───────────────────────────
-- Connected to: ResidentManagement.jsx
CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  flat TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'tenant')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 9. BILLS ───────────────────────────────
-- Connected to: BillManagement.jsx, MyBills.jsx
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 10. PAYMENTS ───────────────────────────
-- Connected to: PaymentRecords.jsx, PayMaintenance.jsx, PaymentHistory.jsx
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  method TEXT CHECK (method IN ('upi', 'card', 'netbanking', 'cash', 'cheque')),
  transaction_id TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  paid_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 11. COMPLAINTS ─────────────────────────
-- Connected to: ComplaintManagement.jsx, Complaints.jsx (Resident)
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 12. STAFF ──────────────────────────────
-- Connected to: StaffManagement.jsx, Staff.jsx (Resident)
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  salary NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  shift TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 13. COMMITTEE MEMBERS ──────────────────
-- Connected to: CommitteeManagement.jsx
CREATE TABLE committee_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  since DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 14. EXPENSES ───────────────────────────
-- Connected to: ExpenseTracker.jsx
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  vendor TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 15. EVENTS & ANNOUNCEMENTS ─────────────
-- Connected to: EventsAnnouncements.jsx, Announcements.jsx (Resident)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('event', 'notice')),
  title TEXT NOT NULL,
  message TEXT,
  date DATE,
  time TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 16. DOCUMENTS ──────────────────────────
-- Connected to: DocumentRepo.jsx, Documents.jsx (Resident)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  size TEXT,
  file_url TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 17. DELIVERIES ─────────────────────────
-- Connected to: DeliveryLog.jsx, Deliveries.jsx (Security)
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flat TEXT NOT NULL,
  courier TEXT,
  type TEXT DEFAULT 'package',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'collected')),
  date DATE DEFAULT CURRENT_DATE,
  logged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 18. VISITOR LOGS ───────────────────────
-- Connected to: VehicleVisitorLog.jsx, VisitorEntry.jsx
CREATE TABLE visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name TEXT NOT NULL,
  phone TEXT,
  flat TEXT,
  purpose TEXT,
  vehicle_number TEXT,
  photo_url TEXT,
  check_in TIMESTAMPTZ DEFAULT now(),
  check_out TIMESTAMPTZ,
  logged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'checked-in' CHECK (status IN ('checked-in', 'checked-out'))
);

-- ─── 19. VEHICLE LOGS ───────────────────────
-- Connected to: VehicleVisitorLog.jsx, VehicleEntry.jsx
CREATE TABLE vehicle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT,
  owner_name TEXT,
  flat TEXT,
  entry_time TIMESTAMPTZ DEFAULT now(),
  exit_time TIMESTAMPTZ,
  logged_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'in' CHECK (status IN ('in', 'out'))
);

-- ─── 20. ASSETS ─────────────────────────────
-- Connected to: AssetBooking.jsx (Admin & Resident)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER,
  charges NUMERIC(10,2) DEFAULT 0,
  booking_rules TEXT,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 21. ASSET BOOKINGS ─────────────────────
-- Connected to: AssetBooking.jsx (Admin & Resident)
CREATE TABLE asset_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TEXT,
  purpose TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 22. EMERGENCY ALERTS ───────────────────
-- Connected to: EmergencyManagement.jsx, Emergency.jsx (Resident), EmergencyLogs.jsx (Security)
CREATE TABLE emergency_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT,
  reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 23. VIOLATIONS (Smart Surveillance) ────
-- Connected to: SmartSurveillance.jsx
CREATE TABLE violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  image_url TEXT,
  detected_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed'))
);

-- ─── 24. ATTENDANCE LOGS ────────────────────
-- Connected to: AttendanceLogs.jsx, StaffAttendance.jsx
CREATE TABLE attendance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  staff_name TEXT,
  date DATE DEFAULT CURRENT_DATE,
  check_in TIMESTAMPTZ DEFAULT now(),
  check_out TIMESTAMPTZ,
  photo_url TEXT,
  location_lat NUMERIC,
  location_lng NUMERIC,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 25. VISITOR PRE-APPROVALS ──────────────
-- Connected to: VisitorPreApproval.jsx, PreApprovedVisitors.jsx
CREATE TABLE visitor_preapprovals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  mobile_number TEXT,
  purpose TEXT,
  date_of_visit DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  vehicle_number TEXT,
  approval_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  entry_time TIMESTAMPTZ,
  exit_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 26. FINES ──────────────────────────────
-- Connected to: MyFines.jsx
CREATE TABLE fines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
  issued_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- ─── 27. LOST ITEMS ─────────────────────────
-- Connected to: ReportLostItem.jsx, LostAndFoundTraceback.jsx
CREATE TABLE lost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  description TEXT,
  color TEXT,
  date_lost DATE,
  location_lost TEXT,
  contact TEXT,
  images TEXT[], -- array of storage URLs
  consent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'claimed', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 28. FOUND ITEMS ────────────────────────
-- Connected to: ReportFoundItem.jsx, LostAndFoundTraceback.jsx
CREATE TABLE found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  description TEXT,
  color TEXT,
  date_found DATE,
  location_found TEXT,
  contact TEXT,
  images TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'claimed', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 29. TRACEBACK MATCHES ──────────────────
-- Connected to: TracebackMatches.jsx
CREATE TABLE traceback_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_item_id UUID REFERENCES lost_items(id) ON DELETE CASCADE,
  found_item_id UUID REFERENCES found_items(id) ON DELETE CASCADE,
  score NUMERIC(5,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 30. CLAIMS ─────────────────────────────
-- Connected to: ProveOwnership.jsx, FinderClaimReview.jsx, ClaimsPanel.jsx
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES traceback_matches(id) ON DELETE CASCADE,
  claimant_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  lost_item_id UUID REFERENCES lost_items(id) ON DELETE CASCADE,
  found_item_id UUID REFERENCES found_items(id) ON DELETE CASCADE,
  description TEXT,
  unique_marks TEXT,
  lost_location TEXT,
  notes TEXT,
  proof_image_url TEXT,
  claim_token TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'info_requested')),
  admin_comment TEXT,
  reject_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 31. MARKETPLACE LISTINGS ───────────────
-- Connected to: CreateListing.jsx, MarketplaceList.jsx, ListingDetails.jsx, MyListings.jsx
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  flat_number TEXT,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  title TEXT,
  description TEXT,
  price NUMERIC(12,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area NUMERIC(10,2),
  furnishing TEXT CHECK (furnishing IN ('furnished', 'semi-furnished', 'unfurnished')),
  images TEXT[],
  features TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'sold', 'rented', 'rejected', 'withdrawn')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 32. MARKETPLACE ENQUIRIES ──────────────
-- Connected to: ListingDetails.jsx, AdminMarketplace.jsx
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 33. MARKETPLACE FAVORITES ──────────────
-- Connected to: Favorites.jsx, MarketplaceList.jsx, ListingDetails.jsx
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resident_id, listing_id)
);

-- ─── 34. NOTIFICATIONS ──────────────────────
-- Connected to: NotificationPanel.jsx
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 35. VISITS (Marketplace) ───────────────
-- Connected to: ListingDetails.jsx → Schedule Visit
CREATE TABLE marketplace_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

```

---

## 4. Row Level Security Policies (Run this second)
```sql
-- ============================================
-- SMS-Aksh — Row Level Security Policies
-- ============================================
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- These policies ensure data isolation per role.
-- ============================================

-- ─── Enable RLS on all tables ───────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE society_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE committee_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_preapprovals ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE traceback_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_visits ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════
-- HELPER: function to get current user's role
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ═══════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (get_user_role() = 'admin');
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Service role full access" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════
-- SOCIETY, MAINTENANCE, PAYMENT, NOTIFICATION, LOST_FOUND SETTINGS
-- Admin-only read/write
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON society_settings
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access" ON maintenance_settings
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access" ON payment_settings
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access" ON notification_settings
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access" ON lost_found_settings
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Admin full access" ON expense_categories
  FOR ALL USING (get_user_role() = 'admin');

-- ═══════════════════════════════════════════
-- RESIDENTS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON residents
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Residents can view own record" ON residents
  FOR SELECT USING (profile_id = auth.uid());

-- ═══════════════════════════════════════════
-- BILLS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON bills
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Residents see own bills" ON bills
  FOR SELECT USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- PAYMENTS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON payments
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Residents see own payments" ON payments
  FOR SELECT USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );
CREATE POLICY "Residents can insert payment" ON payments
  FOR INSERT WITH CHECK (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- COMPLAINTS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON complaints
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Residents see own complaints" ON complaints
  FOR SELECT USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );
CREATE POLICY "Residents can submit complaint" ON complaints
  FOR INSERT WITH CHECK (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- STAFF
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON staff
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "All authenticated can view staff" ON staff
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════
-- COMMITTEE MEMBERS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON committee_members
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Authenticated can view committee" ON committee_members
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════
-- EXPENSES
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON expenses
  FOR ALL USING (get_user_role() = 'admin');

-- ═══════════════════════════════════════════
-- EVENTS / ANNOUNCEMENTS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON events
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Authenticated can view events" ON events
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════
-- DOCUMENTS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON documents
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Authenticated can view documents" ON documents
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════
-- DELIVERIES
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON deliveries
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Security full access" ON deliveries
  FOR ALL USING (get_user_role() = 'security');

-- ═══════════════════════════════════════════
-- VISITOR LOGS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON visitor_logs
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Security full access" ON visitor_logs
  FOR ALL USING (get_user_role() = 'security');

-- ═══════════════════════════════════════════
-- VEHICLE LOGS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON vehicle_logs
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Security full access" ON vehicle_logs
  FOR ALL USING (get_user_role() = 'security');

-- ═══════════════════════════════════════════
-- ASSETS & BOOKINGS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON assets
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Authenticated can view assets" ON assets
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access" ON asset_bookings
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Residents can view own bookings" ON asset_bookings
  FOR SELECT USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );
CREATE POLICY "Residents can insert booking" ON asset_bookings
  FOR INSERT WITH CHECK (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- EMERGENCY ALERTS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON emergency_alerts
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Security full access" ON emergency_alerts
  FOR ALL USING (get_user_role() = 'security');
CREATE POLICY "Residents can insert emergency" ON emergency_alerts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can view emergencies" ON emergency_alerts
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════
-- VIOLATIONS (Surveillance)
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON violations
  FOR ALL USING (get_user_role() = 'admin');

-- ═══════════════════════════════════════════
-- ATTENDANCE LOGS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON attendance_logs
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Security full access" ON attendance_logs
  FOR ALL USING (get_user_role() = 'security');

-- ═══════════════════════════════════════════
-- VISITOR PRE-APPROVALS
-- ═══════════════════════════════════════════
CREATE POLICY "Admin can view all" ON visitor_preapprovals
  FOR SELECT USING (get_user_role() = 'admin');
CREATE POLICY "Security full access" ON visitor_preapprovals
  FOR ALL USING (get_user_role() = 'security');
CREATE POLICY "Residents manage own preapprovals" ON visitor_preapprovals
  FOR ALL USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- FINES
-- ═══════════════════════════════════════════
CREATE POLICY "Admin full access" ON fines
  FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY "Residents see own fines" ON fines
  FOR SELECT USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );

-- ═══════════════════════════════════════════
-- LOST & FOUND ITEMS, MATCHES, CLAIMS
-- ═══════════════════════════════════════════
CREATE POLICY "Authenticated can insert lost" ON lost_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can view lost" ON lost_items
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access" ON lost_items
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Authenticated can insert found" ON found_items
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can view found" ON found_items
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access" ON found_items
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Authenticated can view matches" ON traceback_matches
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access" ON traceback_matches
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Authenticated can insert claim" ON claims
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Claimant can view own claims" ON claims
  FOR SELECT USING (claimant_id = auth.uid());
CREATE POLICY "Admin full access" ON claims
  FOR ALL USING (get_user_role() = 'admin');

-- ═══════════════════════════════════════════
-- MARKETPLACE (Listings, Enquiries, Favorites, Visits)
-- ═══════════════════════════════════════════
CREATE POLICY "Authenticated can view active listings" ON listings
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Residents can insert listing" ON listings
  FOR INSERT WITH CHECK (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );
CREATE POLICY "Residents can update own listing" ON listings
  FOR UPDATE USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );
CREATE POLICY "Admin full access" ON listings
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Authenticated can view enquiries" ON enquiries
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Residents can insert enquiry" ON enquiries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin full access" ON enquiries
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Residents manage own favorites" ON favorites
  FOR ALL USING (
    resident_id IN (SELECT id FROM residents WHERE profile_id = auth.uid())
  );

CREATE POLICY "Authenticated access visits" ON marketplace_visits
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ═══════════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════════
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Service role can insert" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin full access" ON notifications
  FOR ALL USING (get_user_role() = 'admin');

-- ═══════════════════════════════════════════
-- STORAGE BUCKETS (create these in Supabase Dashboard)
-- ═══════════════════════════════════════════
-- Bucket: surveillance-images
-- Bucket: lost-found-images
-- Bucket: proof-uploads
-- Bucket: marketplace-images
-- Bucket: attendance-images
-- Bucket: documents

```
