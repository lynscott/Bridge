import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring, config, useTrail } from "react-spring";
import { useGesture } from "react-use-gesture";
import logo from "../assets/bridge.webp";
import { verifyToken } from "../lib/supabaseClient";

const AnimatedText: React.FC = () => {
  const letters = "BRIDGE".split("");

  const trail = useTrail(letters.length, {
    from: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      color: "#4FD1C5", // Lighter teal/green
    },
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      color: "#2C7A7B", // Darker teal
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 20,
    },
    delay: 1000,
  });

  return (
    <div className="flex justify-center mt-6 overflow-hidden">
      {trail.map((props, index) => (
        <animated.span
          key={index}
          style={{
            ...props,
            transform: props.y.to(
              (y) => `translate3d(0,${y}px,0) scale(${props.scale})`
            ),
            textShadow: props.opacity.to(
              (o) => `0 0 10px rgba(96, 165, 250, ${o})`
            ),
          }}
          className="text-4xl font-bold mx-[2px] font-sans"
        >
          {letters[index]}
        </animated.span>
      ))}
    </div>
  );
};

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const introProps = useSpring({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 280, friction: 60 },
  });

  const exitProps = useSpring({
    opacity: isExiting ? 0 : 1,
    transform: isExiting
      ? "scale(0.5) rotate(180deg)"
      : "scale(1) rotate(0deg)",
    config: config.gentle,
  });

  const [{ rotate }, setRotate] = useSpring(() => ({ rotate: 0 }));

  const bind = useGesture({
    onMouseDown: () =>
      setRotate({ rotate: rotate.get() + 360, config: config.wobbly }),
    onTouchStart: () =>
      setRotate({ rotate: rotate.get() + 360, config: config.wobbly }),
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const isValid = await verifyToken();
        if (isValid) {
          navigate("/home");
        } else {
          setIsExiting(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsExiting(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    };

    const timer = setTimeout(checkToken, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-900">
      <animated.div style={{ ...introProps, ...exitProps }}>
        <div className="relative flex flex-col items-center">
          <animated.div
            {...bind()}
            style={{
              transform: rotate.to((r) => `rotate(${r}deg)`),
              cursor: "pointer",
            }}
            className="bg-black rounded-full p-2 shadow-2xl transition-shadow hover:shadow-3xl relative z-10"
          >
            <animated.div
              className="w-48 h-48 rounded-full overflow-hidden"
              style={introProps}
            >
              <img
                src={logo}
                alt="Trufit Logo"
                className="w-full h-full object-cover"
              />
            </animated.div>
          </animated.div>

          <AnimatedText />
        </div>
      </animated.div>
    </div>
  );
};

export default SplashScreen;
