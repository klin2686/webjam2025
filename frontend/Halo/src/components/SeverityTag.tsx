import React from "react";

interface SeverityTagProps {
  severity: string;
  text: string;
}

const SeverityTag = ({ severity, text }: SeverityTagProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-[rgba(255,80,80,0.44)]";
      case "moderate":
        return "bg-[rgba(255,170,80,0.44)]";
      case "mild":
        return "bg-[rgba(183,255,83,0.44)]";
      default:
        return "bg-gray-300/44";
    }
  };

  return (
    <div
      className={`h-[1.125rem] w-[5rem] rounded-full ${getSeverityColor(
        severity
      )} flex items-center justify-center gap-[0.25rem]`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          severity === "severe"
            ? "bg-red-500"
            : severity === "moderate"
            ? "bg-orange-400"
            : "bg-green-400"
        }`}
      />
      <span className="text-sm text-black font-light font-sf-pro">{text}</span>
    </div>
  );
};

export default SeverityTag;
