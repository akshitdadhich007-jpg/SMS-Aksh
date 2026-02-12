import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';
import { Button } from '../ui';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [demoExpanded, setDemoExpanded] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoadingGoogle(true);
            setErrorMsg('');

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

            // Send token to backend for verification
            const response = await axios.post(`${apiUrl}/api/google-login`, {
                token: credentialResponse.credential,
                role: activeRole
            });

            if (response.data.success) {
                const userData = response.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                setSuccessMsg(`✅ Welcome ${userData.name}! (${userData.role.toUpperCase()})`);

                setTimeout(() => {
                    if (userData.role === 'admin') navigate('/admin');
                    else if (userData.role === 'security') navigate('/security');
                    else navigate('/resident');
                }, 600);
            } else {
                setErrorMsg(response.data.message || 'Google login failed');
            }
        } catch (err) {
            console.error('Google auth error:', err);
            setErrorMsg(err.response?.data?.message || 'Failed to authenticate with Google');
        } finally {
            setIsLoadingGoogle(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => {
            setErrorMsg('Google login cancelled or failed');
        },
        flow: 'implicit'
    });

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

                    {/* Google OAuth Button */}
                    <button
                        type="button"
                        className="google-login-button"
                        onClick={() => googleLogin()}
                        disabled={isLoadingGoogle}
                        style={{ marginTop: '12px' }}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        {isLoadingGoogle ? 'Signing in...' : 'Continue with Google'}
                    </button>
                
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
