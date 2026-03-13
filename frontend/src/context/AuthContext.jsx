import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getOrCreateUserProfile, updateUserProfile } from '../firebase/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getOrCreateUserProfile(firebaseUser);
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: profile.name || firebaseUser.displayName || firebaseUser.email,
            role: profile.role,
            flatNumber: profile.flatNumber || null,
            societyId: profile.societyId || null,
          });
        } catch (err) {
          console.error('Auth state profile error:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const profile = await getOrCreateUserProfile(credential.user);
      return {
        user: { id: credential.user.uid, email: credential.user.email, role: profile.role, name: profile.name },
        error: null,
      };
    } catch (err) {
      return { user: null, error: { message: err.message } };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const profile = await getOrCreateUserProfile(credential.user);
      return {
        user: { id: credential.user.uid, email: credential.user.email, role: profile.role, name: profile.name },
        error: null,
      };
    } catch (err) {
      return { user: null, error: { message: err.message } };
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user?.id) return;
    try {
      await updateUserProfile(user.id, updates);
      setUser(prev => ({ ...prev, ...updates }));
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
    // Return a fallback so pages don't crash outside AuthProvider
    return {
      user: (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })(),
      loading: false,
      signIn: async () => ({ user: null, error: { message: 'AuthProvider not mounted' } }),
      signInWithGoogle: async () => ({ error: { message: 'AuthProvider not mounted' } }),
      signOut: async () => { localStorage.removeItem('user'); },
      updateProfile: async () => {},
    };
  }
  return context;
}

export default AuthContext;
