import React from "react";

interface ConfidenceTagProps {
  confidence: number;
  text: string;
}

const ConfidenceTag = ({ confidence, text }: ConfidenceTagProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 7.5) {
      return "bg-[rgba(255,80,80,0.44)]"; // Green
    } else if (confidence > 2.5) {
      return "bg-[rgba(255,170,80,0.44)]"; // Orange
    } else {
      return "bg-[rgba(183,255,83,0.44)]"; // Red
    }
  };

  const getDotColor = (confidence: number) => {
    if (confidence > 7.5) {
      return "bg-red-500";
    } else if (confidence > 2.5) {
      return "bg-orange-400";
    } else {
      return "bg-green-400";
    }
  };

  return (
    <div
      className={`h-[1.125rem] w-[5rem] rounded-full ${getConfidenceColor(
        confidence
      )} flex items-center justify-center gap-1`}
    >
      <div className={`w-2 h-2 rounded-full ${getDotColor(confidence)}`} />
      <span className="text-sm text-black font-light font-sf-pro">{text}</span>
    </div>
  );
};

export default ConfidenceTag;
