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
    <>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="goal" className="sr-only">
            Nutritional Health Goal
          </label>
          <select
            id="goal"
            {...register("goal")}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          >
            <option value="">Select your goal</option>
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="previous_training" className="sr-only">
            Previous Training Experience
          </label>
          <select
            id="previous_training"
            {...register("previous_training")}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          >
            <option value="">Select your experience</option>
            {previousTrainingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="neat" className="sr-only">
            Activity Level (Non-exercise)
          </label>
          <select
            id="neat"
            {...register("neat")}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          >
            <option value="">Select your activity level</option>
            {neatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {errors.goal && (
        <p className="text-red-500 text-xs italic">{errors.goal.message}</p>
      )}
      {errors.previous_training && (
        <p className="text-red-500 text-xs italic">
          {errors.previous_training.message}
        </p>
      )}
      {errors.neat && (
        <p className="text-red-500 text-xs italic">{errors.neat.message}</p>
      )}
    </>
  );
};

export default Step2Form;
