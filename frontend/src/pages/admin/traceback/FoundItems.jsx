import React from 'react';
import { Box, Clock, Image as ImageIcon } from 'lucide-react';
import TracebackStatusBadge from './TracebackStatusBadge';

const FoundItems = ({ items, isAdmin, onReportFound, searchTerm }) => {
    const filtered = items.filter(item => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return item.description?.toLowerCase().includes(s) || item.category?.toLowerCase().includes(s) || item.location?.toLowerCase().includes(s);
    });

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 30) return `${days} days ago`;
        return `${Math.floor(days / 30)} month(s) ago`;
    };

    return (
        <div>
            {filtered.length === 0 ? (
                <div className="premium-empty-state">
                    <div className="empty-icon-circle"><Box size={32} /></div>
                    <h3>{searchTerm ? 'No Matching Found Items' : 'No Found Items Reported'}</h3>
                    <p>{searchTerm ? 'Try adjusting your search.' : 'Thank you for keeping our community safe. Report items you find here.'}</p>
                    {!searchTerm && (
                        <button className="btn-gradient" style={{ margin: '0 auto' }} onClick={onReportFound}>+ Report Found Item</button>
                    )}
                </div>
            ) : (
                <div className="traceback-grid-2col">
                    {filtered.map(item => (
                        <div key={item.id} className="traceback-card item-card">
                            {item.image_url && (
                                <div className="traceback-card-thumb">
                                    <img src={item.image_url} alt={item.category} />
                                </div>
                            )}
                            <div className="item-header">
                                <span className="item-category found-category">{item.category}</span>
                                <TracebackStatusBadge status={item.status} />
                            </div>
                            <p className="item-desc">{item.description}</p>
                            {item.color && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Color: {item.color}</div>}
                            <div className="item-meta">
                                <Clock size={12} style={{ marginRight: 5 }} />
                                {timeAgo(item.created_at)} · Found at: {item.location}
                                {isAdmin && (
                                    <span style={{ fontWeight: 'bold', display: 'block', marginTop: 4 }}>
                                        Held by: {item.reporter_id === 'security' || item.reporter_id === 'admin' ? 'Security Office' : 'Resident'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoundItems;
