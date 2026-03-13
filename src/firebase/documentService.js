import { db } from './config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

const COLLECTION = 'documents';

export const subscribeToResidentDocuments = (societyId, callback) => {
  if (!societyId) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, COLLECTION), where('societyId', '==', societyId));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => {
      const data = d.data();
      const createdDate = data.createdAt?.toDate?.()?.toLocaleDateString?.('en-IN') || '';
      return {
        id: d.id,
        title: data.title || 'Untitled document',
        type: data.type || 'FILE',
        size: data.size || '-',
        date: data.date || createdDate || '-',
        fileUrl: data.fileUrl || '',
      };
    });

    items.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    callback(items);
  }, (error) => {
    console.error('[Firestore Error] subscribeToResidentDocuments:', error);
    callback([]);
  });
};
