import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/admin-style.css';
import { PageHeader, Card, StatCard, StatusBadge, Button, CardHeader, CardContent } from '../components/ui';

const Security = () => {
    const [profileOpen, setProfileOpen] = useState(false);

    const location = useLocation();
    const currentHash = location.hash || '#';

    return (
        <div className="security-body">
            <aside className="sidebar">
                <div className="sidebar-brand" style={{ padding: '0 14px' }}><h2 id="societyName">Greenfield Residency</h2></div>
                <nav className="sidebar-nav">
                    <a className={`nav-item ${currentHash === '#' ? 'active' : ''}`} href="#">🏠 Dashboard</a>
                    <a className={`nav-item ${currentHash === '#visitor' ? 'active' : ''}`} href="#visitor">👤 Visitor Entry</a>
                    <a className={`nav-item ${currentHash === '#vehicle' ? 'active' : ''}`} href="#vehicle">🚗 Vehicle Entry</a>
                    <a className={`nav-item ${currentHash === '#delivery' ? 'active' : ''}`} href="#delivery">📦 Deliveries</a>
                    <a className={`nav-item ${currentHash === '#emergency' ? 'active' : ''}`} href="#emergency">🚨 Emergency Logs</a>
                </nav>
                <div className="sidebar-footer">© 2026 Society Fintech</div>
            </aside>

            <div className="main">
                <header className="topbar">
                    <div className="left"><strong id="topSociety">Greenfield Residency</strong></div>
                    <div className="topbar-right">
                        <div className="notif" id="notifBtn">
                            <span className="bell">🔔</span>
                            <span className="badge" id="notifCount">1</span>
                        </div>
                        <div className="profile">
                            <button id="profileBtn" className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>Security ▾</button>
                            <div id="profileMenu" className={`profile-menu ${profileOpen ? 'show' : ''}`}>
                                <a href="#">Profile</a>
                                <a href="/" id="logoutBtn">Logout</a>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="content container">
                    {/* Quick Actions */}
                    <div className="quick-actions" style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button variant="primary" style={{ padding: '12px 20px' }}>Add Visitor Entry</Button>
                        <Button variant="primary" style={{ padding: '12px 20px' }}>Add Vehicle Entry</Button>
                        <Button variant="primary" style={{ padding: '12px 20px' }}>Log Delivery</Button>
                        <Button variant="danger" style={{ padding: '12px 20px' }}>Emergency Alert</Button>
                    </div>

                    <div style={{ display: 'grid', gap: '24px' }}>
                        <Card id="visitor">
                            <CardHeader title="Visitor Entry" />
                            <CardContent>
                                <form id="visitorForm" className="form" style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
                                    <input id="vName" placeholder="Visitor Name" required className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                                    <input id="vPurpose" placeholder="Purpose of Visit" required className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                                    <input id="vFlat" placeholder="Flat Number to Visit" required className="form-input" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '14px', width: '100%' }} />
                                    <Button variant="primary" type="submit" style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>Save Visitor</Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card id="delivery">
                            <CardHeader title="Deliveries" />
                            <CardContent className="p-0">
                                <table id="deliveryTable" className="table">
                                    <thead><tr><th>Courier</th><th>Flat</th><th>Status</th><th>Time</th></tr></thead>
                                    <tbody>
                                        <tr><td>Amazon</td><td>A-101</td><td><StatusBadge status="Arrived" /></td><td>10:00 AM</td></tr>
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                <footer className="footer">Security Panel — quick actions for gate operations</footer>
            </div>
        </div>
    );
};

export default Security;
