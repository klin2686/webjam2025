import TopBar from "./components/TopBar";
import backgroundImage from "./assets/background.jpg";
import SideBar from "./components/SideBar";
import RestaurantInput from "./components/RestaurantInput";
import FoodItemsSection from "./components/FoodItemSection";
import AllergyBar from "./components/AllergyBar";

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
        <div className="h-full w-full pt-4 px-8">
          <TopBar />
          <div className="h-[calc(100%-5rem-1rem)] grid grid-cols-[2fr_6fr_3fr] gap-4 pt-4">
            <SideBar />
            <div className="grid grid-rows-[1fr_3fr] gap-4">
              <RestaurantInput />
              <FoodItemsSection />
            </div>
            <AllergyBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
