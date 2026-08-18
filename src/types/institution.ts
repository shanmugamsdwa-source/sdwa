import { Timestamp } from 'firebase/firestore';

// ─── Dynamic Centre Types ───────────────────────────────────────────────────

export type CentreType =
  | 'Weightlifting Academy'
  | 'Gym'
  | 'Fitness Centre'
  | 'Sports Academy'
  | 'Educational Institution'
  | 'Other'
  | string;

export const INITIAL_CENTRE_TYPES: string[] = [
  'Weightlifting Academy',
  'Gym',
  'Fitness Centre',
  'Sports Academy',
  'Educational Institution',
  'Other',
];

// Legacy backward-compatibility mapping
export type OrganizationType = 'GYM' | 'SPORTS_ACADEMY' | 'EDUCATIONAL_INSTITUTION' | 'OTHER';

export const ORGANIZATION_TYPE_LABELS: Record<string, string> = {
  GYM: 'Gym',
  SPORTS_ACADEMY: 'Sports Academy',
  EDUCATIONAL_INSTITUTION: 'Educational Institution',
  OTHER: 'Other',
  'Weightlifting Academy': 'Weightlifting Academy',
  Gym: 'Gym',
  'Fitness Centre': 'Fitness Centre',
  'Sports Academy': 'Sports Academy',
  'Educational Institution': 'Educational Institution',
  Other: 'Other',
};

// ─── Affiliated Centres Data Model ──────────────────────────────────────────

export interface AffiliatedCentre {
  id: string;
  name: string;
  slug: string;
  centreType: string;
  contactPerson?: string;
  phone?: string;
  secondaryPhone?: string;
  address?: string;
  googleMapsUrl?: string;
  imageUrl?: string;
  imagePublicId?: string;
  description?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;

  // Backward compatibility fields
  organizationType?: OrganizationType | string;
  coachName?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  email?: string;
  websiteUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
  isFeatured?: boolean;
  isActive?: boolean;
}

export type AffiliatedCentreFormData = Omit<
  AffiliatedCentre,
  'id' | 'createdAt' | 'updatedAt'
>;

// Backward compatibility aliases
export type AffiliatedInstitution = AffiliatedCentre;
export type AffiliatedInstitutionFormData = AffiliatedCentreFormData;
