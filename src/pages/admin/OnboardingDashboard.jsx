import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createBulkFlats } from '../../firebase/flatService';
import { generateBulkCredentials } from '../../firebase/credentialService';
import { generateCredential } from '../../firebase/credentialService';
import { useToast } from '../../components/ui/Toast';
import './OnboardingDashboard.css';

const STEPS = ['Add Flats', 'Add Residents', 'Add Staff', 'Complete!'];

const defaultFlats = Array.from({ length: 10 }, (_, i) => String(101 + i));

const OnboardingDashboard = () => {
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const societyId = user?.societyId;

    // Step 0 — Flats
    const [flatInput, setFlatInput] = useState(defaultFlats.join(', '));
    const [flatsCreated, setFlatsCreated] = useState(false);
    const [flatsLoading, setFlatsLoading] = useState(false);

    // Step 1 — Residents
    const [residentForm, setResidentForm] = useState({ flatNumber: '', name: '', email: '', password: '', confirmPassword: '' });
    const [residentList, setResidentList] = useState([]);
    const [credsLoading, setCredsLoading] = useState(false);
    const [generatedCreds, setGeneratedCreds] = useState([]);

    // Step 2 — Staff
    const [staffForm, setStaffForm] = useState({ name: '', role: 'security', email: '', password: '', confirmPassword: '' });
    const [staffList, setStaffList] = useState([]);
    const [staffLoading, setStaffLoading] = useState(false);
    const [staffAdded, setStaffAdded] = useState(false);

    // Guard: must be admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    /* ─── Step 0: Create Flats ─── */
    const handleCreateFlats = async () => {
        if (!societyId) {
            toast.error('Society ID is missing. Please re-login.');
            return;
        }
        const nums = flatInput
            .split(/[,\s]+/)
            .map((s) => s.trim())
            .filter(Boolean);
        if (nums.length === 0) {
            toast.error('Enter at least one flat number.');
            return;
        }
        setFlatsLoading(true);
        try {
            await createBulkFlats(societyId, nums);
            setFlatsCreated(true);
            toast.success(`${nums.length} flats created successfully!`);
        } catch (err) {
            toast.error(err?.message || 'Failed to create flats');
        } finally {
            setFlatsLoading(false);
        }
    };

    /* ─── Step 1: Add Residents ─── */
    const addResident = () => {
        const { flatNumber, name, email, password, confirmPassword } = residentForm;
        if (!flatNumber.trim() || !name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            toast.error('All resident fields are required.');
            return;
        }
        if (password.length < 6) {
            toast.error('Resident password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Resident password and confirm password do not match.');
            return;
        }
        if (residentList.find((r) => r.email.toLowerCase() === email.trim().toLowerCase())) {
            toast.error('This email is already added.');
            return;
        }
        setResidentList((prev) => [...prev, {
            flatNumber: flatNumber.trim(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        }]);
        setResidentForm({ flatNumber: '', name: '', email: '', password: '', confirmPassword: '' });
    };

    const removeResident = (email) => {
        setResidentList((prev) => prev.filter((r) => r.email !== email));
    };

    const generateResidentCredentials = async () => {
        if (residentList.length === 0) {
            toast.error('Add at least one resident first.');
            return;
        }
        if (!societyId) {
            toast.error('Society ID is missing. Please re-login.');
            return;
        }
        setCredsLoading(true);
        try {
            const results = await generateBulkCredentials(societyId, residentList.map((r) => ({ ...r, role: 'resident' })));
            setGeneratedCreds(results);
            toast.success(`${results.length} credentials generated!`);
        } catch (err) {
            toast.error(err?.message || 'Failed to generate credentials');
        } finally {
            setCredsLoading(false);
        }
    };

    const downloadCredentials = () => {
        const lines = [
            ['Name', 'Email', 'Flat', 'Password'],
            ...generatedCreds.map((c) => [c.name, c.email, c.flatNumber || '', c.tempPassword]),
        ];
        const csv = lines.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resident-credentials.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    /* ─── Step 2: Add Staff ─── */
    const addStaff = () => {
        const { name, email, role, password, confirmPassword } = staffForm;
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            toast.error('Name, email, and password are required for staff.');
            return;
        }
        if (password.length < 6) {
            toast.error('Staff password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Staff password and confirm password do not match.');
            return;
        }
        setStaffList((prev) => [...prev, { name: name.trim(), email: email.trim().toLowerCase(), role, password }]);
        setStaffForm({ name: '', role: 'security', email: '', password: '', confirmPassword: '' });
    };

    const removeStaff = (email) => {
        setStaffList((prev) => prev.filter((s) => s.email !== email));
    };

    const handleGenerateStaff = async () => {
        if (staffList.length === 0) {
            setStaffAdded(true);
            setStep(3);
            return;
        }
        if (!societyId) {
            toast.error('Society ID is missing. Please re-login.');
            return;
        }
        setStaffLoading(true);
        try {
            for (const member of staffList) {
                await generateCredential({
                    societyId,
                    email: member.email,
                    name: member.name,
                    role: member.role,
                    password: member.password,
                });
            }
            setStaffAdded(true);
            toast.success(`${staffList.length} staff credentials created!`);
            setStep(3);
        } catch (err) {
            toast.error(err?.message || 'Failed to add staff');
        } finally {
            setStaffLoading(false);
        }
    };

    /* ─── Renderers ─── */
    const renderStep0 = () => (
        <div className="onb-step-content">
            <div className="onb-step-icon">🏢</div>
            <h2>Add Flats to Your Society</h2>
            <p className="onb-step-desc">Enter flat numbers separated by commas (e.g. 101, 102, 103).</p>
            <div className="onb-input-group">
                <textarea
                    className="onb-textarea"
                    value={flatInput}
                    onChange={(e) => setFlatInput(e.target.value)}
                    rows={3}
                    placeholder="101, 102, 103, ..."
                    disabled={flatsCreated}
                />
            </div>
            {flatsCreated ? (
                <div className="onb-success-banner">
                    ✅ Flats created successfully! Click Next to continue.
                </div>
            ) : (
                <button className="onb-btn onb-btn-primary" onClick={handleCreateFlats} disabled={flatsLoading}>
                    {flatsLoading ? 'Creating…' : '🏗️ Create All Flats'}
                </button>
            )}
            {flatsCreated && (
                <button className="onb-btn onb-btn-outline" style={{ marginTop: 12 }} onClick={() => setStep(1)}>
                    Next →
                </button>
            )}
        </div>
    );

    const renderStep1 = () => (
        <div className="onb-step-content">
            <div className="onb-step-icon">👤</div>
            <h2>Generate Resident Credentials</h2>
            <p className="onb-step-desc">Add residents with their email and password. They will use these same credentials in the resident portal.</p>

            {generatedCreds.length === 0 ? (
                <>
                    <div className="onb-resident-form">
                        <select
                            value={residentForm.flatNumber}
                            onChange={(e) => setResidentForm((p) => ({ ...p, flatNumber: e.target.value }))}
                        >
                            <option value="">Select Flat</option>
                            {flatInput.split(/[,\s]+/).filter(Boolean).map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Resident Name"
                            value={residentForm.name}
                            onChange={(e) => setResidentForm((p) => ({ ...p, name: e.target.value }))}
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={residentForm.email}
                            onChange={(e) => setResidentForm((p) => ({ ...p, email: e.target.value }))}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={residentForm.password}
                            onChange={(e) => setResidentForm((p) => ({ ...p, password: e.target.value }))}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={residentForm.confirmPassword}
                            onChange={(e) => setResidentForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        />
                        <button className="onb-btn onb-btn-secondary" onClick={addResident} type="button">
                            + Add Resident
                        </button>
                    </div>

                    {residentList.length > 0 && (
                        <div className="onb-list">
                            {residentList.map((r) => (
                                <div className="onb-list-item" key={r.email}>
                                    <span>Flat {r.flatNumber} — <strong>{r.name}</strong> ({r.email})</span>
                                    <button className="onb-remove-btn" onClick={() => removeResident(r.email)} type="button">✕</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        className="onb-btn onb-btn-primary"
                        style={{ marginTop: 16 }}
                        onClick={generateResidentCredentials}
                        disabled={credsLoading || residentList.length === 0}
                    >
                        {credsLoading ? 'Generating…' : `🔑 Generate Credentials (${residentList.length})`}
                    </button>
                </>
            ) : (
                <>
                    <div className="onb-creds-table-wrap">
                        <table className="onb-creds-table">
                            <thead>
                                <tr><th>Name</th><th>Flat</th><th>Email</th><th>Password</th></tr>
                            </thead>
                            <tbody>
                                {generatedCreds.map((c) => (
                                    <tr key={c.email}>
                                        <td>{c.name}</td>
                                        <td>{c.flatNumber}</td>
                                        <td>{c.email}</td>
                                        <td><code className="onb-pass">{c.tempPassword}</code></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="onb-creds-actions">
                        <button className="onb-btn onb-btn-secondary" onClick={downloadCredentials}>
                            ⬇️ Download CSV
                        </button>
                        <button className="onb-btn onb-btn-primary" onClick={() => setStep(2)}>
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="onb-step-content">
            <div className="onb-step-icon">👮</div>
            <h2>Add Staff Members</h2>
            <p className="onb-step-desc">Add staff with direct login credentials. These same email and password values will be used at login.</p>

            <div className="onb-resident-form">
                <input
                    type="text"
                    placeholder="Staff Name"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm((p) => ({ ...p, name: e.target.value }))}
                />
                <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm((p) => ({ ...p, role: e.target.value }))}
                >
                    <option value="security">Security Guard</option>
                    <option value="staff">Maintenance Staff</option>
                </select>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm((p) => ({ ...p, email: e.target.value }))}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm((p) => ({ ...p, password: e.target.value }))}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={staffForm.confirmPassword}
                    onChange={(e) => setStaffForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                />
                <button className="onb-btn onb-btn-secondary" onClick={addStaff} type="button">
                    + Add Staff
                </button>
            </div>

            {staffList.length > 0 && (
                <div className="onb-list">
                    {staffList.map((s) => (
                        <div className="onb-list-item" key={s.email}>
                            <span><strong>{s.name}</strong> ({s.role}) — {s.email}</span>
                            <button className="onb-remove-btn" onClick={() => removeStaff(s.email)} type="button">✕</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="onb-creds-actions" style={{ marginTop: 24 }}>
                <button className="onb-btn onb-btn-outline" onClick={() => setStep(3)}>
                    Skip →
                </button>
                {staffList.length > 0 && (
                    <button className="onb-btn onb-btn-primary" onClick={handleGenerateStaff} disabled={staffLoading}>
                        {staffLoading ? 'Adding Staff…' : `👮 Add ${staffList.length} Staff & Continue`}
                    </button>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="onb-step-content onb-complete">
            <div className="onb-step-icon">🎉</div>
            <h2>Your Society is Ready!</h2>
            <p className="onb-step-desc">Everything is set up. Your residents and staff can now log in.</p>

            <ul className="onb-checklist">
                {flatsCreated && <li>✅ Flats created in Firestore</li>}
                {generatedCreds.length > 0 && <li>✅ {generatedCreds.length} resident credentials generated</li>}
                {staffAdded && staffList.length > 0 && <li>✅ {staffList.length} staff members added</li>}
            </ul>

            <button
                className="onb-btn onb-btn-primary"
                style={{ marginTop: 24 }}
                onClick={() => navigate('/admin/dashboard', { replace: true })}
            >
                🚀 Start Using Dashboard
            </button>
        </div>
    );

    const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3];

    return (
        <div className="onb-page">
            <div className="onb-card">
                <div className="onb-header">
                    <h1 className="onb-brand">CIVIORA Setup</h1>
                    <p className="onb-society-name">{user?.name || 'Admin'} — Society Onboarding</p>
                </div>

                {/* Progress bar */}
                <div className="onb-progress">
                    {STEPS.map((label, i) => (
                        <div key={label} className={`onb-progress-step ${i <= step ? 'onb-progress-done' : ''} ${i === step ? 'onb-progress-active' : ''}`}>
                            <div className="onb-progress-dot">{i < step ? '✓' : i + 1}</div>
                            <span className="onb-progress-label">{label}</span>
                        </div>
                    ))}
                </div>

                {stepRenderers[step]?.()}
            </div>
        </div>
    );
};

export default OnboardingDashboard;
