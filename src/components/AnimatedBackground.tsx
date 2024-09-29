import React from "react";
import { animated, useSpring } from "react-spring";

export const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const bgProps = useSpring({
    from: { background: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)" },
    to: async (next) => {
      while (true) {
        await next({
          background: "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
        });
        await next({
          background: "linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)",
        });
        await next({
          background: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
        });
      }
    },
    config: { duration: 5000 },
  });

  return (
    <animated.div
      style={bgProps}
      className="flex items-center justify-center min-h-screen"
    >
      {children}
    </animated.div>
  );
};
