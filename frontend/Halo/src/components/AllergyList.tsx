import { allergyAPI } from "../utils/api";

export interface Allergy {
  id: number;
  allergen: string;
  severity: string;
}

// Standard allergens from backend
export const STANDARD_ALLERGENS = [
  "milk",
  "eggs",
  "fish",
  "shellfish",
  "tree nuts",
  "peanuts",
  "wheat",
  "soybeans",
  "sesame",
];

const severityToString = (severity: number): string => {
  switch (severity) {
    case 1:
      return "mild";
    case 2:
      return "moderate";
    case 3:
      return "severe";
    default:
      return "mild";
  }
};

const stringToSeverity = (severity: string): number => {
  switch (severity.toLowerCase()) {
    case "mild":
      return 1;
    case "moderate":
      return 2;
    case "severe":
      return 3;
    default:
      return 1;
  }
};

//testpush
export const defaultAllergyList: Allergy[] = [
  { id: 1, allergen: "Peanuts", severity: "severe" },
  { id: 2, allergen: "Shellfish", severity: "moderate" },
  { id: 3, allergen: "Soy", severity: "mild" },
];

export const fetchAllergies = async (
  accessToken: string
): Promise<Allergy[]> => {
  try {
    const data = await allergyAPI.getAllergies(accessToken);
    return data.user_allergy.map((item) => ({
      id: item.id,
      allergen: item.allergen_name,
      severity: severityToString(item.severity),
    }));
  } catch (error) {
    console.error("Error fetching allergies:", error);
    return defaultAllergyList;
  }
};

export const addAllergy = async (
  accessToken: string,
  allergenName: string,
  severity: string
): Promise<void> => {
  await allergyAPI.addAllergy(accessToken, allergenName, stringToSeverity(severity));
};
