// MacroInfoCard.tsx
import React from "react";

interface MacroInfoProps {
  title: string;
  description: string;
}

export const MacroInfo: React.FC<MacroInfoProps> = ({ title, description }) => (
  <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/30">
    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-gray-300/90 mt-2 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);
