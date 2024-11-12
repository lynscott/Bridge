// src/components/MealPlanView.tsx

import React, { useEffect, useState } from "react";
import { useMealPlanRealtime } from "../hooks/useMealPlan";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { RecipeView, RecipeCard } from "./RecipeView";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Props {
  mealPlanId?: string; // Made optional
}

type ViewMode = "overview" | "recipe";

export const MealPlanView: React.FC<Props> = ({
  mealPlanId: propMealPlanId,
}) => {
  const [mealPlanId, setMealPlanId] = useState<string | undefined>(
    propMealPlanId
  );
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);

  const mealPlanQuery = useMealPlanRealtime(mealPlanId || "");
  const {
    mealPlan,
    loading: mealPlanLoading,
    error: mealPlanError,
  } = mealPlanId
    ? mealPlanQuery
    : { mealPlan: null, loading: false, error: null };

  useEffect(() => {
    const fetchLatestMealPlan = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setFetchError("User not authenticated");
          return;
        }

        // If no stored ID, fetch from Supabase
        const { data: mealPlanData, error } = await supabase
          .from("meal_plans")
          .select("id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (error) {
          if (error.code === "PGRST116") {
            setFetchError("No meal plan found");
          } else {
            setFetchError(error.message);
          }
          return;
        }

        if (mealPlanData) {
          setMealPlanId(mealPlanData.id);
          localStorage.setItem("mealPlanId", mealPlanData.id);
          // TODO Activate when ready
          localStorage.removeItem("mealsProcessing");
          // localStorage.removeItem("mealPlanId");
        }
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    };

    if (!propMealPlanId && !mealPlanId) {
      fetchLatestMealPlan();
    }
  }, [propMealPlanId]);

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-24 h-24 mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-green-500"
          strokeWidth="2"
        >
          <path d="M15 11H9V7c0-1.7 1.3-3 3-3s3 1.3 3 3v4z" />
          <path d="M12 14v4" />
          <path d="M6 21h12" />
          <path d="M9 21v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3" />
        </svg>
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl text-green-500 font-medium text-center"
      >
        {!mealPlanId
          ? "Locating your meal plan..."
          : "Preparing your meal plan..."}
      </motion.div>
      <div className="mt-4 text-gray-400 text-center max-w-md">
        We're putting together your personalized recipes and nutritional
        information.
      </div>
    </div>
  );

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md">
          <h3 className="text-red-500 font-medium mb-2">
            Error Finding Meal Plan
          </h3>
          <p className="text-gray-400">{fetchError}</p>
        </div>
      </div>
    );
  }

  if (!mealPlanId || mealPlanLoading) {
    return <LoadingAnimation />;
  }

  if (mealPlanError && !mealPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md">
          <h3 className="text-red-500 font-medium mb-2">
            Error Loading Meal Plan
          </h3>
          <p className="text-gray-400">{mealPlanError.message}</p>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-gray-500">No meal plan found</div>
      </div>
    );
  } else {
    console.log(mealPlan);
  }

  const extract = (meal: any, key: string) => {
    console.log(meal.meal);
    return meal.meal[key];
  };

  return (
    <AnimatePresence mode="wait">
      {viewMode === "overview" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="max-w-6xl mx-auto p-6 space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {mealPlan.name}
            </h1>
            <p className="text-gray-400">{mealPlan.description}</p>
          </div>

          {/* Daily Totals */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Daily Nutrition Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(mealPlan.total_macros).map(
                ([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-700/50 rounded-xl p-4"
                  >
                    <div className="text-gray-400 text-sm capitalize">
                      {key}
                    </div>
                    <div className="text-white font-bold text-lg">
                      {typeof value === "number" ? value.toFixed(1) : value}
                      <span className="text-sm text-gray-400 ml-1">
                        {key === "calories"
                          ? "kcal"
                          : key === "sodium"
                          ? "mg"
                          : "g"}
                      </span>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlan.meals.map((recipe, index) => (
              <RecipeCard
                key={index}
                setSelectedRecipeIndex={setSelectedRecipeIndex}
                setViewMode={setViewMode}
                // @ts-ignore
                recipe={recipe.meal}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="p-6">
          <RecipeView
            //  @ts-ignore TODO: Fix this type issue
            recipe={mealPlan.meals[selectedRecipeIndex].meal}
            onBack={() => setViewMode("overview")}
          />

          {/* Recipe Navigation */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-800/90 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-700/50">
            <button
              onClick={() =>
                setSelectedRecipeIndex((prev) =>
                  prev === 0 ? mealPlan.meals.length - 1 : prev - 1
                )
              }
              className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <IoChevronBack className="w-5 h-5" />
            </button>
            <span className="text-gray-400">
              Recipe {selectedRecipeIndex + 1} of {mealPlan.meals.length}
            </span>
            <button
              onClick={() =>
                setSelectedRecipeIndex((prev) =>
                  prev === mealPlan.meals.length - 1 ? 0 : prev + 1
                )
              }
              className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <IoChevronForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MealPlanView;
