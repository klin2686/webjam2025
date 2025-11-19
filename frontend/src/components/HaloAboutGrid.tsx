import { motion, type Variants } from "framer-motion";

// Placeholder image paths - replace with actual Halo feature images
// import haloMenuScan from "../assets/halo-menu-scan.png";
// import haloAllergyMatch from "../assets/halo-allergy-match.png";

const HaloAboutGrid = () => {
  // Animation variants for fade-in from left
  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  // Animation variants for fade-in from right
  const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  // Stagger container for text elements
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Child animation for staggered text
  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="halo-about-grid"
      className="py-20 px-4 relative"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/25 z-0"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* First Hero Section - AI-Powered Menu Analysis */}
        <motion.div
          className="flex items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="w-full flex flex-col lg:flex-row-reverse items-center justify-between gap-12">
            <motion.div
              className="max-w-lg lg:ml-auto"
              variants={containerVariants}
            >
              <motion.div variants={childVariants} className="mb-4">
                <div className="bg-[#56BECC]/50 backdrop-blur-sm rounded-full px-6 py-2 inline-block shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-black font-sf-pro font-semibold text-sm">
                    🤖 Smart Analysis
                  </span>
                </div>
              </motion.div>
              <motion.h2
                variants={childVariants}
                className="text-6xl font-bold text-black mb-6 font-sf-pro hover:text-[#56BECC] transition-colors duration-300"
              >
                AI-Powered Menu Intelligence
              </motion.h2>
              <motion.p
                variants={childVariants}
                className="text-xl text-black/70 font-sf-pro mb-6"
              >
                Simply upload a photo of any restaurant menu or manually enter
                dishes, and let Google Gemini AI do the heavy lifting. Our
                advanced AI analyzes each item to identify potential allergens,
                giving you detailed insights with confidence scores for every
                dish.
              </motion.p>
              <motion.p
                variants={childVariants}
                className="text-lg text-black/60 font-sf-pro"
              >
                No more guessing games or awkward questions – know what's safe
                before you order.
              </motion.p>
              <motion.div variants={childVariants} className="mt-6 flex gap-3">
                <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-[#56BECC] font-sf-pro font-medium text-sm">
                    Photo Upload
                  </span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-[#56BECC] font-sf-pro font-medium text-sm">
                    Manual Entry
                  </span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-[#56BECC] font-sf-pro font-medium text-sm">
                    Instant Results
                  </span>
                </div>
              </motion.div>
            </motion.div>
            <motion.figure
              className="lg:mr-auto"
              variants={fadeInLeft}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative">
                <div className="w-[500px] h-[600px] bg-white/50 backdrop-blur-sm rounded-3xl shadow-2xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50 flex items-center justify-center">
                  {/* Placeholder for menu scan image */}
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">📱</div>
                    <div className="text-black/50 font-sf-pro text-lg">
                      Menu Scan Preview
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-[#56BECC] text-white px-6 py-3 rounded-full font-sf-pro font-bold shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🚀 Powered by AI
                </motion.div>
              </div>
            </motion.figure>
          </div>
        </motion.div>

        {/* Divider with icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          className="flex justify-center"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
            <span className="text-4xl">🛡️</span>
          </div>
        </motion.div>

        {/* Second Hero Section - Personalized Allergy Management */}
        <motion.div
          className="flex items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="max-w-lg lg:mr-auto"
              variants={containerVariants}
            >
              <motion.div variants={childVariants} className="mb-4">
                <div className="bg-sky-400/50 backdrop-blur-sm rounded-full px-6 py-2 inline-block shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-black font-sf-pro font-semibold text-sm">
                    🎯 Personalized Protection
                  </span>
                </div>
              </motion.div>
              <motion.h2
                variants={childVariants}
                className="text-6xl font-bold text-black mb-6 font-sf-pro hover:text-sky-500 transition-colors duration-300"
              >
                Your Allergies, Your Safety
              </motion.h2>
              <motion.p
                variants={childVariants}
                className="text-xl text-black/70 font-sf-pro mb-6"
              >
                Build your personalized allergy profile with severity levels,
                and watch as Halo instantly matches detected allergens against
                your list. Color-coded severity tags make it easy to spot dishes
                you should avoid at a glance.
              </motion.p>
              <motion.p
                variants={childVariants}
                className="text-lg text-black/60 font-sf-pro"
              >
                Search through menu items, filter by allergen, and keep a
                complete history of analyzed menus – dining out has never been
                this safe.
              </motion.p>
              <motion.div variants={childVariants} className="mt-6 flex gap-3">
                <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-sky-500 font-sf-pro font-medium text-sm">
                    Smart Matching
                  </span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-sky-500 font-sf-pro font-medium text-sm">
                    Color Coding
                  </span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50">
                  <span className="text-sky-500 font-sf-pro font-medium text-sm">
                    Easy Search
                  </span>
                </div>
              </motion.div>
            </motion.div>
            <motion.figure
              className="lg:ml-auto"
              variants={fadeInRight}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="relative">
                <div className="w-[500px] h-[600px] bg-white/50 backdrop-blur-sm rounded-3xl shadow-2xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50 flex items-center justify-center">
                  {/* Placeholder for allergy matching image */}
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <div className="text-black/50 font-sf-pro text-lg">
                      Allergy Matching Preview
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-sky-500 text-white px-6 py-3 rounded-full font-sf-pro font-bold shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  ✨ Stay Protected
                </motion.div>
              </div>
            </motion.figure>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-2xl outline outline-1 outline-offset-[-0.0625rem] outline-white/50 p-12 max-w-3xl mx-auto">
            <h3 className="text-5xl font-bold text-black mb-4 font-sf-pro">
              Ready to dine with confidence?
            </h3>
            <p className="text-xl text-black/70 font-sf-pro mb-8">
              Join thousands of users who trust Halo to keep them safe while
              enjoying their favorite restaurants.
            </p>
            <motion.button
              className="bg-[#56BECC] hover:bg-[#56BECC]/80 text-white font-sf-pro font-bold text-lg px-8 py-4 rounded-xl shadow-xl transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HaloAboutGrid;
