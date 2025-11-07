import { useState } from "react";
import { STANDARD_ALLERGENS, addAllergy } from "./AllergyList";
import type { Allergy } from "./AllergyList";
import { storage } from "../utils/api";

interface AddAllergyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  existingAllergies: Allergy[];
  onAllergyAdded?: () => void;
}

const AddAllergyPopup = ({
  isOpen,
  onClose,
  existingAllergies,
  onAllergyAdded,
}: AddAllergyPopupProps) => {
  const [selectedAllergen, setSelectedAllergen] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("mild");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  //FIlter Allergies from original list
  const existingAllergenNames = existingAllergies.map((a) =>
    a.allergen.toLowerCase()
  );
  const availableAllergens = STANDARD_ALLERGENS.filter(
    (allergen) => !existingAllergenNames.includes(allergen.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedAllergen) {
      setError("Please select an allergen");
      return;
    }

    const accessToken = storage.getAccessToken();
    if (!accessToken) {
      setError("You must be logged in to add allergies");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await addAllergy(accessToken, selectedAllergen, selectedSeverity);

      // This is the default state
      setSelectedAllergen("");
      setSelectedSeverity("mild");

      if (onAllergyAdded) {
        onAllergyAdded();
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add allergy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md bg-white/90 rounded-3xl shadow-2xl backdrop-blur-md outline outline-2 outline-offset-[-1px] outline-white/50 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-all"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path // This is the X icon from tailwind css
              d="M15 5L5 15M5 5L15 15"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-sf-pro font-bold text-black mb-6">
          Add New Allergy
        </h2>

        <div className="mb-4">
          <label className="block text-black font-sf-pro font-semibold mb-2">
            Select Allergen
          </label>
          <select
            value={selectedAllergen}
            onChange={(e) => setSelectedAllergen(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border border-white/50 rounded-xl font-sf-pro text-black outline-none focus:outline-sky-500/50 focus:outline-2"
          >
            <option value="" disabled>
              Choose an allergen...
            </option>
            {availableAllergens.map((allergen) => (
              <option key={allergen} value={allergen}>
                {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-black font-sf-pro font-semibold mb-2">
            Select Severity
          </label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border border-white/50 rounded-xl font-sf-pro text-black outline-none focus:outline-sky-500/50 focus:outline-2"
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl font-sf-pro text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedAllergen || isSubmitting}
          className="w-full py-3 bg-sky-500/70 hover:bg-sky-500/90 disabled:bg-gray-400/50 disabled:cursor-not-allowed rounded-xl font-sf-pro font-bold text-white text-lg transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? "Adding..." : "Add Allergy"}
        </button>
      </div>
    </div>
  );
};

export default AddAllergyPopup;
