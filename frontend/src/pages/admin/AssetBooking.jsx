<<<<<<< HEAD
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Building2,
  Calendar,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  MoreHorizontal,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  User,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../utils/supabaseClient';
import {
  attachLocalAssetRelation,
  deleteLocalAsset,
  getLocalAssets,
  getLocalBookings,
  insertLocalAssets,
  updateLocalAsset,
  updateLocalBookingPayment,
  updateLocalBookingStatus,
} from '../../utils/assetBookingStorage';
import { pushNotification } from '../../utils/notificationStorage';
import './AssetBooking.css';

const ASSET_CATEGORIES = ['Hall', 'Clubhouse', 'Gym', 'Garden', 'Parking', 'Sports'];
const ASSET_PAGE_SIZE = 8;
const HISTORY_PAGE_SIZE = 10;

const emptyAssetForm = {
  name: '',
  category: 'Hall',
  capacity: '',
  pricePerHour: '',
  maxBookingHours: '',
  maxBookingsPerDay: '',
  advanceBookingDays: '',
  description: '',
  bookingApprovalRequired: true,
  status: 'active',
  imageUrl: '',
};

const STARTER_ASSET_TEMPLATES = [
  {
    name: 'Clubhouse',
    category: 'Clubhouse',
    capacity: 80,
    price_per_hour: 900,
    max_booking_hours: 4,
    max_bookings_per_day: 2,
    advance_booking_days: 30,
    description: 'Premium indoor lounge for parties, meetings, and family functions.',
    approval_required: true,
  },
  {
    name: 'Community Hall',
    category: 'Hall',
    capacity: 180,
    price_per_hour: 1500,
    max_booking_hours: 6,
    max_bookings_per_day: 2,
    advance_booking_days: 45,
    description: 'Large event hall suitable for community gatherings and celebrations.',
    approval_required: true,
  },
  {
    name: 'Fitness Gym',
    category: 'Gym',
    capacity: 25,
    price_per_hour: 200,
    max_booking_hours: 2,
    max_bookings_per_day: 8,
    advance_booking_days: 7,
    description: 'Slot-based gym booking to manage peak hours and avoid overcrowding.',
    approval_required: false,
  },
  {
    name: 'Garden Lawn',
    category: 'Garden',
    capacity: 120,
    price_per_hour: 700,
    max_booking_hours: 5,
    max_bookings_per_day: 2,
    advance_booking_days: 20,
    description: 'Open lawn area for small events, yoga sessions, and weekend activities.',
    approval_required: true,
  },
  {
    name: 'Sports Court',
    category: 'Sports',
    capacity: 20,
    price_per_hour: 350,
    max_booking_hours: 2,
    max_bookings_per_day: 10,
    advance_booking_days: 10,
    description: 'Multi-use court for badminton, basketball, and coaching sessions.',
    approval_required: false,
  },
];

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (value) => {
  if (!value) return '';
  const [hours, minutes] = String(value).split(':');
  if (!hours || !minutes) return value;
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  return `Rs ${numeric.toLocaleString('en-IN')}`;
};

const normalizeStatus = (status) => String(status || '').toLowerCase();
const getBookingStatus = (booking) => normalizeStatus(booking?.booking_status || booking?.status || 'pending');

const extractBookingPaymentOption = (booking) => {
  if (booking?.payment_option) return booking.payment_option;
  const purpose = String(booking?.purpose || '');
  const match = purpose.match(/\|\s*Payment:\s*([^|]+)/i);
  return match?.[1]?.trim() || 'Not specified';
};

const extractBookingUpiUtr = (booking) => {
  const purpose = String(booking?.purpose || '');
  const match = purpose.match(/\|\s*UPI UTR:\s*([^|]+)/i);
  return match?.[1]?.trim() || '';
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

const startOfWeek = (date) => {
  const safeDate = new Date(date);
  const day = safeDate.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  safeDate.setDate(safeDate.getDate() + offset);
  safeDate.setHours(0, 0, 0, 0);
  return safeDate;
};

const toISODate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const createBookingRules = ({ max_booking_hours, max_bookings_per_day, advance_booking_days }) => {
  return `Max ${max_booking_hours || 0}h / booking, ${max_bookings_per_day || 0} bookings/day, ${advance_booking_days || 0} days advance`;
};

const getMissingColumnFromError = (error) => {
  const message = String(error?.message || '');
  const match = message.match(/'([^']+)'\s+column/i);
  return match?.[1] || null;
};

const removeColumnFromPayload = (payload, column) => {
  if (Array.isArray(payload)) {
    return payload.map((row) => {
      const clone = { ...row };
      delete clone[column];
      return clone;
    });
  }

  const clone = { ...payload };
  delete clone[column];
  return clone;
};

const getNotNullColumnFromError = (error) => {
  const message = String(error?.message || '');
  const match = message.match(/null value in column\s+"([^"]+)"/i);
  return match?.[1] || null;
};

const applyDefaultForRequiredColumn = (payload, column) => {
  const defaultByColumn = {
    name: 'Community Asset',
    capacity: 0,
    charges: 0,
    price_per_hour: 0,
    bookingRules: '',
    booking_rules: '',
    description: '',
    status: 'active',
  };

  if (!Object.prototype.hasOwnProperty.call(defaultByColumn, column)) return payload;

  if (Array.isArray(payload)) {
    return payload.map((row) => ({ ...row, [column]: row[column] ?? defaultByColumn[column] }));
  }

  return { ...payload, [column]: payload[column] ?? defaultByColumn[column] };
};

const toLegacyAssetPayload = (payload) => {
  const convert = (row) => ({
    name: row.name,
    capacity: row.capacity,
    charges: row.price_per_hour ?? row.charges ?? 0,
    bookingRules: row.booking_rules ?? row.bookingRules ?? '',
    description: row.description ?? '',
    status: row.status ?? 'active',
    category: row.category,
    imageUrl: row.image_url ?? row.imageUrl ?? null,
    approvalRequired: row.approval_required ?? row.approvalRequired ?? true,
  });

  if (Array.isArray(payload)) return payload.map(convert);
  return convert(payload);
};

const normalizeAssetRecord = (asset) => ({
  ...asset,
  name: asset.name || 'Asset',
  category: asset.category || 'General',
  capacity: asset.capacity ?? 0,
  price_per_hour: asset.price_per_hour ?? asset.charges ?? 0,
  max_booking_hours: asset.max_booking_hours ?? asset.maxBookingHours ?? 0,
  max_bookings_per_day: asset.max_bookings_per_day ?? asset.maxBookingsPerDay ?? 0,
  advance_booking_days: asset.advance_booking_days ?? asset.advanceBookingDays ?? 0,
  booking_rules: asset.booking_rules || asset.bookingRules || '',
  description: asset.description || '',
  approval_required: asset.approval_required ?? asset.approvalRequired ?? true,
  status: normalizeStatus(asset.status || 'active') || 'active',
  image_url: asset.image_url || asset.imageUrl || null,
});

