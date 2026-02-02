import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`ui-card ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ title, action }) => {
    return (
        <div className="ui-card-header">
            <h3 className="ui-card-title">{title}</h3>
            {action && <div className="ui-card-action">{action}</div>}
        </div>
    );
};

export const CardContent = ({ children, className = '', ...props }) => {
    return (
        <div className={`ui-card-body ${className}`} {...props}>
            {children}
        </div>
    );
};
