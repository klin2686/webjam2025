import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { storage } from "../utils/api";
import AllergyCard from "./AllergyCard";
import AddAllergyPopup from "./AddAllergyPopup";
import { fetchAllergies, defaultAllergyList } from "./AllergyList";
import type { Allergy } from "./AllergyList";
import { iconButtonVariants } from "../utils/animations";

interface AllergyBarProps {
  onAllergiesLoaded?: (allergies: Allergy[]) => void;
}

const AllergyBar = ({ onAllergiesLoaded }: AllergyBarProps) => {
  const { isAuthenticated } = useAuth();
  const [allergies, setAllergies] = useState<Allergy[]>(defaultAllergyList);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const loadAllergies = async () => {
    const accessToken = storage.getAccessToken();
    if (!accessToken || !isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await fetchAllergies(accessToken);
    setAllergies(data);
    onAllergiesLoaded?.(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAllergies();
  }, []);

  const handleRemoveAllergy = (allergyId: number) => {
    setDeletingIds((prev) => new Set(prev).add(allergyId));

    setTimeout(() => {
      setAllergies((prevAllergies) => {
        const updatedAllergies = prevAllergies.filter((allergy) => allergy.id !== allergyId);
        onAllergiesLoaded?.(updatedAllergies);
        return updatedAllergies;
      });
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(allergyId);
        return newSet;
      });
    }, 300);
  };

  return (
    <div className="h-full w-full relative bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y-auto overflow-x-hidden no-scrollbar">
      <div
        className={`flex flex-col justify-start ${
          isActive ? "items-start" : "items-center"
        } p-[1rem]`}
      >
        <div className="pt-[2.5rem] flex justify-center text-black font-sf-pro font-semibold text-3xl w-full">
          My Allergies
        </div>
        <br></br>
        <div className="flex justify-center w-full">
          <hr className="w-9/10 justify-center pt-[1rem] opacity-40"></hr>
        </div>

        {loading ? (
          <div className="text-black/50 font-sf-pro font-bold text-lg py-4">
            Loading allergies...
          </div>
        ) : (
          allergies.map((allergy) => (
            <AllergyCard
              key={allergy.id}
              id={allergy.id}
              allergen={allergy.allergen}
              severity={allergy.severity}
              editActive={isActive}
              onRemove={handleRemoveAllergy}
              isDeleting={deletingIds.has(allergy.id)}
            />
          ))
        )}

        <div
          key={allergies.length}
          className="flex gap-[1rem] mt-[1rem] mb-[1rem] w-full justify-center"
        >
          <motion.button
            onClick={() => setIsActive(!isActive)}
            className="cursor-pointer w-[3rem] h-[3rem] backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center shadow-xl"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={iconButtonVariants}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-[0.05rem] -mt-[0.1rem]"
            >
              {isActive ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                  stroke="#56BECC"
                  strokeWidth="3"
                />
              ) : (
                <path
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  stroke="#56BECC"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </motion.button>

          <motion.button
            onClick={() => setIsPopupOpen(true)}
            className="cursor-pointer w-[3rem] h-[3rem] backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center shadow-xl"
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={iconButtonVariants}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path // Plus Button
                d="M10 4V16M4 10H16"
                stroke="#56BECC"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Add Allergy Popup */}
      <AddAllergyPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        existingAllergies={allergies}
        onAllergyAdded={loadAllergies}
      />
    </div>
  );
};

export default AllergyBar;
