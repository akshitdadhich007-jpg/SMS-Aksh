import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Eye } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice, timeAgo } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { useToast } from '../../../components/ui/Toast';
import '../styles/marketplace.css';

const PendingListings = () => {
    const navigate = useNavigate();
    const { state, approveListing, rejectListing } = useMarketplace();
    const toast = useToast();

    const pending = state.listings.filter(l => l.status === 'pending');

    const handleApproveAll = () => {
        pending.forEach(l => approveListing(l.id));
        toast.success(`${pending.length} listings approved!`);
    };

    return (
        <div className="mp-page">
            <div className="mp-page-header">
                <div>
                    <h1>⏳ Pending Listings</h1>
                    <p>{pending.length} listings awaiting approval</p>
                </div>
                <div className="mp-header-actions">
                    <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/admin/marketplace')}><ArrowLeft size={16} /> Back</button>
                    {pending.length > 0 && (
                        <button className="mp-btn mp-btn-success" onClick={handleApproveAll}><Check size={16} /> Approve All</button>
                    )}
                </div>
            </div>

            {pending.length === 0 ? (
                <EmptyState icon="✅" title="All caught up!" message="There are no pending listings to review." />
            ) : (
                <div className="mp-grid">
                    {pending.map(l => (
                        <div key={l.id} className="mp-listing-card">
                            <div className="mp-card-image">
                                {l.images && l.images.length > 0 ? (
                                    <img src={l.images[0]} alt={`Flat ${l.flatNumber}`} loading="lazy" />
                                ) : (
                                    <span className="mp-card-placeholder">🏠</span>
                                )}
                                <div className="mp-card-badges">
                                    <StatusBadge status={l.status} />
                                </div>
                            </div>
                            <div className="mp-card-body">
                                <div className="mp-card-price">
                                    {l.type === 'sale' ? formatPrice(l.price) : `${formatPrice(l.rent)}/mo`}
                                </div>
                                <div className="mp-card-flat">Flat {l.flatNumber} · {l.bedrooms}BHK · {l.area} sq.ft</div>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '8px 0' }}>
                                    By <strong>{l.ownerName || 'Unknown'}</strong> · {timeAgo(l.createdAt)}
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {l.description}
                                </p>
                                <div className="mp-card-footer">
                                    <button className="mp-btn mp-btn-success mp-btn-sm" onClick={() => { approveListing(l.id); toast.success(`Flat ${l.flatNumber} approved`); }}><Check size={14} /> Approve</button>
                                    <button className="mp-btn mp-btn-danger mp-btn-sm" onClick={() => { rejectListing(l.id); toast.warning(`Flat ${l.flatNumber} rejected`); }}><X size={14} /> Reject</button>
                                    <button className="mp-btn mp-btn-secondary mp-btn-sm" onClick={() => navigate(`/resident/marketplace/${l.id}`)}><Eye size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingListings;
