import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateId } from '../utils/helpers';

const MarketplaceContext = createContext(null);

const STORAGE_KEY = 'marketplaceData';

const SEED_LISTINGS = [
    {
        id: 'L001', type: 'sale', flatNumber: 'A-101', bedrooms: 3, bathrooms: 2,
        area: 1450, floor: 1, furnishing: 'semi-furnished', parking: 'covered',
        description: 'Spacious 3BHK with a large balcony facing the garden. Recently renovated kitchen with modular fittings. Marble flooring throughout. 24x7 water and power backup.',
        price: 8500000, rent: 0, deposit: 0,
        images: [], status: 'approved', featured: true, premium: false,
        views: 34, createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        ownerName: 'Rajesh Sharma', ownerFlat: 'A-101', enquiryCount: 3,
    },
    {
        id: 'L002', type: 'rent', flatNumber: 'B-204', bedrooms: 2, bathrooms: 2,
        area: 1100, floor: 2, furnishing: 'fully-furnished', parking: 'open',
        description: 'Fully furnished 2BHK ideal for working professionals. Includes AC, washing machine, fridge, and modular kitchen. Close to clubhouse.',
        price: 0, rent: 25000, deposit: 75000,
        images: [], status: 'approved', featured: false, premium: false,
        views: 18, createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        ownerName: 'Priya Mehta', ownerFlat: 'B-204', enquiryCount: 1,
    },
    {
        id: 'L003', type: 'sale', flatNumber: 'C-502', bedrooms: 4, bathrooms: 3,
        area: 2200, floor: 5, furnishing: 'unfurnished', parking: 'covered',
        description: 'Premium penthouse-style 4BHK on the top floor. Panoramic city view from all rooms. Private terrace with garden area.',
        price: 15000000, rent: 0, deposit: 0,
        images: [], status: 'approved', featured: true, premium: true,
        views: 56, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        ownerName: 'Vikram Singh', ownerFlat: 'C-502', enquiryCount: 7,
    },
    {
        id: 'L004', type: 'rent', flatNumber: 'A-303', bedrooms: 1, bathrooms: 1,
        area: 650, floor: 3, furnishing: 'semi-furnished', parking: 'none',
        description: 'Compact 1BHK perfect for bachelors or small families. Well-ventilated rooms. Maintenance included in rent.',
        price: 0, rent: 12000, deposit: 36000,
        images: [], status: 'pending', featured: false, premium: false,
        views: 4, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        ownerName: 'Anita Desai', ownerFlat: 'A-303', enquiryCount: 0,
    },
    {
        id: 'L005', type: 'sale', flatNumber: 'D-102', bedrooms: 2, bathrooms: 2,
        area: 1000, floor: 1, furnishing: 'fully-furnished', parking: 'covered',
        description: 'Well-maintained ground floor 2BHK. Pet-friendly block. Garden-facing windows with beautiful morning sunlight.',
        price: 6200000, rent: 0, deposit: 0,
        images: [], status: 'approved', featured: false, premium: false,
        views: 22, createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
        ownerName: 'Sunil Kumar', ownerFlat: 'D-102', enquiryCount: 2,
    },
    {
        id: 'L006', type: 'rent', flatNumber: 'B-401', bedrooms: 3, bathrooms: 2,
        area: 1500, floor: 4, furnishing: 'unfurnished', parking: 'open',
        description: 'Airy 3BHK with cross ventilation. Newly painted. Close to the main gate with easy access. Society gym and pool available.',
        price: 0, rent: 30000, deposit: 90000,
        images: [], status: 'rejected', featured: false, premium: false,
        views: 8, createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        ownerName: 'Meera Joshi', ownerFlat: 'B-401', enquiryCount: 0,
    },
    {
        id: 'L007', type: 'sale', flatNumber: 'C-201', bedrooms: 3, bathrooms: 2,
        area: 1350, floor: 2, furnishing: 'semi-furnished', parking: 'covered',
        description: 'East-facing 3BHK with Vastu compliance. Italian marble in living room. Modular kitchen with chimney. Piped gas available.',
        price: 9200000, rent: 0, deposit: 0,
        images: [], status: 'sold', featured: false, premium: false,
        views: 45, createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        ownerName: 'Rohit Patel', ownerFlat: 'C-201', enquiryCount: 5,
    },
    {
        id: 'L008', type: 'rent', flatNumber: 'D-305', bedrooms: 2, bathrooms: 1,
        area: 900, floor: 3, furnishing: 'fully-furnished', parking: 'covered',
        description: 'Cozy furnished 2BHK. Includes smart TV, split ACs, geyser. Near children play area. Ideal for families.',
        price: 0, rent: 20000, deposit: 60000,
        images: [], status: 'approved', featured: false, premium: false,
        views: 12, createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        ownerName: 'Kavita Rao', ownerFlat: 'D-305', enquiryCount: 1,
    },
];

