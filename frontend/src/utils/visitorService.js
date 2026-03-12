// visitorService.js — localStorage-only implementation
// TODO: Firebase - replace all localStorage operations with Firestore CRUD + Realtime listeners

export const VISITOR_STATUS = {
  INSIDE: 'inside',
  EXITED: 'exited',
  WAITING: 'waiting_approval',
  CANCELLED: 'cancelled',
};

const DEFAULT_SETTINGS = {
  society_name: 'CIVIORA',
  require_resident_approval: true,
  enable_qr_pass: true,
  enable_photo_capture: true,
  enable_vehicle_tracking: true,
  enable_otp_verification: false,
  allow_walkin_visitors: true,
  auto_approve_delivery: true,
  max_visitors_per_flat: 5,
  visitor_pass_expiry_hours: 12,
};

const safeLower = (value) => String(value || '').trim().toLowerCase();

export const getCurrentUser = () => {
  try {
    const roleUser =
      localStorage.getItem('user_admin') ||
      localStorage.getItem('user_security') ||
      localStorage.getItem('user_resident') ||
      localStorage.getItem('user');
    return roleUser ? JSON.parse(roleUser) : {};
  } catch {
    return {};
  }
};

export const getCurrentRole = () => {
  const user = getCurrentUser();
  return safeLower(user.role) || 'resident';
};

export const getResidentFlat = () => {
  const user = getCurrentUser();
  return (
    user.flat_number ||
    user.flatNumber ||
    user.flat ||
    user.apartment ||
    user.unit ||
    ''
  );
};

const LS_VISITORS = 'civiora_visitors';
const LS_SETTINGS = 'civiora_visitor_settings';
const LS_BLACKLIST = 'civiora_visitor_blacklist';

const lsGetVisitors = () => { try { return JSON.parse(localStorage.getItem(LS_VISITORS)) || []; } catch { return []; } };
const lsSetVisitors = (v) => localStorage.setItem(LS_VISITORS, JSON.stringify(v));

const lsGetBlacklist = () => { try { return JSON.parse(localStorage.getItem(LS_BLACKLIST)) || []; } catch { return []; } };
const lsSetBlacklist = (b) => localStorage.setItem(LS_BLACKLIST, JSON.stringify(b));

