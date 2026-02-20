import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, Trash2, Eye, ShoppingBag, AlertTriangle, DollarSign } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice, timeAgo, getStatusLabel } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { useToast } from '../../../components/ui/Toast';
import '../styles/marketplace.css';

const AdminMarketplace = () => {
    const navigate = useNavigate();
    const { state, approveListing, rejectListing, markSold, markRented, toggleFeatured, togglePremium, deleteListing, deleteEnquiry } = useMarketplace();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('all');
    const [deleteId, setDeleteId] = useState(null);
    const [showEnquiries, setShowEnquiries] = useState(false);

    const tabFilters = {
        all: state.listings,
        pending: state.listings.filter(l => l.status === 'pending'),
        approved: state.listings.filter(l => l.status === 'approved' || l.status === 'under_visit'),
        rejected: state.listings.filter(l => l.status === 'rejected'),
        sold: state.listings.filter(l => l.status === 'sold'),
        rented: state.listings.filter(l => l.status === 'rented'),
    };

    const currentListings = tabFilters[activeTab] || [];

    const handleApprove = (id) => { approveListing(id); toast.success('Listing approved!'); };
    const handleReject = (id) => { rejectListing(id); toast.warning('Listing rejected'); };
    const handleSold = (id) => { markSold(id); toast.success('Marked as Sold'); };
    const handleRented = (id) => { markRented(id); toast.success('Marked as Rented'); };
    const handleFeatured = (id) => {
        const listing = state.listings.find(l => l.id === id);
        toggleFeatured(id);
        toast.info(listing?.featured ? 'Removed from featured' : 'Added to featured');
    };
    const handlePremium = (id) => {
        const listing = state.listings.find(l => l.id === id);
        togglePremium(id);
        toast.info(listing?.premium ? 'Premium removed' : 'Premium enabled');
    };
    const handleDelete = () => {
        if (deleteId) { deleteListing(deleteId); toast.success('Listing deleted permanently'); setDeleteId(null); }
    };

    return (
        <div className="mp-page">
            <div className="mp-page-header">
                <div>
                    <h1>🏘️ Marketplace Management</h1>
                    <p>Review, approve, and manage property listings</p>
                </div>
                <div className="mp-header-actions">
                    <button className="mp-btn mp-btn-secondary" onClick={() => setShowEnquiries(!showEnquiries)}>
                        📩 Enquiries ({state.enquiries.length})
                    </button>
                    <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/admin/marketplace/pending')}>
                        <AlertTriangle size={16} /> Pending ({tabFilters.pending.length})
                    </button>
                    <button className="mp-btn mp-btn-primary" onClick={() => navigate('/admin/marketplace/analytics')}>
                        📊 Analytics
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="mp-stats">
                <div className="mp-stat-card"><div className="mp-stat-label">Total Listings</div><div className="mp-stat-value">{state.listings.length}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Pending</div><div className="mp-stat-value" style={{ color: '#d97706' }}>{tabFilters.pending.length}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Active</div><div className="mp-stat-value" style={{ color: '#16a34a' }}>{tabFilters.approved.length}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Sold / Rented</div><div className="mp-stat-value" style={{ color: '#7c3aed' }}>{tabFilters.sold.length + tabFilters.rented.length}</div></div>
            </div>

            {/* Enquiries Panel */}
            {showEnquiries && (
                <div className="mp-detail-section" style={{ marginBottom: 20 }}>
                    <h2>📩 All Enquiries ({state.enquiries.length})</h2>
                    {state.enquiries.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No enquiries yet.</p>
                    ) : (
                        <div className="mp-table-wrap">
                            <table className="mp-table">
                                <thead><tr><th>Name</th><th>Phone</th><th>Listing</th><th>Message</th><th>Date</th><th>Action</th></tr></thead>
                                <tbody>
                                    {state.enquiries.map(e => {
                                        const listing = state.listings.find(l => l.id === e.listingId);
                                        return (
                                            <tr key={e.id}>
                                                <td><strong>{e.name}</strong></td>
                                                <td>{e.phone}</td>
                                                <td>{listing ? `Flat ${listing.flatNumber}` : e.listingId}</td>
                                                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message || '—'}</td>
                                                <td>{timeAgo(e.createdAt)}</td>
                                                <td><button className="mp-btn mp-btn-danger mp-btn-sm" onClick={() => { deleteEnquiry(e.id); toast.success('Enquiry deleted'); }}><Trash2 size={14} /></button></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Tabs */}
            <div className="mp-tabs">
                {Object.entries(tabFilters).map(([key, items]) => (
                    <button key={key} className={`mp-tab ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} <span className="mp-tab-count">{items.length}</span>
                    </button>
                ))}
            </div>

            {/* Listings Table */}
            {currentListings.length === 0 ? (
                <EmptyState icon="📭" title={`No ${activeTab} listings`} message="All clear here." />
            ) : (
                <div className="mp-table-wrap">
                    <table className="mp-table">
                        <thead>
                            <tr><th>Flat</th><th>Type</th><th>Price</th><th>Owner</th><th>Status</th><th>Views</th><th>Listed</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {currentListings.map(l => (
                                <tr key={l.id}>
                                    <td><strong>{l.flatNumber}</strong><br /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{l.bedrooms}BHK · {l.area} sq.ft</span></td>
                                    <td>{l.type === 'sale' ? '🏷️ Sale' : '🔑 Rent'}</td>
                                    <td>{l.type === 'sale' ? formatPrice(l.price) : `${formatPrice(l.rent)}/mo`}</td>
                                    <td>{l.ownerName || '—'}</td>
                                    <td><StatusBadge status={l.status} />{l.featured && <span style={{ marginLeft: 4, fontSize: 12 }}>⭐</span>}{l.premium && <span style={{ marginLeft: 2, fontSize: 12 }}>💎</span>}</td>
                                    <td>{l.views || 0}</td>
                                    <td>{timeAgo(l.createdAt)}</td>
                                    <td>
                                        <div className="mp-table-actions">
                                            <button className="mp-btn mp-btn-secondary mp-btn-sm" onClick={() => navigate(`/resident/marketplace/${l.id}`)} title="View"><Eye size={14} /></button>
                                            {l.status === 'pending' && <button className="mp-btn mp-btn-success mp-btn-sm" onClick={() => handleApprove(l.id)} title="Approve"><Check size={14} /></button>}
                                            {l.status === 'pending' && <button className="mp-btn mp-btn-danger mp-btn-sm" onClick={() => handleReject(l.id)} title="Reject"><X size={14} /></button>}
                                            {['approved', 'under_visit'].includes(l.status) && l.type === 'sale' && <button className="mp-btn mp-btn-purple mp-btn-sm" onClick={() => handleSold(l.id)} title="Mark Sold"><DollarSign size={14} /></button>}
                                            {['approved', 'under_visit'].includes(l.status) && l.type === 'rent' && <button className="mp-btn mp-btn-cyan mp-btn-sm" onClick={() => handleRented(l.id)} title="Mark Rented"><ShoppingBag size={14} /></button>}
                                            {l.status === 'approved' && <button className={`mp-btn mp-btn-sm ${l.featured ? 'mp-btn-warning' : 'mp-btn-secondary'}`} onClick={() => handleFeatured(l.id)} title="Toggle Featured"><Star size={14} /></button>}
                                            <button className="mp-btn mp-btn-danger mp-btn-sm" onClick={() => setDeleteId(l.id)} title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmModal isOpen={!!deleteId} title="Delete Listing" message="This will permanently delete this listing and all associated data." icon="🗑️" iconType="danger" confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
        </div>
    );
};

export default AdminMarketplace;
