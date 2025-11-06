import React from "react";
import SeverityTag from "./SeverityTag";

interface AllergyCardProps {
  id: number;
  allergen: string;
  severity: string;
}

const AllergyCard = ({ allergen, severity }: AllergyCardProps) => {
  return (
    <div className="w-9/10 rounded-xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 p-[1.5rem] my-[1rem]">
      <div className="flex items-center justify-between text-black font-sf-pro font-semibold text-xl">
        <div>{allergen}</div>
        <SeverityTag
          severity={severity}
          text={severity.charAt(0).toUpperCase() + severity.slice(1)}
        />
      </div>
    </div>
  );
};

export default AllergyCard;
