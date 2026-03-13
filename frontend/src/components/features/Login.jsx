import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';
import { Button } from '../ui';
import { useAuth } from '../../context/AuthContext';
import {
    getDashboardPathByRole,
    normalizeRole,
} from '../../utils/authUtils';

const SELECTED_ROLE_STORAGE_KEY = 'selectedRole';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [activeRole, setActiveRole] = useState(() => normalizeRole(localStorage.getItem(SELECTED_ROLE_STORAGE_KEY) || 'admin'));
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [demoExpanded, setDemoExpanded] = useState(false);
    const navigate = useNavigate();
    const { signIn, signInWithGoogle, user } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(getDashboardPathByRole(user.role), { replace: true });
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const { user: loggedInUser, error } = await signIn(email, password);
            if (error) {
                setErrorMsg(error.message.includes('invalid-credential') || error.message.includes('wrong-password')
                    ? 'Invalid email or password.'
                    : error.message);
                return;
            }
            if (loggedInUser) {
                setSuccessMsg('✅ Login successful!');
                navigate(getDashboardPathByRole(loggedInUser.role), { replace: true });
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fillCredentials = (e, p, role) => {
        setEmail(e);
        setPassword(p);
        setActiveRole(role);
        localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, role);
        setDemoExpanded(false);
    };

    const handleGoogleLogin = async () => {
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);
        try {
            const { user: loggedInUser, error } = await signInWithGoogle();
            if (error) { setErrorMsg(error.message); return; }
            if (loggedInUser) navigate(getDashboardPathByRole(loggedInUser.role), { replace: true });
        } catch (err) {
            setErrorMsg('Google login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-section">
                    <h1 className="heading">CIVIORA</h1>
                    <p className="subtitle">Login to manage maintenance payments</p>
                    <p className="role-text">For society members and committee administrators</p>
                </div>

                {/* Role Tabs */}
                <div className="role-tabs">
                    <button 
                        className={`role-tab ${activeRole === 'admin' ? 'active' : ''}`}
                        onClick={() => { setActiveRole('admin'); localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, 'admin'); setEmail(''); setPassword(''); }}
                        type="button"
                    >
                        👨‍💼 Admin
                    </button>
                    <button 
                        className={`role-tab ${activeRole === 'resident' ? 'active' : ''}`}
                        onClick={() => { setActiveRole('resident'); localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, 'resident'); setEmail(''); setPassword(''); }}
                        type="button"
                    >
                        👤 Resident
                    </button>
                    <button 
                        className={`role-tab ${activeRole === 'security' ? 'active' : ''}`}
                        onClick={() => { setActiveRole('security'); localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, 'security'); setEmail(''); setPassword(''); }}
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

                    <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '24px' }} disabled={isLoading}>
                        {isLoading ? 'Please wait...' : 'Login'}
                    </Button>
                    <button type="button" className="google-login-button" style={{ marginTop: '12px' }} onClick={handleGoogleLogin} disabled={isLoading}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.65Z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
                            <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.29v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.39l4.01-3.1Z" />
                            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.2 15.23 0 12 0A12 12 0 0 0 1.27 6.61l4.01 3.1c.94-2.84 3.6-4.94 6.72-4.94Z" />
                        </svg>
                        Continue with Google
                    </button>
                    <p className="member-contact-message">Not a member? Contact your society admin to get access.</p>
                
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
                                onClick={() => fillCredentials('admin@accordliving.com', 'Admin@123', 'admin')}
                            >
                                <div className="demo-icon">🧑‍💼</div>
                                <div className="demo-details">
                                    <div className="demo-label">Admin</div>
                                    <div className="demo-cred">admin@accordliving.com</div>
                                    <div className="demo-cred">Admin@123</div>
                                </div>
                            </div>

                            <div 
                                className="demo-account-item" 
                                onClick={() => fillCredentials('resident@accordliving.com', 'Resident@123', 'resident')}
                            >
                                <div className="demo-icon">🏠</div>
                                <div className="demo-details">
                                    <div className="demo-label">Resident</div>
                                    <div className="demo-cred">resident@accordliving.com</div>
                                    <div className="demo-cred">Resident@123</div>
                                </div>
                            </div>

                            <div 
                                className="demo-account-item" 
                                onClick={() => fillCredentials('security@accordliving.com', 'Security@123', 'security')}
                            >
                                <div className="demo-icon">🛡️</div>
                                <div className="demo-details">
                                    <div className="demo-label">Security</div>
                                    <div className="demo-cred">security@accordliving.com</div>
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
