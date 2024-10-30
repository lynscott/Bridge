// ActionButtons.tsx
import React from "react";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  loading: boolean;
  onCreateMealPlan: () => void;
  onStartOver: () => void;
  error: string | null;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  onCreateMealPlan,
  onStartOver,
  error,
}) => (
  <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/30 my-8">
    <h3 className="text-xl text-center font-semibold mb-6 text-gray-200">
      Are you satisfied with these nutritional values?
    </h3>
    <div className="flex flex-col sm:flex-row gap-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreateMealPlan}
        disabled={loading}
        className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl 
          disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/20 transition-all duration-300"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
            <span>Creating meal plan...</span>
          </div>
        ) : (
          "Yes, create meal plan"
        )}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStartOver}
        className="flex-1 bg-gradient-to-r from-red-400 to-rose-500 text-white font-semibold py-3 px-6 rounded-xl
          shadow-lg hover:shadow-red-500/20 transition-all duration-300"
      >
        No, start over
      </motion.button>
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 text-red-400 text-center bg-red-500/10 rounded-lg p-3"
      >
        {error}
      </motion.p>
    )}
  </div>
);
