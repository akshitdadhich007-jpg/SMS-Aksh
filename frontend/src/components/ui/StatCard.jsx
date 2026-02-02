import React from 'react';
import { Card } from './Card';

export const StatCard = ({ label, value, trend, trendLabel, icon }) => {
    return (
        <Card className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
            {trend && (
                <div className={`stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
                </div>
            )}
        </Card>
    );
};
