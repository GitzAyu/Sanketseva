import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
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
  isProcessing: boolean;
  error: string | null;
  requiresVerification: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string) => Promise<boolean>;
  resendVerification: (email: string, pass: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
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
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a while and try again.';
    case 'auth/unauthorized-continue-uri':
    case 'auth/invalid-continue-uri':
      return 'The verification link domain is not authorized. Add your website domain in Firebase Authentication settings.';
    default:
      return error instanceof Error ? error.message : 'Sign-in failed. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [operatorEmail, setOperatorEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const authFlowInProgress = React.useRef(false);

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    if (authFlowInProgress.current) return;
    try {
      if (firebaseUser) {
        await reload(firebaseUser);
        if (!firebaseUser.emailVerified) {
          setRequiresVerification(true);
          await signOut(auth);
          setOperatorEmail(null);
        } else {
          setRequiresVerification(false);
          setOperatorEmail(firebaseUser.email ?? null);
        }
      } else {
        setOperatorEmail(null);
      }
    } catch {
      setOperatorEmail(null);
    } finally {
      setLoading(false);
    }
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
    setRequiresVerification(false);
    setIsProcessing(true);
    authFlowInProgress.current = true;
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await reload(credential.user);
      if (!credential.user.emailVerified) {
        setRequiresVerification(true);
        setError('email-not-verified');
        await signOut(auth);
        setOperatorEmail(null);
        return false;
      }
      setOperatorEmail(credential.user.email ?? null);
      return true;
    } catch (authError) {
      setError(authErrorMessage(authError));
      return false;
    } finally {
      authFlowInProgress.current = false;
      setIsProcessing(false);
    }
  }, []);

  const register = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setRequiresVerification(false);
    setIsProcessing(true);
    authFlowInProgress.current = true;
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      await sendEmailVerification(credential.user);
      await signOut(auth);
      setOperatorEmail(null);
      return true;
    } catch (authError) {
      setError(authErrorMessage(authError));
      return false;
    } finally {
      if (auth.currentUser) await signOut(auth).catch(() => undefined);
      setOperatorEmail(null);
      authFlowInProgress.current = false;
      setIsProcessing(false);
    }
  }, []);

  const resendVerification = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setError(null);
    setIsProcessing(true);
    authFlowInProgress.current = true;
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await reload(credential.user);
      if (credential.user.emailVerified) {
        setError('This email is already verified. Sign in to continue.');
        return false;
      }
      await sendEmailVerification(credential.user);
      setRequiresVerification(true);
      return true;
    } catch (authError) {
      setError(authErrorMessage(authError));
      return false;
    } finally {
      if (auth.currentUser) await signOut(auth).catch(() => undefined);
      setOperatorEmail(null);
      authFlowInProgress.current = false;
      setIsProcessing(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setError(null);
    setIsProcessing(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (resetError) {
      setError(authErrorMessage(resetError));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsProcessing(true);
    try {
      await signOut(auth);
    } catch (authError) {
      setError(authErrorMessage(authError));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, operatorEmail, loading, isProcessing, error, requiresVerification, login, register, resendVerification, resetPassword, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
