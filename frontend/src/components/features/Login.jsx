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
