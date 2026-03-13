import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAX_tIN2p2_C3SF794dzSNRnMANnytlpAg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'accord-living-cf585.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'accord-living-cf585',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'accord-living-cf585.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '581517247679',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:581517247679:web:c2a8852d62ef0176db720a',
};

const hasRequiredFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
].every(Boolean);

const hasValidApiKeyFormat = typeof firebaseConfig.apiKey === 'string'
  && firebaseConfig.apiKey.startsWith('AIza');

let app = null;
let auth = null;
let db = null;

if (hasRequiredFirebaseConfig && hasValidApiKeyFormat) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // browserSessionPersistence stores auth state in sessionStorage, which is:
    //   ✅ Tab-scoped  → each tab keeps its own logged-in user independently
    //   ✅ Survives refresh → sessionStorage is cleared only when the TAB/window
    //      is closed, NOT on page reload
    //   ✅ New tab starts fresh → no shared auth confusion between admin/resident/security
    //   ✅ Single Firebase app instance → no Firestore internal assertion errors
    setPersistence(auth, browserSessionPersistence).catch(console.error);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase config is missing or invalid. Add VITE_FIREBASE_* values in your .env file.');
}

export { auth, db, firebaseConfig };
export default app;
