import React from 'react';

const SkeletonLoader = ({ count = 6 }) => {
    return (
        <div className="mp-grid">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="mp-skeleton-card">
                    <div className="mp-skeleton mp-skeleton-image" />
                    <div className="mp-skeleton-body">
                        <div className="mp-skeleton mp-skeleton-line h24 w60" />
                        <div className="mp-skeleton mp-skeleton-line w40" />
                        <div className="mp-skeleton mp-skeleton-line w80" />
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <div className="mp-skeleton" style={{ height: 36, flex: 1, borderRadius: 8 }} />
                            <div className="mp-skeleton" style={{ height: 36, flex: 1, borderRadius: 8 }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
