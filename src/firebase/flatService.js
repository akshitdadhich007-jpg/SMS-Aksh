import { db } from './config';
import {
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'flats';

/**
 * Create a single flat.
 * @param {string} societyId
 * @param {string} flatNumber
 * @returns {Promise<string>} flatId
 */
export const createFlat = async (societyId, flatNumber) => {
  const ref = await addDoc(collection(db, COLLECTION), {
    societyId,
    flatNumber: String(flatNumber),
    residentUid: null,
    residentName: null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

/**
 * Create multiple flats at once.
 * @param {string} societyId
 * @param {string[]} flatNumbers
 * @returns {Promise<string[]>} array of flatIds
 */
export const createBulkFlats = async (societyId, flatNumbers) => {
  const ids = [];
  for (const num of flatNumbers) {
    const id = await createFlat(societyId, num);
    ids.push(id);
  }
  return ids;
};

/**
 * Assign a resident to a flat.
 * @param {string} flatId
 * @param {string} residentUid
 * @param {string} residentName
 */
export const assignResidentToFlat = (flatId, residentUid, residentName) => {
  return updateDoc(doc(db, COLLECTION, flatId), {
    residentUid,
    residentName,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Subscribe to all flats in a society.
 * @param {string} societyId
 * @param {function} callback
 * @returns {function} unsubscribe
 */
export const subscribeToFlats = (societyId, callback) => {
  if (!societyId) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, COLLECTION), where('societyId', '==', societyId));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    items.sort((a, b) => String(a.flatNumber).localeCompare(String(b.flatNumber), undefined, { numeric: true }));
    callback(items);
  }, (err) => {
    console.error('[Firestore Error] subscribeToFlats:', err);
    callback([]);
  });
};

export const fetchFlatsOnce = async (societyId) => {
  if (!societyId) return [];
  const q = query(collection(db, COLLECTION), where('societyId', '==', societyId));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => String(a.flatNumber).localeCompare(String(b.flatNumber), undefined, { numeric: true }));
  return items;
};
