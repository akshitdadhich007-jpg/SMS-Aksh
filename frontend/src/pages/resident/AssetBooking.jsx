<<<<<<< HEAD
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Clock, Check, AlertCircle, Plus, X, Loader2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../utils/supabaseClient';
import {
  attachLocalAssetRelation,
  getAssetBookingUpdateEvent,
  getLocalAssets,
  getLocalBookings,
  insertLocalBooking,
} from '../../utils/assetBookingStorage';
import './AssetBooking.css';

const parse12HourTo24Hour = (value) => {
  const [time, meridiemRaw] = String(value || '').trim().split(' ');
  if (!time || !meridiemRaw) return null;
  let [hour, minute] = time.split(':').map(Number);
  const meridiem = meridiemRaw.toUpperCase();
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
};

const parseTimeSlot = (timeSlot) => {
  const [startRaw, endRaw] = String(timeSlot || '').split(' - ');
  const start = parse12HourTo24Hour(startRaw);
  const end = parse12HourTo24Hour(endRaw);
  if (!start || !end) return null;
  return { start, end };
};

const getDurationHours = (startTime, endTime) => {
  const [sh, sm] = String(startTime).split(':').map(Number);
  const [eh, em] = String(endTime).split(':').map(Number);
  const startMins = (sh * 60) + sm;
  const endMins = (eh * 60) + em;
  return Math.max(0, (endMins - startMins) / 60);
};

