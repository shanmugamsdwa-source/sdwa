import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  NextOrObserver,
} from 'firebase/auth';
import { auth } from './config';

// ─── Authentication Helpers ─────────────────────────────────────────────────

/**
 * Sign in with email and password.
 * Used by the admin login page.
 */
export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  return firebaseSignOut(auth);
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChanged(callback: NextOrObserver<User>) {
  return firebaseOnAuthStateChanged(auth, callback);
}

/**
 * Get the current user synchronously (may be null before auth initializes).
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Get the current user's ID token for API requests.
 * Throws if no user is signed in.
 */
export async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user');
  }
  return user.getIdToken();
}
