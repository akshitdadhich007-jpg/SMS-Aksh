import api from "../services/api";

export const fetchTracebackData = async () => {
  try {
    const [itemsRes, matchesRes, claimsRes] = await Promise.all([
      api.get('/api/traceback/items'),
      api.get('/api/traceback/matches'),
      api.get('/api/traceback/claims')
    ]);

    const lostItems = (itemsRes.data?.lostItems || []).map(i => ({ ...i, type: 'lost' }));
    const foundItems = (itemsRes.data?.foundItems || []).map(i => ({ ...i, type: 'found' }));

    return {
      items: [...lostItems, ...foundItems],
      matches: matchesRes.data || [],
      claims: claimsRes.data || []
    };
  } catch (err) {
    console.error("Failed to fetch traceback data", err);
    throw err;
  }
};

export const submitClaimAPI = async (formData) => {
  const { data } = await api.post('/api/traceback/claim', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const approveClaimAPI = async (id) => {
  const { data } = await api.put(`/api/traceback/claim/${id}`, { status: 'approved' });
  return data;
};

export const rejectClaimAPI = async (id, reason) => {
  const { data } = await api.put(`/api/traceback/claim/${id}`, { status: 'rejected', rejectReason: reason });
  return data;
};

export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Polyfills for legacy components so they don't break immediately
export const getDB = () => ({ items: [], matches: [], claims: [] });
export const saveDB = () => { };
export const logAction = () => { };
export const checkExpiry = (db) => db;
