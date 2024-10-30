// NutritionProfile.tsx
import React from "react";
import { motion } from "framer-motion";

interface NutritionProfileProps {
  generated_macros: {
    tbw: number;
    calories: number;
    protein: number;
    fats: number;
    carbohydrates: number;
    saturated_fats: number;
    sodium: number;
  };
}

export const NutritionProfile: React.FC<NutritionProfileProps> = ({
  generated_macros,
}) => (
  <div className="backdrop-blur-xl bg-gray-900/30 rounded-3xl p-4 sm:p-8 shadow-2xl border border-gray-700/30">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
      Daily Nutrition Profile
    </h2>
    <div className="mb-4 sm:mb-8">
      <p className="text-lg sm:text-xl text-center text-gray-300">
        Target Body Weight:{" "}
        <span className="font-bold text-white">{generated_macros.tbw} lbs</span>
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
      <MacroCard
        label="Calories"
        value={`${generated_macros.calories}`}
        unit="kcal"
        gradient="from-orange-400 to-pink-400"
      />
      <MacroCard
        label="Protein"
        value={`${generated_macros.protein}`}
        unit="g"
        gradient="from-blue-400 to-cyan-400"
      />
      <MacroCard
        label="Fats"
        value={`${generated_macros.fats}`}
        unit="g"
        gradient="from-yellow-400 to-orange-400"
      />
      <MacroCard
        label="Carbs"
        value={`${generated_macros.carbohydrates}`}
        unit="g"
        gradient="from-green-400 to-emerald-400"
      />
      <MacroCard
        label="Max Saturated Fats"
        value={`${Math.round(generated_macros.saturated_fats)}`}
        unit="g"
        gradient="from-red-400 to-pink-400"
      />
      <MacroCard
        label="Max Sodium"
        value={`${Math.round(generated_macros.sodium)}`}
        unit="mg"
        gradient="from-purple-400 to-indigo-400"
      />
    </div>
  </div>
);

interface MacroCardProps {
  label: string;
  value: string;
  unit: string;
  gradient: string;
}

const MacroCard: React.FC<MacroCardProps> = ({
  label,
  value,
  unit,
  gradient,
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800/40 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-gray-700/30"
  >
    <p className="text-sm text-gray-400 mb-1 truncate">{label}</p>
    <div className="flex items-baseline gap-1">
      <p
        className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
      >
        {value}
      </p>
      <p className="text-base sm:text-lg text-gray-500">{unit}</p>
    </div>
  </motion.div>
);
