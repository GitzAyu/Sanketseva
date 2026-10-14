import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

export interface UserProfile {
  email: string;
  role: string;
  displayName: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  operatorEmail: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is not available. Contact your system administrator.';
    case 'auth/network-request-failed':
      return 'Could not connect. Check your internet connection and try again.';
    default:
      return error instanceof Error ? error.message : 'Sign-in failed. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [operatorEmail, setOperatorEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, (firebaseUser) => {
    setOperatorEmail(firebaseUser?.email ?? null);
    setLoading(false);
  }, () => {
    setOperatorEmail(null);
    setLoading(false);
  }), []);

  const user: UserProfile | null = operatorEmail
    ? {
        email: operatorEmail,
        role: 'Safety Controller Tier 1',
        displayName: operatorEmail.split('@')[0],
      }
    : null;

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return true;
    } catch (authError) {
      setError(authErrorMessage(authError));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      return true;
    } catch (authError) {
      setError(authErrorMessage(authError));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (authError) {
      setError(authErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, operatorEmail, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
