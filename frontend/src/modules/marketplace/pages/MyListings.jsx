import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, Eye } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice, timeAgo } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { useToast } from '../../../components/ui/Toast';
import '../styles/marketplace.css';

const MyListings = () => {
    const navigate = useNavigate();
    const { state, deleteListing, updateListing } = useMarketplace();
    const toast = useToast();
    const [deleteId, setDeleteId] = useState(null);
    const [editPriceId, setEditPriceId] = useState(null);
    const [editPrice, setEditPrice] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // In a real app, we'd filter by logged-in user. Here we show listings marked with ownerName = 'Current Resident'
    const myListings = state.listings.filter(l => l.ownerName === 'Current Resident');
    const filtered = activeTab === 'all' ? myListings : myListings.filter(l => l.status === activeTab);

    const handleDelete = () => {
        if (deleteId) {
            deleteListing(deleteId);
            toast.success('Listing deleted');
            setDeleteId(null);
        }
    };

    const handlePriceUpdate = (listingId) => {
        const listing = state.listings.find(l => l.id === listingId);
        if (!listing) return;
        const val = Number(editPrice);
        if (!val || val <= 0) {
            toast.error('Price must be positive');
            return;
        }
        const update = listing.type === 'sale' ? { price: val } : { rent: val };
        updateListing(listingId, update);
        toast.warning('Price updated — listing reset to pending approval');
        setEditPriceId(null);
        setEditPrice('');
    };

    const statusCounts = {
        all: myListings.length,
        draft: myListings.filter(l => l.status === 'draft').length,
        pending: myListings.filter(l => l.status === 'pending').length,
        approved: myListings.filter(l => l.status === 'approved').length,
        rejected: myListings.filter(l => l.status === 'rejected').length,
        sold: myListings.filter(l => l.status === 'sold').length,
        rented: myListings.filter(l => l.status === 'rented').length,
    };

    return (
        <div className="mp-page">
            <div className="mp-page-header">
                <div>
                    <h1>📋 My Listings</h1>
                    <p>Manage your property listings</p>
                </div>
                <div className="mp-header-actions">
                    <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/resident/marketplace')}><ArrowLeft size={16} /> Back</button>
                    <button className="mp-btn mp-btn-primary" onClick={() => navigate('/resident/marketplace/create')}><Plus size={16} /> New Listing</button>
                </div>
            </div>

            <div className="mp-tabs">
                {Object.entries(statusCounts).map(([key, count]) => (
                    <button key={key} className={`mp-tab ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
                        {key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                        <span className="mp-tab-count">{count}</span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <EmptyState
                    icon="📝"
                    title="No listings found"
                    message={activeTab === 'all' ? "You haven't listed any properties yet." : `No ${activeTab} listings.`}
                    action={<button className="mp-btn mp-btn-primary" onClick={() => navigate('/resident/marketplace/create')}><Plus size={16} /> Create Listing</button>}
                />
            ) : (
                <div className="mp-table-wrap">
                    <table className="mp-table">
                        <thead>
                            <tr>
                                <th>Flat</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Views</th>
                                <th>Listed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(listing => (
                                <tr key={listing.id}>
                                    <td><strong>{listing.flatNumber}</strong><br /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{listing.bedrooms}BHK · {listing.area} sq.ft</span></td>
                                    <td>{listing.type === 'sale' ? '🏷️ Sale' : '🔑 Rent'}</td>
                                    <td>
                                        {editPriceId === listing.id ? (
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <input type="number" style={{ width: 100, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }} value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder="New price" autoFocus />
                                                <button className="mp-btn mp-btn-primary mp-btn-sm" onClick={() => handlePriceUpdate(listing.id)}>Save</button>
                                                <button className="mp-btn mp-btn-secondary mp-btn-sm" onClick={() => setEditPriceId(null)}>✕</button>
                                            </div>
                                        ) : (
                                            <span style={{ cursor: 'pointer' }} onClick={() => { setEditPriceId(listing.id); setEditPrice(listing.type === 'sale' ? listing.price : listing.rent); }}>
                                                {listing.type === 'sale' ? formatPrice(listing.price) : `${formatPrice(listing.rent)}/mo`}
                                                <Edit3 size={12} style={{ marginLeft: 4, verticalAlign: 'middle', opacity: 0.5 }} />
                                            </span>
                                        )}
                                    </td>
                                    <td><StatusBadge status={listing.status} /></td>
                                    <td>{listing.views || 0}</td>
                                    <td>{timeAgo(listing.createdAt)}</td>
                                    <td>
                                        <div className="mp-table-actions">
                                            <button className="mp-btn mp-btn-secondary mp-btn-sm" onClick={() => navigate(`/resident/marketplace/${listing.id}`)}><Eye size={14} /></button>
                                            <button className="mp-btn mp-btn-danger mp-btn-sm" onClick={() => setDeleteId(listing.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Listing"
                message="This will permanently delete this listing and all associated enquiries and visits. This action cannot be undone."
                icon="🗑️"
                iconType="danger"
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default MyListings;
