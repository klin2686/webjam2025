import { useState, useMemo } from "react";
import FoodItemsSearch from "./FoodItemsSearch";
import FoodItemCard from "./FoodItemCard";
import type { Allergy } from "./AllergyList";

interface FoodItem {
  food: string;
  confidence: number;
  allergens: string[];
}

interface EnrichedFoodItem {
  food: string;
  confidence: number;
  allergens: [string, string][];
}

interface HistoryFoodItemsPopupProps {
  items: FoodItem[];
  allergies: Allergy[];
  onClose: () => void;
}

const HistoryFoodItemsPopup = ({
  items,
  allergies,
  onClose,
}: HistoryFoodItemsPopupProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const enrichedItems = useMemo<EnrichedFoodItem[]>(() => {
    return items.map((item) => ({
      ...item,
      allergens: item.allergens
        .map((allergenName) => {
          const userAllergy = allergies.find(
            (a) => a.allergen.toLowerCase() === allergenName.toLowerCase()
          );
          return [allergenName, userAllergy?.severity || "none"] as [
            string,
            string
          ];
        })
        .sort((a, b) => {
          const severityOrder: { [key: string]: number } = {
            none: 0,
            mild: 1,
            moderate: 2,
            severe: 3,
          };
          return severityOrder[b[1]] - severityOrder[a[1]];
        }),
    }));
  }, [items, allergies]);

  const foodItems: EnrichedFoodItem[] = enrichedItems;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return foodItems;
    }

    return foodItems.filter((item) =>
      item.food.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, foodItems]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex flex-col h-3/5 w-4/5 bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 z-10 flex flex-row items-center gap-2 p-[1.5rem] pb-[0.75rem] pointer-events-none">
          <div className="flex-1 pointer-events-auto">
            <FoodItemsSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              inline={true}
            />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm flex-shrink-0 outline outline-1 outline-offset-[-0.0625rem] outline-white/50 bg-white/50 shadow-xl pointer-events-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 place-items-center pt-[6.125rem] px-6 pb-6 overflow-y-auto overflow-x-visible no-scrollbar">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <FoodItemCard
                key={`${item.food}-${index}`}
                food={item.food}
                confidence={item.confidence}
                allergens={item.allergens}
              />
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center text-black/50 font-sf-pro text-xl font-bold">
              No food items found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryFoodItemsPopup;
