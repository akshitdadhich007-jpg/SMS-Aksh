import { db } from './config';
import {
    collection, addDoc, deleteDoc, doc, updateDoc,
    query, where, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'complaints';

/**
 * Submit a new complaint
 * @param {object} data - { category, description, residentUid, residentName, residentFlat }
 */
export const submitComplaint = (data) => {
    return addDoc(collection(db, COLLECTION), {
        ...data,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

/**
 * Get all complaints (Admin view)
 * Ordered newest first
 * @param {function} callback - called with array of complaints
 */
export const subscribeToAllComplaints = (callback) => {
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
    }, (error) => {
        console.error('[Firestore Error] subscribeToAllComplaints:', error);
        callback([]);
    });
};

/**
 * Get resident's own complaints only
 * @param {string} residentUid - Firebase UID of logged-in resident
 * @param {function} callback - called with array of complaints
 */
export const subscribeToResidentComplaints = (residentUid, callback) => {
    const q = query(
        collection(db, COLLECTION),
        where('residentUid', '==', residentUid)
    );
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((d) => {
            const data = d.data();
            const ts = data.createdAt;
            const displayDate = ts
                ? ts.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            return { id: d.id, ...data, displayDate };
        });
        // Sort by createdAt in JavaScript to avoid composite index requirement
        items.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
            const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
            return bTime - aTime;
        });
        callback(items);
    }, (error) => {
        console.error('[Firestore Error] subscribeToResidentComplaints:', error);
        callback([]);
    });
};

/**
 * Update complaint status
 * @param {string} id - Complaint doc ID
 * @param {string} status - 'Pending', 'In Progress', 'Resolved'
 */
export const updateComplaintStatus = (id, status) => {
    return updateDoc(doc(db, COLLECTION, id), {
        status,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Delete a complaint (admin only)
 */
export const deleteComplaint = (id) => {
    return deleteDoc(doc(db, COLLECTION, id));
};
