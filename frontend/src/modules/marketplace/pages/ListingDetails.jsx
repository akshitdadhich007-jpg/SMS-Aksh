import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Share2, Send, Calendar, ArrowLeft, Trash2, Bed, Bath, Maximize, Layers, Car, Sofa, MapPin, Eye } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice, timeAgo } from '../utils/helpers';
import { useToast } from '../../../components/ui/Toast';
import ImageCarousel from '../components/ImageCarousel';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/marketplace.css';

const ListingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const toast = useToast();
    const { state, incrementViews, addRecentlyViewed, toggleFavorite, addEnquiry, scheduleVisit, updateListing } = useMarketplace();

    const listing = state.listings.find(l => l.id === id);
    const isFav = state.favorites.includes(id);
    const enquiries = state.enquiries.filter(e => e.listingId === id);
    const visits = state.visits.filter(v => v.listingId === id);

    const [showEnquiryModal, setShowEnquiryModal] = useState(false);
    const [showVisitModal, setShowVisitModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', message: '' });
    const [visitForm, setVisitForm] = useState({ name: '', date: '', time: '', notes: '' });

    useEffect(() => {
        if (listing) {
            incrementViews(id);
            addRecentlyViewed(id);
        }
    }, [id]);

    useEffect(() => {
        if (searchParams.get('enquire') === 'true' && listing) {
            setShowEnquiryModal(true);
        }
    }, [searchParams, listing]);

    if (!listing) {
        return (
            <div className="mp-page">
                <div className="mp-empty">
                    <div className="mp-empty-icon">🔍</div>
                    <h3>Listing Not Found</h3>
                    <p>This listing may have been removed or does not exist.</p>
                    <button className="mp-btn mp-btn-primary" onClick={() => navigate('/resident/marketplace')}>Browse Marketplace</button>
                </div>
            </div>
        );
    }

    const handleEnquiry = () => {
        if (!enquiryForm.name.trim() || !enquiryForm.phone.trim()) {
            toast.error('Name and phone are required');
            return;
        }
        if (['sold', 'rented'].includes(listing.status)) {
            toast.error('Cannot enquire on a sold/rented property');
            return;
        }
        addEnquiry({ ...enquiryForm, listingId: id });
        toast.success('Enquiry sent successfully! The owner will contact you.');
        setShowEnquiryModal(false);
        setEnquiryForm({ name: '', phone: '', message: '' });
    };

    const handleVisit = () => {
        if (!visitForm.name.trim() || !visitForm.date || !visitForm.time) {
            toast.error('Name, date, and time are required');
            return;
        }
        if (['sold', 'rented'].includes(listing.status)) {
            toast.error('Cannot schedule visit for a sold/rented property');
            return;
        }
        const visitDate = new Date(visitForm.date);
        if (visitDate < new Date(new Date().toDateString())) {
            toast.error('Cannot schedule a visit in the past');
            return;
        }
        const alreadyBooked = state.visits.some(v => v.listingId === id && v.date === visitForm.date && v.time === visitForm.time);
        if (alreadyBooked) {
            toast.error('This time slot is already booked');
            return;
        }
        scheduleVisit({ ...visitForm, listingId: id });
        toast.success('Visit scheduled successfully!');
        setShowVisitModal(false);
        setVisitForm({ name: '', date: '', time: '', notes: '' });
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!');
        }).catch(() => {
            toast.info(`Share this link: ${url}`);
        });
    };

    const handleWithdraw = () => {
        updateListing(id, { status: 'rejected' });
        toast.success('Listing withdrawn successfully');
        setShowWithdrawModal(false);
        navigate('/resident/marketplace/my-listings');
    };

    const furnishLabel = { 'unfurnished': 'Unfurnished', 'semi-furnished': 'Semi-Furnished', 'fully-furnished': 'Fully Furnished' };
    const parkingLabel = { 'none': 'No Parking', 'open': 'Open Parking', 'covered': 'Covered Parking' };

    return (
        <div className="mp-page">
            <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/resident/marketplace')} style={{ marginBottom: 20 }}>
                <ArrowLeft size={16} /> Back to Marketplace
            </button>

            <div className="mp-detail">
                {/* Left: Images + Description */}
                <div>
                    <ImageCarousel images={listing.images} />

                    <div className="mp-detail-section" style={{ marginTop: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                                <div className="mp-detail-type">{listing.type === 'sale' ? 'For Sale' : 'For Rent'}</div>
                                <div className="mp-detail-price">
                                    {listing.type === 'sale' ? formatPrice(listing.price) : `${formatPrice(listing.rent)}/month`}
                                </div>
                                {listing.type === 'rent' && listing.deposit > 0 && (
                                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                                        Security Deposit: {formatPrice(listing.deposit)}
                                    </p>
                                )}
                            </div>
                            <StatusBadge status={listing.status} />
                        </div>
                    </div>

                    <div className="mp-detail-section">
                        <h2>Property Details</h2>
                        <div className="mp-specs-grid">
                            <div className="mp-spec-item"><div className="mp-spec-icon"><Bed size={18} /></div><div className="mp-spec-info"><label>Bedrooms</label><span>{listing.bedrooms} BHK</span></div></div>
                            <div className="mp-spec-item"><div className="mp-spec-icon"><Bath size={18} /></div><div className="mp-spec-info"><label>Bathrooms</label><span>{listing.bathrooms}</span></div></div>
                            <div className="mp-spec-item"><div className="mp-spec-icon"><Maximize size={18} /></div><div className="mp-spec-info"><label>Area</label><span>{listing.area} sq.ft</span></div></div>
                            <div className="mp-spec-item"><div className="mp-spec-icon"><Layers size={18} /></div><div className="mp-spec-info"><label>Floor</label><span>{listing.floor}</span></div></div>
                            <div className="mp-spec-item"><div className="mp-spec-icon"><Sofa size={18} /></div><div className="mp-spec-info"><label>Furnishing</label><span>{furnishLabel[listing.furnishing] || listing.furnishing}</span></div></div>
                            <div className="mp-spec-item"><div className="mp-spec-icon"><Car size={18} /></div><div className="mp-spec-info"><label>Parking</label><span>{parkingLabel[listing.parking] || listing.parking}</span></div></div>
                        </div>
                    </div>

                    <div className="mp-detail-section">
                        <h2>Description</h2>
                        <p className="mp-detail-desc">{listing.description}</p>
                    </div>
                </div>

                {/* Right: Actions + Owner + Stats */}
                <div className="mp-detail-sidebar">
                    <div className="mp-detail-section">
                        <h3>Quick Actions</h3>
                        <div className="mp-detail-actions" style={{ flexDirection: 'column' }}>
                            {!['sold', 'rented'].includes(listing.status) && (
                                <>
                                    <button className="mp-btn mp-btn-primary" onClick={() => setShowEnquiryModal(true)}><Send size={16} /> Send Enquiry</button>
                                    <button className="mp-btn mp-btn-success" onClick={() => setShowVisitModal(true)}><Calendar size={16} /> Schedule Visit</button>
                                </>
                            )}
                            <button className={`mp-btn ${isFav ? 'mp-btn-danger' : 'mp-btn-secondary'}`} onClick={() => { toggleFavorite(id); toast.success(isFav ? 'Removed from favorites' : 'Added to favorites'); }}>
                                <Heart size={16} fill={isFav ? '#dc2626' : 'none'} /> {isFav ? 'Remove Favorite' : 'Add to Favorites'}
                            </button>
                            <button className="mp-btn mp-btn-secondary" onClick={handleShare}><Share2 size={16} /> Share Listing</button>
                            {listing.ownerFlat && (
                                <button className="mp-btn mp-btn-warning" onClick={() => setShowWithdrawModal(true)}><Trash2 size={16} /> Withdraw Listing</button>
                            )}
                        </div>
                    </div>

                    <div className="mp-detail-section">
                        <h3>Owner Info</h3>
                        <div className="mp-owner-info">
                            <div className="mp-owner-avatar">{(listing.ownerName || 'R')[0]}</div>
                            <div className="mp-owner-details">
                                <h4>{listing.ownerName || 'Resident'}</h4>
                                <p><MapPin size={12} style={{ verticalAlign: 'middle' }} /> Flat {listing.ownerFlat || listing.flatNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mp-detail-section">
                        <h3>Listing Stats</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}><span><Eye size={14} style={{ verticalAlign: 'middle' }} /> Views</span><strong style={{ color: 'var(--text-primary)' }}>{listing.views || 0}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}><span>📩 Enquiries</span><strong style={{ color: 'var(--text-primary)' }}>{listing.enquiryCount || 0}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}><span>📅 Listed</span><strong style={{ color: 'var(--text-primary)' }}>{timeAgo(listing.createdAt)}</strong></div>
                        </div>
                    </div>

                    {visits.length > 0 && (
                        <div className="mp-detail-section">
                            <h3>Scheduled Visits ({visits.length})</h3>
                            {visits.map(v => (
                                <div key={v.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border, #e2e8f0)', fontSize: 13 }}>
                                    <strong>{v.name}</strong> — {v.date} at {v.time}
                                    {v.notes && <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{v.notes}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Enquiry Modal */}
            {showEnquiryModal && (
                <div className="mp-modal-overlay" onClick={() => setShowEnquiryModal(false)}>
                    <div className="mp-modal" onClick={e => e.stopPropagation()}>
                        <div className="mp-modal-header"><h2>Send Enquiry</h2><button className="mp-btn-icon" onClick={() => setShowEnquiryModal(false)}>✕</button></div>
                        <div className="mp-modal-body">
                            <div className="mp-form">
                                <div className="mp-form-group"><label>Your Name *</label><input type="text" placeholder="Enter your name" value={enquiryForm.name} onChange={e => setEnquiryForm(prev => ({ ...prev, name: e.target.value }))} /></div>
                                <div className="mp-form-group"><label>Phone Number *</label><input type="text" placeholder="Enter phone number" value={enquiryForm.phone} onChange={e => setEnquiryForm(prev => ({ ...prev, phone: e.target.value }))} /></div>
                                <div className="mp-form-group"><label>Message</label><textarea placeholder="I'm interested in this property..." value={enquiryForm.message} onChange={e => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))} rows={4} /></div>
                            </div>
                        </div>
                        <div className="mp-modal-footer">
                            <button className="mp-btn mp-btn-secondary" onClick={() => setShowEnquiryModal(false)}>Cancel</button>
                            <button className="mp-btn mp-btn-primary" onClick={handleEnquiry}><Send size={16} /> Send Enquiry</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visit Modal */}
            {showVisitModal && (
                <div className="mp-modal-overlay" onClick={() => setShowVisitModal(false)}>
                    <div className="mp-modal" onClick={e => e.stopPropagation()}>
                        <div className="mp-modal-header"><h2>Schedule Visit</h2><button className="mp-btn-icon" onClick={() => setShowVisitModal(false)}>✕</button></div>
                        <div className="mp-modal-body">
                            <div className="mp-form">
                                <div className="mp-form-group"><label>Your Name *</label><input type="text" placeholder="Enter your name" value={visitForm.name} onChange={e => setVisitForm(prev => ({ ...prev, name: e.target.value }))} /></div>
                                <div className="mp-form-group"><label>Preferred Date *</label><input type="date" min={new Date().toISOString().split('T')[0]} value={visitForm.date} onChange={e => setVisitForm(prev => ({ ...prev, date: e.target.value }))} /></div>
                                <div className="mp-form-group"><label>Preferred Time *</label><input type="time" value={visitForm.time} onChange={e => setVisitForm(prev => ({ ...prev, time: e.target.value }))} /></div>
                                <div className="mp-form-group"><label>Notes</label><textarea placeholder="Any specific requirements..." value={visitForm.notes} onChange={e => setVisitForm(prev => ({ ...prev, notes: e.target.value }))} rows={3} /></div>
                            </div>
                        </div>
                        <div className="mp-modal-footer">
                            <button className="mp-btn mp-btn-secondary" onClick={() => setShowVisitModal(false)}>Cancel</button>
                            <button className="mp-btn mp-btn-success" onClick={handleVisit}><Calendar size={16} /> Schedule</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            <ConfirmModal
                isOpen={showWithdrawModal}
                title="Withdraw Listing"
                message="Are you sure you want to withdraw this listing? It will be marked as rejected and hidden from the marketplace."
                icon="🗑️"
                iconType="danger"
                confirmText="Yes, Withdraw"
                onConfirm={handleWithdraw}
                onCancel={() => setShowWithdrawModal(false)}
            />
        </div>
    );
};

export default ListingDetails;