const ensureSettingsRow = async () => {
  // TODO: Firebase - fetch from Firestore visitor_settings collection
  try {
    const stored = localStorage.getItem(LS_SETTINGS);
    if (stored) return { id: 'local', ...JSON.parse(stored) };
  } catch { /* ignore */ }
  localStorage.setItem(LS_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  return { id: 'local', ...DEFAULT_SETTINGS };
};

export const getVisitorSettings = async () => ensureSettingsRow();

export const updateVisitorSettings = async (updates) => {
  // TODO: Firebase - update Firestore visitor_settings document
  const current = await ensureSettingsRow();
  const merged = { ...current, ...updates };
  localStorage.setItem(LS_SETTINGS, JSON.stringify(merged));
  return { ...merged, id: 'local' };
};

const addVisitorLog = async ({ visitorId, action, role, actorId }) => {
  // TODO: Firebase - insert into Firestore visitor_logs collection
  console.log(`[VisitorLog] visitor=${visitorId} action=${action} role=${role} actor=${actorId}`);
};

export const getBlacklistByPhone = async (phone) => {
  // TODO: Firebase - query Firestore visitor_blacklist by phone_number
  const list = lsGetBlacklist();
  return list.find(b => b.phone_number === String(phone || '').trim()) || null;
};

export const addToBlacklist = async (payload) => {
  // TODO: Firebase - upsert Firestore visitor_blacklist document
  const list = lsGetBlacklist().filter(b => b.phone_number !== payload.phone_number);
  const record = { id: `bl-${Date.now()}`, ...payload };
  lsSetBlacklist([record, ...list]);
  return record;
};

export const createVisitorCheckIn = async (formData) => {
  // TODO: Firebase - write to Firestore visitors collection
  const settings = await ensureSettingsRow();
  const user = getCurrentUser();

  const phone = String(formData.phone_number || '').trim();
  const blacklisted = await getBlacklistByPhone(phone);
  if (blacklisted) {
    throw new Error('This visitor is blacklisted and cannot be checked in.');
  }

  const visitors = lsGetVisitors();
  const flatActive = visitors.filter(
    v => v.flat_number === formData.flat_number &&
    [VISITOR_STATUS.INSIDE, VISITOR_STATUS.WAITING].includes(v.status)
  ).length;
  if (flatActive >= Number(settings.max_visitors_per_flat || 5)) {
    throw new Error('Max visitor limit reached for this flat.');
  }

  const isDelivery = safeLower(formData.visitor_type) === 'delivery';
  const autoApproved = Boolean(settings.auto_approve_delivery && isDelivery);
  const requiresApproval = Boolean(settings.require_resident_approval) && !autoApproved;

  const row = {
    id: `v-${Date.now()}`,
    visitor_name: formData.visitor_name,
    phone_number: phone,
    purpose: formData.purpose,
    flat_number: formData.flat_number,
    vehicle_number: formData.vehicle_number || '',
    visitor_photo: formData.visitor_photo || '',
    visitor_type: formData.visitor_type || 'Guest',
    entry_time: new Date().toISOString(),
    created_at: new Date().toISOString(),
    status: requiresApproval ? VISITOR_STATUS.WAITING : VISITOR_STATUS.INSIDE,
    approved: !requiresApproval,
    approval_method: autoApproved ? 'auto' : (requiresApproval ? 'resident' : 'admin'),
    approved_by: autoApproved ? 'system_auto_delivery' : (!requiresApproval ? 'security' : ''),
    created_by_security: user.id || null,
  };

  lsSetVisitors([row, ...visitors]);
  await addVisitorLog({ visitorId: row.id, action: 'created', role: 'security', actorId: user.id || null });

  return { visitor: row, settings };
};

export const markVisitorExit = async (visitorId) => {
  // TODO: Firebase - update Firestore visitor document
  const user = getCurrentUser();
  const visitors = lsGetVisitors();
  const updated = visitors.map(v =>
    v.id === visitorId ? { ...v, status: VISITOR_STATUS.EXITED, exit_time: new Date().toISOString() } : v
  );
  lsSetVisitors(updated);
  await addVisitorLog({ visitorId, action: 'exited', role: 'security', actorId: user.id || null });
  return updated.find(v => v.id === visitorId);
};

export const approveVisitor = async (visitorId) => {
  // TODO: Firebase - update Firestore visitor document
  const user = getCurrentUser();
  const role = getCurrentRole();
  const by = role === 'admin' ? 'admin' : 'resident';

  const visitors = lsGetVisitors();
  const updated = visitors.map(v =>
    v.id === visitorId
      ? { ...v, approved: true, status: VISITOR_STATUS.INSIDE, approval_method: by, approved_by: user.name || by }
      : v
  );
  lsSetVisitors(updated);
  await addVisitorLog({ visitorId, action: 'approved', role: by, actorId: user.id || null });
  return updated.find(v => v.id === visitorId);
};

export const rejectVisitor = async (visitorId) => {
  // TODO: Firebase - update Firestore visitor document
  const user = getCurrentUser();
  const role = getCurrentRole();
  const by = role === 'admin' ? 'admin' : 'resident';

  const visitors = lsGetVisitors();
  const updated = visitors.map(v =>
    v.id === visitorId
      ? { ...v, approved: false, status: VISITOR_STATUS.CANCELLED, approval_method: by, approved_by: user.name || by }
      : v
  );
  lsSetVisitors(updated);
  await addVisitorLog({ visitorId, action: 'rejected', role: by, actorId: user.id || null });
  return updated.find(v => v.id === visitorId);
};

export const listVisitors = async () => {
  // TODO: Firebase - query Firestore visitors collection ordered by created_at desc
  return lsGetVisitors().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const listVisitorsForFlat = async (flatNumber) => {
  // TODO: Firebase - query Firestore visitors where flat_number == flatNumber
  return lsGetVisitors().filter(v => v.flat_number === flatNumber);
};

export const listPendingApprovalsForFlat = async (flatNumber) => {
  // TODO: Firebase - query Firestore visitors where flat_number == flatNumber && status == WAITING
  return lsGetVisitors().filter(v => v.flat_number === flatNumber && v.status === VISITOR_STATUS.WAITING);
};

export const computeVisitorAnalytics = (rows, range = '7') => {
  const now = new Date();
  const days = Number(range);
  const filtered = range === 'all'
    ? rows
    : rows.filter((row) => new Date(row.created_at) >= new Date(now.getTime() - days * 24 * 60 * 60 * 1000));

  const total = filtered.length;
  const approvals = filtered.filter((r) => r.approved).length;
  const entriesCompleted = filtered.filter((r) => r.status === VISITOR_STATUS.EXITED).length;
  const currentlyInside = filtered.filter((r) => r.status === VISITOR_STATUS.INSIDE || r.status === VISITOR_STATUS.WAITING).length;
  const uniqueVisitors = new Set(filtered.map((r) => `${safeLower(r.visitor_name)}-${String(r.phone_number || '')}`)).size;

  const totalStayMins = filtered
    .filter((r) => r.entry_time && r.exit_time)
    .reduce((sum, r) => sum + ((new Date(r.exit_time) - new Date(r.entry_time)) / 60000), 0);
  const stayCount = filtered.filter((r) => r.entry_time && r.exit_time).length;
  const avgStayMinutes = stayCount ? Math.round(totalStayMins / stayCount) : 0;

  const perDayMap = {};
  const perFlatMap = {};
  const perHourMap = {};
  const purposeMap = {};

  filtered.forEach((r) => {
    const d = new Date(r.created_at);
    const day = d.toISOString().split('T')[0];
    const hour = String(d.getHours()).padStart(2, '0');

    perDayMap[day] = (perDayMap[day] || 0) + 1;
    perFlatMap[r.flat_number] = (perFlatMap[r.flat_number] || 0) + 1;
    perHourMap[hour] = (perHourMap[hour] || 0) + 1;
    purposeMap[r.purpose] = (purposeMap[r.purpose] || 0) + 1;
  });

  const peakVisitDay = Object.entries(perDayMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  return {
    totalVisitors: total,
    totalApprovals: approvals,
    entriesCompleted,
    visitorsCurrentlyInside: currentlyInside,
    conversionRate: total ? Math.round((entriesCompleted / total) * 100) : 0,
    averageStayMinutes: avgStayMinutes,
    peakVisitDay,
    uniqueVisitors,
    visitorsPerDay: Object.entries(perDayMap).map(([date, count]) => ({ date, count })),
    visitorsPerFlat: Object.entries(perFlatMap).map(([flat, count]) => ({ flat, count })),
    peakVisitingHours: Object.entries(perHourMap).map(([hour, count]) => ({ hour: `${hour}:00`, count })),
    purposeBreakdown: Object.entries(purposeMap).map(([purpose, count]) => ({ purpose, count })),
  };
};

export const toCsv = (rows) => {
  const headers = [
    'Visitor Name', 'Phone Number', 'Flat Number', 'Purpose', 'Visitor Type',
    'Vehicle Number', 'Entry Time', 'Exit Time', 'Status', 'Approval Method', 'Approved'
  ];

  const body = rows.map((r) => [
    r.visitor_name,
    r.phone_number,
    r.flat_number,
    r.purpose,
    r.visitor_type,
    r.vehicle_number || '',
    r.entry_time || '',
    r.exit_time || '',
    r.status,
    r.approval_method,
    r.approved ? 'Yes' : 'No',
  ]);

  return [headers, ...body]
    .map((row) => row.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
};

export const downloadTextFile = (fileName, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const subscribeVisitorRealtime = (onChange) => {
  // TODO: Firebase - subscribe to Firestore visitors/settings/logs with onSnapshot
  const handler = () => onChange({ eventType: 'localStorage' });
  window.addEventListener('civiora-visitors-updated', handler);
  return () => window.removeEventListener('civiora-visitors-updated', handler);
};
