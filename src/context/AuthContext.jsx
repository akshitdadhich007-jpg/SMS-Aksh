import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { getOrCreateUserProfile, updateUserProfile } from '../firebase/userService';
import { normalizeRole } from '../utils/authUtils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileUnsubRef = useRef(null);

  // Listen to Firebase Auth state changes, then subscribe to Firestore profile in real-time
  useEffect(() => {
    if (!auth || !db) {
      setUser(null);
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up any previous profile listener
      if (profileUnsubRef.current) {
        profileUnsubRef.current();
        profileUnsubRef.current = null;
      }

      if (firebaseUser) {
        try {
          // Ensure the profile doc exists (creates it if first login)
          await getOrCreateUserProfile(firebaseUser);

          // Now subscribe in real-time so societyId updates propagate instantly
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          profileUnsubRef.current = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const profile = snap.data();
              const societyId = profile.societyId && profile.societyId !== '__pending__'
                ? profile.societyId
                : null;
              console.log('[AuthContext] Profile updated, societyId:', societyId);
              setUser({
                id: firebaseUser.uid,
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: profile.name || firebaseUser.displayName || firebaseUser.email,
                role: normalizeRole(profile.role),
                flatNumber: profile.flatNumber || null,
                societyId,
              });
            } else {
              setUser(null);
            }
            setLoading(false);
          }, (err) => {
            console.error('[AuthContext] Profile listener error:', err);
            setUser(null);
            setLoading(false);
          });
        } catch (err) {
          console.error('[AuthContext] Auth state profile error:', err);
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubRef.current) {
        profileUnsubRef.current();
        profileUnsubRef.current = null;
      }
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!auth) {
      return { user: null, error: { message: 'Firebase is not configured. Add VITE_FIREBASE_* values to .env.' } };
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const profile = await getOrCreateUserProfile(credential.user);
      return {
        user: { id: credential.user.uid, email: credential.user.email, role: normalizeRole(profile.role), name: profile.name },
        error: null,
      };
    } catch (err) {
      const raw = err.message || '';
      const isInternal = raw.includes('INTERNAL ASSERTION') || raw.includes('FIRESTORE') || raw.includes('FirebaseError: [Default]');
      return { user: null, error: { message: isInternal ? 'Authentication service error. Please refresh and try again.' : raw } };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      return { user: null, error: { message: 'Firebase is not configured. Add VITE_FIREBASE_* values to .env.' } };
    }

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const profile = await getOrCreateUserProfile(credential.user);
      return {
        user: { id: credential.user.uid, email: credential.user.email, role: normalizeRole(profile.role), name: profile.name },
        error: null,
      };
    } catch (err) {
      return { user: null, error: { message: err.message } };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) {
      setUser(null);
      return;
    }

    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user?.id) return;
    try {
      await updateUserProfile(user.id, updates);
      // No need to setUser here — the onSnapshot listener will pick up the change automatically
    } catch (err) {
      console.error('updateProfile error:', err);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>. Check that AuthProvider wraps your component tree in App.jsx.');
  }
  return context;
}

export default AuthContext;
