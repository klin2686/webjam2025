const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm border border-white/50 p-12 flex flex-col items-center gap-6 animate-fadeIn">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-8 border-[#56BECC80]/30 border-t-[#56BECC] rounded-full animate-spin"></div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl font-sf-pro font-bold text-black">
            Processing your menu
          </h3>
          <p className="text-sm font-sf-pro text-black/60">
            Analyzing ingredients and allergens
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;