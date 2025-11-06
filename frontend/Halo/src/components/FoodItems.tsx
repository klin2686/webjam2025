import React, { useState, useMemo } from "react";
import FoodItemsSearch from "./FoodItemsSearch";
import FoodItemCard from "./FoodItemCard";

interface FoodItem {
  food: string;
  confidence: number;
  allergens: [string, string][];
}

const FoodItems = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const foodItems: FoodItem[] = [
    {
      food: "Pizza",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
      ],
    },
    {
      food: "Sushi",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
      ],
    },
    {
      food: "MCDonalds Burger",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
      ],
    },
    {
      food: "Ice Cream",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
      ],
    },
    {
      food: "Chicken",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
      ],
    },
    {
      food: "Nuggets",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
      ],
    },
    {
      food: "Potato",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
      ],
    },
    {
      food: "Pizza",
      confidence: 8.5,
      allergens: [
        ["Peanuts", "severe"],
        ["Dairy", "moderate"],
        ["Gluten", "mild"],
        ["Gluten", "mild"],
        ["Gluten", "mild"],
        ["Gluten", "mild"],
        ["Gluten", "mild"],
        ["Gluten", "mild"],
      ],
    },
  ];

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return foodItems;
    }

    return foodItems.filter((item) =>
      item.food.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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
