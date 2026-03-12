// mockData/index.js — Centralized mock data for Accord Living

export const DEMO_SOCIETY = {
  id: 'soc-2026-001',
  name: 'Harmony Heights Apartments',
  code: 'SOC-2026-HH',
  totalFlats: 50,
  adminId: 'admin-001',
  createdAt: '2026-01-01'
};

export const DEMO_MEMBERS = [
  { id: 'mem-001', flatId: 'flat-101', name: 'Bhavesh Khatri', phone: '9876543210', role: 'owner' },
  { id: 'mem-002', flatId: 'flat-102', name: 'Priya Singh', phone: '9876543211', role: 'owner' },
  { id: 'mem-003', flatId: 'flat-201', name: 'Amit Patel', phone: '9876543212', role: 'tenant' },
  { id: 'mem-004', flatId: 'flat-202', name: 'Neha Verma', phone: '9876543213', role: 'owner' },
  { id: 'mem-005', flatId: 'flat-301', name: 'Rohit Mehta', phone: '9876543214', role: 'owner' }
];

export const DEMO_BILLS = [
  { id: 'bill-001', flatId: 'flat-101', amount: 5000, dueDate: '2026-03-31', status: 'pending', description: 'Monthly Maintenance' },
  { id: 'bill-002', flatId: 'flat-101', amount: 2000, dueDate: '2026-03-15', status: 'pending', description: 'Society Fund' },
  { id: 'bill-003', flatId: 'flat-102', amount: 5000, dueDate: '2026-03-31', status: 'paid', description: 'Monthly Maintenance' },
  { id: 'bill-004', flatId: 'flat-201', amount: 5000, dueDate: '2026-02-28', status: 'overdue', description: 'Monthly Maintenance' },
  { id: 'bill-005', flatId: 'flat-202', amount: 500, dueDate: '2026-03-31', status: 'pending', description: 'Water Charges' }
];

export const DEMO_COMPLAINTS = [
  { id: 'cmp-001', flatId: 'flat-101', category: 'plumbing', title: 'Water leakage in kitchen', description: 'Tap is dripping continuously', status: 'open', createdAt: '2026-03-10' },
  { id: 'cmp-002', flatId: 'flat-201', category: 'electrical', title: 'Bedroom light not working', description: 'Main bedroom ceiling light flickering', status: 'in_progress', createdAt: '2026-03-09' },
  { id: 'cmp-003', flatId: 'flat-102', category: 'other', title: 'Corridor light broken', description: 'Common area corridor light', status: 'resolved', createdAt: '2026-03-08' }
];

export const DEMO_ANNOUNCEMENTS = [
  { id: 'ann-001', title: 'Annual AGM on April 5th', category: 'event', priority: 'high', content: 'Mandatory attendance. Venue: Community Hall, 6 PM', createdAt: '2026-03-10' },
  { id: 'ann-002', title: 'Water Supply Maintenance', category: 'maintenance', priority: 'high', content: 'Scheduled maintenance on March 20-25. Water will be cut off from 8 AM to 6 PM', createdAt: '2026-03-09' },
  { id: 'ann-003', title: 'New Community Rules', category: 'rule', priority: 'medium', content: 'Updated parking rules effective from April 1st', createdAt: '2026-03-08' },
  { id: 'ann-004', title: 'Spring Cleaning Drive', category: 'event', priority: 'low', content: 'Volunteers needed for society cleanup on March 25th', createdAt: '2026-03-07' },
  { id: 'ann-005', title: 'Festival Celebration', category: 'event', priority: 'medium', content: 'Holi celebration in community garden on March 20th', createdAt: '2026-03-06' }
];

export const DEMO_VISITORS = [
  { id: 'vis-001', flatId: 'flat-101', visitorName: 'John Doe', visitorPhone: '9999888877', approvalCode: 'APPR-2026-001', status: 'approved', approvedAt: '2026-03-12' },
  { id: 'vis-002', flatId: 'flat-102', visitorName: 'Sarah Johnson', visitorPhone: '8888777766', approvalCode: 'APPR-2026-002', status: 'pending', approvedAt: null }
];

export const DEMO_STAFF = [
  { id: 'staff-001', name: 'Vikram Singh', role: 'security', phone: '9876543210', joinedAt: '2025-01-01' },
  { id: 'staff-002', name: 'Rajesh Kumar', role: 'cleaner', phone: '9876543211', joinedAt: '2025-02-01' },
  { id: 'staff-003', name: 'Suresh Patel', role: 'maintenance', phone: '9876543212', joinedAt: '2025-03-01' }
];

export const DEMO_DASHBOARD_STATS = {
  admin: {
    totalMembers: 50,
    pendingBills: 3,
    billsAmount: 12500,
    openComplaints: 2,
    staffPresent: 3,
    totalStaff: 4,
    todayVisitors: 2,
    maintenancePercentage: 85
  },
  resident: {
    pendingBills: 2,
    billsAmount: 7000,
    openComplaints: 1,
    resolvedComplaints: 2,
    totalVisitors: 2,
    membersSince: '2025-01-15'
  },
  security: {
    todayVisitors: 2,
    staffPresent: 3,
    totalStaff: 4,
    emergencyAlerts: 0,
    lastCheckIn: '2026-03-12 10:30 AM'
  }
};

export default {
  DEMO_SOCIETY,
  DEMO_MEMBERS,
  DEMO_BILLS,
  DEMO_COMPLAINTS,
  DEMO_ANNOUNCEMENTS,
  DEMO_VISITORS,
  DEMO_STAFF,
  DEMO_DASHBOARD_STATS
};
