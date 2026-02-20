import React from 'react';
import { Card } from './Card';

export const StatCard = ({ label, value, trend, trendLabel, icon, accentColor }) => {
    const accent = accentColor || 'var(--brand-blue)';
    return (
        <Card className="stat-card" style={{ borderLeft: `3px solid ${accent}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                {icon && (
                    <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: `${accent}12`, color: accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, flexShrink: 0
                    }}>
                        {icon}
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <div className="stat-label">{label}</div>
                    <div className="stat-value">{value}</div>
                    {trend !== undefined && trend !== 0 && (
                        <div className={`stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
