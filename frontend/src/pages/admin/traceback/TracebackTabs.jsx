<<<<<<< HEAD
import React from 'react';
import { Search, Box, ShieldQuestion } from 'lucide-react';

const TracebackTabs = ({ activeTab, onTabChange, counts, isAdmin }) => {
    return (
        <div className="pill-tabs-container">
            <button 
                className={`pill-tab ${activeTab === 'lost' ? 'active' : ''}`}
                onClick={() => onTabChange('lost')}
            >
                <Search size={16} />
                {isAdmin ? 'All Lost Reports' : 'My Lost Items'}
                <span className="tab-badge">{counts.lost || 0}</span>
            </button>
            
            <button 
                className={`pill-tab ${activeTab === 'found' ? 'active' : ''}`}
                onClick={() => onTabChange('found')}
            >
                <Box size={16} />
                {isAdmin ? 'Found Inventory' : 'My Found Items'}
                <span className="tab-badge">{counts.found || 0}</span>
            </button>
            
            <button 
                className={`pill-tab ${activeTab === 'claims' ? 'active' : ''}`}
                onClick={() => onTabChange('claims')}
            >
                <ShieldQuestion size={16} />
                {isAdmin ? 'Verify Claims' : 'Incoming Claims'}
                {counts.claims > 0 && <span className="tab-badge" style={{background:'#f59e0b'}}>{counts.claims}</span>}
            </button>
        </div>
    );
=======
import React from "react";
import { Search, Box, ShieldQuestion, BarChart3, Archive } from "lucide-react";

const TracebackTabs = ({ activeTab, onTabChange, counts, isAdmin }) => {
  const tabs = [
    {
      id: "lost",
      icon: <Search size={16} />,
      label: isAdmin ? "All Lost Reports" : "My Lost Items",
      count: counts.lost,
    },
    {
      id: "found",
      icon: <Box size={16} />,
      label: isAdmin ? "Found Inventory" : "My Found Items",
      count: counts.found,
    },
    {
      id: "claims",
      icon: <ShieldQuestion size={16} />,
      label: isAdmin ? "Review Claims" : "My Claims",
      count: counts.claims,
      highlight: true,
    },
    {
      id: "archived",
      icon: <Archive size={16} />,
      label: "Archived",
      count: counts.archived,
    },
  ];

  if (isAdmin) {
    tabs.push({
      id: "analytics",
      icon: <BarChart3 size={16} />,
      label: "Analytics",
      count: null,
    });
  }

  return (
    <div className="pill-tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`pill-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          {tab.label}
          {tab.count != null && tab.count > 0 && (
            <span
              className="tab-badge"
              style={
                tab.highlight && tab.count > 0 ? { background: "#f59e0b" } : {}
              }
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
};

export default TracebackTabs;
