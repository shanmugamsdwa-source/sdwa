// ─── Weight Divisions ───────────────────────────────────────────────────────

export interface WeightDivision {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export type WeightDivisionFormData = Omit<WeightDivision, 'id'>;

// ─── Weight Classes ─────────────────────────────────────────────────────────

export interface WeightClass {
  id: string;
  divisionId: string;
  value: number | null;
  minimumWeight?: number;
  displayValue: string;
  displayOrder: number;
  isActive: boolean;
}

export type WeightClassFormData = Omit<WeightClass, 'id'>;

// ─── With resolved references ───────────────────────────────────────────────

export interface WeightClassWithDivision extends WeightClass {
  division?: WeightDivision;
}
