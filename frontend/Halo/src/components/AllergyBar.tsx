import React from "react";
import AllergyCard from "./AllergyCard";
import { AllergyList } from "./AllergyList";

const AllergyBar = () => {
  return (
    <div className="h-full w-full relative bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y-auto overflow-x-hidden no-scrollbar">
      <div className="flex flex-col justify-start items-center p-[1rem]">
        <div className="pt-[2.5rem] flex justify-center text-black font-sf-pro font-semibold text-3xl">
          My Allergies
        </div>
        <br></br>
        <div className="flex justify-center w-full">
          <hr className="w-9/10 justify-center pt-[1rem]"></hr>
        </div>

        {AllergyList.map((allergy) => (
          <AllergyCard
            id={allergy.id}
            allergen={allergy.allergen}
            severity={allergy.severity}
          />
        ))}

        <div className="flex gap-[1rem] mt-[1rem] mb-[1rem]">
          <button className="w-[3rem] h-[3rem] backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10H16"
                stroke="#56BECC"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button className="w-[3rem] h-[3rem] backdrop-blur-sm border border-white/50 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4V16M4 10H16"
                stroke="#56BECC"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllergyBar;
