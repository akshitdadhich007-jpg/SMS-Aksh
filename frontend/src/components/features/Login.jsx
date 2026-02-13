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
    const [errorMsg, setErrorMsg] = useState('');
    const [demoExpanded, setDemoExpanded] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
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

            // Demo login successful - Call Backend to set Session
            try {
                await fetch('http://localhost:3001/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        isDemoLogin: true, 
                        user: { 
                            id: 'demo-' + demoUser.role, // Mock ID
                            email: demoUser.email, 
                            role: demoUser.role,
                            name: demoUser.name
                        } 
                    })
                });
            } catch (err) {
                console.warn('Backend login failed, proceeding with frontend-only mode (some features may be limited)');
            }

            localStorage.setItem('user', JSON.stringify(demoUser));
            setSuccessMsg(`✅ Welcome ${demoUser.name}! (${demoUser.role.toUpperCase()})`);

            setTimeout(() => {
                if (demoUser.role === 'admin') navigate('/admin');
                else if (demoUser.role === 'security') navigate('/security');
                else navigate('/resident');
            }, 600);
            return;
        }

        // Real Backend Login for non-demo users
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Fetch full user details if needed, or construct from basic info
                const userData = { email, role: data.role, name: 'User' }; 
                localStorage.setItem('user', JSON.stringify(userData));
                setSuccessMsg('✅ Login Successful');
                
                setTimeout(() => {
                    if (data.role === 'admin') navigate('/admin');
                    else if (data.role === 'security') navigate('/security');
                    else navigate('/resident');
                }, 600);
            } else {
                 alert('❌ ' + (data.message || 'Login failed'));
            }
        } catch (err) {
             console.error(err);
             alert('❌ Server connection failed');
        }
    };

    const fillCredentials = (e, p, role) => {
        setEmail(e);
        setPassword(p);
        setActiveRole(role);
        setDemoExpanded(false);
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

                <div className={`error-message ${errorMsg ? 'show' : ''}`}>
                    {errorMsg}
                </div>
            </div>

            {/* Demo Credentials Box - Attached to Login Card */}
            <div className="demo-credentials-box">
                <h3 className="demo-box-title" onClick={() => setDemoExpanded(!demoExpanded)}>
                    📋 Demo Credentials
                    <span className={`demo-chevron ${demoExpanded ? 'expanded' : ''}`}>⌄</span>
                </h3>
                <div className={`demo-accounts-list ${demoExpanded ? 'expanded' : ''}`}>
                    {demoExpanded && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Login;
