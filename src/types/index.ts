// ─── Association ────────────────────────────────────────────────────────────
export type {
  AssociationSettings,
  WorkingHour,
  Affiliation,
  SocialLinks,
  ObjectiveCategory,
  AssociationObjective,
  AssociationObjectiveFormData,
} from './association';

// ─── Committee ──────────────────────────────────────────────────────────────
export type {
  CommitteeMember,
  CommitteeMemberFormData,
} from './committee';

// ─── Achievements ───────────────────────────────────────────────────────────
export type {
  CloudinaryImage,
  AchievementCategory,
  AchievementCategoryFormData,
  AchievementLevel,
  AchievementLevelFormData,
  Achievement,
  AchievementFormData,
  AchievementWithRefs,
} from './achievement';

// ─── Tournaments ────────────────────────────────────────────────────────────
export type {
  RegistrationMode,
  RegistrationStatus,
  TournamentCategory,
  TournamentCategoryFormData,
  Tournament,
  TournamentFormData,
  ComputedRegistrationState,
} from './tournament';
export { computeRegistrationState } from './tournament';

// ─── Weights ────────────────────────────────────────────────────────────────
export type {
  WeightDivision,
  WeightDivisionFormData,
  WeightClass,
  WeightClassFormData,
  WeightClassWithDivision,
} from './weight';

// ─── Affiliated Centres ─────────────────────────────────────────────────────
export type {
  CentreType,
  AffiliatedCentre,
  AffiliatedCentreFormData,
  OrganizationType,
  AffiliatedInstitution,
  AffiliatedInstitutionFormData,
} from './institution';
export { INITIAL_CENTRE_TYPES, ORGANIZATION_TYPE_LABELS } from './institution';

// ─── Gallery ────────────────────────────────────────────────────────────────
export type {
  GalleryAlbum,
  GalleryAlbumFormData,
  GalleryImage,
  GalleryImageFormData,
} from './gallery';

// ─── Admin ──────────────────────────────────────────────────────────────────
export type {
  AdminRole,
  AdminUser,
} from './admin';

// ─── Firestore Collection Names ─────────────────────────────────────────────

export const COLLECTIONS = {
  SETTINGS: 'settings',
  SETTINGS_ASSOCIATION: 'association',
  SETTINGS_CENTRE_TYPES: 'centre_types',
  COMMITTEE_MEMBERS: 'committeeMembers',
  ACHIEVEMENT_CATEGORIES: 'achievementCategories',
  ACHIEVEMENT_LEVELS: 'achievementLevels',
  ACHIEVEMENTS: 'achievements',
  TOURNAMENT_CATEGORIES: 'tournamentCategories',
  TOURNAMENTS: 'tournaments',
  WEIGHT_DIVISIONS: 'weightDivisions',
  WEIGHT_CLASSES: 'weightClasses',
  AFFILIATED_CENTRES: 'affiliatedInstitutions',
  AFFILIATED_INSTITUTIONS: 'affiliatedInstitutions',
  GALLERY_ALBUMS: 'galleryAlbums',
  GALLERY_IMAGES: 'galleryImages',
  ADMIN_USERS: 'adminUsers',
  ASSOCIATION_OBJECTIVES: 'associationObjectives',
} as const;

