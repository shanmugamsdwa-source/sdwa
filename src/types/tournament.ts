import { Timestamp } from 'firebase/firestore';

// ─── Registration ───────────────────────────────────────────────────────────

export type RegistrationMode = 'EXTERNAL_FORM';
export type RegistrationStatus = 'OPEN' | 'CLOSED';

// ─── Tournament Categories ──────────────────────────────────────────────────

export interface TournamentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export type TournamentCategoryFormData = Omit<TournamentCategory, 'id'>;

// ─── Tournaments ────────────────────────────────────────────────────────────

export interface Tournament {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  venue: string;
  levelId: string;
  categoryIds: string[];
  divisionIds: string[];
  weightClassIds: string[];
  posterUrl: string;
  posterPublicId: string;
  registrationMode: RegistrationMode;
  registrationUrl: string;
  registrationStatus: RegistrationStatus;
  registrationDeadline: Timestamp;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type TournamentFormData = Omit<Tournament, 'id' | 'createdAt' | 'updatedAt'>;

// ─── Registration State (computed on frontend) ──────────────────────────────

export type ComputedRegistrationState =
  | 'CLOSED'
  | 'DEADLINE_PASSED'
  | 'APPLY_NOW'
  | 'NOT_AVAILABLE';

export function computeRegistrationState(tournament: Tournament): ComputedRegistrationState {
  if (tournament.registrationStatus === 'CLOSED') {
    return 'CLOSED';
  }

  const now = new Date();
  let deadline: Date | null = null;

  const rawDeadline: any = tournament.registrationDeadline;
  if (rawDeadline) {
    if (typeof rawDeadline.toDate === 'function') {
      deadline = rawDeadline.toDate();
    } else if (rawDeadline instanceof Date) {
      deadline = rawDeadline;
    } else if (typeof rawDeadline === 'object' && typeof rawDeadline._seconds === 'number') {
      deadline = new Date(rawDeadline._seconds * 1000);
    } else if (typeof rawDeadline === 'object' && typeof rawDeadline.seconds === 'number') {
      deadline = new Date(rawDeadline.seconds * 1000);
    } else if (typeof rawDeadline === 'string' || typeof rawDeadline === 'number') {
      const d = new Date(rawDeadline);
      if (!isNaN(d.getTime())) deadline = d;
    }
  }

  if (deadline && now > deadline) {
    return 'DEADLINE_PASSED';
  }

  if (tournament.registrationMode === 'EXTERNAL_FORM' && tournament.registrationUrl) {
    return 'APPLY_NOW';
  }

  return 'NOT_AVAILABLE';
}