const formatTimeRange = (start, end) => {
  if (!start || !end) return '-';
  const startDate = new Date();
  const endDate = new Date();
  const [sh, sm] = String(start).split(':').map(Number);
  const [eh, em] = String(end).split(':').map(Number);
  startDate.setHours(sh, sm, 0, 0);
  endDate.setHours(eh, em, 0, 0);
  return `${startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const normalizeStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'approved') return 'Approved';
  if (normalized === 'rejected') return 'Rejected';
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'cancelled') return 'Rejected';
  return 'Pending';
};

const normalizeAssetStatus = (status) => String(status || '').toLowerCase().trim();

const isBookableAssetStatus = (status) => {
  const normalized = normalizeAssetStatus(status);
  if (!normalized) return true;
  return ['active', 'enabled', 'available', 'open'].includes(normalized);
};

const isRlsError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('row-level security') || message.includes('violates row-level security');
};

const getFriendlyErrorMessage = (error, fallback) => {
  if (isRlsError(error)) {
    return 'RLS blocked this action. Run backend/database/asset_booking_rls_hotfix.sql in Supabase SQL Editor, then refresh.';
  }
  return error?.message || fallback;
};

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));

const extractPaymentOption = (booking) => {
  if (booking?.payment_option) return booking.payment_option;
  const purpose = String(booking?.purpose || '');
  const match = purpose.match(/\|\s*Payment:\s*([^|]+)/i);
  return match?.[1]?.trim() || 'Not specified';
};

const extractUpiRef = (booking) => {
  const purpose = String(booking?.purpose || '');
  const match = purpose.match(/\|\s*UPI UTR:\s*([^|]+)/i);
  return match?.[1]?.trim() || '';
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const bookingIdentityKey = (booking) => {
  if (booking?.id) return `id:${booking.id}`;
  return [
    normalizeText(booking?.asset_id),
    normalizeText(booking?.booking_date),
    normalizeText(booking?.start_time),
    normalizeText(booking?.resident_id),
    normalizeText(booking?.resident_name),
  ].join('|');
};

const mergeBookings = (primary, secondary) => {
  const map = new Map();
  [...secondary, ...primary].forEach((item) => {
    map.set(bookingIdentityKey(item), item);
  });
  return Array.from(map.values())
    .sort((a, b) => String(b.created_at || b.booking_date || '').localeCompare(String(a.created_at || a.booking_date || '')));
};

=======
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Check, AlertCircle, Plus, X } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import "./AssetBooking.css";
import api from "../../services/api";
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
const AssetBooking = () => {
  const toast = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('available');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    assetId: '',
    date: '',
    timeSlot: '',
    purpose: '',
    paymentOption: '',
    upiId: '',
    upiUtr: '',
    agreeTerms: false,
  });

  const [assets, setAssets] = useState([]);
  const [allAssetsCount, setAllAssetsCount] = useState(0);
  const [myBookings, setMyBookings] = useState([]);
  const [isLocalFallbackMode, setIsLocalFallbackMode] = useState(false);

  const showLocalFallbackNotice = useCallback(() => {
    setIsLocalFallbackMode(true);
  }, []);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const loadAssets = useCallback(async () => {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const localRows = getLocalAssets();
      const normalizedLocal = localRows.map((asset) => ({
        ...asset,
        status: normalizeAssetStatus(asset.status || 'active'),
        price_per_hour: asset.price_per_hour ?? asset.charges ?? 0,
        approval_required: asset.approval_required ?? asset.approvalRequired ?? true,
        max_booking_hours: asset.max_booking_hours ?? asset.maxBookingHours ?? 0,
        advance_booking_days: asset.advance_booking_days ?? asset.advanceBookingDays ?? 0,
      }));
      setAllAssetsCount(normalizedLocal.length);
      setAssets(normalizedLocal.filter((asset) => isBookableAssetStatus(asset.status)));
      showLocalFallbackNotice();
      return;
    }

    const rows = Array.isArray(data) ? data : [];
    const normalized = rows.map((asset) => ({
      ...asset,
      status: normalizeAssetStatus(asset.status || 'active'),
      price_per_hour: asset.price_per_hour ?? asset.charges ?? 0,
      approval_required: asset.approval_required ?? asset.approvalRequired ?? true,
      max_booking_hours: asset.max_booking_hours ?? asset.maxBookingHours ?? 0,
      advance_booking_days: asset.advance_booking_days ?? asset.advanceBookingDays ?? 0,
    }));

    const localRows = getLocalAssets().map((asset) => ({
      ...asset,
      status: normalizeAssetStatus(asset.status || 'active'),
      price_per_hour: asset.price_per_hour ?? asset.charges ?? 0,
      approval_required: asset.approval_required ?? asset.approvalRequired ?? true,
      max_booking_hours: asset.max_booking_hours ?? asset.maxBookingHours ?? 0,
      advance_booking_days: asset.advance_booking_days ?? asset.advanceBookingDays ?? 0,
    }));

    const sourceRows = normalized.length ? normalized : localRows;
    if (!normalized.length && localRows.length) {
      showLocalFallbackNotice();
    }

    setAllAssetsCount(sourceRows.length);
    setAssets(sourceRows.filter((asset) => isBookableAssetStatus(asset.status)));
  }, [showLocalFallbackNotice]);

  const loadBookings = useCallback(async () => {
    const userId = String(user?.id || '');
    const userName = normalizeText(user?.name || 'Resident');
    const hasUuidId = isUuid(userId);

    const localAssets = getLocalAssets();
    const localBookings = getLocalBookings().map((row) => attachLocalAssetRelation(row, localAssets));
    const localFiltered = hasUuidId
      ? localBookings.filter((row) => String(row.resident_id || '') === userId)
      : localBookings.filter((row) => normalizeText(row.resident_name || '') === userName);

    const bookingQuery = supabase
      .from('asset_bookings')
      .select('*, assets(id, name, category, price_per_hour)')
      .order('created_at', { ascending: false });

    const baseQuery = hasUuidId
      ? bookingQuery.eq('resident_id', userId)
      : bookingQuery.eq('resident_name', user?.name || 'Resident');

    const { data, error } = await baseQuery;

    if (error) {
      const fallback = await supabase
        .from('asset_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!fallback.error && Array.isArray(fallback.data)) {
        const supabaseFiltered = hasUuidId
          ? fallback.data.filter((row) => String(row.resident_id || '') === userId)
          : fallback.data.filter((row) => normalizeText(row.resident_name || '') === userName);

        setMyBookings(mergeBookings(supabaseFiltered, localFiltered));
        if (!supabaseFiltered.length && localFiltered.length) {
          showLocalFallbackNotice();
        }
        return;
      }

      if (fallback.error) {
        setMyBookings(localFiltered);
        showLocalFallbackNotice();
        return;
      }

      return;
    }

    const relationRows = Array.isArray(data) ? data : [];
    const mergedRows = mergeBookings(relationRows, localFiltered);
    setMyBookings(mergedRows);

    if (!relationRows.length && localFiltered.length) {
      showLocalFallbackNotice();
    }
  }, [showLocalFallbackNotice, user?.id, user?.name]);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      toastRef.current.error('Please login again to continue booking assets.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsLocalFallbackMode(false);
    try {
      await Promise.all([loadAssets(), loadBookings()]);
    } finally {
      setIsLoading(false);
    }
  }, [loadAssets, loadBookings, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!user?.id) return undefined;
    const hasUuidId = isUuid(user?.id);
    const channel = supabase
      .channel(`resident-bookings-${user.id}`)
      .on(
        'postgres_changes',
        hasUuidId
          ? { event: '*', schema: 'public', table: 'asset_bookings', filter: `resident_id=eq.${user.id}` }
          : { event: '*', schema: 'public', table: 'asset_bookings' },
        () => loadBookings(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assets' },
        () => loadAssets(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAssets, loadBookings, user?.id]);

  useEffect(() => {
    const syncData = () => {
      loadAssets();
      loadBookings();
    };

    const eventName = getAssetBookingUpdateEvent();
    window.addEventListener(eventName, syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener(eventName, syncData);
      window.removeEventListener('storage', syncData);
    };
  }, [loadAssets, loadBookings]);

=======
  const [activeTab, setActiveTab] = useState("available");
  const [bookingForm, setBookingForm] = useState({
    assetId: "",
    date: "",
    timeSlot: "",
    duration: "2",
    purpose: "",
  });
  const [assets, setAssets] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  useEffect(() => {
    api
      .get("/api/resident/assets")
      .then((res) => {
        const data = res.data || {};
        setAssets(data.assets || data || []);
        setUpcomingBookings(data.upcomingBookings || []);
        setPastBookings(data.pastBookings || []);
      })
      .catch((err) => console.error("Failed to load assets:", err));
  }, []);
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setBookingForm((prev) => ({
      ...prev,
      assetId: asset.id,
<<<<<<< HEAD
      timeSlot: '',
      purpose: '',
      paymentOption: '',
      upiId: '',
      upiUtr: '',
      agreeTerms: false,
=======
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
    }));
    setShowBookingModal(true);
  };
  const handleBookingChange = (field, value) => {
    setBookingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
<<<<<<< HEAD

  const handleSubmitBooking = async () => {
    if (!bookingForm.date || !bookingForm.timeSlot || !bookingForm.assetId) {
      toastRef.current.warning('Please select asset, date, and time slot');
      return;
    }

    if (!bookingForm.paymentOption) {
      toastRef.current.warning('Please choose a payment option');
      return;
    }

    if (bookingForm.paymentOption === 'UPI' && !String(bookingForm.upiId || '').trim()) {
      toastRef.current.warning('Please enter your UPI ID');
      return;
    }

    if (bookingForm.paymentOption === 'UPI' && !String(bookingForm.upiUtr || '').trim()) {
      toastRef.current.warning('Please enter UPI transaction reference (UTR)');
      return;
    }

    if (!bookingForm.agreeTerms) {
      toastRef.current.warning('Please accept booking terms to continue');
      return;
    }

    const asset = assets.find((item) => String(item.id) === String(bookingForm.assetId));
    if (!asset) {
      toastRef.current.error('Selected asset is no longer available');
      return;
    }

    const parsedSlot = parseTimeSlot(bookingForm.timeSlot);
    if (!parsedSlot) {
      toastRef.current.error('Invalid time slot selected');
      return;
    }

    const durationHours = getDurationHours(parsedSlot.start, parsedSlot.end);
    if (asset.max_booking_hours && durationHours > Number(asset.max_booking_hours)) {
      toastRef.current.warning(`This asset allows up to ${asset.max_booking_hours} hours per booking`);
      return;
    }

    if (asset.advance_booking_days && bookingForm.date) {
      const selectedDate = new Date(`${bookingForm.date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + Number(asset.advance_booking_days));
      if (selectedDate > maxDate) {
        toastRef.current.warning(`This asset can be booked only ${asset.advance_booking_days} days in advance`);
        return;
      }
    }

    const status = asset.approval_required ? 'pending' : 'approved';
    const totalAmount = Number(asset.price_per_hour || 0) * durationHours;
    const cleanedPurpose = String(bookingForm.purpose || '').trim();
    const upiDetails = bookingForm.paymentOption === 'UPI'
      ? ` | Payer UPI: ${String(bookingForm.upiId || '').trim()} | UPI UTR: ${String(bookingForm.upiUtr || '').trim()}`
      : '';
    const finalPurpose = `${cleanedPurpose || 'General use'} | Payment: ${bookingForm.paymentOption}${upiDetails}`;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('asset_bookings')
        .insert({
          asset_id: asset.id,
          resident_id: isUuid(user?.id) ? user.id : null,
          resident_name: user.name || 'Resident',
          booking_date: bookingForm.date,
          start_time: parsedSlot.start,
          end_time: parsedSlot.end,
          duration_hours: durationHours,
          purpose: finalPurpose,
          payment_status: 'pending',
          booking_status: status,
          status,
          total_amount: totalAmount,
        });

      if (error) {
        insertLocalBooking({
          asset_id: asset.id,
          resident_id: isUuid(user?.id) ? user.id : null,
          resident_name: user.name || 'Resident',
          booking_date: bookingForm.date,
          start_time: parsedSlot.start,
          end_time: parsedSlot.end,
          duration_hours: durationHours,
          purpose: finalPurpose,
          payment_option: bookingForm.paymentOption,
          payment_status: 'pending',
          booking_status: status,
          status,
          total_amount: totalAmount,
        });
        showLocalFallbackNotice();
      }

      toastRef.current.success('Booking request submitted successfully');
      setShowBookingModal(false);
      setBookingForm({
        assetId: '',
        date: '',
        timeSlot: '',
        purpose: '',
        paymentOption: '',
        upiId: '',
        upiUtr: '',
        agreeTerms: false,
      });
      await loadBookings();
    } catch (error) {
      toastRef.current.error(getFriendlyErrorMessage(error, 'Unable to submit booking request'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookingRows = useMemo(() => {
    return myBookings.map((booking) => ({
      id: booking.id,
      assetName: booking.assets?.name || 'Asset',
      date: booking.booking_date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      timeSlot: formatTimeRange(booking.start_time, booking.end_time),
      status: normalizeStatus(booking.booking_status || booking.status),
      rawStatus: String(booking.booking_status || booking.status || '').toLowerCase(),
      purpose: booking.purpose || 'General use',
      paymentOption: extractPaymentOption(booking),
      upiUtr: extractUpiRef(booking),
      paymentStatus: booking.payment_status || 'pending',
      totalAmount: Number(booking.total_amount || 0),
      createdAt: booking.created_at || null,
    }));
  }, [myBookings]);

  const nowDateOnly = new Date();
  nowDateOnly.setHours(0, 0, 0, 0);

  const upcomingBookings = bookingRows.filter((booking) => {
    const date = new Date(`${booking.date}T00:00:00`);
    return date >= nowDateOnly && booking.status !== 'Rejected';
  });

  const pastBookings = bookingRows.filter((booking) => {
    const date = new Date(`${booking.date}T00:00:00`);
    return date < nowDateOnly || booking.status === 'Completed';
  });

  const bookingInsights = useMemo(() => {
    const totals = {
      total: bookingRows.length,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      spent: 0,
    };

    bookingRows.forEach((booking) => {
      if (booking.status === 'Pending') totals.pending += 1;
      if (booking.status === 'Approved') totals.approved += 1;
      if (booking.status === 'Completed') totals.completed += 1;
      if (booking.status === 'Rejected') totals.rejected += 1;
      if (booking.status === 'Approved' || booking.status === 'Completed') {
        totals.spent += Number(booking.totalAmount || 0);
      }
    });

    const sortedUpcoming = [...upcomingBookings]
      .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));

    const sortedRecent = [...bookingRows]
      .sort((a, b) => String(b.createdAt || b.date || '').localeCompare(String(a.createdAt || a.date || '')));

    return {
      ...totals,
      nextBooking: sortedUpcoming[0] || null,
      recentBooking: sortedRecent[0] || null,
    };
  }, [bookingRows, upcomingBookings]);

=======
  const handleSubmitBooking = async () => {
    if (!bookingForm.date || !bookingForm.timeSlot) {
      alert("Please select date and time slot");
      return;
    }
    try {
      const { data } = await api.post("/api/resident/bookings", bookingForm);
      setUpcomingBookings((prev) => [...prev, data]);
      alert("Booking request submitted! Awaiting admin approval.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit booking request.");
    }
    setShowBookingModal(false);
    setBookingForm({
      assetId: "",
      date: "",
      timeSlot: "",
      duration: "2",
      purpose: "",
    });
  };
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
  const getStatusBadge = (status) => {
    const statusClass = {
      Approved: "status-approved",
      Pending: "status-pending",
      Rejected: "status-rejected",
      Completed: "status-completed",
    };
    return (
      <span className={`status-badge ${statusClass[status]}`}>{status}</span>
    );
  };
  return (
    <div className="asset-booking-page">
      <PageHeader
        title="Asset Booking"
        subtitle="Book community assets like clubhouse, hall, gym, and guest room"
      />

      {isLocalFallbackMode ? (
        <div className="mode-indicator warning">Local fallback mode active. Supabase access is currently blocked.</div>
      ) : null}

      <section className="resident-overview-grid">
        <article className="overview-card">
          <p>Total Bookings</p>
          <h3>{bookingInsights.total}</h3>
        </article>
        <article className="overview-card">
          <p>Pending Requests</p>
          <h3>{bookingInsights.pending}</h3>
        </article>
        <article className="overview-card">
          <p>Current Upcoming</p>
          <h3>{upcomingBookings.length}</h3>
        </article>
        <article className="overview-card">
          <p>Completed Bookings</p>
          <h3>{bookingInsights.completed}</h3>
        </article>
        <article className="overview-card">
          <p>Total Spent</p>
          <h3>{formatCurrency(bookingInsights.spent)}</h3>
        </article>
      </section>

      <section className="resident-detail-strip">
        <article className="detail-card">
          <h4>Current / Next Booking</h4>
          {bookingInsights.nextBooking ? (
            <>
              <p><strong>Asset:</strong> {bookingInsights.nextBooking.assetName}</p>
              <p><strong>Date:</strong> {bookingInsights.nextBooking.date}</p>
              <p><strong>Time:</strong> {bookingInsights.nextBooking.timeSlot}</p>
              <p><strong>Status:</strong> {bookingInsights.nextBooking.status}</p>
            </>
          ) : <p>No upcoming booking scheduled.</p>}
        </article>
        <article className="detail-card">
          <h4>Latest Booking Update</h4>
          {bookingInsights.recentBooking ? (
            <>
              <p><strong>Asset:</strong> {bookingInsights.recentBooking.assetName}</p>
              <p><strong>Date:</strong> {bookingInsights.recentBooking.date}</p>
              <p><strong>Status:</strong> {bookingInsights.recentBooking.status}</p>
              <p><strong>Amount:</strong> {formatCurrency(bookingInsights.recentBooking.totalAmount)}</p>
            </>
          ) : <p>No booking activity yet.</p>}
        </article>
      </section>

      <div className="booking-tabs">
        <button
          className={`tab-btn ${activeTab === "available" ? "active" : ""}`}
          onClick={() => setActiveTab("available")}
        >
          📦 Available Assets
        </button>
        <button
          className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          📅 Upcoming Bookings ({upcomingBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          ✅ Past Bookings ({pastBookings.length})
        </button>
      </div>

<<<<<<< HEAD
      {isLoading ? (
        <div className="empty-state">
          <Loader2 size={32} className="spin" />
          <p>Loading assets and bookings...</p>
        </div>
      ) : (
        <>
          {activeTab === 'available' && (
            <div className="assets-grid">
              {assets.map((asset) => (
                <div key={asset.id} className="asset-card">
                  <div className="asset-icon">🏢</div>
                  <h3>{asset.name}</h3>
                  <p className="asset-capacity">👥 {asset.capacity} persons</p>
                  <p className="asset-charges">💰 ₹{Number(asset.price_per_hour || 0).toLocaleString('en-IN')}/hour</p>
                  <p className="asset-description">{asset.description || 'Community booking asset'}</p>
                  <button
                    className="booking-btn"
                    onClick={() => handleAssetSelect(asset)}
                  >
                    <Plus size={16} /> Request Booking
                  </button>
                </div>
              ))}

              {!assets.length && (
                <div className="empty-state">
                  <AlertCircle size={48} />
                  <p>{allAssetsCount > 0 ? 'Assets exist but are currently unavailable for booking.' : 'No assets are available for booking yet.'}</p>
                </div>
              )}
            </div>
=======
      {/* Available Assets */}
      {activeTab === "available" && (
        <div className="assets-grid">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <div className="asset-icon">{asset.icon}</div>
              <h3>{asset.name}</h3>
              <p className="asset-capacity">👥 {asset.capacity}</p>
              <p className="asset-charges">💰 {asset.charges}</p>
              <p className="asset-description">{asset.description}</p>
              <button
                className="booking-btn"
                onClick={() => handleAssetSelect(asset)}
              >
                <Plus size={16} /> Request Booking
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Bookings */}
      {activeTab === "upcoming" && (
        <div className="bookings-list">
          {upcomingBookings.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No upcoming bookings</p>
            </div>
          ) : (
            upcomingBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h4>{booking.assetName}</h4>
                  <p>
                    <Calendar size={16} /> {booking.date}
                  </p>
                  <p>
                    <Clock size={16} /> {booking.timeSlot}
                  </p>
                  <p className="purpose">Purpose: {booking.purpose}</p>
                </div>
                <div className="booking-status">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Past Bookings */}
      {activeTab === "past" && (
        <div className="bookings-list">
          {pastBookings.length === 0 ? (
            <div className="empty-state">
              <Check size={48} />
              <p>No past bookings</p>
            </div>
          ) : (
            pastBookings.map((booking) => (
              <div key={booking.id} className="booking-card past">
                <div className="booking-info">
                  <h4>{booking.assetName}</h4>
                  <p>
                    <Calendar size={16} /> {booking.date}
                  </p>
                  <p>
                    <Clock size={16} /> {booking.timeSlot}
                  </p>
                  <p className="purpose">Purpose: {booking.purpose}</p>
                </div>
                <div className="booking-status">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            ))
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
          )}

          {activeTab === 'upcoming' && (
            <div className="bookings-list">
              {upcomingBookings.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle size={48} />
                  <p>No upcoming bookings</p>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-info">
                      <h4>{booking.assetName}</h4>
                      <p>
                        <Calendar size={16} /> {booking.date}
                      </p>
                      <p>
                        <Clock size={16} /> {booking.timeSlot}
                      </p>
                      <p className="purpose">Purpose: {booking.purpose}</p>
                      <p>Payment Mode: {booking.paymentOption}</p>
                      {booking.upiUtr ? <p>UPI UTR: {booking.upiUtr}</p> : null}
                      <p>Payment: {booking.paymentStatus}</p>
                      <p>Amount: {formatCurrency(booking.totalAmount)}</p>
                    </div>
                    <div className="booking-status">{getStatusBadge(booking.status)}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="bookings-list">
              {pastBookings.length === 0 ? (
                <div className="empty-state">
                  <Check size={48} />
                  <p>No past bookings</p>
                </div>
              ) : (
                pastBookings.map((booking) => (
                  <div key={booking.id} className="booking-card past">
                    <div className="booking-info">
                      <h4>{booking.assetName}</h4>
                      <p>
                        <Calendar size={16} /> {booking.date}
                      </p>
                      <p>
                        <Clock size={16} /> {booking.timeSlot}
                      </p>
                      <p className="purpose">Purpose: {booking.purpose}</p>
                      <p>Payment Mode: {booking.paymentOption}</p>
                      {booking.upiUtr ? <p>UPI UTR: {booking.upiUtr}</p> : null}
                      <p>Payment: {booking.paymentStatus}</p>
                      <p>Amount: {formatCurrency(booking.totalAmount)}</p>
                    </div>
                    <div className="booking-status">{getStatusBadge(booking.status)}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {showBookingModal && selectedAsset && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Book {selectedAsset.name}</h2>
              <button
                className="close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="asset-details">
                <p>
                  <strong>Capacity:</strong> {selectedAsset.capacity} persons
                </p>
                <p>
                  <strong>Charges:</strong> ₹{Number(selectedAsset.price_per_hour || 0).toLocaleString('en-IN')}/hour
                </p>
                <p>
                  <strong>Approval:</strong> {selectedAsset.approval_required ? 'Required' : 'Not required'}
                </p>
              </div>

              <div className="form-group">
                <label>Select Date *</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => handleBookingChange("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-group">
                <label>Select Time Slot *</label>
                <select
                  value={bookingForm.timeSlot}
                  onChange={(e) =>
                    handleBookingChange("timeSlot", e.target.value)
                  }
                >
                  <option value="">-- Select Time Slot --</option>
                  <option value="6:00 AM - 8:00 AM">6:00 AM - 8:00 AM</option>
                  <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 12:00 PM">
                    10:00 AM - 12:00 PM
                  </option>
                  <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                  <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                  <option value="8:00 PM - 10:00 PM">8:00 PM - 10:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label>Purpose (Optional)</label>
                <textarea
                  value={bookingForm.purpose}
                  onChange={(e) =>
                    handleBookingChange("purpose", e.target.value)
                  }
                  placeholder="e.g., Birthday party, wedding, meeting, etc."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Payment Option *</label>
                <select
                  value={bookingForm.paymentOption}
                  onChange={(e) => handleBookingChange('paymentOption', e.target.value)}
                >
                  <option value="">-- Select Payment Option --</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash at Office">Cash at Office</option>
                </select>
                <small className="form-help">Payment status will remain pending until admin/payment verification.</small>
              </div>

              {bookingForm.paymentOption === 'UPI' ? (
                <>
                  <div className="form-group">
                    <label>Your UPI ID *</label>
                    <input
                      type="text"
                      value={bookingForm.upiId}
                      onChange={(e) => handleBookingChange('upiId', e.target.value)}
                      placeholder="name@bank"
                    />
                  </div>
                  <div className="form-group">
                    <label>UPI Transaction Reference (UTR) *</label>
                    <input
                      type="text"
                      value={bookingForm.upiUtr}
                      onChange={(e) => handleBookingChange('upiUtr', e.target.value)}
                      placeholder="Enter 12 digit UTR"
                    />
                  </div>
                </>
              ) : null}

              <label className="terms-check">
                <input
                  type="checkbox"
                  checked={bookingForm.agreeTerms}
                  onChange={(e) => handleBookingChange('agreeTerms', e.target.checked)}
                />
                <span>I confirm the booking details and agree to community booking terms.</span>
              </label>
            </div>

            <div className="modal-footer">
              <button
                className="btn"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
<<<<<<< HEAD
              <button className="btn-submit" onClick={handleSubmitBooking} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} Submit Request
=======
              <button className="btn" onClick={handleSubmitBooking}>
                <Plus size={16} /> Submit Request
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AssetBooking;
