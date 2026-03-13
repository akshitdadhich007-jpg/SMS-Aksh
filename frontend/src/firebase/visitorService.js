import { db } from './config';
import {
    collection, addDoc, updateDoc, deleteDoc, doc, getDoc,
    query, where, orderBy, onSnapshot, serverTimestamp,
    getDocs, Timestamp, limit
} from 'firebase/firestore';

const VISITORS_COLLECTION = 'visitors';
const PREAPPROVALS_COLLECTION = 'visitor_preapprovals';
const SETTINGS_COLLECTION = 'visitor_settings';
const BLACKLIST_COLLECTION = 'visitor_blacklist';

/**
 * ===== VISITOR CHECK-IN / CHECK-OUT =====
 */

/**
 * Check-in a new visitor
 * @param {object} visitorData - { visitorName, phone, purpose, flatNumber, vehicleNumber, visitorType, residentUid }
 */
export const checkInVisitor = (visitorData) => {
    return addDoc(collection(db, VISITORS_COLLECTION), {
        ...visitorData,
        status: 'waiting_approval',
        approved: false,
        entryTime: serverTimestamp(),
        exitTime: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

/**
 * Check-out a visitor
 * @param {string} visitorId - Visitor document ID
 */
export const checkOutVisitor = (visitorId) => {
    return updateDoc(doc(db, VISITORS_COLLECTION, visitorId), {
        status: 'exited',
        exitTime: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

/**
 * ===== VISITOR APPROVALS =====
 */

/**
 * Approve a visitor (resident action)
 * @param {string} visitorId - Visitor document ID
 */
export const approveVisitor = (visitorId) => {
    return updateDoc(doc(db, VISITORS_COLLECTION, visitorId), {
        approved: true,
        status: 'approved',
        updatedAt: serverTimestamp()
    });
};

/**
 * Reject a visitor (resident action)
 * @param {string} visitorId - Visitor document ID
 * @param {string} reason - Reason for rejection
 */
export const rejectVisitor = (visitorId, reason = '') => {
    return updateDoc(doc(db, VISITORS_COLLECTION, visitorId), {
        approved: false,
        status: 'rejected',
        rejectionReason: reason,
        updatedAt: serverTimestamp()
    });
};

/**
 * ===== PRE-APPROVALS (Schedule ahead) =====
 */

/**
 * Create a pre-approval for a visitor
 * @param {object} preApprovalData - { visitorName, phone, dateOfVisit, startTime, endTime, residentUid, residentFlat, purpose }
 */
export const createPreApproval = (preApprovalData) => {
    // Generate unique approval code: VPA + 6 random digits
    const approvalCode = 'VPA' + Math.floor(100000 + Math.random() * 900000);
    
    return addDoc(collection(db, PREAPPROVALS_COLLECTION), {
        ...preApprovalData,
        approvalCode,
        status: 'pending',
        entryTime: null,
        exitTime: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

/**
 * Get all pre-approvals for a resident
 * @param {string} residentUid - Firebase UID of resident
 * @param {function} callback - Real-time listener callback
 */
export const subscribeToResidentPreApprovals = (residentUid, callback) => {
    console.log('[visitorService] Subscribing to pre-approvals for resident:', residentUid);
    
    const q = query(
        collection(db, PREAPPROVALS_COLLECTION),
        where('residentUid', '==', residentUid),
        orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
        console.log('[visitorService] Snapshot received:', snapshot.docs.length, 'documents');
        
        const items = snapshot.docs.map(d => {
            const data = d.data();
            console.log('[visitorService] Document:', d.id, data);
            
            // Format dates for display
            const createdDate = data.createdAt?.toDate?.()?.toLocaleDateString?.('en-IN') || '-';
            const visitDate = data.dateOfVisit || '-';
            return { id: d.id, ...data, displayDate: createdDate, visitDate };
        });
        
        console.log('[visitorService] Calling callback with', items.length, 'items');
        callback(items);
    }, (error) => {
        console.error('[visitorService] Firestore Error in subscribeToResidentPreApprovals:', error);
        console.error('[visitorService] Error code:', error.code);
        console.error('[visitorService] Error message:', error.message);
        callback([]);
    });
};

/**
 * Get pre-approval by approval code (Security lookup)
 * @param {string} approvalCode - The VPA code
 * @param {function} callback
 */
export const getPreApprovalByCode = (approvalCode, callback) => {
    const q = query(
        collection(db, PREAPPROVALS_COLLECTION),
        where('approvalCode', '==', approvalCode)
    );
    return onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            callback(null);
        } else {
            const doc = snapshot.docs[0];
            const data = doc.data();
            callback({
                id: doc.id,
                ...data,
                entryTime: data.entryTime?.toDate?.()?.toISOString?.() || null,
                exitTime: data.exitTime?.toDate?.()?.toISOString?.() || null,
            });
        }
    }, (error) => {
        console.error('[Firestore Error] getPreApprovalByCode:', error);
        callback(null);
    });
};

/**
 * Security validates a pre-approval for gate entry
 * @param {string} preApprovalId - Pre-approval document ID
 * @param {string} officerName - Security officer name
 */
export const approvePreApprovalBySecurity = (preApprovalId, officerName = 'Security Officer') => {
    return updateDoc(doc(db, PREAPPROVALS_COLLECTION, preApprovalId), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: officerName,
        updatedAt: serverTimestamp()
    });
};

/**
 * Security rejects a pre-approval at gate
 * @param {string} preApprovalId - Pre-approval document ID
 * @param {string} reason - Reason for denial
 * @param {string} officerName - Security officer name
 */
export const rejectPreApprovalBySecurity = (preApprovalId, reason = 'Denied by security', officerName = 'Security Officer') => {
    return updateDoc(doc(db, PREAPPROVALS_COLLECTION, preApprovalId), {
        status: 'denied',
        deniedReason: reason,
        deniedAt: serverTimestamp(),
        deniedBy: officerName,
        updatedAt: serverTimestamp()
    });
};

/**
 * Mark entry for a pre-approved visitor
 * @param {string} preApprovalId - Pre-approval document ID
 */
export const markPreApprovalEntry = (preApprovalId) => {
    return updateDoc(doc(db, PREAPPROVALS_COLLECTION, preApprovalId), {
        status: 'checked_in',
        entryTime: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

/**
 * Mark exit for a pre-approved visitor
 * @param {string} preApprovalId - Pre-approval document ID
 */
export const markPreApprovalExit = (preApprovalId) => {
    return updateDoc(doc(db, PREAPPROVALS_COLLECTION, preApprovalId), {
        status: 'checked_out',
        exitTime: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

/**
 * ===== ADMIN: VISITOR RECORDS =====
 */

/**
 * Get all visitors for admin view with real-time updates
 * @param {function} callback
 */
export const subscribeToAllVisitors = (callback) => {
    const q = query(
        collection(db, VISITORS_COLLECTION),
        orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => {
            const data = d.data();
            const entryTime = data.entryTime?.toDate?.()?.toLocaleString?.('en-IN') || '-';
            const exitTime = data.exitTime?.toDate?.()?.toLocaleString?.('en-IN') || '-';
            const createdDate = data.createdAt?.toDate?.()?.toLocaleDateString?.('en-IN') || '-';
            return { id: d.id, ...data, entryTime, exitTime, createdDate };
        });
        callback(items);
    }, (error) => {
        console.error('[Firestore Error] subscribeToAllVisitors:', error);
        callback([]);
    });
};

/**
 * Get all pre-approvals for admin view
 * @param {function} callback
 */
export const subscribeToAllPreApprovals = (callback) => {
    const q = query(
        collection(db, PREAPPROVALS_COLLECTION),
        orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => {
            const data = d.data();
            const createdDate = data.createdAt?.toDate?.()?.toLocaleDateString?.('en-IN') || '-';
            return {
                id: d.id,
                ...data,
                displayDate: createdDate,
                entryTime: data.entryTime?.toDate?.()?.toISOString?.() || null,
                exitTime: data.exitTime?.toDate?.()?.toISOString?.() || null,
            };
        });
        callback(items);
    }, (error) => {
        console.error('[Firestore Error] subscribeToAllPreApprovals:', error);
        callback([]);
    });
};

/**
 * ===== ADMIN: BLACKLIST =====
 */

/**
 * Add phone number to blacklist
 * @param {object} blacklistData - { phone, reason, addedBy }
 */
export const addToBlacklist = (blacklistData) => {
    return addDoc(collection(db, BLACKLIST_COLLECTION), {
        ...blacklistData,
        createdAt: serverTimestamp(),
    });
};

/**
 * Check if a phone is blacklisted
 * @param {string} phone - Phone number to check
 * @param {function} callback
 */
export const checkBlacklist = (phone, callback) => {
    const q = query(
        collection(db, BLACKLIST_COLLECTION),
        where('phone', '==', phone)
    );
    return onSnapshot(q, (snapshot) => {
        callback(!snapshot.empty ? snapshot.docs[0].data() : null);
    }, (error) => {
        console.error('[Firestore Error] checkBlacklist:', error);
        callback(null);
    });
};

/**
 * ===== ANALYTICS =====
 */

/**
 * Get visitor statistics
 * @param {function} callback - Real-time stats callback
 */
export const subscribeToVisitorStats = (callback) => {
    const q = query(collection(db, VISITORS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
        const visitors = snapshot.docs.map(d => d.data());
        
        const stats = {
            totalVisitors: visitors.length,
            currentlyInside: visitors.filter(v => v.status === 'inside' || (v.status === 'approved' && !v.exitTime)).length,
            waitingApproval: visitors.filter(v => v.status === 'waiting_approval').length,
            approved: visitors.filter(v => v.approved).length,
            rejected: visitors.filter(v => v.status === 'rejected').length,
        };
        
        callback(stats);
    }, (error) => {
        console.error('[Firestore Error] subscribeToVisitorStats:', error);
        callback({
            totalVisitors: 0,
            currentlyInside: 0,
            waitingApproval: 0,
            approved: 0,
            rejected: 0,
        });
    });
};

/**
 * Get pre-approval statistics
 * @param {function} callback
 */
export const subscribeToPreApprovalStats = (callback) => {
    const q = query(collection(db, PREAPPROVALS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
        const preApprovals = snapshot.docs.map(d => d.data());
        
        const stats = {
            totalPreApprovals: preApprovals.length,
            pending: preApprovals.filter(p => p.status === 'pending').length,
            checkedIn: preApprovals.filter(p => p.status === 'checked_in').length,
            checkedOut: preApprovals.filter(p => p.status === 'checked_out').length,
        };
        
        callback(stats);
    }, (error) => {
        console.error('[Firestore Error] subscribeToPreApprovalStats:', error);
        callback({
            totalPreApprovals: 0,
            pending: 0,
            checkedIn: 0,
            checkedOut: 0,
        });
    });
};

/**
 * ===== SETTINGS =====
 */

/**
 * Get visitor system settings
 * @param {function} callback
 */
export const subscribeToVisitorSettings = (callback) => {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'default');
    return onSnapshot(settingsRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            // Return default settings if none exist
            callback({
                requireResidentApproval: true,
                enableQRPass: false,
                enablePhotoCapture: false,
                enableVehicleTracking: true,
                enableOTP: false,
                allowWalkIns: true,
                autoApproveDelivery: false,
                maxVisitorsPerFlat: 5,
                passExpiryHours: 24,
            });
        }
    }, (error) => {
        console.error('[Firestore Error] subscribeToVisitorSettings:', error);
        callback({
            requireResidentApproval: true,
            enableQRPass: false,
            enablePhotoCapture: false,
            enableVehicleTracking: true,
            enableOTP: false,
            allowWalkIns: true,
            autoApproveDelivery: false,
            maxVisitorsPerFlat: 5,
            passExpiryHours: 24,
        });
    });
};

/**
 * Update visitor system settings (admin only)
 * @param {object} updates - Settings to update
 */
export const updateVisitorSettings = (updates) => {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'default');
    return updateDoc(settingsRef, {
        ...updates,
        updatedAt: serverTimestamp()
    }).catch((error) => {
        // Create if doesn't exist
        if (error.code === 'not-found') {
            return new Promise((resolve) => {
                addDoc(collection(db, SETTINGS_COLLECTION), {
                    ...updates,
                    createdAt: serverTimestamp(),
                }).then(resolve);
            });
        }
        throw error;
    });
};

/**
 * Delete a visitor record (admin)
 * @param {string} visitorId
 */
export const deleteVisitor = (visitorId) => {
    return deleteDoc(doc(db, VISITORS_COLLECTION, visitorId));
};

/**
 * Delete a pre-approval (admin)
 * @param {string} preApprovalId
 */
export const deletePreApproval = (preApprovalId) => {
    return deleteDoc(doc(db, PREAPPROVALS_COLLECTION, preApprovalId));
};

/**
 * Resident cancels own pre-approval before visitor arrives
 * @param {string} preApprovalId
 */
export const cancelPreApproval = (preApprovalId) => {
    return updateDoc(doc(db, PREAPPROVALS_COLLECTION, preApprovalId), {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};
