import React, { useState } from 'react';
import { Bell, Lock, LogOut, Key } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SettingsTabs from '../../components/ui/SettingsTabs';
import Modal from '../../components/ui/Modal';
import './ResidentSettings.css';

const ResidentSettings = () => {
  // Profile State (Read-only for flat number)
  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh@example.com',
    flatNo: 'A-304',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    maintenanceNotifications: true,
    complaintUpdates: true,
    announcementNotifications: true,
  });

  // Payment Preferences State
  const [paymentPreferences, setPaymentPreferences] = useState({
    defaultPaymentMode: 'upi',
    autoReminder: true,
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    lastPasswordChange: '2025-12-15',
    lastLogin: 'Today at 10:45 AM',
  });

  // Modal States
  const [modals, setModals] = useState({
    changePassword: false,
    logoutDevices: false,
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handlers
  const handleProfileChange = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePaymentChange = (key, value) => {
    setPaymentPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveProfile = () => {
    // In production: API call to save profile
    console.log('Profile saved:', profileData);
    // Show success message
  };

  const handleSaveNotifications = () => {
    // In production: API call
    console.log('Notification settings saved:', notificationSettings);
  };

  const handleSavePaymentPreferences = () => {
    // In production: API call
    console.log('Payment preferences saved:', paymentPreferences);
  };

  const openChangePasswordModal = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setModals(prev => ({ ...prev, changePassword: true }));
  };

  const handleChangePassword = () => {
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('All fields are required');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    // In production: API call
    console.log('Password change request:', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    
    alert('Password changed successfully');
    setModals(prev => ({ ...prev, changePassword: false }));
    setSecurityData(prev => ({
      ...prev,
      lastPasswordChange: new Date().toLocaleDateString()
    }));
  };

  const handleLogoutAllDevices = () => {
    // In production: API call
    console.log('Logging out from all devices');
    alert('You have been logged out from all devices. Please login again.');
    // Redirect to login
    window.location.href = '/';
  };

  const tabs = [
    {
      label: 'Profile',
      icon: <span style={{ fontSize: '16px' }}>👤</span>,
      content: (
        <div>
          <h2>Personal Information</h2>
          <div className="settings-form-grid">
            <div>
              <label className="settings-label">Full Name</label>
              <input
                type="text"
                className="settings-input"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Phone Number</label>
              <input
                type="tel"
                className="settings-input"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="10-digit mobile number"
              />
            </div>
            <div className="grid-full">
              <label className="settings-label">Email Address</label>
              <input
                type="email"
                className="settings-input"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
            <div className="grid-full">
              <label className="settings-label">Flat Number</label>
              <input
                type="text"
                className="settings-input"
                value={profileData.flatNo}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                This field cannot be changed. Contact administrator to update.
              </p>
            </div>
          </div>
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary" onClick={handleSaveProfile}>
              Save Profile
            </button>
            <button className="settings-button settings-button-secondary">
              Cancel
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Notifications',
      icon: <Bell size={18} />,
      content: (
        <div>
          <h2>Notification Preferences</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Control which notifications you receive from the society</span>
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Maintenance Notifications</h3>
              <p>Get notified about maintenance billing, due dates, and payment reminders</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.maintenanceNotifications}
              onChange={() => handleNotificationChange('maintenanceNotifications')}
            />
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Complaint Updates</h3>
              <p>Receive updates when your complaints are updated or resolved</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.complaintUpdates}
              onChange={() => handleNotificationChange('complaintUpdates')}
            />
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Announcements</h3>
              <p>Get notified about important society announcements and notices</p>
            </div>
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={notificationSettings.announcementNotifications}
              onChange={() => handleNotificationChange('announcementNotifications')}
            />
          </div>
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary" onClick={handleSaveNotifications}>
              Save Preferences
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Payment',
      icon: <span style={{ fontSize: '16px' }}>💳</span>,
      content: (
        <div>
          <h2>Payment Preferences</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Set your preferred payment method and reminder settings</span>
          </div>
          <div>
            <label className="settings-label">Default Payment Mode</label>
            <select
              className="settings-select"
              value={paymentPreferences.defaultPaymentMode}
              onChange={(e) => handlePaymentChange('defaultPaymentMode', e.target.value)}
            >
              <option value="upi">UPI (Google Pay, PhonePe, PayTM)</option>
              <option value="card">Credit/Debit Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="manual">Manual Transfer</option>
            </select>
          </div>
          <div className="settings-divider"></div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Auto Payment Reminder</h3>
              <p>Receive automatic reminders 3 days before maintenance due date</p>
            </div>
            <button
              className={`toggle-switch ${paymentPreferences.autoReminder ? 'active' : ''}`}
              onClick={() => handlePaymentChange('autoReminder', !paymentPreferences.autoReminder)}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary" onClick={handleSavePaymentPreferences}>
              Save Payment Settings
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Security',
      icon: <Lock size={18} />,
      content: (
        <div>
          <h2>Account Security</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Manage your account security and active sessions</span>
          </div>
          
          <h3 style={{ marginTop: '24px', marginBottom: '16px' }}>Password</h3>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Change Password</h3>
              <p>Last changed on {securityData.lastPasswordChange}</p>
            </div>
            <button
              className="settings-button settings-button-secondary"
              onClick={openChangePasswordModal}
            >
              Change Password
            </button>
          </div>

          <div className="settings-divider"></div>

          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Active Sessions</h3>
          <div className="session-info">
            <div className="session-item">
              <div className="session-details">
                <h4>Current Device</h4>
                <p>Chrome on Windows</p>
                <span className="session-meta">Last active: {securityData.lastLogin}</span>
              </div>
              <span className="session-badge active">Active</span>
            </div>
          </div>

          <div className="settings-divider"></div>

          <div className="settings-item">
            <div className="setting-info">
              <h3>Logout From All Devices</h3>
              <p>Sign out from all other active sessions for security</p>
            </div>
            <button
              className="settings-button settings-button-danger"
              onClick={() => setModals(prev => ({ ...prev, logoutDevices: true }))}
            >
              Logout All
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Appearance',
      icon: <span style={{ fontSize: '16px' }}>🎨</span>,
    },
  ];

  return (
    <div className="resident-settings-page">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your profile, preferences, and account security"
      />
      <div className="settings-wrapper">
        <SettingsTabs tabs={tabs} />
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={modals.changePassword}
        title="Change Password"
        onClose={() => setModals(prev => ({ ...prev, changePassword: false }))}
      >
        <div className="modal-form">
          <div>
            <label className="settings-label">Current Password *</label>
            <input
              type="password"
              className="settings-input"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label className="settings-label">New Password *</label>
            <input
              type="password"
              className="settings-input"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new password (min. 8 characters)"
            />
          </div>
          <div>
            <label className="settings-label">Confirm New Password *</label>
            <input
              type="password"
              className="settings-input"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
            />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '0' }}>
            Password must be at least 8 characters long and contain a mix of uppercase, lowercase, and numbers for security.
          </p>
          <div className="settings-button-group" style={{ marginTop: '20px' }}>
            <button className="settings-button settings-button-primary" onClick={handleChangePassword}>
              Change Password
            </button>
            <button
              className="settings-button settings-button-secondary"
              onClick={() => setModals(prev => ({ ...prev, changePassword: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Logout All Devices Modal */}
      <Modal
        isOpen={modals.logoutDevices}
        title="Confirm Logout"
        onClose={() => setModals(prev => ({ ...prev, logoutDevices: false }))}
      >
        <div className="modal-form">
          <div className="settings-alert settings-alert-warning">
            <span>⚠️</span>
            <span>You will be logged out from all devices. You'll need to login again.</span>
          </div>
          <p>Are you sure you want to logout from all active sessions?</p>
          <div className="settings-button-group" style={{ marginTop: '20px' }}>
            <button className="settings-button settings-button-danger" onClick={handleLogoutAllDevices}>
              Yes, Logout All
            </button>
            <button
              className="settings-button settings-button-secondary"
              onClick={() => setModals(prev => ({ ...prev, logoutDevices: false }))}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResidentSettings;
