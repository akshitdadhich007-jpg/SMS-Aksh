import React from 'react';
import { getStatusLabel } from '../utils/helpers';

const StatusBadge = ({ status }) => {
    return (
        <span className={`mp-status mp-status-${status}`}>
            {getStatusLabel(status)}
        </span>
    );
};

export default StatusBadge;
