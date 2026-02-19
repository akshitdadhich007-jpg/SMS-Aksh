import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    return (
        <button
            className={`btn btn-${variant} ${sizeClass} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
