import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import SideBarProfile from "./SideBarProfile";
import SideBarElement from "./SideBarElement";
import SideBarSwitch from "./SideBarSwitch";
import sidebarAccount from "../assets/sidebarAccount.svg";
import sidebarAllergies from "../assets/sidebarAllergies.svg";
import sidebarColor from "../assets/sidebarColor.svg";
import sidebarDashboard from "../assets/sidebarDashboard.svg";
import sidebarHistory from "../assets/sidebarHistory.svg";
import sidebarSettings from "../assets/sidebarSettings.svg";
import sidebarSignOut from "../assets/sidebarSignOut.svg";
import defaultUser from "../assets/defaultUser.svg";

const SideBar = () => {
  const { user, logout } = useAuth();
  const [activeElement, setActiveElement] = useState<string>("Dashboard");
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLifted, setIsLifted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const elementsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSignOut = () => {
    logout();
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    console.log(isDarkMode ? "light mode" : "dark mode");
  };

  useEffect(() => {
    const activeRef = elementsRef.current[activeElement];
    if (activeRef) {
      setIsLifted(false);

      setIndicatorStyle({
        top: activeRef.offsetTop + 8,
        height: activeRef.offsetHeight - 16,
      });

      setTimeout(() => {
        setIsLifted(true);
      }, 500);
    }
  }, [activeElement]);

  useEffect(() => {
    const dashboardRef = elementsRef.current["Dashboard"];
    if (dashboardRef) {
      setIndicatorStyle({
        top: dashboardRef.offsetTop + 8,
        height: dashboardRef.offsetHeight - 16,
      });
      setIsInitialized(true);
      setTimeout(() => {
        setIsLifted(true);
      }, 100);
    }
  }, []);

  return (
    <div className="h-full w-full relative bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y overflow-x">
      <div className="flex flex-col justify-between h-full p-[1rem]">
        {isInitialized && (
          <div
            className={`absolute backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 rounded-lg pointer-events-none transition-all ease-in-out duration-500 ${
              isLifted ? "shadow-xl" : ""
            }`}
            style={{
              top: `${indicatorStyle.top}px`,
              height: `${indicatorStyle.height}px`,
              left: "1.5rem",
              right: "1.5rem",
              transform: isLifted ? "translateY(-0.25rem)" : "translateY(0)",
            }}
          />
        )}

        <div className="flex flex-col flex-1 min-h-0">
          <SideBarProfile
            picture={user?.profile_picture || defaultUser}
            name={user?.name || user?.email || "User"}
          />
          <div className="flex justify-center w-full">
            <hr className="w-9/10 justify-center pt-[1rem]"></hr>
          </div>

          <div
            ref={(el) => {
              elementsRef.current["Dashboard"] = el;
            }}
          >
            <SideBarElement
              element="Dashboard"
              logo={sidebarDashboard}
              onClick={() => setActiveElement("Dashboard")}
              active={activeElement === "Dashboard"}
              isLifted={isLifted}
            />
          </div>
          <div
            ref={(el) => {
              elementsRef.current["History"] = el;
            }}
          >
            <SideBarElement
              element="History"
              logo={sidebarHistory}
              onClick={() => setActiveElement("History")}
              active={activeElement === "History"}
              isLifted={isLifted}
            />
          </div>
          <div
            ref={(el) => {
              elementsRef.current["My Allergies"] = el;
            }}
          >
            <SideBarElement
              element="My Allergies"
              logo={sidebarAllergies}
              onClick={() => setActiveElement("My Allergies")}
              active={activeElement === "My Allergies"}
              isLifted={isLifted}
            />
          </div>

          <br></br>
          <div className="flex justify-center w-full">
            <hr className="w-9/10 justify-center pt-[1rem]"></hr>
          </div>

          <div
            ref={(el) => {
              elementsRef.current["Settings"] = el;
            }}
          >
            <SideBarElement
              element="Settings"
              logo={sidebarSettings}
              onClick={() => setActiveElement("Settings")}
              active={activeElement === "Settings"}
              isLifted={isLifted}
            />
          </div>
          <div
            ref={(el) => {
              elementsRef.current["Account"] = el;
            }}
          >
            <SideBarElement
              element="Account"
              logo={sidebarAccount}
              onClick={() => setActiveElement("Account")}
              active={activeElement === "Account"}
              isLifted={isLifted}
            />
          </div>
          <div
            ref={(el) => {
              elementsRef.current["Sign Out"] = el;
            }}
          >
            <SideBarElement
              element="Sign Out"
              logo={sidebarSignOut}
              onClick={handleSignOut}
              active={activeElement === "Sign Out"}
              isLifted={isLifted}
            />
          </div>
        </div>

        <div className="flex flex-col mt-auto">
          <div className="flex justify-center w-full">
            <hr className="w-9/10 justify-center pt-[1rem]"></hr>
          </div>
          <div className="flex flex-col justify-center w-full p-[1rem]">
            <SideBarSwitch
              element="Dark Mode"
              logo={sidebarColor}
              isOn={isDarkMode}
              onToggle={handleDarkModeToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
