import React from "react";
import SideBarProfile from "./SideBarProfile";

import SideBarElement from "./SideBarElement";
import sidebarAccount from "../assets/sidebarAccount.svg";
import sidebarAllergies from "../assets/sidebarAllergies.svg";
import sidebarColor from  "../assets/sidebarColor.svg";
import sidebarDashboard from "../assets/sidebarDashboard.svg";
import sidebarHistory from "../assets/sidebarHistory.svg";
import sidebarSettings from "../assets/sidebarSettings.svg";
import sidebarSignOut from "../assets/sidebarSignOut.svg";

import defaultUser from "../assets/defaultUser.svg";

const SideBar = () => {
  const [activeElement, setActiveElement] = React.useState<string>("Dashboard");

  return (
    <div className="h-full w-full relative bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-2 outline-offset-[-1px] outline-white/50 overflow-y overflow-x">
      <div className="flex flex-col justify-start p-4">
        <SideBarProfile picture={defaultUser} name="John Doe" />
        <div className="flex justify-center w-full">
          <hr className="w-9/10 justify-center pt-4"></hr>
        </div>
        <SideBarElement element="Dashboard" logo={sidebarDashboard} active={activeElement === "Dashboard"} onClick={() => setActiveElement("Dashboard")}/>
        <SideBarElement element="History" logo={sidebarHistory} active={activeElement === "History"} onClick={() => setActiveElement("History")} />
        <SideBarElement element="My Allergies" logo={sidebarAllergies} active={activeElement === "My Allergies"} onClick={() => setActiveElement("My Allergies")} />
        <br></br>
        <div className="flex justify-center w-full">
          <hr className="w-9/10 justify-center pt-4"></hr>
        </div>
        <SideBarElement element="Settings" logo={sidebarSettings} active={activeElement === "Settings"} onClick={() => setActiveElement("Settings")} />
        <SideBarElement element="Account" logo={sidebarAccount} active={activeElement === "Account"} onClick={() => setActiveElement("Account")} />
        <SideBarElement element="Sign Out" logo={sidebarSignOut} active={activeElement === "Sign Out"} onClick={() => setActiveElement("Sign Out")} />
      </div>
      <div className="flex flex-col justify-end absolute bottom-0 w-full p-4">
        <SideBarElement element="Dark Mode" logo={sidebarColor} active={activeElement === "Dark Mode"} onClick={() => setActiveElement("Dark Mode")} />
      </div>
    </div>
  );
};

export default SideBar;
