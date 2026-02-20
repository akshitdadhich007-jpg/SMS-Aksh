import React from 'react';
import { Search, Box, ShieldQuestion, BarChart3, Archive } from 'lucide-react';

const TracebackTabs = ({ activeTab, onTabChange, counts, isAdmin }) => {
    const tabs = [
        { id: 'lost', icon: <Search size={16} />, label: isAdmin ? 'All Lost Reports' : 'My Lost Items', count: counts.lost },
        { id: 'found', icon: <Box size={16} />, label: isAdmin ? 'Found Inventory' : 'My Found Items', count: counts.found },
        { id: 'claims', icon: <ShieldQuestion size={16} />, label: isAdmin ? 'Review Claims' : 'My Claims', count: counts.claims, highlight: true },
        { id: 'archived', icon: <Archive size={16} />, label: 'Archived', count: counts.archived },
    ];

    if (isAdmin) {
        tabs.push({ id: 'analytics', icon: <BarChart3 size={16} />, label: 'Analytics', count: null });
    }

    return (
        <div className="pill-tabs-container">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`pill-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.icon}
                    {tab.label}
                    {tab.count != null && tab.count > 0 && (
                        <span className="tab-badge" style={tab.highlight && tab.count > 0 ? { background: '#f59e0b' } : {}}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default TracebackTabs;
