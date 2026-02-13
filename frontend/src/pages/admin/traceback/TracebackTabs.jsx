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
};

export default TracebackTabs;