const SEED_ENQUIRIES = [
    { id: 'E001', listingId: 'L001', name: 'Amit Jain', phone: '9876543210', message: 'Interested in site visit this weekend.', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'E002', listingId: 'L001', name: 'Neha Gupta', phone: '9123456789', message: 'Is the price negotiable? Looking for quick possession.', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'E003', listingId: 'L003', name: 'Deepak Verma', phone: '9988776655', message: 'Can I see the terrace area? Very interested.', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const SEED_VISITS = [
    { id: 'V001', listingId: 'L001', name: 'Amit Jain', date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], time: '10:00', notes: 'Will bring family along', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
];

const initialState = {
    listings: SEED_LISTINGS,
    enquiries: SEED_ENQUIRIES,
    visits: SEED_VISITS,
    favorites: ['L003'],
    analyticsLogs: [
        { action: 'listing_created', listingId: 'L001', date: new Date(Date.now() - 5 * 86400000).toISOString() },
        { action: 'listing_created', listingId: 'L002', date: new Date(Date.now() - 12 * 86400000).toISOString() },
        { action: 'listing_approved', listingId: 'L001', date: new Date(Date.now() - 4 * 86400000).toISOString() },
        { action: 'listing_created', listingId: 'L003', date: new Date(Date.now() - 3 * 86400000).toISOString() },
        { action: 'listing_sold', listingId: 'L007', date: new Date(Date.now() - 10 * 86400000).toISOString() },
    ],
    recentlyViewed: [],
};

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.listings && parsed.listings.length > 0) return parsed;
        }
    } catch { /* ignore */ }
    return initialState;
}

