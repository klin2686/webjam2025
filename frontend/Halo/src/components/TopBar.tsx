import React from "react";
import logoSvg from "../assets/logo.svg";

const TopBar = ({}) => {
  return (
    <div className="w-full mx-auto h-20 bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-2 outline-offset-[-1px] outline-white/50 overflow-y overflow-x">
      <div className="flex items-center justify-between h-full px-6 lg:px-6">
        <div className="flex items-center -space-x-8">
          <img src={logoSvg} alt="Logo" className="w-28 h-28 pt-8" />
          <div className="text-black text-2xl lg:text-3xl font-sf-pro font-semibold">
            Halo
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-8 lg:space-x-16">
          <div className="text-black text-xl font-light lg:text-2xl font-sf-pro hover:text-gray-700 transition-colors cursor-pointer">
            About
          </div>
          <div className="text-black text-xl font-light lg:text-2xl font-sf-pro hover:text-gray-700 transition-colors cursor-pointer">
            Contact Us
          </div>
          <div className="bg-sky-500/30 rounded-full px-8 py-2 outline outline-1 outline-offset-[-1px] outline-white/25 hover:bg-sky-500/40 transition-colors cursor-pointer">
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
