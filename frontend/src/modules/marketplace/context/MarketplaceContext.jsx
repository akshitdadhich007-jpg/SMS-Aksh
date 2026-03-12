import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../../services/api";

const MarketplaceContext = createContext(null);

export function MarketplaceProvider({ children }) {
  const [state, setState] = useState({
    listings: [],
    enquiries: [],
    visits: [],
    favorites: [],
    analyticsLogs: [],
    recentlyViewed: JSON.parse(localStorage.getItem('marketplace_recently_viewed') || '[]'),
    loading: true,
  });

  const fetchListings = useCallback(async () => {
    try {
      const { data } = await api.get('/api/resident/marketplace');
      // Set to listings from data which might be paginated or an array
      setState(prev => ({ ...prev, listings: data?.listings || data || [] }));
    } catch (err) {
      console.error("Failed to fetch listings", err);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const { data } = await api.get('/api/resident/marketplace/favorites');
      setState(prev => ({ ...prev, favorites: data ? data.map(f => f.listing_id || f.id) : [] }));
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  }, []);

  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    await Promise.all([fetchListings(), fetchFavorites()]);
    setState(prev => ({ ...prev, loading: false }));
  }, [fetchListings, fetchFavorites]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const addListing = async (listingData) => {
    try {
      // The backend expects flat JSON or FormData. Depending on the route, let's just send JSON if images are URLs, or FormData if files.
      // The backend uses upload.array('images').
      const formData = new FormData();
      Object.keys(listingData).forEach(key => {
        if (key === 'images' && listingData.images?.length > 0) {
          Array.from(listingData.images).forEach(file => formData.append('images', file));
        } else {
          formData.append(key, listingData[key]);
        }
      });
      const { data } = await api.post('/api/resident/marketplace', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Append new listing to state
      setState(prev => ({ ...prev, listings: [data, ...prev.listings] }));
      return data;
    } catch (err) {
      console.error("Failed to add listing", err);
      throw err;
    }
  };

  const updateListing = async (id, updates) => {
    try {
      if (updates.price !== undefined) {
        await api.put(`/api/resident/marketplace/${id}/price`, { price: updates.price });
      }
      if (updates.features !== undefined) {
        await api.put(`/api/resident/marketplace/${id}/features`, { features: updates.features });
      }
      if (updates.status === 'withdrawn') {
        await api.put(`/api/resident/marketplace/${id}/withdraw`);
      }
      fetchListings();
    } catch (err) {
      console.error("Failed to update listing", err);
    }
  };

  const deleteListing = async (id) => {
    try {
      await api.delete(`/api/admin/marketplace/${id}`);
      setState(prev => ({ ...prev, listings: prev.listings.filter(l => l.id !== id) }));
    } catch (err) {
      console.error("Failed to delete listing", err);
    }
  };

  const approveListing = async (id) => {
    try {
      await api.put(`/api/admin/marketplace/${id}/approve`);
      fetchListings();
    } catch (err) { console.error(err); }
  };

  const rejectListing = async (id) => {
    try {
      await api.put(`/api/admin/marketplace/${id}/reject`);
      fetchListings();
    } catch (err) { console.error(err); }
  };

  const markSold = async (id) => {
    try {
      await api.put(`/api/admin/marketplace/${id}/sold`);
      fetchListings();
    } catch (err) { console.error(err); }
  };

  const markRented = async (id) => {
    try {
      await api.put(`/api/admin/marketplace/${id}/rented`);
      fetchListings();
    } catch (err) { console.error(err); }
  };

  const toggleFeatured = async (id) => {
    try {
      await api.put(`/api/admin/marketplace/${id}/featured`);
      fetchListings();
    } catch (err) { console.error(err); }
  };

  const togglePremium = async (id) => {
    // Stub
  };

  const toggleFavorite = async (id) => {
    try {
      await api.post('/api/resident/marketplace/favorite', { listing_id: id });
      setState(prev => {
        const isFav = prev.favorites.includes(id);
        return {
          ...prev,
          favorites: isFav ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id]
        };
      });
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const addEnquiry = async (enquiryData) => {
    try {
      await api.post('/api/resident/marketplace/enquiry', enquiryData);
    } catch (err) {
      console.error("Failed to add enquiry", err);
      throw err;
    }
  };

  const scheduleVisit = async (visitData) => {
    try {
      await api.post('/api/resident/marketplace/visit', visitData);
    } catch (err) {
      console.error("Failed to schedule visit", err);
      throw err;
    }
  };

  const deleteEnquiry = async (id) => {
    try {
      await api.delete(`/api/admin/marketplace/enquiry/${id}`);
    } catch (err) { console.error(err); }
  };

  const incrementViews = (id) => {
    // Stub to prevent undefined errors from old UI
  };

  const addRecentlyViewed = (id) => {
    setState(prev => {
      const filtered = prev.recentlyViewed.filter(v => v !== id);
      const newRecent = [id, ...filtered].slice(0, 10);
      localStorage.setItem('marketplace_recently_viewed', JSON.stringify(newRecent));
      return { ...prev, recentlyViewed: newRecent };
    });
  };

  const resetData = () => { };

  const actions = {
    addListing,
    updateListing,
    deleteListing,
    approveListing,
    rejectListing,
    markSold,
    markRented,
    toggleFeatured,
    togglePremium,
    addEnquiry,
    deleteEnquiry,
    scheduleVisit,
    toggleFavorite,
    incrementViews,
    addRecentlyViewed,
    resetData,
    refreshData: initialize,
  };

  return (
    <MarketplaceContext.Provider value={{ state, ...actions }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return context;
}
