import React, { useState } from 'react';
import { User, Shield, Bell, Palette } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SettingsTabs from '../../components/ui/SettingsTabs';
import './SecuritySettings.css';

const SecuritySettings = () => {
  const [profileData, setProfileData] = useState({
    name: 'Amit Yadav',
    shiftStart: '08:00',
    shiftEnd: '20:00',
    contact: '+91-9876543210',
  });

  const [accessControls, setAccessControls] = useState({
    visitorEntry: true,
    vehicleEntry: true,
    deliveryEntry: true,
  });

  const [alertSettings, setAlertSettings] = useState({
    emergencySound: true,
    nightMode: false,
  });

  const handleProfileChange = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const handleAccessToggle = (key) => {
    setAccessControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAlertToggle = (key) => {
    setAlertSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    console.log('Profile saved:', profileData);
  };

  const handleSaveAccessControls = () => {
    console.log('Access controls saved:', accessControls);
  };

  const handleSaveAlerts = () => {
    console.log('Alert settings saved:', alertSettings);
  };

  const tabs = [
    {
      label: 'Profile',
      icon: <User size={18} />,
      content: (
        <div>
          <h2>Security Profile</h2>
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
              <label className="settings-label">Contact Number</label>
              <input
                type="tel"
                className="settings-input"
                value={profileData.contact}
                onChange={(e) => handleProfileChange('contact', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Shift Start</label>
              <input
                type="time"
                className="settings-input"
                value={profileData.shiftStart}
                onChange={(e) => handleProfileChange('shiftStart', e.target.value)}
              />
            </div>
            <div>
              <label className="settings-label">Shift End</label>
              <input
                type="time"
                className="settings-input"
                value={profileData.shiftEnd}
                onChange={(e) => handleProfileChange('shiftEnd', e.target.value)}
              />
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
      label: 'Access Controls',
      icon: <Shield size={18} />,
      content: (
        <div>
          <h2>Gate Access Controls</h2>
          <div className="settings-alert settings-alert-info">
            <span>ℹ️</span>
            <span>Enable or disable gate entry categories for security operations</span>
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Visitor Entry</h3>
              <p>Allow visitor check-in and approvals</p>
            </div>
            <button
              className={`toggle-switch ${accessControls.visitorEntry ? 'active' : ''}`}
              onClick={() => handleAccessToggle('visitorEntry')}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Vehicle Entry</h3>
              <p>Allow vehicle entry logs and gate pass</p>
            </div>
            <button
              className={`toggle-switch ${accessControls.vehicleEntry ? 'active' : ''}`}
              onClick={() => handleAccessToggle('vehicleEntry')}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Delivery Entry</h3>
              <p>Allow delivery and package logs</p>
            </div>
            <button
              className={`toggle-switch ${accessControls.deliveryEntry ? 'active' : ''}`}
              onClick={() => handleAccessToggle('deliveryEntry')}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary" onClick={handleSaveAccessControls}>
              Save Access Controls
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Alerts',
      icon: <Bell size={18} />,
      content: (
        <div>
          <h2>Alert Preferences</h2>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Emergency Sound</h3>
              <p>Play alert sound for emergency notifications</p>
            </div>
            <button
              className={`toggle-switch ${alertSettings.emergencySound ? 'active' : ''}`}
              onClick={() => handleAlertToggle('emergencySound')}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          <div className="settings-item">
            <div className="setting-info">
              <h3>Night Mode Alerts</h3>
              <p>Reduce alert noise and visual intensity at night</p>
            </div>
            <button
              className={`toggle-switch ${alertSettings.nightMode ? 'active' : ''}`}
              onClick={() => handleAlertToggle('nightMode')}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
          <div className="settings-button-group">
            <button className="settings-button settings-button-primary" onClick={handleSaveAlerts}>
              Save Alert Settings
            </button>
          </div>
        </div>
      ),
    },
    {
      label: 'Appearance',
      icon: <Palette size={18} />,
    },
  ];

  return (
    <div className="security-settings-page">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, access controls, and alert preferences"
      />
      <div className="settings-wrapper">
        <SettingsTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default SecuritySettings;
