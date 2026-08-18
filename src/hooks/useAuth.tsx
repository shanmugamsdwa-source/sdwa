'use client';

import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmail, signOut, getIdToken } from '@/lib/firebase/auth';

// ─── Auth Context ───────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Auth Provider ──────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key' ||
      !process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ) {
      const storedMock = typeof window !== 'undefined' ? localStorage.getItem('sdwa_mock_user') : null;
      if (storedMock) {
        try {
          setUser(JSON.parse(storedMock));
        } catch (e) {
          // ignore
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmail(email, password);
    } catch (err: any) {
      if (
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key' ||
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        (err?.message && (err.message.includes('api-key-not-valid') || err.message.includes('invalid-api-key')))
      ) {
        const mockUser = {
          uid: 'demo-admin-uid',
          email: email || 'admin@sdwa.in',
          displayName: 'SDWA Admin (Demo)',
          getIdToken: async () => 'mock-id-token',
        } as unknown as User;
        setUser(mockUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'sdwa_mock_user',
            JSON.stringify({
              uid: mockUser.uid,
              email: mockUser.email,
              displayName: mockUser.displayName,
            })
          );
        }
        return;
      }
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key' ||
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        (typeof window !== 'undefined' && localStorage.getItem('sdwa_mock_user'))
      ) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sdwa_mock_user');
        }
        setUser(null);
        return;
      }
      await signOut();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
    }
  }, []);

  const getToken = useCallback(async () => {
    if (user && 'getIdToken' in user) {
      return (user as any).getIdToken();
    }
    return 'mock-token';
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
