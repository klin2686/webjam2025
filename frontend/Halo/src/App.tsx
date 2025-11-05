import TopBar from "./components/TopBar";
import backgroundImage from "./assets/background.jpg";
import SideBar from "./components/SideBar";
import RestaurantInput from "./components/RestaurantInput";

const App = () => {
  return (
    <div
      className="h-screen w-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-white/25 z-0"></div>

      <div className="relative z-10 h-screen w-screen flex flex-col">
        <div className="h-screen w-screen pt-4 px-8">
          <TopBar />
          <div className="h-71/80 grid grid-cols-[2fr_6fr_3fr] gap-4 pt-4">
            <SideBar />
            <div className="grid grid-rows-[2fr_3fr] gap-4">
              <RestaurantInput />
              <div className="bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-2 outline-offset-[-1px] outline-white/50 overflow-y overflow-x">
                test bottom
              </div>
            </div>
            <div className="bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-2 outline-offset-[-1px] outline-white/50 overflow-y overflow-x">
              test right
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
