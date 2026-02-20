import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import ListingCard from '../components/ListingCard';
import EmptyState from '../components/EmptyState';
import { useToast } from '../../../components/ui/Toast';
import '../styles/marketplace.css';

const Favorites = () => {
    const navigate = useNavigate();
    const { state, toggleFavorite } = useMarketplace();
    const toast = useToast();

    const favoriteListings = state.favorites
        .map(id => state.listings.find(l => l.id === id))
        .filter(Boolean);

    const clearAll = () => {
        favoriteListings.forEach(l => toggleFavorite(l.id));
        toast.success('All favorites cleared');
    };

    return (
        <div className="mp-page">
            <div className="mp-page-header">
                <div>
                    <h1>❤️ My Favorites</h1>
                    <p>{favoriteListings.length} saved properties</p>
                </div>
                <div className="mp-header-actions">
                    <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/resident/marketplace')}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    {favoriteListings.length > 0 && (
                        <button className="mp-btn mp-btn-danger" onClick={clearAll}>
                            <Trash2 size={16} /> Clear All
                        </button>
                    )}
                </div>
            </div>

            {favoriteListings.length === 0 ? (
                <EmptyState
                    icon="💔"
                    title="No favorites yet"
                    message="Browse the marketplace and click the heart icon to save properties you like."
                    action={<button className="mp-btn mp-btn-primary" onClick={() => navigate('/resident/marketplace')}>Browse Marketplace</button>}
                />
            ) : (
                <div className="mp-grid">
                    {favoriteListings.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
