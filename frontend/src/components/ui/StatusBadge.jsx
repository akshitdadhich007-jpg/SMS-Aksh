import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
    const getVariant = (s) => {
        switch (String(s).toLowerCase()) {
            case 'paid':
            case 'active':
            case 'completed':
            case 'resolved':
            case 'arrived':
                return 'success';
            case 'pending':
            case 'due':
            case 'processing':
                return 'warning';
            case 'overdue':
            case 'failed':
            case 'rejected':
            case 'emergency':
                return 'danger';
            default:
                return 'neutral';
        }
    };

    const variant = getVariant(status);

    return (
        <span className={`badge badge-${variant} ${className}`}>
            {status}
        </span>
    );
};
