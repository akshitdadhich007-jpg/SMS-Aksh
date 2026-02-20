import React from 'react';

const STATUS_MAP = {
    'reported': { bg: '#e0f2fe', color: '#0369a1', label: 'Reported' },
    'matched': { bg: '#ede9fe', color: '#6d28d9', label: 'Match Found' },
    'under_review': { bg: '#fff7ed', color: '#c2410c', label: 'Under Review' },
    'claim_pending': { bg: '#fff7ed', color: '#c2410c', label: 'Claim Pending' },
    'claimed': { bg: '#fff7ed', color: '#c2410c', label: 'Claim Submitted' },
    'claim_verified': { bg: '#d1fae5', color: '#065f46', label: 'Verified' },
    'approved': { bg: '#dcfce7', color: '#15803d', label: 'Approved' },
    'rejected': { bg: '#fee2e2', color: '#b91c1c', label: 'Rejected' },
    'returned': { bg: '#f0fdf4', color: '#166534', label: 'Returned' },
    'collected': { bg: '#f3f4f6', color: '#374151', label: 'Collected' },
    'handed_over': { bg: '#f3f4f6', color: '#374151', label: 'Handed Over' },
    'expired': { bg: '#fee2e2', color: '#b91c1c', label: 'Expired' },
    'archived': { bg: '#fef3c7', color: '#92400e', label: 'Archived' },
    'closed': { bg: '#94a3b8', color: '#ffffff', label: 'Closed' },
};

const TracebackStatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { bg: '#f3f4f6', color: '#4b5563', label: status || 'Unknown' };
    return (
        <span style={{
            backgroundColor: s.bg, color: s.color,
            padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
            fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px',
            whiteSpace: 'nowrap',
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
            {s.label}
        </span>
    );
};

export default TracebackStatusBadge;
