// authUtils.js — removed Supabase dependency; TODO: wire to Firebase when configured

export const ROLE_PATHS = {
  admin: '/admin/dashboard',
  resident: '/resident/dashboard',
  security: '/security/dashboard',
};

export const normalizeRole = (role) => {
  const roleValue = String(role || '').toLowerCase().trim();
  if (roleValue === 'admin') return 'admin';
  if (roleValue === 'security' || roleValue === 'guard') return 'security';
  return 'resident';
};

export const getDashboardPathByRole = (role) => ROLE_PATHS[normalizeRole(role)] || ROLE_PATHS.resident;

export const getProfileByEmail = async (_email) => {
  // TODO: Firebase - query Firestore profiles collection by email
  return null;
};

export const isProfileApproved = (profile) => {
  if (!profile) return false;

  if (profile.is_approved === false || profile.approved === false) {
    return false;
  }

  const status = String(profile.status || profile.approval_status || '').toLowerCase();
  if (status.includes('pending') || status.includes('waiting') || status.includes('review')) {
    return false;
  }

  if (status.includes('rejected') || status.includes('blocked') || status.includes('inactive')) {
    return false;
  }

  return true;
};

export const getOrCreateProfile = async (_user) => {
  // TODO: Firebase - get or create Firestore profile document
  return null;
};
