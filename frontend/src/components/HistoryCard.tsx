import { useState } from "react";
import { type MenuItem } from "../utils/api";
import type { Allergy } from "./AllergyList";
import { motion } from "framer-motion";

interface HistoryCardProps {
  id: number;
  name: string;
  dateTime: string;
  menuItems: MenuItem[];
  allergies: Allergy[];
  onCardClick: () => void;
  editActive?: boolean;
  onRemove: (id: number) => void;
  onRename: (id: number, newName: string) => void;
  isDeleting?: boolean;
}

const HistoryCard = ({ id, name, dateTime, onCardClick, editActive, onRemove, onRename, isDeleting = false }: HistoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleRenameSubmit = () => {
    if (editedName.trim() && editedName !== name) {
      onRename(id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(name);
      setIsEditing(false);
    }
  };

  const handleCardClick = () => {
    if (editActive) {
      setIsEditing(true);
    } else {
      onCardClick();
    }
  };

  return (
    <motion.div
      animate={{
        opacity: isDeleting ? 0 : 1,
        scale: isDeleting ? 0.95 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="flex flex-row items-center justify-start w-full transition-all ease-in-out duration-300 opacity-100 scale-100"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`cursor-pointer stroke-red-500 bg-[rgba(255,80,80,0.44)] rounded-full flex-shrink-0 transition-all ease-in-out duration-300 ${
          editActive ? 'opacity-100 w-[2rem] h-[2rem] mr-4' : 'opacity-0 w-0 h-0 mr-0 pointer-events-none'
        }`}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={() => onRemove(id)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <path d="M7 12h10" />
      </motion.svg>
      <div
        className="flex-1 rounded-xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 p-[1.5rem] my-[1rem] transition-all ease-in-out duration-300 hover:scale-101 active:scale-99 cursor-pointer overflow-x-hidden"
        onClick={handleCardClick}
      >
        <div className="flex-row min-[580px]:flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="text-black font-sf-pro font-semibold text-xl bg-white/50 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#56BECC] mr-2"
              autoFocus
            />
          ) : (
            <div className="text-black font-sf-pro font-semibold text-xl truncate">{name}</div>
          )}
          <div className="text-black font-sf-pro font-normal pt-[5px] text-sm min-[580px]:text-lg">{dateTime}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryCard;
