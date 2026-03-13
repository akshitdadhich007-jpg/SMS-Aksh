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
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'residents';

const withTimestampsForCreate = (data) => ({
  ...data,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const withTimestampsForUpdate = (data) => ({
  ...data,
  updatedAt: serverTimestamp(),
});

export const createResident = (data) => {
  if (!data?.societyId) {
    throw new Error('societyId is required to create a resident');
  }
  return addDoc(collection(db, COLLECTION), withTimestampsForCreate(data));
};

export const getResidentById = async (id) => {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const updateResident = (id, updates) => {
  return updateDoc(doc(db, COLLECTION, id), withTimestampsForUpdate(updates));
};

export const deleteResident = (id) => {
  return deleteDoc(doc(db, COLLECTION, id));
};

export const subscribeToResidents = (societyId, callback) => {
  const q = societyId
    ? query(collection(db, COLLECTION), where('societyId', '==', societyId))
    : query(collection(db, COLLECTION));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(items);
    },
    (error) => {
      console.error('[Firestore Error] subscribeToResidents:', error);
      callback([]);
    },
  );
};

export const fetchResidentsOnce = async (societyId) => {
  const q = societyId
    ? query(collection(db, COLLECTION), where('societyId', '==', societyId))
    : query(collection(db, COLLECTION));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

