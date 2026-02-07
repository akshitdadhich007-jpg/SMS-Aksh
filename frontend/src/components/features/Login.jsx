import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';
import { Button } from '../ui';

const demoUsers = [
    { email: 'admin@society.local', password: 'Admin@12345', name: 'Society Admin', role: 'admin' },
    { email: 'resident1@society.local', password: 'Resident@123', name: 'Raj Kumar', role: 'resident', flat: 'A-101' },
    { email: 'resident2@society.local', password: 'Resident@123', name: 'Priya Singh', role: 'resident', flat: 'A-102' },
    { email: 'security@society.local', password: 'Security@123', name: 'Ram Singh', role: 'security' }
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [activeRole, setActiveRole] = useState('admin');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Check demo credentials first (demo fallback)
        const demoUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (demoUser) {
            // Validate password
            if (demoUser.password !== password) {
                alert('❌ Invalid email or password');
                return;
            }

            // Validate role matches selected tab
            if (demoUser.role !== activeRole) {
                alert(`❌ This account belongs to ${demoUser.role.toUpperCase()} role, but you selected ${activeRole.toUpperCase()}`);
                return;
            }

            // Demo login successful
            localStorage.setItem('user', JSON.stringify(demoUser));
            setSuccessMsg(`✅ Welcome ${demoUser.name}! (${demoUser.role.toUpperCase()})`);

            setTimeout(() => {
                if (demoUser.role === 'admin') navigate('/admin');
                else if (demoUser.role === 'security') navigate('/security');
                else navigate('/resident');
            }, 600);
            return;
        }

        // If not a demo user, attempt backend authentication
        // (This can be added later when backend users are implemented)
        alert('❌ Invalid email or password');
    };

    const fillCredentials = (e, p, role) => {
        setEmail(e);
        setPassword(p);
        setActiveRole(role);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-section">
                    <h1 className="heading">Society Fintech</h1>
                    <p className="subtitle">Login to manage maintenance payments</p>
                    <p className="role-text">For society members and committee administrators</p>
                </div>

                {/* Role Tabs */}
                <div className="role-tabs">
                    <button 
                        className={`role-tab ${activeRole === 'admin' ? 'active' : ''}`}
                        onClick={() => { setActiveRole('admin'); setEmail(''); setPassword(''); }}
                        type="button"
                    >
                        👨‍💼 Admin
                    </button>
                    <button 
                        className={`role-tab ${activeRole === 'resident' ? 'active' : ''}`}
                        onClick={() => { setActiveRole('resident'); setEmail(''); setPassword(''); }}
                        type="button"
                    >
                        👤 Resident
                    </button>
                    <button 
                        className={`role-tab ${activeRole === 'security' ? 'active' : ''}`}
                        onClick={() => { setActiveRole('security'); setEmail(''); setPassword(''); }}
                        type="button"
                    >
                        👮 Security
                    </button>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '24px' }}>Login</Button>
                </form>

                <div className={`success-message ${successMsg ? 'show' : ''}`}>
                    {successMsg}
                </div>
            </div>

            {/* Demo Credentials Box - Attached to Login Card */}
            <div className="demo-credentials-box">
                <h3 className="demo-box-title">📋 Demo Credentials</h3>
                <div className="demo-accounts-list">
                    <div 
                        className="demo-account-item" 
                        onClick={() => fillCredentials('admin@society.local', 'Admin@12345', 'admin')}
                    >
                        <div className="demo-icon">🧑‍💼</div>
                        <div className="demo-details">
                            <div className="demo-label">Admin</div>
                            <div className="demo-cred">admin@society.local</div>
                            <div className="demo-cred">Admin@12345</div>
                        </div>
                    </div>

                    <div 
                        className="demo-account-item" 
                        onClick={() => fillCredentials('resident1@society.local', 'Resident@123', 'resident')}
                    >
                        <div className="demo-icon">🏠</div>
                        <div className="demo-details">
                            <div className="demo-label">Resident</div>
                            <div className="demo-cred">resident1@society.local</div>
                            <div className="demo-cred">Resident@123</div>
                        </div>
                    </div>

                    <div 
                        className="demo-account-item" 
                        onClick={() => fillCredentials('security@society.local', 'Security@123', 'security')}
                    >
                        <div className="demo-icon">🛡️</div>
                        <div className="demo-details">
                            <div className="demo-label">Security</div>
                            <div className="demo-cred">security@society.local</div>
                            <div className="demo-cred">Security@123</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
