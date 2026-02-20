import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, SlidersHorizontal } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice, debounce, paginate } from '../utils/helpers';
import ListingCard from '../components/ListingCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import '../styles/marketplace.css';

const MarketplaceList = () => {
    const navigate = useNavigate();
    const { state } = useMarketplace();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [bedroomFilter, setBedroomFilter] = useState('all');
    const [furnishingFilter, setFurnishingFilter] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);

    // Simulate initial loading
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

    // Debounced search
    const debouncedUpdate = useCallback(debounce((val) => setDebouncedSearch(val), 300), []);
    useEffect(() => { debouncedUpdate(searchTerm); }, [searchTerm, debouncedUpdate]);

    // Reset page when filters change
    useEffect(() => { setPage(1); }, [typeFilter, bedroomFilter, furnishingFilter, priceRange, debouncedSearch, sortBy]);

    const filteredListings = useMemo(() => {
        let results = state.listings.filter(l => ['approved', 'under_visit'].includes(l.status));

        if (typeFilter !== 'all') results = results.filter(l => l.type === typeFilter);
        if (bedroomFilter !== 'all') results = results.filter(l => l.bedrooms === Number(bedroomFilter));
        if (furnishingFilter !== 'all') results = results.filter(l => l.furnishing === furnishingFilter);

        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            results = results.filter(l => {
                const val = l.type === 'sale' ? l.price : l.rent;
                if (max) return val >= min && val <= max;
                return val >= min;
            });
        }

        if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            results = results.filter(l =>
                l.flatNumber.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q) ||
                (l.ownerName && l.ownerName.toLowerCase().includes(q))
            );
        }

        // Sort
        switch (sortBy) {
            case 'price_low': results.sort((a, b) => (a.type === 'sale' ? a.price : a.rent) - (b.type === 'sale' ? b.price : b.rent)); break;
            case 'price_high': results.sort((a, b) => (b.type === 'sale' ? b.price : b.rent) - (a.type === 'sale' ? a.price : a.rent)); break;
            case 'popular': results.sort((a, b) => (b.views || 0) - (a.views || 0)); break;
            case 'newest':
            default: results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
        }

        return results;
    }, [state.listings, typeFilter, bedroomFilter, furnishingFilter, priceRange, debouncedSearch, sortBy]);

    const paginatedData = paginate(filteredListings, page, 10);
    const featuredListings = state.listings.filter(l => l.featured && l.status === 'approved');
    const recentlyViewedListings = (state.recentlyViewed || []).map(id => state.listings.find(l => l.id === id)).filter(Boolean).slice(0, 5);

    return (
        <div className="mp-page">
            <div className="mp-page-header">
                <div>
                    <h1>🏘️ Property Marketplace</h1>
                    <p>Browse properties for sale and rent within the society</p>
                </div>
                <div className="mp-header-actions">
                    <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/resident/marketplace/favorites')}>❤️ Favorites ({state.favorites.length})</button>
                    <button className="mp-btn mp-btn-secondary" onClick={() => navigate('/resident/marketplace/my-listings')}>📋 My Listings</button>
                    <button className="mp-btn mp-btn-primary" onClick={() => navigate('/resident/marketplace/create')}><Plus size={16} /> List Property</button>
                </div>
            </div>

            {/* Stats */}
            <div className="mp-stats">
                <div className="mp-stat-card"><div className="mp-stat-label">Total Active</div><div className="mp-stat-value">{state.listings.filter(l => l.status === 'approved').length}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">For Sale</div><div className="mp-stat-value">{state.listings.filter(l => l.type === 'sale' && l.status === 'approved').length}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">For Rent</div><div className="mp-stat-value">{state.listings.filter(l => l.type === 'rent' && l.status === 'approved').length}</div></div>
                <div className="mp-stat-card"><div className="mp-stat-label">Featured</div><div className="mp-stat-value">{featuredListings.length}</div></div>
            </div>

            {/* Filters */}
            <div className="mp-filters">
                <div className="mp-search">
                    <Search size={16} className="mp-search-icon" />
                    <input type="text" placeholder="Search by flat, description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="mp-toggle-group">
                    <button className={`mp-toggle-btn ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>All</button>
                    <button className={`mp-toggle-btn ${typeFilter === 'sale' ? 'active' : ''}`} onClick={() => setTypeFilter('sale')}>Buy</button>
                    <button className={`mp-toggle-btn ${typeFilter === 'rent' ? 'active' : ''}`} onClick={() => setTypeFilter('rent')}>Rent</button>
                </div>
                <select className="mp-filter-select" value={bedroomFilter} onChange={e => setBedroomFilter(e.target.value)}>
                    <option value="all">All Bedrooms</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                </select>
                <select className="mp-filter-select" value={furnishingFilter} onChange={e => setFurnishingFilter(e.target.value)}>
                    <option value="all">All Furnishing</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="fully-furnished">Fully Furnished</option>
                </select>
                <select className="mp-filter-select" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                    <option value="all">Any Price</option>
                    {typeFilter === 'rent' ? (
                        <>
                            <option value="0-15000">Under ₹15K</option>
                            <option value="15000-30000">₹15K - ₹30K</option>
                            <option value="30000-50000">₹30K - ₹50K</option>
                            <option value="50000-0">₹50K+</option>
                        </>
                    ) : (
                        <>
                            <option value="0-5000000">Under ₹50L</option>
                            <option value="5000000-10000000">₹50L - ₹1Cr</option>
                            <option value="10000000-20000000">₹1Cr - ₹2Cr</option>
                            <option value="20000000-0">₹2Cr+</option>
                        </>
                    )}
                </select>
                <select className="mp-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                </select>
            </div>

            {/* Featured Section */}
            {featuredListings.length > 0 && typeFilter === 'all' && !debouncedSearch && (
                <>
                    <h2 className="mp-section-title">⭐ Featured Properties</h2>
                    <div className="mp-horizontal-scroll">
                        {featuredListings.map(l => <ListingCard key={l.id} listing={l} />)}
                    </div>
                </>
            )}

            {/* Recently Viewed */}
            {recentlyViewedListings.length > 0 && typeFilter === 'all' && !debouncedSearch && (
                <>
                    <h2 className="mp-section-title">🕐 Recently Viewed</h2>
                    <div className="mp-horizontal-scroll">
                        {recentlyViewedListings.map(l => <ListingCard key={l.id} listing={l} />)}
                    </div>
                </>
            )}

            {/* Listings Grid */}
            <h2 className="mp-section-title">
                {debouncedSearch ? `Search Results (${paginatedData.total})` : `All Listings (${paginatedData.total})`}
            </h2>

            {loading ? (
                <SkeletonLoader count={6} />
            ) : paginatedData.items.length === 0 ? (
                <EmptyState
                    icon="🏠"
                    title="No properties found"
                    message="Try adjusting your filters or list a new property."
                    action={<button className="mp-btn mp-btn-primary" onClick={() => navigate('/resident/marketplace/create')}><Plus size={16} /> List Property</button>}
                />
            ) : (
                <>
                    <div className="mp-grid">
                        {paginatedData.items.map(listing => (
                            <ListingCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                    {paginatedData.totalPages > 1 && (
                        <div className="mp-pagination">
                            <button className="mp-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                            {Array.from({ length: paginatedData.totalPages }, (_, i) => (
                                <button key={i + 1} className={`mp-page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                            ))}
                            <button className="mp-page-btn" disabled={page === paginatedData.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                            <span className="mp-page-info">Page {page} of {paginatedData.totalPages}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MarketplaceList;
