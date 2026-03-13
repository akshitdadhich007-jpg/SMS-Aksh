import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPathByRole, normalizeRole } from '../../utils/authUtils';
import './AuthPages.css';

const ROLE_COPY = {
    admin: {
        title: 'Admin Login',
        subtitle: 'Use your admin credentials to manage society operations.',
    },
    resident: {
        title: 'Resident Login',
        subtitle: 'Use the email and password assigned to you by your admin.',
    },
    security: {
        title: 'Security Login',
        subtitle: 'Use your security credentials for daily operations.',
    },
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { signIn, user } = useAuth();
    const selectedRole = normalizeRole(searchParams.get('role') || 'admin');
    const roleCopy = useMemo(() => ROLE_COPY[selectedRole] || ROLE_COPY.admin, [selectedRole]);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(getDashboardPathByRole(user.role), { replace: true });
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const { user: loggedInUser, error } = await signIn(email.trim(), password);
            if (error) {
                const msg = error.message || '';
                if (
                    msg.includes('invalid-credential') ||
                    msg.includes('wrong-password') ||
                    msg.includes('user-not-found') ||
                    msg.includes('INVALID_LOGIN_CREDENTIALS')
                ) {
                    setErrorMsg('Invalid email or password.');
                } else {
                    setErrorMsg(msg || 'Login failed. Please try again.');
                }
                return;
            }
            if (loggedInUser) {
                navigate(getDashboardPathByRole(loggedInUser.role), { replace: true });
            }
        } catch (err) {
            setErrorMsg('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="auth-logo-icon">🏢</span>
                    <h1 className="auth-brand">CIVIORA</h1>
                    <p className="auth-tagline">Society Management Platform</p>
                </div>

                <div className="auth-role-tabs" role="tablist" aria-label="Login role selector">
                    {['admin', 'resident', 'security'].map((role) => (
                        <button
                            key={role}
                            type="button"
                            className={`auth-role-tab ${selectedRole === role ? 'active' : ''}`}
                            onClick={() => setSearchParams({ role })}
                        >
                            {role === 'admin' ? 'Admin' : role === 'resident' ? 'Resident' : 'Security'}
                        </button>
                    ))}
                </div>

                <h2 className="auth-title">{roleCopy.title}</h2>
                <p className="auth-subtitle">{roleCopy.subtitle}</p>

                {errorMsg && (
                    <div className="auth-error">
                        <span>⚠️ {errorMsg}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="auth-field">
                        <label htmlFor="login-email">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-btn auth-btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in…' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    New society?{' '}
                    <Link to="/signup/create-society" className="auth-link">
                        Create Society
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
