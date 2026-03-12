<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';
import { Button } from '../ui';
import { supabase } from '../../utils/supabaseClient';
import {
    getOrCreateProfile,
    getProfileByEmail,
    getDashboardPathByRole,
    isProfileApproved,
    normalizeRole,
} from '../../utils/authUtils';

const LOGIN_TIMEOUT_MS = 12000;
const SELECTED_ROLE_STORAGE_KEY = 'selectedRole';

const DEMO_USERS = {
    'admin@society.local': {
        password: 'Admin@12345',
        role: 'admin',
        name: 'Demo Admin',
        id: 'demo-admin',
    },
    'resident1@society.local': {
        password: 'Resident@123',
        role: 'resident',
        name: 'Demo Resident',
        id: 'demo-resident-1',
    },
    'security@society.local': {
        password: 'Security@123',
        role: 'security',
        name: 'Demo Security',
        id: 'demo-security',
    },
};

const withTimeout = (promise, timeoutMs, timeoutMessage) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
        }),
    ]);
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [activeRole, setActiveRole] = useState(() => normalizeRole(localStorage.getItem(SELECTED_ROLE_STORAGE_KEY) || 'admin'));
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [demoExpanded, setDemoExpanded] = useState(false);
    const navigate = useNavigate();

    const tryDemoLogin = (normalizedEmail, rawPassword) => {
        const demoUser = DEMO_USERS[normalizedEmail];
        if (!demoUser || demoUser.password !== rawPassword) {
            return false;
        }

        const role = normalizeRole(demoUser.role || activeRole);
        localStorage.setItem('user', JSON.stringify({
            id: demoUser.id,
            email: normalizedEmail,
            name: demoUser.name,
            role,
        }));

        setSuccessMsg('✅ Demo login successful');
        navigate(getDashboardPathByRole(role), { replace: true });
        return true;
    };

    const finalizeAuthenticatedUser = async (session, preferredRole = null) => {
        const sessionUser = session?.user;
        const email = sessionUser?.email?.toLowerCase?.() || '';

        if (!sessionUser || !email) return;

        const profile = await getOrCreateProfile(sessionUser);
        if (!profile) {
            await supabase.auth.signOut();
            setErrorMsg('Unable to create your profile. Please contact your society admin.');
            return;
        }

        if (!isProfileApproved(profile)) {
            await supabase.auth.signOut();
            setErrorMsg('Your account is pending approval from the society administrator.');
            return;
        }

        const selectedRole = localStorage.getItem(SELECTED_ROLE_STORAGE_KEY);
        const finalRole = normalizeRole(preferredRole || selectedRole || activeRole || profile.role);

        localStorage.setItem('user', JSON.stringify({
            id: sessionUser.id,
            email,
            name: profile.name || sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || sessionUser.email,
            role: finalRole,
        }));

        localStorage.removeItem(SELECTED_ROLE_STORAGE_KEY);
        navigate(getDashboardPathByRole(finalRole), { replace: true });
    };

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session && active) {
                console.log('User logged in:', session.user);
                await finalizeAuthenticatedUser(session);
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session && active) {
                console.log('User authenticated:', session.user);
                await finalizeAuthenticatedUser(session);
            }
        });

        return () => {
            active = false;
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, activeRole);
            const normalizedEmail = email.toLowerCase().trim();
            const normalizedPassword = password.trim();

            if (tryDemoLogin(normalizedEmail, normalizedPassword)) {
                return;
            }

            const { data, error } = await withTimeout(
                supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password,
                }),
                LOGIN_TIMEOUT_MS,
                'Login request timed out. Please check your internet and try again.'
            );

            if (error) {
                setErrorMsg(error.message || 'Login failed');
                setIsLoading(false);
                return;
            }

            setSuccessMsg('✅ Login successful');
            if (data?.session) {
                await finalizeAuthenticatedUser(data.session, activeRole);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Server connection failed');
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
            localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, activeRole);
            const { error } = await withTimeout(
                supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin,
                        queryParams: {
                            prompt: 'select_account',
                        },
                    },
                }),
                LOGIN_TIMEOUT_MS,
                'Google sign-in is taking too long. Please try again.'
            );

            if (error) {
                console.error('Google login error:', error.message);
                setErrorMsg(error.message || 'Google login failed');
            }
        } catch (err) {
            console.error('Google login error:', err?.message || err);
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
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import { Button } from "../ui";
import api from "../../services/api";
import { ROLES, ROLE_ROUTES, DEMO_CREDENTIALS } from "../../config/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeRole, setActiveRole] = useState(ROLES.ADMIN);
  const [errorMsg, setErrorMsg] = useState("");
  const [demoExpanded, setDemoExpanded] = useState(false);
  const [autoLoginEnabled, setAutoLoginEnabled] = useState(false);
  const navigate = useNavigate();

  const navigateByRole = (role) => {
    navigate(ROLE_ROUTES[role] || ROLE_ROUTES[ROLES.RESIDENT]);
  };

  const handleLogin = async (e, overrideEmail, overridePassword, overrideRole) => {
    e.preventDefault();
    setErrorMsg("");
    const loginEmail = overrideEmail || email;
    const loginPassword = overridePassword || password;
    const loginRole = overrideRole || activeRole;

    // ── Try real backend login first ──
    try {
      const { data } = await api.post("/api/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (data.access_token) {
        localStorage.setItem("auth", JSON.stringify({ access_token: data.access_token }));
        localStorage.setItem("user", JSON.stringify({
          id: data.id,
          email: data.email,
          role: data.role,
          name: data.name || data.email,
        }));
        setSuccessMsg(`✅ Welcome! (${data.role.toUpperCase()})`);
        setTimeout(() => navigateByRole(data.role), 600);
        return;
      }
    } catch (err) {
      console.warn("Backend login failed, trying demo fallback…");
    }

    // ── Demo credential fallback ──
    const demoUser = DEMO_CREDENTIALS.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase(),
    );
    if (demoUser) {
      if (demoUser.password !== loginPassword) {
        setErrorMsg("❌ Invalid email or password");
        return;
      }
      if (demoUser.role !== loginRole) {
        setErrorMsg(
          `❌ This account belongs to ${demoUser.role.toUpperCase()} role, but you selected ${loginRole.toUpperCase()}`,
        );
        return;
      }
      localStorage.setItem("user", JSON.stringify(demoUser));
      setSuccessMsg(
        `✅ Welcome ${demoUser.name}! (Demo – ${demoUser.role.toUpperCase()})`,
      );
      setTimeout(() => navigateByRole(demoUser.role), 600);
      return;
    }
    setErrorMsg("❌ Invalid email or password");
  };

  const fillCredentials = (e, p, role) => {
    setEmail(e);
    setPassword(p);
    setActiveRole(role);
    setDemoExpanded(false);
  };

  const handleAutoLogin = (autoEmail, autoPassword, role) => {
    setEmail(autoEmail);
    setPassword(autoPassword);
    setActiveRole(role);
    handleLogin(
      { preventDefault: () => { }, target: { email: { value: autoEmail }, password: { value: autoPassword } } },
      autoEmail,
      autoPassword,
      role,
    );
  };

  // Build role tabs dynamically from DEMO_CREDENTIALS
  const roleTabs = [
    { role: ROLES.ADMIN, label: "👨‍💼 Admin" },
    { role: ROLES.RESIDENT, label: "👤 Resident" },
    { role: ROLES.SECURITY, label: "👮 Security" },
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <h1 className="heading">Society Fintech</h1>
          <p className="subtitle">Login to manage maintenance payments</p>
          <p className="role-text">
            For society members and committee administrators
          </p>
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
        </div>

        {/* Role Tabs */}
        <div className="role-tabs">
          {roleTabs.map(({ role, label }) => {
            const cred = DEMO_CREDENTIALS.find((d) => d.role === role);
            return (
              <button
                key={role}
                className={`role-tab ${activeRole === role ? "active" : ""}`}
                onClick={() => {
                  setActiveRole(role);
                  if (cred) fillCredentials(cred.email, cred.password, role);
                  if (autoLoginEnabled && cred)
                    handleAutoLogin(cred.email, cred.password, role);
                }}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="mb-16"
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--primary)",
              background: "var(--primary-light, #e0e7ff)",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            Demo Mode Active
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 13,
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
            className="gap-16"
          >
            <input
              type="checkbox"
              checked={autoLoginEnabled}
              onChange={(e) => setAutoLoginEnabled(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            Auto-Login on Tab Click
          </label>
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

          <Button
            type="submit"
            variant="primary"
            style={{ width: "100%" }}
            className="mt-24"
          >
            Login
          </Button>
        </form>

        <div className={`success-message ${successMsg ? "show" : ""}`}>
          {successMsg}
        </div>

        <div className={`error-message ${errorMsg ? "show" : ""}`}>
          {errorMsg}
        </div>
      </div>

      {/* Demo Credentials Box */}
      <div className="demo-credentials-box">
        <h3
          className="demo-box-title"
          onClick={() => setDemoExpanded(!demoExpanded)}
        >
          📋 Demo Credentials
          <span className={`demo-chevron ${demoExpanded ? "expanded" : ""}`}>
            ⌄
          </span>
        </h3>
        <div className={`demo-accounts-list ${demoExpanded ? "expanded" : ""}`}>
          {demoExpanded &&
            DEMO_CREDENTIALS.map((cred) => (
              <div
                key={cred.email}
                className="demo-account-item"
                onClick={() =>
                  fillCredentials(cred.email, cred.password, cred.role)
                }
              >
                <div className="demo-icon">{cred.icon}</div>
                <div className="demo-details">
                  <div className="demo-label">
                    {cred.role.charAt(0).toUpperCase() + cred.role.slice(1)}
                  </div>
                  <div className="demo-cred">{cred.email}</div>
                  <div className="demo-cred">{cred.password}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default Login;
