import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/admin-style.css'; // Reusing admin styles as requested

const Resident = () => {
    const [profileOpen, setProfileOpen] = useState(false);

    const location = useLocation();
    const currentHash = location.hash || '#';

    return (
        <div className="resident-body">
            <aside className="sidebar">
                <div className="sidebar-brand"><h2 id="societyName">Greenfield Residency</h2></div>
                <nav className="sidebar-nav">
                    <a className={`nav-item ${currentHash === '#' ? 'active' : ''}`} href="#">🏠 Dashboard</a>
                    <a className={`nav-item ${currentHash === '#billCard' ? 'active' : ''}`} href="#billCard">🧾 My Bills</a>
                    <a className={`nav-item ${currentHash === '#paySection' ? 'active' : ''}`} href="#paySection">💳 Pay Maintenance</a>
                    <a className={`nav-item ${currentHash === '#history' ? 'active' : ''}`} href="#history">📜 Payment History</a>
                    <a className={`nav-item ${currentHash === '#complaints' ? 'active' : ''}`} href="#complaints">⚠️ Complaints</a>
                    <a className={`nav-item ${currentHash === '#announcements' ? 'active' : ''}`} href="#announcements">📢 Announcements</a>
                    <a className={`nav-item ${currentHash === '#documents' ? 'active' : ''}`} href="#documents">📂 Documents</a>
                    <a className={`nav-item ${currentHash === '#emergency' ? 'active' : ''}`} href="#emergency">🚨 Emergency</a>
                    <a className={`nav-item ${currentHash === '#staff' ? 'active' : ''}`} href="#staff">👷 Staff & Services</a>
                </nav>
                <div className="sidebar-footer">© 2026 Society Fintech</div>
            </aside>

            <div className="main">
                <header className="topbar">
                    <div className="left"><h3 id="topSociety">Greenfield Residency</h3></div>
                    <div className="topbar-right">
                        <div className="notif" id="notifBtn">
                            <span className="bell">🔔</span>
                            <span className="badge" id="notifCount">2</span>
                        </div>
                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>Resident ▾</button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#">My Profile</a>
                                <a href="#">Change Password</a>
                                <a href="/" id="logoutBtn">Logout</a>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="container">
                    {/* Summary cards */}
                    <section className="cards">
                        <div className="card">
                            <div className="card-title">Current Due</div>
                            <div className="card-value" id="currentDue">₹2,500</div>
                        </div>
                        <div className="card">
                            <div className="card-title">Due Date</div>
                            <div className="card-value" id="dueDate">10 Feb 2026</div>
                        </div>
                        <div className="card">
                            <div className="card-title">Payment Status</div>
                            <div className="card-value" style={{ color: 'var(--warning)' }} id="paymentStatus">Pending</div>
                        </div>
                        <div className="card">
                            <div className="card-title">Last Payment</div>
                            <div className="card-value" id="lastPayment">Jan 2026</div>
                        </div>
                    </section>

                    {/* Bill & Pay */}
                    <section id="billCard" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                        <div className="card">
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '600' }}>Current Month Bill</h3>
                            <div className="bill-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Flat:</span> <span id="flatNum" style={{ fontWeight: '600' }}>A-101</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Billing Month:</span> <span id="billMonth" style={{ fontWeight: '600' }}>Feb 2026</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Maintenance Charges:</span> <span id="maintCharges" style={{ fontWeight: '600' }}>₹2,500</span></div>
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}><strong>Total:</strong> <strong id="billTotal" style={{ color: 'var(--brand-blue)' }}>₹2,500</strong></div>

                                <div className="bill-actions" style={{ marginTop: '20px' }}>
                                    <button id="payNow" style={{ width: '100%', padding: '12px', background: 'var(--brand-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Pay Now</button>
                                </div>
                            </div>
                        </div>

                        <div id="paySection" className="card">
                            <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '600' }}>Payment Methods</h3>
                            <div className="methods" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
                                    <input type="radio" name="method" value="UPI" defaultChecked />
                                    <span>UPI / GPay / PhonePe</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
                                    <input type="radio" name="method" value="Card" />
                                    <span>Credit / Debit Card</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
                                    <input type="radio" name="method" value="NetBanking" />
                                    <span>Net Banking</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Payment History */}
                    <section id="history" className="card">
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Payment History</h3>
                        <table className="table" id="historyTable">
                            <thead><tr><th>Month</th><th>Amount</th><th>Mode</th><th>Date</th><th>Status</th></tr></thead>
                            <tbody>
                                <tr><td>Jan 2026</td><td>₹2,500</td><td>UPI</td><td>10 Jan</td><td><span className="status-paid">Paid</span></td></tr>
                            </tbody>
                        </table>
                    </section>
                </main>

                <footer className="footer">Designed for demo — easy payments and complaints</footer>
            </div>
        </div>
    );
};

export default Resident;