const AdminAssetBooking = () => {
  const toast = useToast();
  const toastRef = useRef(toast);
  const relationWarningShownRef = useRef(false);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [activeTab, setActiveTab] = useState('assets');
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLocalFallbackMode, setIsLocalFallbackMode] = useState(false);

  const [assetSearch, setAssetSearch] = useState('');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('all');
  const [assetAvailabilityFilter, setAssetAvailabilityFilter] = useState('all');
  const [assetPriceFilter, setAssetPriceFilter] = useState('all');
  const [assetCapacityFilter, setAssetCapacityFilter] = useState('all');
  const [assetPage, setAssetPage] = useState(1);
  const [openAssetMenuId, setOpenAssetMenuId] = useState(null);

  const [historyPage, setHistoryPage] = useState(1);
  const [historyAssetFilter, setHistoryAssetFilter] = useState('all');
  const [historyResidentFilter, setHistoryResidentFilter] = useState('');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');

  const [showAssetModal, setShowAssetModal] = useState(false);
  const [isSavingAsset, setIsSavingAsset] = useState(false);
  const [isSeedingTemplates, setIsSeedingTemplates] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [assetForm, setAssetForm] = useState(emptyAssetForm);
  const [assetImageFile, setAssetImageFile] = useState(null);

  const [pendingDeleteAsset, setPendingDeleteAsset] = useState(null);
  const [actionAssetId, setActionAssetId] = useState(null);

  const [detailsAsset, setDetailsAsset] = useState(null);
  const [bookingsAsset, setBookingsAsset] = useState(null);
  const [residentModalData, setResidentModalData] = useState(null);

  const [calendarAssetId, setCalendarAssetId] = useState('');
  const [calendarAnchor, setCalendarAnchor] = useState(startOfWeek(new Date()));
  const compatibilityNoticeShownRef = useRef(false);

  const isPendingBooking = (booking) => getBookingStatus(booking) === 'pending';

  const showLocalFallbackNotice = useCallback(() => {
    setIsLocalFallbackMode(true);
  }, []);

  const fetchAssets = useCallback(async ({ silent = false } = {}) => {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const localRows = getLocalAssets().map((row) => normalizeAssetRecord(row));
      setAssets(localRows);
      if (!silent) {
        showLocalFallbackNotice();
      }
      return;
=======
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import "./AssetBooking.css";
import api from "../../services/api";
const AdminAssetBooking = () => {
  const [activeTab, setActiveTab] = useState("assets");
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetForm, setAssetForm] = useState({
    name: "",
    capacity: "",
    charges: "",
    bookingRules: "",
    description: "",
  });
  const [assets, setAssets] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/api/admin/assets")
      .then((res) => {
        const data = res.data || [];
        setAssets(data.filter((d) => d.type === "asset" || !d.type));
        setBookingRequests(data.filter((d) => d.type === "booking"));
      })
      .catch((err) => console.error("Failed to load assets:", err))
      .finally(() => setLoading(false));
  }, []);
  const handleOpenAssetModal = (asset = null) => {
    if (asset) {
      setAssetForm(asset);
      setEditingAsset(asset.id);
    } else {
      setAssetForm({
        name: "",
        capacity: "",
        charges: "",
        bookingRules: "",
        description: "",
      });
      setEditingAsset(null);
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
    }

    const supabaseRows = Array.isArray(data) ? data.map((row) => normalizeAssetRecord(row)) : [];
    const localRows = getLocalAssets().map((row) => normalizeAssetRecord(row));

    if (!supabaseRows.length && localRows.length) {
      setAssets(localRows);
      if (!silent) showLocalFallbackNotice();
      return;
    }

    setAssets(supabaseRows);
  }, [showLocalFallbackNotice]);

  const fetchBookings = useCallback(async ({ silent = false } = {}) => {
    const relationQuery = await supabase
      .from('asset_bookings')
      .select('*, assets(id, name, category, price_per_hour, image_url), profiles(id, name, email, phone, flat_number)')
      .order('booking_date', { ascending: false });

    if (relationQuery.error) {
      const fallback = await supabase
        .from('asset_bookings')
        .select('*')
        .order('booking_date', { ascending: false });

      if (fallback.error) {
        const localAssets = getLocalAssets().map((row) => normalizeAssetRecord(row));
        const localBookings = getLocalBookings().map((row) => attachLocalAssetRelation(row, localAssets));
        setBookings(localBookings);
        if (!silent) {
          showLocalFallbackNotice();
        }
        return;
      }

      const supabaseFallbackRows = Array.isArray(fallback.data) ? fallback.data : [];
      const localAssets = getLocalAssets().map((row) => normalizeAssetRecord(row));
      const localBookings = getLocalBookings().map((row) => attachLocalAssetRelation(row, localAssets));

      if (!supabaseFallbackRows.length && localBookings.length) {
        setBookings(localBookings);
        if (!silent) showLocalFallbackNotice();
        return;
      }

      setBookings(supabaseFallbackRows);
      if (!silent && !relationWarningShownRef.current) {
        relationWarningShownRef.current = true;
        toastRef.current.warning('Bookings loaded without resident/asset relation details.');
      }
      return;
    }

    const relationRows = Array.isArray(relationQuery.data) ? relationQuery.data : [];
    const localAssets = getLocalAssets().map((row) => normalizeAssetRecord(row));
    const localBookings = getLocalBookings().map((row) => attachLocalAssetRelation(row, localAssets));

    if (!relationRows.length && localBookings.length) {
      setBookings(localBookings);
      if (!silent) showLocalFallbackNotice();
      return;
    }

    setBookings(relationRows);
  }, [showLocalFallbackNotice]);

  const saveAssetsWithSchemaCompatibility = useCallback(async ({ mode, payload, id }) => {
    const strategies = [payload, toLegacyAssetPayload(payload)];

    for (const strategyPayload of strategies) {
      let safePayload = strategyPayload;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        const mutation = mode === 'update'
          ? supabase.from('assets').update(safePayload).eq('id', id)
          : supabase.from('assets').insert(safePayload);

        const { error } = await mutation;
        if (!error) return;

        const missingColumn = getMissingColumnFromError(error);
        if (missingColumn) {
          const hasColumn = Array.isArray(safePayload)
            ? safePayload.some((row) => Object.prototype.hasOwnProperty.call(row, missingColumn))
            : Object.prototype.hasOwnProperty.call(safePayload, missingColumn);

          if (!hasColumn) break;
          safePayload = removeColumnFromPayload(safePayload, missingColumn);

          if (!compatibilityNoticeShownRef.current) {
            compatibilityNoticeShownRef.current = true;
            toastRef.current.warning(`Schema compatibility mode: skipping unsupported column '${missingColumn}'.`);
          }
          continue;
        }

        const requiredColumn = getNotNullColumnFromError(error);
        if (requiredColumn) {
          safePayload = applyDefaultForRequiredColumn(safePayload, requiredColumn);
          continue;
        }

        break;
      }
    }

    if (mode === 'update') {
      updateLocalAsset(id, payload);
    } else {
      insertLocalAssets(payload);
    }

    showLocalFallbackNotice();
    return;
  }, [showLocalFallbackNotice]);

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoadingPage(true);
    if (!silent) setIsLocalFallbackMode(false);
    try {
      await Promise.all([
        fetchAssets({ silent }),
        fetchBookings({ silent }),
      ]);
    } finally {
      if (!silent) setIsLoadingPage(false);
    }
  }, [fetchAssets, fetchBookings]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-assets-bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assets' },
        () => {
          fetchAssets({ silent: true });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'asset_bookings' },
        () => {
          fetchBookings({ silent: true });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAssets, fetchBookings]);

  useEffect(() => {
    if (!calendarAssetId && assets.length > 0) {
      setCalendarAssetId(String(assets[0].id));
    }
  }, [assets, calendarAssetId]);

  const resetForm = () => {
    setAssetForm(emptyAssetForm);
    setAssetImageFile(null);
    setEditingAssetId(null);
  };

  const openCreateAssetModal = () => {
    resetForm();
    setShowAssetModal(true);
  };
