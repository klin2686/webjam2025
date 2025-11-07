import React from "react";

interface SideBarSwitchProps {
  element: string;
  logo: string;
  isOn: boolean;
  onToggle: () => void;
}

const SideBarSwitch = ({
  element,
  logo,
  isOn,
  onToggle,
}: SideBarSwitchProps) => {
  return (
    <div
      className="relative flex flex-row items-center justify-between cursor-pointer space-x-[1rem]"
      onClick={onToggle}
    >
      <div className="flex flex-row items-center space-x-[1rem]">
        <img src={logo} alt={`${element} icon`} className="w-6 h-6 ml-4" />
        <div className="text-black text-md font-sf-pro pl-[1rem]">{element}</div>
      </div>
      <div
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          isOn ? "bg-sky-500/50" : "bg-gray-300/50"
        } outline outline-1 outline-offset-[-0.0625rem] outline-white/50`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
            isOn ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default SideBarSwitch;
