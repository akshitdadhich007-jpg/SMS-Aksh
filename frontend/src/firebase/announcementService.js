import { db } from './config';
import {
    collection, addDoc, deleteDoc, doc,
    query, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'announcements';

/**
 * Post a new announcement or event to Firestore.
 * @param {object} data - { category, type, title, message, date?, time?, location? }
 */
export const postAnnouncement = (data) => {
    return addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
    });
};

/**
 * Delete an announcement by its Firestore document ID.
 */
export const deleteAnnouncement = (id) => {
    return deleteDoc(doc(db, COLLECTION, id));
};

/**
 * Subscribe to all announcements, ordered newest-first.
 * Returns the unsubscribe function — call it in useEffect cleanup.
 * @param {function} callback - called with the array of announcement objects
 */
export const subscribeToAnnouncements = (callback) => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((d) => {
            const data = d.data();
            const ts = data.createdAt;
            const displayDate = ts
                ? ts.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            return { id: d.id, ...data, displayDate };
        });
        callback(items);
    });
};
