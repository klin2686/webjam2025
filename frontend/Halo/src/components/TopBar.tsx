import React from "react";
import haloLogo from "../assets/haloLogo.svg";

const TopBar = ({}) => {
  return (
    <div className="w-full mx-auto h-20 bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y overflow-x">
      <div className="flex items-center justify-between h-full px-[1.5rem] lg:px-[1.5rem]">
        <div className="flex items-center space-x-[1rem]">
          <img src={haloLogo} alt="Logo" className="w-[3rem] h-[3rem]" />
          <div className="text-black text-2xl lg:text-3xl font-sf-pro font-semibold">
            Halo
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-8 lg:space-x-16">
          <div className="text-black text-xl font-thin lg:text-2xl font-sf-pro hover:text-gray-700 transition-colors cursor-pointer">
            About
          </div>
          <div className="text-black text-xl font-thin lg:text-2xl font-sf-pro hover:text-gray-700 transition-colors cursor-pointer">
            Contact Us
          </div>
          <div className="bg-sky-500/30 rounded-full px-[2rem] py-[0.5rem] outline outline-1 outline-offset-[-0.0625rem] outline-white/25 hover:bg-sky-500/40 transition-colors cursor-pointer">
            <div className="text-black text-xl lg:text-2xl font-bold font-sf-pro">
              Sign In
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <button className="text-black text-2xl font-sf-pro">☰</button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
