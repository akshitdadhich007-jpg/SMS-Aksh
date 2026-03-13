import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

/**
 * Each browser tab gets its own Firebase app instance keyed by a tab-scoped ID
 * stored in sessionStorage. This gives full tab isolation (different users in
 * different tabs) without the refresh-logout trade-off:
 *
 *  ✅ Tab 1 (Admin) stays logged in while Tab 2 (Resident) is open
 *  ✅ Refreshing any tab keeps the user logged in (sessionStorage survives refresh)
 *  ✅ New tab starts fresh — pick whichever account you want
 */
const getTabAppName = () => {
  try {
    let id = window.sessionStorage.getItem('_civiora_tab');
    if (!id) {
      id = `tab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      window.sessionStorage.setItem('_civiora_tab', id);
    }
    return id;
  } catch {
    return '[DEFAULT]';
  }
};

const TAB_APP_NAME = typeof window !== 'undefined' ? getTabAppName() : '[DEFAULT]';

let app = null;
let auth = null;
let db = null;

if (hasRequiredFirebaseConfig && hasValidApiKeyFormat) {
  try {
    // Reuse the same named app if already initialised (e.g. HMR in dev)
    const existing = getApps().find((a) => a.name === TAB_APP_NAME);
    app = existing ?? initializeApp(firebaseConfig, TAB_APP_NAME);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase config is missing or invalid. Add VITE_FIREBASE_* values in your .env file.');
}

export { auth, db, firebaseConfig };
export default app;
