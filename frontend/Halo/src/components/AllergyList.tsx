export interface Allergy {
  id: number;
  allergen: string;
  severity: string;
}

export const AllergyList: Allergy[] = [
  { id: 1, allergen: "Peanuts", severity: "severe" },
  { id: 2, allergen: "Shellfish", severity: "moderate" },
  { id: 3, allergen: "Soy", severity: "mild" },
];
