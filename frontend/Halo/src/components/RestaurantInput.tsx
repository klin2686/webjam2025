import React from "react";

const RestaurantInput = () => {
  return (
    <div className="h-full w-full bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm border border-white/50 flex flex-col items-center justify-center gap-4 p-8">
      <button className="w-64 h-12 bg-[#b5d3dc] border border-white/50 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#a5c3cc] transition-colors">
        <span className="text-black text-2xl font-sf-pro">Upload Menu</span>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="#56BECC80" fillOpacity="1" />
          <path
            //M16 10V22M10 16H22 is the plus icon just fyi
            d="M16 10V22M10 16H22"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button className="w-64 h-12 bg-white/50 border border-white/50 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#D3D3D3] transition-colors">
        <span className="text-black text-2xl font-sf-pro">Manual Input</span>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="#56BECC80" fillOpacity="1" />
          <path
            d="M16 10V22M10 16H22"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default RestaurantInput;
