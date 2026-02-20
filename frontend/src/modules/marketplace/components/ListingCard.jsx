import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import StatusBadge from './StatusBadge';
import { useMarketplace } from '../context/MarketplaceContext';

const ListingCard = ({ listing, basePath = '/resident/marketplace', showActions = true, showFav = true }) => {
    const navigate = useNavigate();
    const { toggleFavorite, state } = useMarketplace();
    const isFav = state.favorites.includes(listing.id);
    const mainImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

    const handleCardClick = () => {
        navigate(`${basePath}/${listing.id}`);
    };

    const handleFav = (e) => {
        e.stopPropagation();
        toggleFavorite(listing.id);
    };

    const handleEnquire = (e) => {
        e.stopPropagation();
        navigate(`${basePath}/${listing.id}?enquire=true`);
    };

    return (
        <div className={`mp-listing-card ${listing.premium ? 'premium' : ''}`} onClick={handleCardClick}>
            <div className="mp-card-image">
                {mainImage ? (
                    <img src={mainImage} alt={`Flat ${listing.flatNumber}`} loading="lazy" />
                ) : (
                    <span className="mp-card-placeholder">🏠</span>
                )}
                <div className="mp-card-badges">
                    <StatusBadge status={listing.status} />
                    {listing.type && (
                        <span className={`mp-status ${listing.type === 'sale' ? 'mp-status-sold' : 'mp-status-rented'}`}>
                            {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                    )}
                </div>
                {listing.featured && <div className="mp-featured-ribbon">FEATURED</div>}
                {listing.premium && <div className="mp-premium-badge">⭐ PREMIUM</div>}
                {showFav && (
                    <button className={`mp-card-fav ${isFav ? 'active' : ''}`} onClick={handleFav} aria-label="Toggle favorite">
                        <Heart size={18} fill={isFav ? '#ef4444' : 'none'} />
                    </button>
                )}
            </div>
            <div className="mp-card-body">
                <div className="mp-card-price">
                    {listing.type === 'sale' ? formatPrice(listing.price) : formatPrice(listing.rent)}
                    {listing.type === 'rent' && <span className="mp-price-label"> /month</span>}
                </div>
                <div className="mp-card-flat">
                    <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Flat {listing.flatNumber} · Floor {listing.floor}
                </div>
                <div className="mp-card-specs">
                    <span className="mp-card-spec"><Bed size={14} /> {listing.bedrooms} Bed</span>
                    <span className="mp-card-spec"><Bath size={14} /> {listing.bathrooms} Bath</span>
                    <span className="mp-card-spec"><Maximize size={14} /> {listing.area} sq.ft</span>
                </div>
                <div className="mp-card-views">
                    <Eye size={12} /> {listing.views || 0} views · {listing.enquiryCount || 0} enquiries
                </div>
                {showActions && listing.status !== 'sold' && listing.status !== 'rented' && (
                    <div className="mp-card-footer">
                        <button className="mp-btn mp-btn-primary mp-btn-sm" onClick={handleCardClick}>View Details</button>
                        <button className="mp-btn mp-btn-secondary mp-btn-sm" onClick={handleEnquire}>Enquire</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingCard;
