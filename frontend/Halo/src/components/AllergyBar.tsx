import React from "react";
import AllergyCard from "./AllergyCard";

const AllergyBar = () => {
  return (
    <div className="h-full w-full relative bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y overflow-x">
      <div className="flex flex-col justify-start items-center p-[1rem]">
        <div className="pt-[2.5rem] flex justify-center text-black font-sf-pro font-semibold text-3xl">
          My Allergies
        </div>
        <br></br>
        <div className="flex justify-center w-full">
          <hr className="w-9/10 justify-center pt-[1rem]"></hr>
        </div>
        <AllergyCard allergen="Peanuts" severity="severe" />
        <AllergyCard allergen="Shellfish" severity="moderate" />
        <AllergyCard allergen="Soy" severity="mild" />
      </div>
    </div>
  );
};

export default AllergyBar;
