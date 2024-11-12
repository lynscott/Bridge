// src/components/RecipeView.tsx
import { motion } from "framer-motion";
import {
  IoChevronBack,
  IoTimeOutline,
  IoRestaurant,
  IoNutrition,
} from "react-icons/io5";
import { Recipe } from "../types/nutrition";

export const RecipeView = ({
  recipe,
  onBack,
}: {
  recipe: Recipe;
  onBack: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="max-w-4xl mx-auto"
  >
    <button
      onClick={onBack}
      className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 px-4 py-2 rounded-lg hover:bg-gray-800/30"
    >
      <motion.div
        whileHover={{ x: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <IoChevronBack className="w-5 h-5" />
      </motion.div>
      <span>Back to Overview</span>
    </button>

    <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-800/50 rounded-2xl p-6 mb-3 backdrop-blur-sm border border-gray-700/50 shadow-xl">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4">
          {recipe.name}
        </h2>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-full text-sm text-gray-300 flex items-center gap-2">
            <IoRestaurant className="w-4 h-4" />
            {recipe.type}
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-full text-sm text-gray-300 flex items-center gap-2">
            <IoTimeOutline className="w-4 h-4" />
            {recipe.cooking_time} mins
          </span>
        </div>
        <p className="text-gray-300 italic text-lg leading-relaxed">
          {recipe.description}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <IoNutrition className="w-5 h-5 text-green-500" />
          <h3 className="text-xl font-semibold text-white">
            Nutritional Information
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(recipe.total_macros).map(([key, value]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-700/30 to-gray-700/20 rounded-xl p-4 border border-gray-600/20 hover:border-green-500/20 transition-colors shadow-lg"
            >
              <div className="text-gray-400 text-sm capitalize mb-1">{key}</div>
              <div className="text-white font-bold text-lg">
                {typeof value === "number" ? value.toFixed(1) : value}
                <span className="text-sm text-gray-400 ml-1">
                  {key === "calories" ? "kcal" : key === "sodium" ? "mg" : "g"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <IoRestaurant className="w-5 h-5 text-green-500" />
          </span>
          Ingredients
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipe.ingredients.map((ingredient, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-700/30 to-gray-700/20 rounded-xl p-4 border border-gray-600/20 hover:border-green-500/20 transition-all shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-medium mb-1">
                    {ingredient["ingredient"].name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {ingredient.amount} {ingredient.unit}
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-md">
                  FDC ID: {ingredient["ingredient"].fdc_id}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
          Instructions
        </h3>
        <ol className="space-y-6">
          {recipe.instructions.map((instruction, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="flex gap-4 group"
            >
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center text-green-400 font-medium group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all">
                {idx + 1}
              </span>
              <p className="text-gray-300 pt-1 leading-relaxed">
                {instruction}
              </p>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </div>
  </motion.div>
);

export const RecipeCard = ({
  recipe,
  index,
  setSelectedRecipeIndex,
  setViewMode,
}: {
  recipe: Recipe;
  index: number;
  setSelectedRecipeIndex: (idx: number) => undefined;
  setViewMode: (mode: string) => undefined;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className="group bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/30 transition-all cursor-pointer shadow-lg hover:shadow-xl"
    onClick={() => {
      setSelectedRecipeIndex(index);
      setViewMode("recipe");
    }}
  >
    <div className="mb-4">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-green-400 group-hover:to-green-600 transition-all duration-300 mb-3">
        {recipe.name}
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-3 py-1 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-full text-sm text-gray-300 flex items-center gap-2">
          <IoRestaurant className="w-4 h-4" />
          {recipe.type}
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-full text-sm text-gray-300 flex items-center gap-2">
          <IoTimeOutline className="w-4 h-4" />
          {recipe.cooking_time} mins
        </span>
      </div>
    </div>

    <p className="text-gray-400 mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors">
      {recipe.description}
    </p>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-700/20 rounded-lg p-3 group-hover:bg-gray-700/30 transition-colors">
        <div className="text-gray-400 text-sm mb-1">Calories</div>
        <div className="text-white font-bold">
          {recipe.total_macros.calories.toFixed(0)}
          <span className="text-sm text-gray-400 ml-1">kcal</span>
        </div>
      </div>
      <div className="bg-gray-700/20 rounded-lg p-3 group-hover:bg-gray-700/30 transition-colors">
        <div className="text-gray-400 text-sm mb-1">Protein</div>
        <div className="text-white font-bold">
          {recipe.total_macros.protein.toFixed(1)}
          <span className="text-sm text-gray-400 ml-1">g</span>
        </div>
      </div>
    </div>
  </motion.div>
);
