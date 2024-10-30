import React from "react";
import { animated, useSpring } from "react-spring";

export const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const waveProps = useSpring({
    from: { transform: "translateX(0%)" },
    to: { transform: "translateX(-50%)" },
    config: { duration: 10000, loop: true },
  });

  return (
    <div className="relative flex flex-col h-full w-full bg-black overflow-hidden">
      <animated.div
        style={waveProps}
        className="absolute inset-0 w-[200%] h-full"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,90 600,0 900,90 L900,120 L0,120 Z"
            fill="url(#gradient1)"
            opacity="0.3"
          />
          <path
            d="M0,0 C300,60 600,120 900,60 L900,120 L0,120 Z"
            fill="url(#gradient2)"
            opacity="0.3"
          />
          <path
            d="M0,0 C300,30 600,60 900,30 L900,120 L0,120 Z"
            fill="url(#gradient3)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0077BE" />
              <stop offset="100%" stopColor="#00A6ED" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00873E" />
              <stop offset="100%" stopColor="#3CB371" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F0F0F0" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>
      </animated.div>
      <div className="relative z-10 flex-grow">{children}</div>
    </div>
  );
};
