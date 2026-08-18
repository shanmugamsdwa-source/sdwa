import { Timestamp } from 'firebase/firestore';

// ─── Association Settings ────────────────────────────────────────────────────

export interface WorkingHour {
  day: string;
  open: string;
  close: string;
  note?: string;
}

export interface Affiliation {
  organizationName: string;
  relationship: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
}

export interface AssociationSettings {
  name: string;
  shortName: string;
  registrationNumber: string;
  affiliation: Affiliation;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  faviconUrl: string;
  googleMapsEmbedUrl: string;
  description: string;
  mission: string;
  vision: string;
  socialLinks: SocialLinks;
  workingHours: WorkingHour[];
}

// ─── Association Objectives & Commitments ─────────────────────────────────────

export type ObjectiveCategory = 'core_objective' | 'sporting_objective' | 'commitment';

export interface AssociationObjective {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  category: ObjectiveCategory;
  displayOrder: number;
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export type AssociationObjectiveFormData = Omit<AssociationObjective, 'id' | 'createdAt' | 'updatedAt'>;

