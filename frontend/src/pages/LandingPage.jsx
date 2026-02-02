import React from 'react';
import Login from '../components/features/Login';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page-root">
            {/* SECTION 1: HERO + SIDE LOGIN */}
            <section className="landing-hero">
                <div className="hero-left">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="hero-title">Society Fintech</h1>
                        <h2 className="hero-tagline">Smart management for modern residential societies</h2>
                        <p className="hero-description">
                            Managing a residential society shouldn’t be chaotic.
                            Society Fintech brings residents, administrators, and security together on one secure platform.
                        </p>
                        <p className="hero-supporting">
                            Designed for gated communities that want clarity, control, and accountability — without complexity.
                        </p>
                    </div>
                </div>
                <div className="hero-right">
                    <Login />
                </div>
            </section>

            {/* SECTION 2: PROBLEM STATEMENT */}
            <section className="landing-section section-problem">
                <div className="container">
                    <h2 className="section-title">Residential societies face daily operational chaos</h2>
                    <div className="problem-grid">
                        <div className="problem-item">
                            <span className="icon">⚠️</span>
                            <p>Maintenance payments are tracked manually, leading to confusion and disputes</p>
                        </div>
                        <div className="problem-item">
                            <span className="icon">📢</span>
                            <p>Residents miss important notices and announcements</p>
                        </div>
                        <div className="problem-item">
                            <span className="icon">📝</span>
                            <p>Security teams rely on paper logs for visitor entries</p>
                        </div>
                        <div className="problem-item">
                            <span className="icon">📉</span>
                            <p>Administrators struggle to maintain transparency and accountability</p>
                        </div>
                        <div className="problem-item">
                            <span className="icon">🔍</span>
                            <p>Lost personal items have no central place to be reported or tracked</p>
                        </div>
                    </div>
                    <p className="section-supporting">
                        From payments to security to everyday inconveniences like misplaced items,
                        societies lack a single system that brings order to daily operations.
                    </p>
                </div>
            </section>

            {/* SECTION 3: SOLUTION */}
            <section className="landing-section section-solution">
                <div className="container">
                    <h2 className="section-title">One platform. Complete control. Total transparency.</h2>
                    <p className="solution-text">
                        Society Fintech replaces scattered processes with a single, role-based system
                        designed specifically for residential communities.
                        From maintenance management and security logs to community notices
                        and lost items, everything stays organized in one place.
                    </p>
                </div>
            </section>

            {/* SECTION 4: FEATURES */}
            <section className="landing-section section-features">
                <div className="container">
                    <h2 className="section-title">Designed for every role in your society</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Admin Dashboard</h3>
                            <p>Administrators manage residents, flats, maintenance cycles, notices,
                                and community activity from one centralized dashboard.
                                Reports, records, and updates stay structured and accessible.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Resident Portal</h3>
                            <p>Residents can view maintenance bills, payment history,
                                announcements, and community updates.
                                They can also report lost items or check found listings,
                                keeping communication simple and transparent.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Security, Visitor & Lost-Item Management</h3>
                            <p>Security teams log visitor and vehicle entries digitally
                                while also updating found items reported within the premises.
                                Every entry — visitors or items — is time-stamped and searchable.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Maintenance, Payments & Records</h3>
                            <p>Clear billing cycles, transparent dues,
                                structured payment history, and digital records
                                ensure long-term trust between residents and management.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: HOW IT WORKS */}
            <section className="landing-section section-how">
                <div className="container">
                    <h2 className="section-title">How Society Fintech works</h2>
                    <div className="steps-list">
                        <div className="step-item">
                            <span className="step-number">1</span>
                            <p>The admin sets up society structure, residents, and access roles</p>
                        </div>
                        <div className="step-item">
                            <span className="step-number">2</span>
                            <p>Residents and security teams use their dashboards for payments, logs, and updates</p>
                        </div>
                        <div className="step-item">
                            <span className="step-number">3</span>
                            <p>Visitors, notices, and lost-and-found items are recorded and tracked centrally</p>
                        </div>
                    </div>
                    <p className="section-closing">Simple to use. Easy to manage. Built for scale.</p>
                </div>
            </section>

            {/* SECTION 6: TRUST & COMMUNITY */}
            <section className="landing-section section-trust">
                <div className="container">
                    <h2 className="section-title">Built for trust, accountability, and community living</h2>
                    <ul className="trust-list">
                        <li>Role-based access ensures data privacy</li>
                        <li>Secure authentication for all users</li>
                        <li>Transparent records reduce disputes</li>
                        <li>Designed specifically for gated communities</li>
                        <li>Community features like Lost & Found strengthen trust among residents</li>
                    </ul>
                    <p className="section-closing">Because society management depends on trust.</p>
                </div>
            </section>

            {/* SECTION 7: FOOTER */}
            <footer className="landing-footer">
                <p>Society Fintech — simplifying community living through technology.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