<<<<<<< HEAD

  const openEditAssetModal = (asset) => {
    setEditingAssetId(asset.id);
    setAssetImageFile(null);
    setAssetForm({
      name: asset.name || '',
      category: asset.category || 'Hall',
      capacity: asset.capacity ?? '',
      pricePerHour: asset.price_per_hour ?? '',
      maxBookingHours: asset.max_booking_hours ?? '',
      maxBookingsPerDay: asset.max_bookings_per_day ?? '',
      advanceBookingDays: asset.advance_booking_days ?? '',
      description: asset.description || '',
      bookingApprovalRequired: Boolean(asset.approval_required),
      status: normalizeStatus(asset.status) || 'active',
      imageUrl: asset.image_url || '',
    });
    setShowAssetModal(true);
  };

  const updateAssetForm = (field, value) => {
    setAssetForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadAssetImage = async () => {
    if (!assetImageFile) return assetForm.imageUrl || null;

    const fileExt = assetImageFile.name.split('.').pop();
    const baseName = assetImageFile.name.replace(/\.[^.]+$/, '');
    const fileName = `${Date.now()}-${baseName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `assets/${fileName}.${fileExt || 'jpg'}`;

    const { error: uploadError } = await supabase.storage
      .from('asset-images')
      .upload(filePath, assetImageFile, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('asset-images')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || assetForm.imageUrl || null;
  };

  const upsertAsset = async () => {
    if (!assetForm.name.trim()) {
      toast.warning('Asset name is required');
      return;
    }

    if (!assetForm.capacity || Number(assetForm.capacity) <= 0) {
      toast.warning('Capacity must be greater than zero');
      return;
    }

    setIsSavingAsset(true);
    try {
      const imageUrl = await uploadAssetImage();
      const bookingRules = createBookingRules({
        max_booking_hours: assetForm.maxBookingHours,
        max_bookings_per_day: assetForm.maxBookingsPerDay,
        advance_booking_days: assetForm.advanceBookingDays,
      });

      const payload = {
        name: assetForm.name.trim(),
        category: assetForm.category,
        capacity: Number(assetForm.capacity),
        price_per_hour: Number(assetForm.pricePerHour || 0),
        max_booking_hours: Number(assetForm.maxBookingHours || 0),
        max_bookings_per_day: Number(assetForm.maxBookingsPerDay || 0),
        advance_booking_days: Number(assetForm.advanceBookingDays || 0),
        booking_rules: bookingRules,
        description: assetForm.description.trim(),
        approval_required: Boolean(assetForm.bookingApprovalRequired),
        status: normalizeStatus(assetForm.status) === 'disabled' ? 'disabled' : 'active',
        image_url: imageUrl,
      };

      if (editingAssetId) {
        await saveAssetsWithSchemaCompatibility({ mode: 'update', payload, id: editingAssetId });
        toast.success('Asset updated successfully');
      } else {
        await saveAssetsWithSchemaCompatibility({ mode: 'insert', payload });
        toast.success('Asset created successfully');
      }

      await fetchAssets();
      setShowAssetModal(false);
      resetForm();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, 'Unable to save asset'));
    } finally {
      setIsSavingAsset(false);
    }
  };

  const addStarterTemplates = async (mode = 'all', templateName = '') => {
    setIsSeedingTemplates(true);
    try {
      const existingNames = new Set(assets.map((asset) => String(asset.name || '').toLowerCase().trim()));
      const selected = mode === 'single'
        ? STARTER_ASSET_TEMPLATES.filter((item) => item.name === templateName)
        : STARTER_ASSET_TEMPLATES;

      const payload = selected
        .filter((template) => !existingNames.has(template.name.toLowerCase()))
        .map((template) => ({
          ...template,
          booking_rules: createBookingRules(template),
          status: 'active',
        }));

      if (!payload.length) {
        toast.success('Starter assets are already available.');
        return;
      }

      await saveAssetsWithSchemaCompatibility({ mode: 'insert', payload });

      toast.success(`${payload.length} starter asset${payload.length > 1 ? 's' : ''} added.`);
      await fetchAssets();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, 'Unable to add starter assets'));
    } finally {
      setIsSeedingTemplates(false);
    }
  };

  const toggleAssetStatus = async (asset) => {
    setActionAssetId(asset.id);
    const nextStatus = normalizeStatus(asset.status) === 'active' ? 'disabled' : 'active';

    try {
      const { error } = await supabase
        .from('assets')
        .update({ status: nextStatus })
        .eq('id', asset.id);

      if (error) {
        updateLocalAsset(asset.id, { status: nextStatus });
        showLocalFallbackNotice();
      }

      toast.success(`Asset ${nextStatus === 'active' ? 'enabled' : 'disabled'} successfully`);
      await fetchAssets();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, 'Unable to update asset status'));
    } finally {
      setActionAssetId(null);
    }
  };

  const deleteAsset = async () => {
    if (!pendingDeleteAsset) return;
    setActionAssetId(pendingDeleteAsset.id);
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', pendingDeleteAsset.id);

      if (error) {
        deleteLocalAsset(pendingDeleteAsset.id);
        showLocalFallbackNotice();
      }
      toast.success('Asset deleted successfully');
      setPendingDeleteAsset(null);
      await fetchAssets();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, 'Unable to delete asset'));
    } finally {
      setActionAssetId(null);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    const actionWord = status === 'approved' ? 'approve' : 'reject';
    const confirmed = window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} this booking request?`);
    if (!confirmed) return;

    const booking = bookings.find((item) => String(item.id) === String(bookingId));
    const residentName = residentNameForBooking(booking || {});
    const assetName = booking?.assets?.name || booking?.asset_name || 'asset';

    try {
      let dbUpdated = false;

      const primaryResult = await supabase
        .from('asset_bookings')
        .update({ booking_status: status })
        .eq('id', bookingId)
        .select('id, booking_status, status');

      let error = primaryResult.error;
      if (!error && Array.isArray(primaryResult.data) && primaryResult.data.length > 0) {
        dbUpdated = true;
      }

      // Legacy compatibility: some environments still use status instead of booking_status.
      if (!dbUpdated) {
        const legacyResult = await supabase
          .from('asset_bookings')
          .update({ status, booking_status: status })
          .eq('id', bookingId)
          .select('id, booking_status, status');

        error = legacyResult.error || error;
        if (!legacyResult.error && Array.isArray(legacyResult.data) && legacyResult.data.length > 0) {
          dbUpdated = true;
        }
      }

      if (!dbUpdated && error) {
        updateLocalBookingStatus(bookingId, status);
        showLocalFallbackNotice();
      }

      if (dbUpdated) {
        toast.success(`Booking ${actionWord}d successfully`);
      }

      const notificationPayload = {
        type: status === 'approved' ? 'success' : 'alert',
        title: status === 'approved' ? 'Booking Approved' : 'Booking Rejected',
        message: status === 'approved'
          ? `Your booking for ${assetName} on ${formatDate(booking?.booking_date)} has been approved.`
          : `Your booking for ${assetName} on ${formatDate(booking?.booking_date)} was rejected.`,
        recipient_id: booking?.resident_id || null,
        recipient_name: residentName,
        recipient_role: 'resident',
      };

      pushNotification(notificationPayload);

      // If a notifications table exists in Supabase, write there as well.
      // Ignore errors because many environments do not have this table yet.
      try {
        await supabase.from('notifications').insert({
          title: notificationPayload.title,
          message: notificationPayload.message,
          type: notificationPayload.type,
          recipient_id: notificationPayload.recipient_id,
          recipient_name: notificationPayload.recipient_name,
          recipient_role: notificationPayload.recipient_role,
        });
      } catch {
        // no-op fallback to local notifications only
      }

      await fetchBookings();
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, 'Unable to update booking status'));
    }
  };

  const updateBookingPaymentStatus = async (bookingId, paymentStatus) => {
    const booking = bookings.find((item) => String(item.id) === String(bookingId));
    const actionLabel = paymentStatus === 'paid' ? 'verify payment as PAID' : 'mark payment as FAILED';
    if (!window.confirm(`Confirm to ${actionLabel}?`)) return;

    try {
      let dbUpdated = false;

      const primaryResult = await supabase
        .from('asset_bookings')
        .update({ payment_status: paymentStatus })
        .eq('id', bookingId)
        .select('id, payment_status');

      if (!primaryResult.error && Array.isArray(primaryResult.data) && primaryResult.data.length > 0) {
        dbUpdated = true;
      }

      if (!dbUpdated) {
        updateLocalBookingPayment(bookingId, { payment_status: paymentStatus });
        showLocalFallbackNotice();
      }

      if (paymentStatus === 'paid') {
        pushNotification({
          type: 'success',
          title: 'Payment Verified',
          message: `Your booking payment for ${booking?.assets?.name || 'asset'} has been verified by admin.`,
          recipient_id: booking?.resident_id || null,
          recipient_name: residentNameForBooking(booking || {}),
          recipient_role: 'resident',
        });
      }

      await fetchBookings();
      toast.success(`Payment marked as ${paymentStatus}`);
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, 'Unable to update payment status'));
    }
  };

  const filteredAssets = useMemo(() => {
    const term = assetSearch.trim().toLowerCase();
    return assets.filter((asset) => {
      const searchable = `${asset.name || ''} ${asset.category || ''} ${asset.description || ''}`.toLowerCase();
      const status = normalizeStatus(asset.status);
      const pricePerHour = Number(asset.price_per_hour || 0);
      const capacity = Number(asset.capacity || 0);

      if (term && !searchable.includes(term)) return false;
      if (assetCategoryFilter !== 'all' && String(asset.category || '').toLowerCase() !== assetCategoryFilter) return false;
      if (assetAvailabilityFilter !== 'all' && status !== assetAvailabilityFilter) return false;

      if (assetPriceFilter === 'low' && pricePerHour > 500) return false;
      if (assetPriceFilter === 'mid' && (pricePerHour < 501 || pricePerHour > 1500)) return false;
      if (assetPriceFilter === 'high' && pricePerHour < 1501) return false;

      if (assetCapacityFilter === 'small' && capacity > 50) return false;
      if (assetCapacityFilter === 'medium' && (capacity < 51 || capacity > 150)) return false;
      if (assetCapacityFilter === 'large' && capacity < 151) return false;

      return true;
    });
  }, [
    assets,
    assetAvailabilityFilter,
    assetCapacityFilter,
    assetCategoryFilter,
    assetPriceFilter,
    assetSearch,
  ]);

  const totalAssetPages = Math.max(1, Math.ceil(filteredAssets.length / ASSET_PAGE_SIZE));
  const paginatedAssets = useMemo(() => {
    const startIndex = (assetPage - 1) * ASSET_PAGE_SIZE;
    return filteredAssets.slice(startIndex, startIndex + ASSET_PAGE_SIZE);
  }, [filteredAssets, assetPage]);

  useEffect(() => {
    setAssetPage((prev) => Math.min(prev, totalAssetPages));
  }, [totalAssetPages]);

  const pendingBookings = useMemo(
    () => bookings.filter((booking) => isPendingBooking(booking)),
    [bookings],
  );

  const completedBookings = useMemo(
    () => bookings.filter((booking) => !isPendingBooking(booking)),
    [bookings],
  );

  const historyRows = useMemo(() => {
    const residentTerm = historyResidentFilter.trim().toLowerCase();

    return completedBookings.filter((booking) => {
      if (historyAssetFilter !== 'all' && String(booking.asset_id) !== historyAssetFilter) {
        return false;
      }

      const bookingDateText = String(booking.booking_date || '').slice(0, 10);
      if (historyDateFrom && bookingDateText && bookingDateText < historyDateFrom) {
        return false;
      }

      if (historyDateTo && bookingDateText && bookingDateText > historyDateTo) {
        return false;
      }

      if (residentTerm) {
        const resident = (booking.profiles?.name || booking.resident_name || '').toLowerCase();
        if (!resident.includes(residentTerm)) return false;
      }

      return true;
    });
  }, [completedBookings, historyAssetFilter, historyDateFrom, historyDateTo, historyResidentFilter]);

  const exportHistoryCsv = () => {
    const headers = ['Resident', 'Asset', 'Date', 'Start Time', 'End Time', 'Status', 'Payment', 'Amount'];
    const rows = historyRows.map((booking) => ([
      residentNameForBooking(booking),
      booking.assets?.name || booking.asset_name || 'Asset',
      String(booking.booking_date || ''),
      String(booking.start_time || ''),
      String(booking.end_time || ''),
      String(booking.booking_status || booking.status || ''),
      String(booking.payment_status || ''),
      String(booking.total_amount || 0),
    ]));

    const csv = [headers, ...rows]
      .map((row) => row.map((item) => `"${String(item).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `booking-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalHistoryPages = Math.max(1, Math.ceil(historyRows.length / HISTORY_PAGE_SIZE));
  const paginatedHistoryRows = useMemo(() => {
    const startIndex = (historyPage - 1) * HISTORY_PAGE_SIZE;
    return historyRows.slice(startIndex, startIndex + HISTORY_PAGE_SIZE);
  }, [historyPage, historyRows]);

  useEffect(() => {
    setHistoryPage((prev) => Math.min(prev, totalHistoryPages));
  }, [totalHistoryPages]);

  const analytics = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    let monthlyBookings = 0;
    const bookingsByAsset = {};
    let revenue = 0;

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.booking_date || booking.created_at || Date.now());
      if (bookingDate.getMonth() === month && bookingDate.getFullYear() === year) {
        monthlyBookings += 1;
      }

      const assetName = booking.assets?.name || booking.asset_name || 'Unknown Asset';
      bookingsByAsset[assetName] = (bookingsByAsset[assetName] || 0) + 1;

      const amount = Number(
        booking.total_amount
          || booking.amount_paid
          || ((booking.duration_hours || 0) * (booking.assets?.price_per_hour || 0)),
      );
      revenue += amount;
    });

    const mostBookedAsset = Object.entries(bookingsByAsset)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      totalAssets: assets.length,
      monthlyBookings,
      mostBookedAsset,
      revenue,
    };
  }, [assets.length, bookings]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(calendarAnchor);
      date.setDate(date.getDate() + index);
      return date;
    });
  }, [calendarAnchor]);

  const calendarEntries = useMemo(() => {
    const selectedAsset = String(calendarAssetId);
    if (!selectedAsset) return {};

    const map = {};
    bookings.forEach((booking) => {
      if (String(booking.asset_id) !== selectedAsset) return;
      const bookingDate = String(booking.booking_date || '').slice(0, 10);
      if (!bookingDate) return;
      if (!map[bookingDate]) map[bookingDate] = [];
      map[bookingDate].push(booking);
    });

    return map;
  }, [bookings, calendarAssetId]);

  const residentNameForBooking = (booking) => booking.profiles?.name || booking.resident_name || 'Resident';

