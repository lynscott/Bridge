import React from "react";

const AnimatedGradientBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="relative overflow-hidden rounded-lg">
    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 animate-gradient-x">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-wave-pattern"></div>
      </div>
    </div>
    <div className="relative z-10">{children}</div>
  </div>
);

export { AnimatedGradientBackground };
