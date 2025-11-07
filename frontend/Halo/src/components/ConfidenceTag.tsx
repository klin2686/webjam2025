interface ConfidenceTagProps {
  confidence: number;
  text: string;
}

const ConfidenceTag = ({ confidence, text }: ConfidenceTagProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 7.5) {
      return "bg-[rgba(183,255,83,0.44)]"; // Green
    } else if (confidence > 2.5) {
      return "bg-[rgba(255,170,80,0.44)]"; // Orange
    } else {
      return "bg-[rgba(255,80,80,0.44)]"; // Red
    }
  };

  const getDotColor = (confidence: number) => {
    if (confidence > 7.5) {
      return "bg-green-50";
    } else if (confidence > 2.5) {
      return "bg-orange-50";
    } else {
      return "bg-red-50";
    }
  };

  return (
    <div
      className={`h-[1.225rem] w-[5rem] rounded-full ${getConfidenceColor(
        confidence
      )} flex items-center justify-center`}
    >
      <div
        className={`h-[0.975rem] w-[4.700rem] rounded-full ${getDotColor(
          confidence
        )} flex items-center justify-center`}
      >
        <span className="text-sm text-black font-light font-sf-pro">
          {text}
        </span>
      </div>
    </div>
  );
};

export default ConfidenceTag;
