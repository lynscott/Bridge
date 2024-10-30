import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { NutritionFormInputs } from "./FormSchema";

const goalOptions = [
  { name: "Weight Gain", value: "weight_gain" },
  { name: "Weight Loss", value: "weight_loss" },
  { name: "Just healthier eating", value: "healthy_eating" },
];

const previousTrainingOptions = [
  { name: "Newbie", value: "new" },
  { name: "Intermediate", value: "intermediate" },
  { name: "Advanced", value: "advanced" },
];

const neatOptions = [
  { name: "Very Low", value: "very_low" },
  { name: "Low", value: "low" },
  { name: "Moderate", value: "moderate" },
  { name: "High", value: "high" },
];

interface Step2FormProps {
  register: UseFormRegister<NutritionFormInputs>;
  errors: FieldErrors<NutritionFormInputs>;
}

const Step2Form: React.FC<Step2FormProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
        <label
          htmlFor="goal"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Nutritional Health Goal
        </label>
        <select
          id="goal"
          {...register("goal")}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
        >
          <option value="">Select your goal</option>
          {goalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.goal && (
          <p className="text-red-400 text-sm mt-2">{errors.goal.message}</p>
        )}
      </div>

      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
        <label
          htmlFor="previous_training"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Previous Training Experience
        </label>
        <select
          id="previous_training"
          {...register("previous_training")}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
        >
          <option value="">Select your experience</option>
          {previousTrainingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.previous_training && (
          <p className="text-red-400 text-sm mt-2">
            {errors.previous_training.message}
          </p>
        )}
      </div>

      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
        <label
          htmlFor="neat"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Activity Level (Non-exercise)
        </label>
        <select
          id="neat"
          {...register("neat")}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
        >
          <option value="">Select your activity level</option>
          {neatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {errors.neat && (
          <p className="text-red-400 text-sm mt-2">{errors.neat.message}</p>
        )}
      </div>

      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Weekly Exercise Hours
        </label>
        <input
          id="exercise_hours"
          type="number"
          {...register("exercise_hours", { valueAsNumber: true })}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
          placeholder="Hours per week"
        />
        {errors.exercise_hours && (
          <p className="text-red-400 text-sm mt-2">
            {errors.exercise_hours.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step2Form;
