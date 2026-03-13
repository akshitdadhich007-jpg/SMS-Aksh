import { db } from './config';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'attendance';

const withTimestampsForCreate = (data) => ({
  ...data,
  inTime: serverTimestamp(),
  outTime: null,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const withTimestampsForUpdate = (data) => ({
  ...data,
  updatedAt: serverTimestamp(),
});

export const markStaffIn = (staffId, societyId, extra = {}) => {
  if (!staffId || !societyId) {
    throw new Error('staffId and societyId are required to mark attendance');
  }

  return addDoc(
    collection(db, COLLECTION),
    withTimestampsForCreate({
      staffId,
      societyId,
      status: 'present',
      ...extra,
    }),
  );
};

export const markStaffOut = (attendanceId) => {
  if (!attendanceId) {
    throw new Error('attendanceId is required to mark staff out');
  }

  return updateDoc(doc(db, COLLECTION, attendanceId), withTimestampsForUpdate({
    outTime: serverTimestamp(),
    status: 'completed',
  }));
};

export const updateAttendance = (attendanceId, updates) => {
  return updateDoc(doc(db, COLLECTION, attendanceId), withTimestampsForUpdate(updates));
};

export const deleteAttendance = (attendanceId) => {
  return deleteDoc(doc(db, COLLECTION, attendanceId));
};

export const getAttendanceById = async (attendanceId) => {
  const snap = await getDoc(doc(db, COLLECTION, attendanceId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

// Today subscription: filter by society and "today" range on createdAt
export const subscribeToTodayAttendance = (societyId, callback) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const baseQuery = [
    where('societyId', '==', societyId),
    where('createdAt', '>=', today),
    where('createdAt', '<', tomorrow),
    orderBy('createdAt', 'desc'),
  ];

  const q = query(collection(db, COLLECTION), ...baseQuery);

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(items);
    },
    (error) => {
      console.error('[Firestore Error] subscribeToTodayAttendance:', error);
      callback([]);
    },
  );
};

// Monthly history by staff
export const subscribeToMonthlyAttendance = (staffId, month, year, callback) => {
  if (!staffId || !month || !year) {
    console.warn('subscribeToMonthlyAttendance missing staffId/month/year');
  }

  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);

  const baseQuery = [
    where('staffId', '==', staffId),
    where('createdAt', '>=', start),
    where('createdAt', '<', end),
    orderBy('createdAt', 'desc'),
  ];

  const q = query(collection(db, COLLECTION), ...baseQuery);

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(items);
    },
    (error) => {
      console.error('[Firestore Error] subscribeToMonthlyAttendance:', error);
      callback([]);
    },
  );
};

export const fetchAttendanceOnce = async (societyId) => {
  const q = societyId
    ? query(collection(db, COLLECTION), where('societyId', '==', societyId))
    : query(collection(db, COLLECTION));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

