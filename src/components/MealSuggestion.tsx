// MealSuggestions.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReset } from "../hooks/useScrollReset";
import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

interface Macros {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  saturated_fats: number;
  sodium: number;
}

interface Meal {
  name: string;
  type: string;
  ingredients: Record<string, any>[];
  macros: Macros;
}

interface MealSuggestionsProps {
  meals: Meal[];
}

interface FeedbackOption {
  id: string;
  label: string;
}

const feedbackOptions: FeedbackOption[] = [
  { id: "ingredients", label: "Don't like ingredients" },
  { id: "nutrition", label: "Don't like nutritional values" },
  { id: "cuisine", label: "Change cuisine" },
  { id: "meal", label: "Change entire meal" },
];

const MealSuggestions: React.FC<MealSuggestionsProps> = ({ meals }) => {
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [isOverviewMode, setIsOverviewMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const nextMeal = () => {
    setCurrentMealIndex((prevIndex) => (prevIndex + 1) % meals.length);
    setSelectedFeedback([]);
  };

  const prevMeal = () => {
    setCurrentMealIndex((prevIndex) =>
      prevIndex === 0 ? meals.length - 1 : prevIndex - 1
    );
    setSelectedFeedback([]);
  };

  const toggleFeedback = (id: string) => {
    setSelectedFeedback((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitFeedback = () => {
    // TODO: Implement feedback submission logic
    console.log("Feedback submitted:", selectedFeedback);
    setSelectedFeedback([]);
  };

  const selectMealFromOverview = (index: number) => {
    setCurrentMealIndex(index);
    setIsOverviewMode(false);
  };

  const finalizeMealPlan = async () => {
    if (!user) {
      console.error("User not logged in? " + user);
      return;
    }
    const real = "https://927e-38-13-9-210.ngrok-free.app/finalize_plan";
    const local = `http://localhost:8000/finalize_plan`;
    try {
      const chain = new RemoteRunnable({
        url: local,
      });
      setIsLoading(true);

      await chain.invoke({
        meal_queries: meals,
        userId: user?.id,
      });

      // Set localStorage state
      localStorage.setItem("mealsProcessing", "true");

      navigate("/nutrition/meal-plan");
    } catch (err) {
      console.error("Error finalizing meal plan:", err);
      // Show error message to user
      setError("Failed to finalize meal plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentMeal = meals[currentMealIndex];
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="px-4 py-6 min-h-screen">
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-4">
          {!isOverviewMode && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsOverviewMode(true)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Back to all meals"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </motion.button>
          )}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
              {isOverviewMode ? "Plan Overview" : "Meal Preview"}
            </h2>
            <p className="text-sm text-gray-400 italic text-center">
              Note: This is a preview, your final plan will be created after you
              decide everything looks good.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isOverviewMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meals.map((meal, index) => (
                <motion.div
                  key={`overview-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => selectMealFromOverview(index)}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 
                         rounded-xl shadow-lg p-4 cursor-pointer 
                         hover:shadow-xl transition-all duration-200 
                         hover:scale-105"
                >
                  <div className="border-b border-gray-700 pb-2 mb-3">
                    <h3 className="text-lg font-semibold text-green-400">
                      {meal.name}
                    </h3>
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                      {meal.type}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    <div className="mb-2">
                      <span className="text-green-400">Calories:</span>{" "}
                      {meal.macros.calories} kcal
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span>P: {meal.macros.protein}g</span>
                      <span>C: {meal.macros.carbs}g</span>
                      <span>F: {meal.macros.fats}g</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-3 mt-8 pb-8"
            >
              <button
                onClick={finalizeMealPlan}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 
                         hover:from-green-600 hover:to-green-700 text-white 
                         font-semibold py-4 px-8 rounded-xl transition-all 
                         duration-200 shadow-lg hover:shadow-xl 
                         shadow-green-500/20 text-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Lock These In 🔒"
                )}
              </button>
              <span className="text-gray-400 text-sm max-w-md text-center">
                Happy with your selections? Click above to finalize meals and
                start your journey into nutritional wellness.
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <div className="relative w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMealIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 mb-4"
              >
                {/* Meal Header */}
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 text-green-400 tracking-wide">
                    {currentMeal.name}
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-300">
                    {currentMeal.type}
                  </span>
                </div>

                {/* Ingredients Section */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-white flex items-center gap-2">
                    <span className="text-green-400">•</span>
                    Ingredients
                    <div className="relative group inline-flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block touch-device:group-active:block">
                        <div className="bg-gray-800 text-gray-200 text-xs rounded py-2 px-3 w-64 shadow-lg">
                          <p>
                            Ingredients are listed with their FDC ID (USDA Food
                            Data Central identifier) which helps track precise
                            nutritional information for each item.
                          </p>
                          <div className="absolute w-2 h-2 bg-gray-800 rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
                        </div>
                      </div>
                    </div>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentMeal.ingredients.map((ingredient, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col px-3 py-2 bg-gray-700/30 rounded-lg text-gray-300 text-sm"
                      >
                        {ingredient.fdcId && (
                          <span className="text-xs text-gray-400 mb-1">
                            FDC ID: {ingredient.fdcId}
                          </span>
                        )}
                        <span>
                          {ingredient.description
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (word: string) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Macros Section */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-white flex items-center gap-2">
                    <span className="text-green-400">•</span>
                    Nutritional Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(currentMeal.macros).map(([key, value]) => (
                      <div
                        key={key}
                        className="bg-gray-700/30 p-3 rounded-lg text-center"
                      >
                        <div className="text-gray-400 text-sm capitalize mb-1">
                          {key.replace("_", " ")}
                        </div>
                        <div className="text-white font-semibold">
                          {value}
                          <span className="text-xs ml-1 text-gray-400">
                            {key === "calories"
                              ? "kcal"
                              : key === "sodium"
                              ? "mg"
                              : "g"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-6 border-t border-gray-700 pt-4">
                  <h4 className="font-medium mb-3 text-white flex items-center gap-2">
                    <span className="text-green-400">•</span>
                    Feedback
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {feedbackOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => toggleFeedback(option.id)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          selectedFeedback.includes(option.id)
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {selectedFeedback.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleSubmitFeedback}
                      className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 
                               hover:from-green-600 hover:to-green-700 text-white font-bold 
                               py-3 px-4 rounded-lg transition-all duration-200 
                               shadow-lg hover:shadow-xl shadow-green-500/20"
                    >
                      Submit Feedback
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex justify-between mt-6 gap-4">
              <button
                onClick={prevMeal}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 
                         hover:from-blue-600 hover:to-blue-700 text-white font-bold 
                         py-3 px-4 rounded-lg transition-all duration-200 
                         shadow-lg hover:shadow-xl shadow-blue-500/20"
              >
                Previous Meal
              </button>
              <button
                onClick={nextMeal}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 
                         hover:from-blue-600 hover:to-blue-700 text-white font-bold 
                         py-3 px-4 rounded-lg transition-all duration-200 
                         shadow-lg hover:shadow-xl shadow-blue-500/20"
              >
                Next Meal
              </button>
            </div>

            <div className="text-center mt-4 text-gray-400 font-medium">
              Meal {currentMealIndex + 1} of {meals.length}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealSuggestions;
