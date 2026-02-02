import React from 'react';

export const PageHeader = ({ title, subtitle, action }) => {
    return (
        <div className="page-header">
            <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
};
