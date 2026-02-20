import React from 'react';

const EmptyState = ({ icon = '📭', title = 'No items found', message = 'Try adjusting your filters or check back later.', action }) => {
    return (
        <div className="mp-empty">
            <div className="mp-empty-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{message}</p>
            {action && action}
        </div>
    );
};

export default EmptyState;
