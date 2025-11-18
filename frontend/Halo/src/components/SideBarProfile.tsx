import { motion } from "framer-motion";
import { profileImageVariants } from "../utils/animations";

interface SideBarProfileProps {
  picture: string;
  name: string;
}

const SideBarProfile = ({ picture, name }: SideBarProfileProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={profileImageVariants}
      className="flex flex-col items-center p-[1rem]"
    >
      <div className="bg-white/15 rounded-full shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 overflow-y overflow-x">
        <img
          src={picture}
          alt={`${name} profile`}
          className="rounded-full p-[0.25rem]"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      </div>
      <div className="text-black font-bold text-xl font-sf-pro py-[1rem]">
        {name}
      </div>
    </motion.div>
  );
};

export default SideBarProfile;
