import { db } from './config';
import {
    collection, addDoc, deleteDoc, doc, updateDoc, getDoc,
    query, where, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'bills';

/**
 * Generate a new bill for all residents
 * @param {object} data - { billMonth, billYear, totalAmount, dueDate, description }
 */
export const generateBill = (data) => {
    return addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

/**
 * Get all bills (Admin view)
 * Ordered newest first
 * @param {function} callback - called with array of bills
 */
export const subscribeToAllBills = (callback) => {
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
        console.error('[Firestore Error] subscribeToAllBills:', error);
        callback([]);
    });
};

/**
 * Get resident's bills with their payment status
 * @param {string} residentUid - Firebase UID of logged-in resident
 * @param {function} callback - called with array of bills
 */
export const subscribeToResidentBills = (residentUid, callback) => {
    // Get all bills from the collection
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((d) => {
            const data = d.data();
            const ts = data.createdAt;
            const displayDate = ts
                ? ts.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
            
            // Check if resident has paid this bill
            const residentPayment = data.payments?.find(p => p.residentUid === residentUid);
            
            return {
                id: d.id,
                ...data,
                displayDate,
                isPaid: residentPayment?.status === 'Paid',
                paidDate: residentPayment?.paidDate,
                paymentStatus: residentPayment?.status || 'Pending'
            };
        });
        callback(items);
    }, (error) => {
        console.error('[Firestore Error] subscribeToResidentBills:', error);
        callback([]);
    });
};

/**
 * Record a payment for a resident
 * @param {string} billId - Bill document ID
 * @param {string} residentUid - Firebase UID of resident
 * @param {object} paymentData - { amount, residentFlat, residentName }
 */
export const recordPayment = async (billId, residentUid, paymentData) => {
    try {
        if (!billId || !residentUid || !paymentData) {
            throw new Error('Missing required parameters for payment');
        }

        const billRef = doc(db, COLLECTION, billId);
        
        // Get current bill data
        const billDoc = await getDoc(billRef);
        if (!billDoc.exists()) {
            throw new Error('Bill not found in database');
        }

        const currentData = billDoc.data();
        
        // Initialize payments array if it doesn't exist
        const payments = currentData.payments || [];
        
        // Remove old payment from this resident if exists
        const filteredPayments = payments.filter(p => p.residentUid !== residentUid);
        
        // Add new payment
        const newPayment = {
            residentUid,
            status: 'Paid',
            paidDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            amount: paymentData.amount,
            residentFlat: paymentData.residentFlat,
            residentName: paymentData.residentName
        };
        
        filteredPayments.push(newPayment);
        
        // Update bill with new payments
        await updateDoc(billRef, {
            payments: filteredPayments,
            updatedAt: serverTimestamp()
        });

        console.log('[Payment Success] Payment recorded for bill:', billId, residentUid);
        return true;
    } catch (error) {
        console.error('[Payment Error] recordPayment failed:', error.message);
        throw error;
    }
};

/**
 * Delete a bill (admin only)
 * @param {string} billId - Bill document ID
 */
export const deleteBill = (billId) => {
    return deleteDoc(doc(db, COLLECTION, billId));
};

/**
 * Get billing statistics (admin)
 * @param {function} callback - called with stats object
 */
export const subscribeBillingStats = (callback) => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const bills = snapshot.docs.map(d => d.data());
        
        let totalBilled = 0;
        let totalCollected = 0;
        let totalPending = 0;
        let billCount = bills.length;
        
        bills.forEach(bill => {
            totalBilled += bill.totalAmount || 0;
            const payments = bill.payments || [];
            const collected = payments.reduce((sum, p) => sum + (p.status === 'Paid' ? p.amount : 0), 0);
            totalCollected += collected;
            totalPending += (bill.totalAmount || 0) - collected;
        });
        
        callback({
            totalBilled,
            totalCollected,
            totalPending,
            billCount,
            collectionPercentage: billCount > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0
        });
    }, (error) => {
        console.error('[Firestore Error] subscribeBillingStats:', error);
        callback({
            totalBilled: 0,
            totalCollected: 0,
            totalPending: 0,
            billCount: 0,
            collectionPercentage: 0
        });
    });
};
