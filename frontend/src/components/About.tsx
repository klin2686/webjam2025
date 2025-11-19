import { motion } from "framer-motion";
import haloLogo from "../assets/haloLogo.svg";

interface AboutProps {
  onSignIn: () => void;
}

const About = ({ onSignIn }: AboutProps) => {
  const scrollToAboutGrid = () => {
    const element = document.getElementById("halo-about-grid");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-[2rem] relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/25 z-0"></div>

      {/* Animated background circles with glassmorphism */}
      <motion.div
        className="absolute top-20 w-72 h-72 bg-[#56BECC]/20 rounded-full backdrop-blur-xl filter blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-sky-300/20 rounded-full backdrop-blur-xl filter blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-72 h-72 bg-sky-300/20 rounded-full backdrop-blur-xl filter blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -ml-48 w-96 h-96 bg-blue-200/15 rounded-full backdrop-blur-xl filter blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="text-center max-w-4xl relative z-10">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
            <span className="text-black font-sf-pro font-semibold text-sm">
              🛡️ AI-Powered Allergy Protection
            </span>
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <img src={haloLogo} alt="Halo Logo" className="w-32 h-32" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl md:text-8xl font-bold text-black mb-4 font-sf-pro"
        >
          This is
          <br />
          <span className="bg-gradient-to-r from-[#56BECC] via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Halo
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-black/70 text-xl mb-12 font-sf-pro"
        >
          Your guardian angel for dining out safely.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex gap-4 bg-white/50 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-black font-sf-pro font-medium">
                AI-Powered
              </span>
            </div>
            <div className="h-6 w-px bg-black/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#56BECC] rounded-full animate-pulse"></div>
              <span className="text-black font-sf-pro font-medium">
                Safe Dining
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={onSignIn}
          className="cursor-pointer px-12 py-4 bg-gradient-to-r from-[#56BECC] to-sky-500 rounded-full text-white font-sf-pro font-bold text-lg shadow-2xl mb-8 outline outline-1 outline-offset-[-0.0625rem] outline-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(86, 190, 204, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Sign In
        </motion.button>

        <motion.button
          onClick={scrollToAboutGrid}
          className="flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none hover:opacity-70 transition-opacity mx-auto group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ y: -5 }}
        >
          <p className="text-black font-sf-pro text-sm font-medium tracking-wider">
            LEARN MORE
          </p>
          <motion.svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </motion.button>
      </div>
    </section>
  );
};

export default About;
