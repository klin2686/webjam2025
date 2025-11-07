import React from "react";
import SeverityTag from "./SeverityTag";
import { allergyAPI, storage } from "../utils/api";

interface AllergyCardProps {
  id: number;
  allergen: string;
  severity: string;
  editActive: boolean;
  onRemove: (id: number) => void;
  isDeleting?: boolean;
}

const AllergyCard = ({ id, allergen, severity, editActive, onRemove, isDeleting = false }: AllergyCardProps) => {
  const handleRemoveAllergy = async (allergyId: number) => {
    const accessToken = storage.getAccessToken();
    if (!accessToken) {
      console.error('Error deleting allergy: No access token found');
      return;
    }

    try {
      await allergyAPI.deleteAllergy(accessToken, allergyId);
      onRemove(allergyId);
    } catch (error) {
      console.error('Error deleting allergy:', error);
    }
  };
  return (
    <div className={`flex flex-row items-center justify-start px-[1.25rem] w-full transition-all ease-in-out duration-300 ${
      isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`cursor-pointer stroke-red-500 bg-[rgba(255,80,80,0.44)] rounded-full flex-shrink-0 transition-all ease-in-out duration-300 ${
          editActive ? 'opacity-100 w-[2rem] h-[2rem] mr-4 hover:scale-105 active:scale-95 transition-all' : 'opacity-0 w-0 h-0 mr-0 pointer-events-none'
        }`}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={() => handleRemoveAllergy(id)}
      >
        <path d="M7 12h10" />
      </svg>
      <div className="flex-1 rounded-xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 p-[1.5rem] my-[1rem] transition-all ease-in-out duration-300">
        <div className="flex items-center justify-between text-black font-sf-pro font-semibold text-xl">
          <div>{allergen}</div>
          <SeverityTag
            severity={severity}
            text={severity.charAt(0).toUpperCase() + severity.slice(1)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllergyCard;