function reducer(state, action) {
    switch (action.type) {
        case 'ADD_LISTING': {
            const listing = { ...action.payload, id: generateId('L'), createdAt: new Date().toISOString(), views: 0, enquiryCount: 0 };
            return {
                ...state,
                listings: [listing, ...state.listings],
                analyticsLogs: [...state.analyticsLogs, { action: 'listing_created', listingId: listing.id, date: new Date().toISOString() }],
            };
        }
        case 'UPDATE_LISTING': {
            const { id, updates } = action.payload;
            const old = state.listings.find(l => l.id === id);
            const priceChanged = old && updates.price !== undefined && updates.price !== old.price;
            const rentChanged = old && updates.rent !== undefined && updates.rent !== old.rent;
            const resetStatus = (priceChanged || rentChanged) && old.status === 'approved';
            return {
                ...state,
                listings: state.listings.map(l => l.id === id ? { ...l, ...updates, ...(resetStatus ? { status: 'pending' } : {}) } : l),
            };
        }
        case 'DELETE_LISTING':
            return {
                ...state,
                listings: state.listings.filter(l => l.id !== action.payload),
                enquiries: state.enquiries.filter(e => e.listingId !== action.payload),
                visits: state.visits.filter(v => v.listingId !== action.payload),
                favorites: state.favorites.filter(f => f !== action.payload),
                analyticsLogs: [...state.analyticsLogs, { action: 'listing_deleted', listingId: action.payload, date: new Date().toISOString() }],
            };
        case 'APPROVE_LISTING':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload ? { ...l, status: 'approved' } : l),
                analyticsLogs: [...state.analyticsLogs, { action: 'listing_approved', listingId: action.payload, date: new Date().toISOString() }],
            };
        case 'REJECT_LISTING':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload ? { ...l, status: 'rejected' } : l),
                analyticsLogs: [...state.analyticsLogs, { action: 'listing_rejected', listingId: action.payload, date: new Date().toISOString() }],
            };
        case 'MARK_SOLD':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload ? { ...l, status: 'sold' } : l),
                analyticsLogs: [...state.analyticsLogs, { action: 'listing_sold', listingId: action.payload, date: new Date().toISOString() }],
            };
        case 'MARK_RENTED':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload ? { ...l, status: 'rented' } : l),
                analyticsLogs: [...state.analyticsLogs, { action: 'listing_rented', listingId: action.payload, date: new Date().toISOString() }],
            };
        case 'TOGGLE_FEATURED':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload ? { ...l, featured: !l.featured } : l),
            };
        case 'TOGGLE_PREMIUM':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload ? { ...l, premium: !l.premium } : l),
            };
        case 'ADD_ENQUIRY': {
            const enquiry = { ...action.payload, id: generateId('E'), createdAt: new Date().toISOString() };
            return {
                ...state,
                enquiries: [enquiry, ...state.enquiries],
                listings: state.listings.map(l => l.id === enquiry.listingId ? { ...l, enquiryCount: (l.enquiryCount || 0) + 1 } : l),
            };
        }
        case 'DELETE_ENQUIRY':
            return {
                ...state,
                enquiries: state.enquiries.filter(e => e.id !== action.payload),
            };
        case 'SCHEDULE_VISIT': {
            const visit = { ...action.payload, id: generateId('V'), createdAt: new Date().toISOString() };
            return {
                ...state,
                visits: [visit, ...state.visits],
                listings: state.listings.map(l => l.id === visit.listingId ? { ...l, status: l.status === 'approved' ? 'under_visit' : l.status } : l),
            };
        }
        case 'TOGGLE_FAVORITE': {
            const isFav = state.favorites.includes(action.payload);
            return {
                ...state,
                favorites: isFav ? state.favorites.filter(f => f !== action.payload) : [...state.favorites, action.payload],
            };
        }
        case 'INCREMENT_VIEWS':
            return {
                ...state,
                listings: state.listings.map(l => l.id === action.payload ? { ...l, views: (l.views || 0) + 1 } : l),
            };
        case 'ADD_RECENTLY_VIEWED': {
            const filtered = (state.recentlyViewed || []).filter(id => id !== action.payload);
            return {
                ...state,
                recentlyViewed: [action.payload, ...filtered].slice(0, 10),
            };
        }
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export function MarketplaceProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, null, loadState);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Auto-expire listings older than 60 days
    useEffect(() => {
        const now = Date.now();
        state.listings.forEach(l => {
            if (['approved', 'under_visit'].includes(l.status)) {
                const age = now - new Date(l.createdAt).getTime();
                if (age > 60 * 86400000) {
                    dispatch({ type: 'UPDATE_LISTING', payload: { id: l.id, updates: { status: 'rejected' } } });
                }
            }
        });
    }, []); // run once on mount

    const actions = {
        addListing: (data) => dispatch({ type: 'ADD_LISTING', payload: data }),
        updateListing: (id, updates) => dispatch({ type: 'UPDATE_LISTING', payload: { id, updates } }),
        deleteListing: (id) => dispatch({ type: 'DELETE_LISTING', payload: id }),
        approveListing: (id) => dispatch({ type: 'APPROVE_LISTING', payload: id }),
        rejectListing: (id) => dispatch({ type: 'REJECT_LISTING', payload: id }),
        markSold: (id) => dispatch({ type: 'MARK_SOLD', payload: id }),
        markRented: (id) => dispatch({ type: 'MARK_RENTED', payload: id }),
        toggleFeatured: (id) => dispatch({ type: 'TOGGLE_FEATURED', payload: id }),
        togglePremium: (id) => dispatch({ type: 'TOGGLE_PREMIUM', payload: id }),
        addEnquiry: (data) => dispatch({ type: 'ADD_ENQUIRY', payload: data }),
        deleteEnquiry: (id) => dispatch({ type: 'DELETE_ENQUIRY', payload: id }),
        scheduleVisit: (data) => dispatch({ type: 'SCHEDULE_VISIT', payload: data }),
        toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id }),
        incrementViews: (id) => dispatch({ type: 'INCREMENT_VIEWS', payload: id }),
        addRecentlyViewed: (id) => dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: id }),
        resetData: () => dispatch({ type: 'RESET' }),
    };

    return (
        <MarketplaceContext.Provider value={{ state, ...actions }}>
            {children}
        </MarketplaceContext.Provider>
    );
}

export function useMarketplace() {
    const context = useContext(MarketplaceContext);
    if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
    return context;
}
