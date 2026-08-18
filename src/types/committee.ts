import { Timestamp } from 'firebase/firestore';

// ─── Committee Members ──────────────────────────────────────────────────────

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  position?: string;
  photoUrl: string;
  photoPublicId?: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  isPublished?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export type CommitteeMemberFormData = Omit<CommitteeMember, 'id' | 'createdAt' | 'updatedAt'>;
