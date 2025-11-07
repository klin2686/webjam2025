import { useState, useEffect } from "react";
import HistoryCard from "./HistoryCard";
import HistoryFoodItemsPopup from "./HistoryFoodItemsPopup";
import { menuAPI, storage, allergyAPI, type MenuHistoryItem } from "../utils/api";
import type { Allergy } from "./AllergyList";

const History = () => {
  const [menuHistory, setMenuHistory] = useState<MenuHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<MenuHistoryItem | null>(null);
  const [userAllergies, setUserAllergies] = useState<Allergy[]>([]);

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = storage.getAccessToken();
      if (!accessToken) {
        setError("No access token found");
        setIsLoading(false);
        return;
      }

      try {
        const [history, allergiesResponse] = await Promise.all([
          menuAPI.getMenuHistory(accessToken),
          allergyAPI.getAllergies(accessToken),
        ]);
        setMenuHistory(history);
        setUserAllergies(
          allergiesResponse.user_allergy.map((allergy) => ({
            id: allergy.id,
            allergen: allergy.allergen_name,
            severity: allergy.severity === 1 ? "mild" : allergy.severity === 2 ? "moderate" : "severe",
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load menu history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="h-full w-full relative bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y overflow-x">
        <div className="pt-[2.5rem] flex justify-center text-black font-sf-pro font-semibold text-3xl w-full">
          History
        </div>
        <br></br>
        <div className="flex justify-center w-full">
          <hr className="w-9/10 justify-center pt-[1rem] opacity-40"></hr>
        </div>
        <div className="flex justify-center w-full">
          <div className="w-9/10 justify-center">
            {isLoading && (
              <div className="text-center py-4">Loading...</div>
            )}
            {error && (
              <div className="text-center py-4 text-red-500">{error}</div>
            )}
            {!isLoading && !error && menuHistory.length === 0 && (
              <div className="text-center py-4 text-gray-500">No menu history</div>
            )}
            {!isLoading && !error && menuHistory.map((item, index) => (
              <HistoryCard
                key={index}
                id={item.id}
                name={item.upload_name}
                dateTime={formatDateTime(item.created_at)}
                menuItems={item.analysis_result}
                allergies={userAllergies}
                onCardClick={() => setSelectedHistoryItem(item)}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedHistoryItem && (
        <HistoryFoodItemsPopup
          items={selectedHistoryItem.analysis_result.map((item) => ({
            food: item.item_name,
            confidence: item.confidence_score,
            allergens: item.common_allergens,
          }))}
          allergies={userAllergies}
          onClose={() => setSelectedHistoryItem(null)}
        />
      )}
    </>
  );
};

export default History;
