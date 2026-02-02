import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';
import { Button } from '../ui';

const demoUsers = [
    { email: 'admin@society.local', password: 'Admin@123456', name: 'Society Admin', role: 'admin' },
    { email: 'resident1@society.local', password: 'Resident@123', name: 'Raj Kumar', role: 'resident', flat: 'A-101' },
    { email: 'resident2@society.local', password: 'Resident@123', name: 'Priya Singh', role: 'resident', flat: 'A-102' },
    { email: 'security@society.local', password: 'Security@123', name: 'Ram Singh', role: 'security' }
];

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user || user.password !== password) {
            alert('❌ Invalid email or password');
            return;
        }

        localStorage.setItem('user', JSON.stringify(user));
        setSuccessMsg(`✅ Welcome ${user.name}! (${user.role.toUpperCase()})`);

        setTimeout(() => {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'security') navigate('/security');
            else navigate('/resident');
        }, 600);
    };

    const fillCredentials = (e, p) => {
        setEmail(e);
        setPassword(p);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-section">
                    <h1 className="heading">Society Fintech</h1>
                    <p className="subtitle">Login to manage maintenance payments</p>
                    <p className="role-text">For society members and committee administrators</p>
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

                <div className="demo-section">
                    <h3>📋 Demo Credentials (Click to Fill)</h3>
                    <div className="demo-credentials">
                        <div className="credential-box" onClick={() => fillCredentials('admin@society.local', 'Admin@123456')}>
                            <div className="credential-label">👨‍💼 Admin Account</div>
                            <div className="credential-info">admin@society.local</div>
                            <div className="credential-info">Admin@123456</div>
                        </div>
                        <div className="credential-box" onClick={() => fillCredentials('resident1@society.local', 'Resident@123')}>
                            <div className="credential-label">👤 Resident 1</div>
                            <div className="credential-info">resident1@society.local</div>
                            <div className="credential-info">Resident@123</div>
                        </div>
                        <div className="credential-box" onClick={() => fillCredentials('security@society.local', 'Security@123')}>
                            <div className="credential-label">👮 Security Guard</div>
                            <div className="credential-info">security@society.local</div>
                            <div className="credential-info">Security@123</div>
                        </div>
                    </div>
                </div>
            </div>


            <footer className="footer-text">
                <p>&copy; 2026 Society Fintech. All rights reserved.</p>
            </footer>
        </div>

    );
};

export default Login;
