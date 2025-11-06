import React from "react";

interface AllergenTag {
  name: string;
  severity: "severe" | "moderate" | "mild";
}

interface FoodItem {
  name: string;
  allergens: AllergenTag[];
  confidence: number; // 0-100 - Represents how confident the ai is about the allergens
}

const FoodItemCard = ({ item }: { item: FoodItem }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-[rgba(255,80,80,0.44)]";
      case "moderate":
        return "bg-[rgba(255,170,80,0.44)]";
      case "mild":
        return "bg-[rgba(183,255,83,0.44)]";
      default:
        return "bg-gray-300/44";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-[rgba(183,255,83,0.44)]";
    if (confidence >= 50) return "bg-[rgba(255,170,80,0.44)]";
    return "bg-[rgba(255,80,80,0.44)]";
  };

  return (
    <div className="h-full w-full rounded-xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-1px] outline-white/50 overflow-y overflow-x p-4 relative inset-0">
      <h1 className="text-2xl font-bold text-black font-sf-pro mb-3">
        {item.name}
      </h1>

      <div className="absolute top-4 right-4 h-[18px] w-[76px] rounded-full overflow-hidden">
        <div className={`h-full ${getConfidenceColor(item.confidence)}`}>
          <div
            className="h-full bg-[#d9d9d9] ml-auto"
            style={{ width: `${100 - item.confidence}%` }}
          />
        </div>

        <div className="absolute inset-0 bg-white/50 rounded-full flex items-center justify-center">
          <span className="text-[11px] text-black font-sf-pro">
            {item.confidence}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {item.allergens.map((allergen, index) => (
          <div
            key={index}
            className={`h-[18px] px-3 rounded-full ${getSeverityColor(
              allergen.severity
            )} flex items-center gap-1`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                allergen.severity === "severe"
                  ? "bg-red-500"
                  : allergen.severity === "moderate"
                  ? "bg-orange-400"
                  : "bg-green-400"
              }`}
            />
            <span className="text-[11px] text-black font-sf-pro">
              {allergen.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FoodItemsSection = () => {
  const foodItems: FoodItem[] = [
    {
      name: "Pad Thai",
      allergens: [
        { name: "Peanuts", severity: "severe" },
        { name: "Shellfish", severity: "moderate" },
        { name: "Shellfish", severity: "moderate" },
        { name: "Shellfish", severity: "moderate" },
        { name: "Shellfish", severity: "moderate" },
        { name: "Shellfish", severity: "moderate" },
      ],
      confidence: 97,
    },
    {
      name: "Pesto Pasta",
      allergens: [
        { name: "Tree Nuts", severity: "severe" },
        { name: "Shrimp", severity: "moderate" },
        { name: "Dairy", severity: "mild" },
      ],
      confidence: 67,
    },
    {
      name: "Chef's Special",
      allergens: [{ name: "Shellfish", severity: "moderate" }],
      confidence: 31,
    },
    {
      name: "Pesto Pasta",
      allergens: [
        { name: "Tree Nuts", severity: "severe" },
        { name: "Shrimp", severity: "moderate" },
        { name: "Dairy", severity: "mild" },
      ],
      confidence: 67,
    },
    {
      name: "Chef's Special",
      allergens: [{ name: "Shellfish", severity: "moderate" }],
      confidence: 31,
    },
    {
      name: "Pesto Pasta",
      allergens: [
        { name: "Tree Nuts", severity: "severe" },
        { name: "Shrimp", severity: "moderate" },
        { name: "Dairy", severity: "mild" },
      ],
      confidence: 67,
    },
    {
      name: "Chef's Special",
      allergens: [{ name: "Shellfish", severity: "moderate" }],
      confidence: 31,
    },
    {
      name: "Pesto Pasta",
      allergens: [
        { name: "Tree Nuts", severity: "severe" },
        { name: "Shrimp", severity: "moderate" },
        { name: "Dairy", severity: "mild" },
      ],
      confidence: 67,
    },
    {
      name: "Chef's Special",
      allergens: [{ name: "Shellfish", severity: "moderate" }],
      confidence: 31,
    },
  ];

  return (
    <div className="flex flex-col h-[38rem] w-full bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-1px] outline-white/50 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-10 p-6 pb-3 pointer-events-none">
        <div className="flex items-center w-full h-[50px] bg-white/10 border border-white/50 rounded-xl px-4 backdrop-blur-sm outline outline-1 outline-offset-[-1px] outline-white/50 pointer-events-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-2xl text-black placeholder-black/70 font-sf-pro outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-visible no-scrollbar px-6 pt-[98px] pb-6">
        <div className="grid grid-cols-2 gap-6">
          {foodItems.map((item, index) => (
            <FoodItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodItemsSection;
