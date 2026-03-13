import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Role assigned by email for the 3 known accounts
const EMAIL_ROLE_MAP = {
  'admin@accordliving.com': 'admin',
  'resident@accordliving.com': 'resident',
  'security@accordliving.com': 'security',
};

const EMAIL_NAME_MAP = {
  'admin@accordliving.com': 'Society Admin',
  'resident@accordliving.com': 'Demo Resident',
  'security@accordliving.com': 'Security Guard',
};

/**
 * Gets or creates a user profile document in Firestore.
 * Role is determined by email for the 3 known accounts.
 * For any other email, defaults to 'resident'.
 */
export async function getOrCreateUserProfile(firebaseUser) {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  // Create new profile
  const email = firebaseUser.email.toLowerCase();
  const role = EMAIL_ROLE_MAP[email] || 'resident';
  const name = EMAIL_NAME_MAP[email] || firebaseUser.displayName || email.split('@')[0];

  const profile = {
    uid: firebaseUser.uid,
    email,
    name,
    role,
    flatNumber: role === 'resident' ? '101' : null,
    societyId: 'accord-living-cf585',
    createdAt: serverTimestamp(),
  };

  await setDoc(ref, profile);
  return profile;
}

/**
 * Updates a user's profile in Firestore.
 */
export async function updateUserProfile(uid, updates) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
}
