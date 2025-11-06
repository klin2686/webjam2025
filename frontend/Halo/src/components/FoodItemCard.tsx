import React from "react";
import SeverityTag from "./SeverityTag";
import ConfidenceTag from "./ConfidenceTag";

interface FoodItemCardProps {
  food: string;
  confidence: number;
  allergens: [string, string][];
}

const FoodItemCard = ({ food, confidence, allergens }: FoodItemCardProps) => {
  return (
    <div className="w-9/10 min-h-[8rem] rounded-xl bg-white backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 p-[1.5rem] my-[1rem]">
      <div className="flex items-center justify-between text-black font-sf-pro font-semibold text-xl">
        <div>{food}</div>
        <ConfidenceTag confidence={confidence} text={confidence.toString()} />
      </div>
      <div className="grid grid-cols-3 gap-[0.5rem] pt-[1rem] place-items-center">
        {allergens.map(([allergen, severity], index) => (
          <SeverityTag key={index} severity={severity} text={allergen} />
        ))}
      </div>
    </div>
  );
};

export default FoodItemCard;
