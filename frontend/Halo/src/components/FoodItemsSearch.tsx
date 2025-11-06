import React from "react";

const FoodItemsSearch = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-[1.5rem] pb-[0.75rem] pointer-events-none">
      <div className="flex items-center w-full h-[3.125rem] bg-white/10 border border-white/50 rounded-xl px-[1rem] backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 pointer-events-auto shadow-xl">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-2xl text-black placeholder-black/70 font-sf-pro outline-none"
        />
      </div>
    </div>
  );
};

export default FoodItemsSearch;
