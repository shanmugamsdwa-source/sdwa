import { Timestamp } from 'firebase/firestore';

// ─── Admin Users ────────────────────────────────────────────────────────────

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
