import { useState, useEffect, useRef } from "react";
import HistoryCard from "./HistoryCard";
import HistoryFoodItemsPopup from "./HistoryFoodItemsPopup";
import { menuAPI, storage, allergyAPI, type MenuHistoryItem } from "../utils/api";
import type { Allergy } from "./AllergyList";
import { motion } from "framer-motion";
import { iconButtonVariants } from "../utils/animations";

const History = () => {
  const [menuHistory, setMenuHistory] = useState<MenuHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<MenuHistoryItem | null>(null);
  const [userAllergies, setUserAllergies] = useState<Allergy[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleRemoveHistoryItem = async (id: number) => {
    const accessToken = storage.getAccessToken();
    if (!accessToken) return;

    setDeletingIds((prev) => new Set(prev).add(id));

    try {
      await menuAPI.deleteMenuHistory(accessToken, id);

      timeoutRef.current = setTimeout(() => {
        setMenuHistory((prev) => prev.filter((item) => item.id !== id));
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 300);
    } catch (error) {
      console.error("Error deleting history item:", error);
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRenameHistoryItem = async (id: number, newName: string) => {
    const accessToken = storage.getAccessToken();
    if (!accessToken) return;

    try {
      const updatedItem = await menuAPI.renameMenuHistory(accessToken, id, newName);
      setMenuHistory((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    } catch (error) {
      console.error("Error renaming history item:", error);
    }
  };

  return (
    <>
      <div className="h-full w-full flex flex-col relative bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y-auto">
        <div className="pt-[2.5rem] px-[2rem] flex items-center justify-between w-full">
          <div className="w-[3rem]"></div> {/* Spacer for centering */}
          <div className="text-black font-sf-pro font-semibold text-3xl">
            History
          </div>
          <div className="w-[3rem] flex justify-end">
            <motion.button
              onClick={() => setIsActive(!isActive)}
              className="cursor-pointer w-[3rem] h-[3rem] bg-white/10 border border-white/50 rounded-full flex items-center justify-center shadow-xl"
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={iconButtonVariants}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-[0.05rem] -mt-[0.1rem]"
              >
                {isActive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                    stroke="#56BECC"
                    strokeWidth="3"
                  />
                ) : (
                  <path
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    stroke="#56BECC"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
        <br></br>
        <div className="flex justify-center w-full">
          <hr className="w-full mx-[2.2rem] pt-[1rem] opacity-40"></hr>
        </div>
        <div className="flex justify-center w-full">
          <div className="w-full px-[2rem]">
            {isLoading && (
              <div className="text-center py-4">Loading...</div>
            )}
            {error && (
              <div className="text-center py-4 text-red-500">{error}</div>
            )}
            {!isLoading && !error && menuHistory.length === 0 && (
              <div className="text-center py-4 text-gray-500">No menu history</div>
            )}
            {!isLoading && !error && menuHistory.map((item) => (
              <HistoryCard
                key={item.id}
                id={item.id}
                name={item.upload_name}
                dateTime={formatDateTime(item.created_at)}
                menuItems={item.analysis_result}
                allergies={userAllergies}
                onCardClick={() => !isActive && setSelectedHistoryItem(item)}
                editActive={isActive}
                onRemove={handleRemoveHistoryItem}
                onRename={handleRenameHistoryItem}
                isDeleting={deletingIds.has(item.id)}
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
