import { animated, useSpring } from "react-spring";
import { useMemo } from "react";

const loadingPhrases = [
  "No pain, no gain...",
  "Building strength...",
  "Pumping iron...",
  "Feel the burn...",
  "One more rep...",
  "Getting stronger...",
  "Beast mode activated...",
  "Raising the bar...",
  "Making gains...",
  "Crushing goals...",
  "Power loading...",
  "Training in progress...",
  "Level up incoming...",
  "Maximum effort...",
  "Strength rising...",
];

interface LoadingScreenProps {
  fullScreen?: boolean;
}
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fullScreen = true,
}) => {
  const spinnerAnimation = useSpring({
    from: { rotate: 0 },
    to: { rotate: 360 },
    loop: true,
    config: { duration: 1000 },
  });

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300 },
  });

  const randomPhrase = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
    return loadingPhrases[randomIndex];
  }, []);

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-95"
    : "flex items-center justify-center h-full w-full";

  return (
    <animated.div style={fadeIn} className={containerClasses}>
      <div className="flex flex-col items-center">
        <animated.div
          style={{
            ...spinnerAnimation,
            width: "4rem",
            height: "4rem",
          }}
          className="border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-blue-400 font-semibold text-lg">
          {randomPhrase}
        </p>
      </div>
    </animated.div>
  );
};
