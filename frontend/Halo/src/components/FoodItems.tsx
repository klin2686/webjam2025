import React from "react";
import FoodItemsSearch from "./FoodItemsSearch";
import FoodItemCard from "./FoodItemCard";

interface FoodItemsProps {
  name: string;
  foodItem: string;
  confidence: number;
}

const FoodItems = () => {
  return (
    <div className="flex flex-col h-[38rem] w-full bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-hidden relative">
      <FoodItemsSearch />
      <div className="grid grid-cols-2 place-items-center pt-[6.125rem] px-6 pb-6 overflow-y-auto overflow-x-visible no-scrollbar">
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
        <FoodItemCard
          food="Pizza"
          confidence={8.5}
          allergens={[
            ["Peanuts", "severe"],
            ["Dairy", "moderate"],
            ["Gluten", "mild"],
          ]}
        />
      </div>
    </div>
  );
};

export default FoodItems;
