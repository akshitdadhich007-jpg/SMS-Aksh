import { deleteApp, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut as signOutAuth,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, firebaseConfig } from './config';

const USERS_COLLECTION = 'users';

/**
 * Generates a random temporary password.
 * @returns {string} e.g. "Soc#Ab12"
 */
const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const specials = '!@#$';
  let pass = specials[Math.floor(Math.random() * specials.length)];
  for (let i = 0; i < 7; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  // Shuffle
  return pass.split('').sort(() => Math.random() - 0.5).join('');
};

const createUserWithoutSwitchingSession = async (email, password) => {
  if (!auth?.currentUser) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const secondaryApp = initializeApp(firebaseConfig, `secondary-auth-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await signOutAuth(secondaryAuth);
    return credential;
  } finally {
    await deleteApp(secondaryApp);
  }
};

/**
 * Generate a credential: create Firebase Auth user + user doc in Firestore.
 *
 * @param {object} params
 * @param {string} params.societyId
 * @param {string} params.email
 * @param {string} params.role - "resident" | "security" | "staff" | "admin"
 * @param {string|null} params.flatNumber
 * @param {string} params.name
 * @param {string} [params.password] - if omitted, a temp password is generated
 * @returns {Promise<{ uid: string, email: string, tempPassword: string }>}
 */
export const generateCredential = async ({
  societyId,
  email,
  role,
  flatNumber = null,
  name,
  password,
}) => {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  if (!societyId || !email || !role || !name) {
    throw new Error('societyId, email, role, and name are required');
  }

  const tempPassword = password || generateTempPassword();
  const trimmedEmail = email.trim().toLowerCase();

  // Preserve the logged-in admin session while onboarding residents and staff.
  const credential = await createUserWithoutSwitchingSession(trimmedEmail, tempPassword);
  const uid = credential.user.uid;

  // Write user profile doc
  await setDoc(doc(db, USERS_COLLECTION, uid), {
    uid,
    email: trimmedEmail,
    name,
    role,
    societyId,
    flatNumber: flatNumber || null,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { uid, email: trimmedEmail, tempPassword };
};

/**
 * Generate credentials for multiple residents in batch.
 *
 * @param {string} societyId
 * @param {Array<{ email, name, flatNumber, role }>} members
 * @returns {Promise<Array<{ email, tempPassword, flatNumber, name, uid }>>}
 */
export const generateBulkCredentials = async (societyId, members) => {
  const results = [];
  for (const member of members) {
    const result = await generateCredential({
      societyId,
      email: member.email,
      name: member.name,
      role: member.role || 'resident',
      flatNumber: member.flatNumber || null,
      password: member.password,
    });
    results.push({
      ...result,
      flatNumber: member.flatNumber,
      name: member.name,
    });
  }
  return results;
};

/**
 * Get a user doc by email within a society.
 * @param {string} email
 * @param {string} societyId
 * @returns {Promise<object|null>}
 */
export const getCredentialByEmail = async (email, societyId) => {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('email', '==', email.trim().toLowerCase()),
    where('societyId', '==', societyId),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
};
