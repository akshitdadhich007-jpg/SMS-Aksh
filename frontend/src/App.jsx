import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { VisitorProvider } from './context/VisitorContext';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/AdminLayout';
import * as AdminPages from './pages/admin/index';
import ResidentLayout from './pages/ResidentLayout';
import SecurityLayout from './pages/SecurityLayout';
import * as SecurityPages from './pages/security/index';
import * as ResidentPages from './pages/resident/index';

import { ToastProvider } from './components/ui/Toast';

import './App.css';

function App() {
    // TODO: Firebase - set up onAuthStateChanged listener here

    return (
        <ThemeProvider>
            <AuthProvider>
                <VisitorProvider>
                    <ToastProvider>
                        <Router>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="/resident-dashboard" element={<Navigate to="/resident/dashboard" replace />} />
                            <Route path="/security-dashboard" element={<Navigate to="/security/dashboard" replace />} />
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<AdminPages.AdminDashboard />} />
                                <Route path="residents" element={<AdminPages.ResidentManagement />} />
                                <Route path="maintenance" element={<AdminPages.BillManagement />} />
                                <Route path="staff" element={<AdminPages.StaffManagement />} />
                                <Route path="complaints" element={<AdminPages.ComplaintManagement />} />
                                <Route path="notices" element={<AdminPages.EventsAnnouncements />} />
                                <Route path="emergency" element={<AdminPages.EmergencyManagement />} />
                                <Route path="reports" element={<AdminPages.ReportsAnalytics />} />
                                <Route path="settings" element={<AdminPages.AdminSettings />} />
                                <Route path="attendance" element={<AdminPages.AttendanceLogs />} />
                                <Route path="visitor-records" element={<AdminPages.VisitorRecords />} />
                                <Route path="visitor-settings" element={<AdminPages.VisitorSystemSettings />} />
                            </Route>

                            {/* Resident Nested Routes */}
                            <Route path="/resident" element={<ResidentLayout />}>
                                <Route index element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<ResidentPages.ResidentDashboard />} />
                                <Route path="bills" element={<ResidentPages.MyBills />} />
                                <Route path="complaints" element={<ResidentPages.Complaints />} />
                                <Route path="announcements" element={<ResidentPages.Announcements />} />
                                <Route path="documents" element={<ResidentPages.Documents />} />
                                <Route path="emergency-sos" element={<ResidentPages.EmergencySOS />} />
                                <Route path="settings" element={<ResidentPages.ResidentSettings />} />
                                <Route path="visitor-approval" element={<ResidentPages.VisitorPreApproval />} />
                            </Route>

                            <Route path="/security" element={<SecurityLayout />}>
                                <Route index element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<SecurityPages.SecurityDashboard />} />
                                <Route path="visitors" element={<SecurityPages.VisitorEntry />} />
                                <Route path="settings" element={<SecurityPages.SecuritySettings />} />
                                <Route path="preapproved" element={<SecurityPages.PreApprovedVisitors />} />
                                <Route path="attendance" element={<SecurityPages.StaffAttendance />} />
                                <Route path="emergency-alerts" element={<SecurityPages.EmergencyAlerts />} />
                            </Route>
                        </Routes>
                    </Router>
                </ToastProvider>
            </VisitorProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
