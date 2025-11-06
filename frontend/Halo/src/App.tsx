import TopBar from "./components/TopBar";
import backgroundImage from "./assets/background.jpg";
import SideBar from "./components/SideBar";
import RestaurantInput from "./components/RestaurantInput";
import FoodItemsSection from "./components/FoodItems";
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

      <div className="relative z-10 h-full w-full flex flex-col p-[2rem] gap-[1rem]">
        <TopBar />
        <div className="flex-1 grid grid-cols-[4fr_10fr_5fr] gap-[1rem] min-h-0">
          <SideBar />
          <div className="grid grid-rows-[1fr_3fr] gap-[1rem] min-h-0">
            <RestaurantInput />
            <FoodItemsSection />
          </div>
          <AllergyBar />
        </div>
      </div>
    </div>
  );
};

export default App;
