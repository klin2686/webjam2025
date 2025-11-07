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

interface FoodItemsProps {
  items: FoodItem[];
  allergies: Allergy[];
}

const FoodItems = ({ items, allergies }: FoodItemsProps) => {
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
          return severityOrder[a[1]] - severityOrder[b[1]];
        }),
    }));
  }, [items, allergies]);

  const foodItems: EnrichedFoodItem[] = enrichedItems;

  // const foodItems: EnrichedFoodItem[] = [
  //   {
  //     food: "Pizza",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "none"],
  //       ["Dairy", "moderate"],
  //       ["Gluten", "none"],
  //     ],
  //   },
  //   {
  //     food: "Sushi",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "severe"],
  //       ["Dairy", "moderate"],
  //       ["Gluten", "mild"],
  //     ],
  //   },
  //   {
  //     food: "MCDonalds Burger",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "severe"],
  //       ["Dairy", "moderate"],
  //       ["Gluten", "mild"],
  //     ],
  //   },
  //   {
  //     food: "Ice Cream",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "severe"],
  //       ["Dairy", "moderate"],
  //       ["Gluten", "mild"],
  //     ],
  //   },
  //   {
  //     food: "Chicken",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "severe"],
  //       ["Dairy", "moderate"],
  //       ["Gluten", "mild"],
  //     ],
  //   },
  //   {
  //     food: "Nuggets",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "severe"],
  //       ["Dairy", "moderate"],
  //       ["Gluten", "mild"],
  //     ],
  //   },
  //   {
  //     food: "Potato",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "severe"],
  //       ["Dairy", "moderate"],
  //       ["Gluten", "mild"],
  //     ],
  //   },
  //   {
  //     food: "Pizza",
  //     confidence: 8.5,
  //     allergens: [
  //       ["Peanuts", "severe"],
  //       ["Dairy", "moderate"]
  //     ],
  //   },
  // ];

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return foodItems;
    }

    return foodItems.filter((item) =>
      item.food.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, foodItems]);

  return (
    <div className="flex flex-col h-full w-full bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-hidden relative">
      <FoodItemsSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="grid grid-cols-2 place-items-center pt-[6.125rem] px-6 pb-6 overflow-y-auto overflow-x-visible no-scrollbar">
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
  );
};

export default FoodItems;