=======
  const handleAssetChange = (field, value) => {
    setAssetForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSaveAsset = () => {
    if (!assetForm.name || !assetForm.capacity) {
      alert("Please fill required fields");
      return;
    }
    if (editingAsset) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === editingAsset
            ? {
                ...assetForm,
                id: editingAsset,
              }
            : a,
        ),
      );
      alert("Asset updated successfully!");
    } else {
      setAssets((prev) => [
        ...prev,
        {
          ...assetForm,
          id: Date.now(),
        },
      ]);
      alert("Asset created successfully!");
    }
    setShowAssetModal(false);
  };
  const handleDeleteAsset = (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      alert("Asset deleted successfully!");
    }
  };
  const handleApproveBooking = (id) => {
    console.log("Booking approved:", id);
    alert("Booking approved! Resident will be notified.");
  };
  const handleRejectBooking = (id) => {
    console.log("Booking rejected:", id);
    alert("Booking rejected! Resident will be notified.");
  };
  const getStatusBadge = (status) => {
    const statusClass = {
      Approved: "status-approved",
      Pending: "status-pending",
      Rejected: "status-rejected",
    };
    return (
      <span className={`status-badge ${statusClass[status]}`}>{status}</span>
    );
  };
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
  return (
    <div className="admin-asset-booking-page">
      <PageHeader
        title="Assets & Bookings"
        subtitle="Manage community facilities, bookings, and availability."
        action={(
          <button type="button" className="btn-primary gradient" onClick={openCreateAssetModal}>
            <Plus size={16} /> Add Asset
          </button>
        )}
      />

      {isLocalFallbackMode ? (
        <div className="mode-indicator warning">Running in local preview mode. Database connection inactive.</div>
      ) : null}

      <section className="analytics-grid">
        <article className="analytics-card">
          <div className="analytics-icon"><Building2 size={17} /></div>
          <div>
            <p>Total Assets</p>
            <h3>{analytics.totalAssets}</h3>
          </div>
        </article>
        <article className="analytics-card">
          <div className="analytics-icon"><CalendarCheck2 size={17} /></div>
          <div>
            <p>Bookings This Month</p>
            <h3>{analytics.monthlyBookings}</h3>
          </div>
        </article>
        <article className="analytics-card">
          <div className="analytics-icon"><Star size={17} /></div>
          <div>
            <p>Most Booked Asset</p>
            <h3>{analytics.mostBookedAsset}</h3>
          </div>
        </article>
      </section>

      <div className="booking-tabs">
<<<<<<< HEAD
        <button className={`tab-btn ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>
          Manage Assets
        </button>
        <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
          Booking Requests ({pendingBookings.length})
        </button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Booking History
        </button>
        <button className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
          Booking Calendar
        </button>
      </div>

      {isLoadingPage ? (
        <div className="loading-state">
          <Loader2 size={22} className="spin" />
          <span>Loading assets and bookings from Supabase...</span>
        </div>
      ) : (
        <>
          {activeTab === 'assets' && (
            <section className="admin-section">
              <header className="section-header section-header-wrap">
                <div>
                  <h3>Community Asset Management</h3>
                  <p>Create, update, disable, and monitor every shared facility.</p>
=======
        <button
          className={`tab-btn ${activeTab === "assets" ? "active" : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          🏢 Manage Assets
        </button>
        <button
          className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          📋 Booking Requests (
          {bookingRequests.filter((b) => b.status === "Pending").length})
        </button>
        <button
          className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          📊 Booking History
        </button>
      </div>

      {/* Manage Assets */}
      {activeTab === "assets" && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Community Assets</h3>
            <button
              className="btn-primary btn"
              onClick={() => handleOpenAssetModal()}
            >
              <Plus size={16} /> Add New Asset
            </button>
          </div>

          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Capacity</th>
                  <th>Charges</th>
                  <th>Booking Rules</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <strong>{asset.name}</strong>
                    </td>
                    <td>{asset.capacity} persons</td>
                    <td>₹{asset.charges}/hour</td>
                    <td>{asset.bookingRules || "-"}</td>
                    <td>{asset.description || "-"}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenAssetModal(asset)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteAsset(asset.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Requests */}
      {activeTab === "requests" && (
        <div className="admin-section">
          <h3>Pending Booking Requests</h3>

          {bookingRequests.length === 0 ? (
            <div className="empty-state">
              <AlertCircle size={48} />
              <p>No booking requests</p>
            </div>
          ) : (
            <div className="requests-list">
              {bookingRequests.map((request) => (
                <div
                  key={request.id}
                  className={`request-card ${request.status === "Pending" ? "pending" : ""}`}
                >
                  <div className="request-info">
                    <h4>{request.assetName}</h4>
                    <p>
                      <strong>Resident:</strong> {request.resident}
                    </p>
                    <p>
                      <Calendar size={14} /> {request.date}
                    </p>
                    <p>
                      <Clock size={14} /> {request.timeSlot}
                    </p>
                    <p>
                      <strong>Purpose:</strong> {request.purpose}
                    </p>
                    <p className="requested-on">
                      Requested on: {request.requestedOn}
                    </p>
                  </div>

                  <div className="request-actions">
                    {getStatusBadge(request.status)}
                    {request.status === "Pending" && (
                      <div className="action-buttons">
                        <button
                          className="btn"
                          onClick={() => handleApproveBooking(request.id)}
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button
                          className="btn"
                          onClick={() => handleRejectBooking(request.id)}
                        >
                          <X size={16} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
                </div>

<<<<<<< HEAD
                <div className="toolbar-right">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => addStarterTemplates('all')}
                    disabled={isSeedingTemplates}
                  >
                    {isSeedingTemplates ? <Loader2 size={16} className="spin" /> : null}
                    Add 5 Starter Assets
                  </button>
                </div>
              </header>

              <div className="asset-filter-row">
                <label className="search-input-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    value={assetSearch}
                    onChange={(event) => setAssetSearch(event.target.value)}
                    placeholder="Search assets"
                  />
                </label>

                <select value={assetCategoryFilter} onChange={(event) => setAssetCategoryFilter(event.target.value)}>
                  <option value="all">Asset Type</option>
                  {ASSET_CATEGORIES.map((category) => (
                    <option key={category} value={category.toLowerCase()}>{category}</option>
                  ))}
                </select>

                <select value={assetAvailabilityFilter} onChange={(event) => setAssetAvailabilityFilter(event.target.value)}>
                  <option value="all">Availability</option>
                  <option value="active">Available</option>
                  <option value="disabled">Disabled</option>
                </select>

                <select value={assetPriceFilter} onChange={(event) => setAssetPriceFilter(event.target.value)}>
                  <option value="all">Price Range</option>
                  <option value="low">Under Rs 500</option>
                  <option value="mid">Rs 500 - Rs 1500</option>
                  <option value="high">Above Rs 1500</option>
                </select>

                <select value={assetCapacityFilter} onChange={(event) => setAssetCapacityFilter(event.target.value)}>
                  <option value="all">Capacity</option>
                  <option value="small">Up to 50</option>
                  <option value="medium">51 - 150</option>
                  <option value="large">151+</option>
                </select>
=======
      {/* Booking History */}
      {activeTab === "history" && (
        <div className="admin-section">
          <h3>All Bookings (History)</h3>
          <div className="requests-list">
            {bookingRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-info">
                  <h4>{request.assetName}</h4>
                  <p>
                    <strong>Resident:</strong> {request.resident}
                  </p>
                  <p>
                    <Calendar size={14} /> {request.date}
                  </p>
                  <p>
                    <Clock size={14} /> {request.timeSlot}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {request.purpose}
                  </p>
                </div>
                <div className="request-status">
                  {getStatusBadge(request.status)}
                </div>
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
              </div>

              <div className="starter-assets-strip">
                {STARTER_ASSET_TEMPLATES.map((template) => (
                  <article key={template.name} className="starter-card">
                    <div>
                      <h4>{template.name}</h4>
                      <p>{template.category} • Capacity {template.capacity}</p>
                      <small>{formatCurrency(template.price_per_hour)}/hour</small>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => addStarterTemplates('single', template.name)}
                      disabled={isSeedingTemplates}
                    >
                      Add
                    </button>
                  </article>
                ))}
              </div>

              <div className="asset-card-grid">
                {paginatedAssets.map((asset) => {
                  const status = normalizeStatus(asset.status) || 'active';
                  const isBusy = actionAssetId === asset.id;
                  const isMenuOpen = openAssetMenuId === asset.id;

                  return (
                    <article key={asset.id} className="asset-grid-card">
                      <div className="asset-card-banner">
                        {asset.image_url ? <img src={asset.image_url} alt={asset.name} /> : <div className="asset-banner-placeholder" />}
                        <button
                          type="button"
                          className="menu-trigger"
                          title="Asset actions"
                          onClick={() => setOpenAssetMenuId(isMenuOpen ? null : asset.id)}
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {isMenuOpen ? (
                          <div className="asset-action-menu">
                            <button type="button" onClick={() => { openEditAssetModal(asset); setOpenAssetMenuId(null); }}>
                              <Pencil size={14} /> Edit
                            </button>
                            <button type="button" onClick={() => { toggleAssetStatus(asset); setOpenAssetMenuId(null); }} disabled={isBusy}>
                              {status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />} {status === 'active' ? 'Disable' : 'Enable'}
                            </button>
                            <button type="button" onClick={() => { setBookingsAsset(asset); setOpenAssetMenuId(null); }}>
                              <Calendar size={14} /> View Bookings
                            </button>
                            <button type="button" onClick={() => { setDetailsAsset(asset); setOpenAssetMenuId(null); }}>
                              <FileText size={14} /> View Details
                            </button>
                            <button type="button" className="danger" onClick={() => { setPendingDeleteAsset(asset); setOpenAssetMenuId(null); }} disabled={isBusy}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <div className="asset-card-body">
                        <h4>{asset.name}</h4>
                        <p>{asset.category || 'General'} • Capacity {asset.capacity || 0}</p>
                        <strong>{formatCurrency(asset.price_per_hour || 0)}/hour</strong>
                        <div className="asset-card-meta">
                          <span className={`status-badge ${status === 'active' ? 'status-approved' : 'status-rejected'}`}>
                            {status === 'active' ? 'Available' : 'Disabled'}
                          </span>
                          <small>Created {formatDate(asset.created_at)}</small>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {!paginatedAssets.length ? (
                  <div className="empty-state compact card-span-full">
                    <AlertCircle size={30} />
                    <p>No assets found for current filters.</p>
                  </div>
                ) : null}
              </div>

              <div className="table-pagination">
                <button type="button" className="btn-ghost" onClick={() => setAssetPage((page) => Math.max(1, page - 1))} disabled={assetPage === 1}>
                  Previous
                </button>
                <span>Page {assetPage} of {totalAssetPages}</span>
                <button type="button" className="btn-ghost" onClick={() => setAssetPage((page) => Math.min(totalAssetPages, page + 1))} disabled={assetPage === totalAssetPages}>
                  Next
                </button>
              </div>

              <div className="security-note">
                <ShieldCheck size={16} />
                <span>RLS enforced: Admin has full access, Resident can view active assets and create bookings, Security has read-only access.</span>
              </div>
            </section>
          )}

          {activeTab === 'requests' && (
            <section className="admin-section">
              <header className="section-header">
                <div>
                  <h3>Pending Booking Requests</h3>
                  <p>Review incoming booking requests from residents in real-time.</p>
                </div>
              </header>

              <div className="assets-table-wrapper">
                <table className="assets-table">
                  <thead>
                    <tr>
                      <th>Resident</th>
                      <th>Asset</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.map((booking) => {
                      const bookingStatus = getBookingStatus(booking);
                      const bookingStatusLabel = bookingStatus || 'pending';
                      const paymentMethod = extractBookingPaymentOption(booking);
                      const upiUtr = extractBookingUpiUtr(booking);

                      return (
                        <tr key={booking.id}>
                          <td>{residentNameForBooking(booking)}</td>
                          <td>{booking.assets?.name || booking.asset_name || 'Asset'}</td>
                          <td>{formatDate(booking.booking_date)}</td>
                          <td>{`${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`}</td>
                          <td>
                            <div className="payment-cell">
                              <span className={`status-badge ${normalizeStatus(booking.payment_status) === 'paid' ? 'status-approved' : normalizeStatus(booking.payment_status) === 'failed' ? 'status-rejected' : 'status-pending'}`}>
                                {booking.payment_status || 'pending'}
                              </span>
                              <small>{paymentMethod}</small>
                              {upiUtr ? <small>UTR: {upiUtr}</small> : null}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${bookingStatus === 'approved' ? 'status-approved' : bookingStatus === 'rejected' ? 'status-rejected' : 'status-pending'}`}>
                              {bookingStatusLabel}
                            </span>
                          </td>
                          <td>
                            <div className="row-actions request-actions">
                              <button type="button" className="action-btn accept" onClick={() => updateBookingStatus(booking.id, 'approved')} title="Accept booking">
                                Accept
                              </button>
                              <button type="button" className="action-btn reject" onClick={() => updateBookingStatus(booking.id, 'rejected')} title="Reject booking">
                                Reject
                              </button>
                              <button type="button" className="action-btn accept" onClick={() => updateBookingPaymentStatus(booking.id, 'paid')} title="Mark payment as paid">
                                Mark Paid
                              </button>
                              <button type="button" className="action-btn reject" onClick={() => updateBookingPaymentStatus(booking.id, 'failed')} title="Mark payment as failed">
                                Mark Failed
                              </button>
                              <button type="button" className="action-btn" onClick={() => setResidentModalData(booking.profiles || { name: residentNameForBooking(booking) })} title="View resident details">
                                <User size={15} /> View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {!pendingBookings.length && (
                  <div className="empty-state compact">
                    <AlertCircle size={30} />
                    <p>No pending booking requests.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'history' && (
            <section className="admin-section">
              <header className="section-header section-header-wrap">
                <div>
                  <h3>Booking History</h3>
                  <p>Track completed and decided bookings with advanced filters.</p>
                </div>

                <div className="history-filters">
                  <select value={historyAssetFilter} onChange={(event) => setHistoryAssetFilter(event.target.value)}>
                    <option value="all">All Assets</option>
                    {assets.map((asset) => (
                      <option key={asset.id} value={String(asset.id)}>{asset.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={historyResidentFilter}
                    onChange={(event) => setHistoryResidentFilter(event.target.value)}
                    placeholder="Filter by resident"
                  />

                  <input
                    type="date"
                    value={historyDateFrom}
                    onChange={(event) => setHistoryDateFrom(event.target.value)}
                  />

                  <input
                    type="date"
                    value={historyDateTo}
                    onChange={(event) => setHistoryDateTo(event.target.value)}
                  />

                  <button type="button" className="btn-ghost" onClick={exportHistoryCsv}>
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </header>

              <div className="assets-table-wrapper">
                <table className="assets-table">
                  <thead>
                    <tr>
                      <th>Resident</th>
                      <th>Asset</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHistoryRows.map((booking) => {
                      const status = getBookingStatus(booking);
                      return (
                        <tr key={booking.id}>
                          <td>{residentNameForBooking(booking)}</td>
                          <td>{booking.assets?.name || booking.asset_name || 'Asset'}</td>
                          <td>{formatDate(booking.booking_date)}</td>
                          <td>{`${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`}</td>
                          <td>
                            <span className={`status-badge ${status === 'approved' || status === 'completed' ? 'status-approved' : 'status-rejected'}`}>
                              {booking.booking_status || booking.status || 'completed'}
                            </span>
                          </td>
                          <td>{booking.payment_status || 'pending'}</td>
                          <td>{formatCurrency(booking.total_amount || 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {!paginatedHistoryRows.length && (
                  <div className="empty-state compact">
                    <AlertCircle size={30} />
                    <p>No booking history rows match your filters.</p>
                  </div>
                )}
              </div>

              <div className="table-pagination">
                <button type="button" className="btn-ghost" onClick={() => setHistoryPage((page) => Math.max(1, page - 1))} disabled={historyPage === 1}>
                  Previous
                </button>
                <span>Page {historyPage} of {totalHistoryPages}</span>
                <button type="button" className="btn-ghost" onClick={() => setHistoryPage((page) => Math.min(totalHistoryPages, page + 1))} disabled={historyPage === totalHistoryPages}>
                  Next
                </button>
              </div>
            </section>
          )}

          {activeTab === 'calendar' && (
            <section className="admin-section">
              <header className="section-header section-header-wrap">
                <div>
                  <h3>Asset Booking Calendar</h3>
                  <p>Visual weekly schedule for occupancy and conflict management.</p>
                </div>

                <div className="calendar-controls">
                  <select value={calendarAssetId} onChange={(event) => setCalendarAssetId(event.target.value)}>
                    {assets.map((asset) => (
                      <option key={asset.id} value={String(asset.id)}>{asset.name}</option>
                    ))}
                  </select>

                  <div className="calendar-nav">
                    <button type="button" className="btn-ghost" onClick={() => {
                      const next = new Date(calendarAnchor);
                      next.setDate(next.getDate() - 7);
                      setCalendarAnchor(startOfWeek(next));
                    }}>
                      <ChevronLeft size={16} />
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setCalendarAnchor(startOfWeek(new Date()))}>
                      This Week
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => {
                      const next = new Date(calendarAnchor);
                      next.setDate(next.getDate() + 7);
                      setCalendarAnchor(startOfWeek(next));
                    }}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </header>

              <div className="calendar-grid">
                {weekDays.map((date) => {
                  const key = toISODate(date);
                  const entries = calendarEntries[key] || [];
                  return (
                    <article className="calendar-day" key={key}>
                      <div className="calendar-day-head">
                        <strong>{date.toLocaleDateString('en-US', { weekday: 'short' })}</strong>
                        <span>{formatDate(key)}</span>
                      </div>
                      <div className="calendar-day-body">
                        {entries.length ? entries.map((entry) => (
                          <div className={`calendar-entry calendar-${getBookingStatus(entry)}`} key={entry.id}>
                            <p>{residentNameForBooking(entry)}</p>
                            <span>{formatTime(entry.start_time)} - {formatTime(entry.end_time)}</span>
                            <small>{entry.booking_status || entry.status || 'pending'}</small>
                          </div>
                        )) : <p className="calendar-empty">No bookings</p>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {showAssetModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content large">
            <div className="modal-header">
<<<<<<< HEAD
              <h2>{editingAssetId ? 'Edit Asset' : 'Create New Asset'}</h2>
              <button type="button" className="close-btn" onClick={() => setShowAssetModal(false)}>x</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <label className="form-group">
                  <span>Asset Name</span>
                  <input type="text" value={assetForm.name} onChange={(event) => updateAssetForm('name', event.target.value)} placeholder="Clubhouse" />
                </label>

                <label className="form-group">
                  <span>Category</span>
                  <select value={assetForm.category} onChange={(event) => updateAssetForm('category', event.target.value)}>
                    {ASSET_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label className="form-group">
                  <span>Capacity</span>
                  <input type="number" value={assetForm.capacity} onChange={(event) => updateAssetForm('capacity', event.target.value)} />
                </label>

                <label className="form-group">
                  <span>Price per hour</span>
                  <input type="number" value={assetForm.pricePerHour} onChange={(event) => updateAssetForm('pricePerHour', event.target.value)} />
                </label>

                <label className="form-group">
                  <span>Max hours per booking</span>
                  <input type="number" value={assetForm.maxBookingHours} onChange={(event) => updateAssetForm('maxBookingHours', event.target.value)} />
                </label>

                <label className="form-group">
                  <span>Max bookings per day</span>
                  <input type="number" value={assetForm.maxBookingsPerDay} onChange={(event) => updateAssetForm('maxBookingsPerDay', event.target.value)} />
                </label>

                <label className="form-group">
                  <span>Advance booking days</span>
                  <input type="number" value={assetForm.advanceBookingDays} onChange={(event) => updateAssetForm('advanceBookingDays', event.target.value)} />
                </label>

                <label className="form-group">
                  <span>Status</span>
                  <select value={assetForm.status} onChange={(event) => updateAssetForm('status', event.target.value)}>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </label>

                <label className="form-group full-row">
                  <span>Description</span>
                  <textarea rows={3} value={assetForm.description} onChange={(event) => updateAssetForm('description', event.target.value)} placeholder="Describe the use case, restrictions, and amenities" />
                </label>

                <label className="form-group">
                  <span>Upload asset image</span>
                  <input type="file" accept="image/*" onChange={(event) => setAssetImageFile(event.target.files?.[0] || null)} />
                </label>

                <label className="form-group toggle-row">
                  <span>Booking approval required</span>
                  <select value={assetForm.bookingApprovalRequired ? 'yes' : 'no'} onChange={(event) => updateAssetForm('bookingApprovalRequired', event.target.value === 'yes')}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
=======
              <h2>{editingAsset ? "Edit Asset" : "Create New Asset"}</h2>
              <button
                className="close-btn"
                onClick={() => setShowAssetModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Asset Name *</label>
                <input
                  type="text"
                  value={assetForm.name}
                  onChange={(e) => handleAssetChange("name", e.target.value)}
                  placeholder="e.g., Clubhouse, Community Hall"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity (persons) *</label>
                  <input
                    type="number"
                    value={assetForm.capacity}
                    onChange={(e) =>
                      handleAssetChange("capacity", e.target.value)
                    }
                    placeholder="e.g., 50"
                  />
                </div>
                <div className="form-group">
                  <label>Charges (₹/hour)</label>
                  <input
                    type="number"
                    value={assetForm.charges}
                    onChange={(e) =>
                      handleAssetChange("charges", e.target.value)
                    }
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Booking Rules</label>
                <input
                  type="text"
                  value={assetForm.bookingRules}
                  onChange={(e) =>
                    handleAssetChange("bookingRules", e.target.value)
                  }
                  placeholder="e.g., Max 3 hours per day, Only on weekends"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={assetForm.description}
                  onChange={(e) =>
                    handleAssetChange("description", e.target.value)
                  }
                  placeholder="Describe the asset..."
                  rows={3}
                />
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
              </div>
            </div>

            <div className="modal-footer">
<<<<<<< HEAD
              <button type="button" className="btn-ghost" onClick={() => setShowAssetModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={upsertAsset} disabled={isSavingAsset}>
                {isSavingAsset ? <Loader2 size={15} className="spin" /> : null}
                {editingAssetId ? 'Update Asset' : 'Create Asset'}
=======
              <button className="btn" onClick={() => setShowAssetModal(false)}>
                Cancel
              </button>
              <button className="btn" onClick={handleSaveAsset}>
                {editingAsset ? "Update Asset" : "Create Asset"}
>>>>>>> 6eb47e31e63a89bdd20e5de1af2183e3c3c4e38f
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteAsset && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Asset</h2>
              <button type="button" className="close-btn" onClick={() => setPendingDeleteAsset(null)}>x</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{pendingDeleteAsset.name}</strong>? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-ghost" onClick={() => setPendingDeleteAsset(null)}>Cancel</button>
              <button type="button" className="btn-danger" onClick={deleteAsset}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {detailsAsset && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Asset Details</h2>
              <button type="button" className="close-btn" onClick={() => setDetailsAsset(null)}>x</button>
            </div>
            <div className="modal-body details-list">
              <p><strong>Name:</strong> {detailsAsset.name}</p>
              <p><strong>Category:</strong> {detailsAsset.category || '-'}</p>
              <p><strong>Capacity:</strong> {detailsAsset.capacity || 0}</p>
              <p><strong>Price per hour:</strong> {formatCurrency(detailsAsset.price_per_hour || 0)}</p>
              <p><strong>Max hours per booking:</strong> {detailsAsset.max_booking_hours || 0}</p>
              <p><strong>Max bookings per day:</strong> {detailsAsset.max_bookings_per_day || 0}</p>
              <p><strong>Advance booking days:</strong> {detailsAsset.advance_booking_days || 0}</p>
              <p><strong>Booking approval:</strong> {detailsAsset.approval_required ? 'Required' : 'Not required'}</p>
              <p><strong>Description:</strong> {detailsAsset.description || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {bookingsAsset && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>{bookingsAsset.name} Bookings</h2>
              <button type="button" className="close-btn" onClick={() => setBookingsAsset(null)}>x</button>
            </div>
            <div className="modal-body">
              <div className="requests-list">
                {bookings
                  .filter((booking) => String(booking.asset_id) === String(bookingsAsset.id))
                  .map((booking) => (
                    <article key={booking.id} className="request-card">
                      <div className="request-info">
                        <h4>{residentNameForBooking(booking)}</h4>
                        <p>{formatDate(booking.booking_date)}</p>
                        <p>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
                        <p>{booking.purpose || 'General booking'}</p>
                      </div>
                      <span className={`status-badge ${isPendingBooking(booking) ? 'status-pending' : 'status-approved'}`}>
                        {booking.booking_status || booking.status || 'pending'}
                      </span>
                    </article>
                  ))}

                {!bookings.some((booking) => String(booking.asset_id) === String(bookingsAsset.id)) && (
                  <div className="empty-state compact">
                    <AlertCircle size={30} />
                    <p>No bookings yet for this asset.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {residentModalData && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Resident Details</h2>
              <button type="button" className="close-btn" onClick={() => setResidentModalData(null)}>x</button>
            </div>
            <div className="modal-body details-list">
              <p><strong>Name:</strong> {residentModalData.name || '-'}</p>
              <p><strong>Email:</strong> {residentModalData.email || '-'}</p>
              <p><strong>Phone:</strong> {residentModalData.phone || '-'}</p>
              <p><strong>Flat:</strong> {residentModalData.flat_number || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminAssetBooking;
