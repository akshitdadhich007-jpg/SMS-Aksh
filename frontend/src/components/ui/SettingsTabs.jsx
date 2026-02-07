import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import './SettingsTabs.css';

export default function SettingsTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const isAppearanceTab = tabs[activeTab]?.label === 'Appearance';

  return (
    <div className="settings-container">
      {/* Tab Navigation */}
      <div className="settings-tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`settings-tab ${activeTab === index ? 'active' : ''}`}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="settings-content">
        {/* Dark Mode Toggle - Available in Appearance Tab */}
        {isAppearanceTab && (
          <div className="settings-section">
            <h2>Appearance</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Dark Mode</h3>
                <p>Enable dark theme for better visibility in low-light environments</p>
              </div>
              <button
                className={`theme-toggle ${isDarkMode ? 'active' : ''}`}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Moon size={20} className="theme-icon" />
                ) : (
                  <Sun size={20} className="theme-icon" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Custom Tab Content */}
        {tabs[activeTab]?.content && (
          <div className="settings-section">
            {tabs[activeTab].content}
          </div>
        )}
      </div>
    </div>
  );
}
