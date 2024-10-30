import React, { useState, useEffect } from "react";
import { RemoteRunnable } from "@langchain/core/runnables/remote";
import MealSuggestions from "../MealSuggestion";
import { motion, AnimatePresence } from "framer-motion";
import { NutritionProfile } from "./NutritionProfile";
import { ActionButtons } from "./ActionButtons";
import { MacroDescriptions } from "./MacroDescriptions";

interface NutritionResultsProps {
  nutritionData: any;
  startOver: () => void;
}

interface Meal {
  name: string;
  type: string;
  ingredients: Record<string, any>[];
  macros: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    saturated_fats: number;
    sodium: number;
  };
}

const STORAGE_KEY = "temporaryMealSuggestion";

const NutritionResults: React.FC<NutritionResultsProps> = ({
  nutritionData,
  startOver,
}) => {
  const [mealSuggestions, setMealSuggestions] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!nutritionData) {
    return <div>No nutrition data available.</div>;
  }

  const { generated_macros } = nutritionData;

  const mealQueryPrompt = `
    For the given macros, cuisine and diet preferences, create 5 dish templates that include:
    - The target macro-nutrients for each dish to adhere to
    - An inviting and delightful name that describes the meal without overselling it
    - Some ingredients that would be typical in the dish, these should be USDA ingredients
    - A breakfast, lunch, dinner, dish, and two snack dishes

    Ideally the sum of macro-nutrients for the meal adds up to the total macro-nutrients given.

    Values:
    Calories ${generated_macros.calories} kcal
    Protein ${generated_macros.protein}g
    Fats ${generated_macros.fats}g
    Carbs ${generated_macros.carbohydrates}g
    Max Saturated Fats ${generated_macros.saturated_fats}g
    Max Sodium ${generated_macros.sodium}mg


    Preferences:
    - Dairy free
    - Cajun, American, & Chinese are preferred cuisine types.
    - Difficulty level: intermediate
    - Max Cooking time: 30 minutes

    Return your results as a a list of JSON objects that include these details for the dish:
    - name
    - type (breakfast, lunch, dinner, snack1, snack2)
    - ingredients (possible ingredients, **don't include amounts and be specific, 'red bell peppers' instead of 'bell pepper', also don't include seasonings or non calorie bearing items, only USDA items** )
    - macros (calories, protein, fats, carbs, saturated_fats, sodium)
    - cooking time (in minutes)
    - difficulty (easy, intermediate, hard)

  `;

  const handleCreateMealQueries = async () => {
    setLoading(true);
    setError(null);
    //TODO add userId to the query for threading
    const deviceURL = `http://localhost:8000/query/invoke`; // `https://11ae-38-13-9-210.ngrok-free.app/query/`;
    try {
      // const chain = new RemoteRunnable({
      //   url: deviceURL,
      //   fetchRequestOptions: {
      //     timeout: 240000,
      //   },
      // });
      // const result = await chain.invoke({ query_prompt: mealQueryPrompt });

      const controller = new AbortController();
      const signal = controller.signal;

      const timeoutId = setTimeout(() => controller.abort(), 240000);

      await fetch(deviceURL, {
        method: "POST",
        signal,
        body: JSON.stringify({ input: { query_prompt: mealQueryPrompt } }),
      })
        .then(async (response) => {
          clearTimeout(timeoutId);
          const { output } = await response.json();
          console.log(output.meal_queries[0]);
          setMealSuggestions(output.meal_queries);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(output.meal_queries)
          );

          // Handle response
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.log(error);
          // Handle timeout error
        });
      // const output = (result as any).meal_queries;
      // console.log(output);
      // setMealSuggestions(output.dishes);
    } catch (err) {
      console.error("Error querying LLM:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedMeal = localStorage.getItem(STORAGE_KEY);
    if (savedMeal) {
      setMealSuggestions(JSON.parse(savedMeal));
    }
  }, [setMealSuggestions]);

  return (
    <AnimatePresence mode="wait">
      <div className="container mx-auto pb-8  max-w-7xl">
        {mealSuggestions.length > 0 ? (
          <motion.div
            key="meal-suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <MealSuggestions meals={mealSuggestions} />
          </motion.div>
        ) : (
          <motion.div
            key="nutrition-profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <NutritionProfile generated_macros={generated_macros} />
            <ActionButtons
              loading={loading}
              onCreateMealPlan={handleCreateMealQueries}
              onStartOver={startOver}
              error={error}
            />
            <MacroDescriptions generated_macros={generated_macros} />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default NutritionResults;
