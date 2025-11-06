import React from "react";

interface SideBarElementProps {
  element: string;
  logo: string;
  active: boolean;
  isLifted: boolean;
  onClick: () => void;
}

const SideBarElement = ({
  element,
  logo,
  onClick,
  active,
  isLifted,
}: SideBarElementProps) => {
  return (
    <div
      className={`relative flex flex-row items-center cursor-pointer p-[1rem] space-x-[1rem] transition-transform duration-500 ease-in-out ${
        active && isLifted ? "-translate-y-1" : ""
      }`}
      onClick={onClick}
    >
      <img src={logo} alt={`${element} icon`} className="w-6 h-6 ml-4" />
      <div className="text-black text-md font-sf-pro pl-[1rem]">{element}</div>
    </div>
  );
};

export default SideBarElement;
