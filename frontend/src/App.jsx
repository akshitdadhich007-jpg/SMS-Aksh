import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { VisitorProvider } from './context/VisitorContext';

import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/AdminLayout';
import * as AdminPages from './pages/admin/index';
import ResidentLayout from './pages/ResidentLayout';
import SecurityLayout from './pages/SecurityLayout';
import * as SecurityPages from './pages/security/index';
import * as ResidentPages from './pages/resident/index';
import './App.css';

function App() {
    return (
        <ThemeProvider>
            <VisitorProvider>
                <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminPages.AdminDashboard />} />
                    <Route path="residents" element={<AdminPages.ResidentManagement />} />
                    <Route path="shops" element={<AdminPages.ShopManagement />} />
                    <Route path="maintenance" element={<AdminPages.BillManagement />} />
                    <Route path="payments" element={<AdminPages.PaymentRecords />} />
                    <Route path="expenses" element={<AdminPages.ExpenseTracker />} />
                    <Route path="staff" element={<AdminPages.StaffManagement />} />
                    <Route path="committee" element={<AdminPages.CommitteeManagement />} />
                    <Route path="vehicles" element={<AdminPages.VehicleVisitorLog />} />
                    <Route path="deliveries" element={<AdminPages.DeliveryLog />} />
                    <Route path="complaints" element={<AdminPages.ComplaintManagement />} />
                    <Route path="notices" element={<AdminPages.EventsAnnouncements />} />
                    <Route path="documents" element={<AdminPages.DocumentRepo />} />
                    <Route path="emergency" element={<AdminPages.EmergencyManagement />} />
                    <Route path="reports" element={<AdminPages.ReportsAnalytics />} />
                    <Route path="settings" element={<AdminPages.AdminSettings />} />
                    <Route path="bookings" element={<AdminPages.AssetBooking />} />
                    <Route path="visitor-analytics" element={<AdminPages.VisitorAnalytics />} />
                    <Route path="traceback" element={<AdminPages.LostAndFoundTraceback />} />
                    <Route path="traceback/report-lost" element={<AdminPages.ReportLostItem />} />
                    <Route path="traceback/report-found" element={<AdminPages.ReportFoundItem />} />
                    <Route path="traceback/matches" element={<AdminPages.TracebackMatches />} />
                    <Route path="traceback/prove-ownership" element={<AdminPages.ProveOwnership />} />
                    <Route path="traceback/claim-review" element={<AdminPages.FinderClaimReview />} />
                </Route>

                {/* Resident Nested Routes */}
                <Route path="/resident" element={<ResidentLayout />}>
                    <Route index element={<ResidentPages.ResidentDashboard />} />
                    <Route path="bills" element={<ResidentPages.MyBills />} />
                    <Route path="pay" element={<ResidentPages.PayMaintenance />} />
                    <Route path="history" element={<ResidentPages.PaymentHistory />} />
                    <Route path="vehicles" element={<ResidentPages.Vehicles />} />
                    <Route path="visitors" element={<ResidentPages.Visitors />} />
                    <Route path="complaints" element={<ResidentPages.Complaints />} />
                    <Route path="announcements" element={<ResidentPages.Announcements />} />
                    <Route path="documents" element={<ResidentPages.Documents />} />
                    <Route path="emergency" element={<ResidentPages.Emergency />} />
                    <Route path="staff" element={<ResidentPages.Staff />} />
                    <Route path="settings" element={<ResidentPages.ResidentSettings />} />
                    <Route path="bookings" element={<ResidentPages.AssetBooking />} />
                    <Route path="visitor-approval" element={<ResidentPages.VisitorPreApproval />} />
                    <Route path="traceback" element={<AdminPages.LostAndFoundTraceback />} />
                    <Route path="traceback/report-lost" element={<AdminPages.ReportLostItem />} />
                    <Route path="traceback/report-found" element={<AdminPages.ReportFoundItem />} />
                    <Route path="traceback/matches" element={<AdminPages.TracebackMatches />} />
                    <Route path="traceback/prove-ownership" element={<AdminPages.ProveOwnership />} />
                    <Route path="traceback/claim-review" element={<AdminPages.FinderClaimReview />} />
                </Route>

                <Route path="/security" element={<SecurityLayout />}>
                    <Route index element={<SecurityPages.SecurityDashboard />} />
                    <Route path="visitors" element={<SecurityPages.VisitorEntry />} />
                    <Route path="vehicles" element={<SecurityPages.VehicleEntry />} />
                    <Route path="deliveries" element={<SecurityPages.Deliveries />} />
                    <Route path="emergency" element={<SecurityPages.EmergencyLogs />} />
                    <Route path="settings" element={<SecurityPages.SecuritySettings />} />
                    <Route path="preapproved" element={<SecurityPages.PreApprovedVisitors />} />
                    <Route path="traceback" element={<AdminPages.LostAndFoundTraceback />} />
                    <Route path="traceback/report-lost" element={<AdminPages.ReportLostItem />} />
                    <Route path="traceback/report-found" element={<AdminPages.ReportFoundItem />} />
                    <Route path="traceback/matches" element={<AdminPages.TracebackMatches />} />
                    <Route path="traceback/prove-ownership" element={<AdminPages.ProveOwnership />} />
                    <Route path="traceback/claim-review" element={<AdminPages.FinderClaimReview />} />
                </Route>
            </Routes>
            </Router>
            </VisitorProvider>
        </ThemeProvider>
    );
}

export default App;
