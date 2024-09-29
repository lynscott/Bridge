import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring, config } from "react-spring";
import { useGesture } from "react-use-gesture";
import logo from "../assets/Trufit.webp";
import { AnimatedBackground } from "../components/AnimatedBackground";

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  // Intro animation: logo drops in and bounces
  const introProps = useSpring({
    from: { opacity: 0, transform: "translateY(-100vh) scale(0.5)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
    config: { tension: 180, friction: 12 },
  });

  // Exit animation
  const exitProps = useSpring({
    opacity: isExiting ? 0 : 1,
    transform: isExiting
      ? "scale(0.5) rotate(180deg)"
      : "scale(1) rotate(0deg)",
    config: config.gentle,
  });

  // Interactive spin animation
  const [{ rotate }, setRotate] = useSpring(() => ({ rotate: 0 }));

  // Gesture handling for spin on click/touch
  const bind = useGesture({
    onMouseDown: () =>
      setRotate({ rotate: rotate.get() + 360, config: config.wobbly }),
    onTouchStart: () =>
      setRotate({ rotate: rotate.get() + 360, config: config.wobbly }),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 4000);
    const navigationTimer = setTimeout(() => {
      navigate("/login");
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <AnimatedBackground>
      <animated.div style={{ ...introProps, ...exitProps }}>
        <animated.div
          {...bind()}
          style={{
            transform: rotate.to((r) => `rotate(${r}deg)`),
            cursor: "pointer",
          }}
          className="bg-white rounded-full p-2 shadow-2xl transition-shadow hover:shadow-3xl"
        >
          <div className="w-48 h-48 rounded-full overflow-hidden">
            <img
              src={logo}
              alt="Trufit Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </animated.div>
      </animated.div>
    </AnimatedBackground>
  );
};

export default SplashScreen;
