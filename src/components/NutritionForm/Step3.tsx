import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";
import { NutritionFormInputs } from "./FormSchema";

interface Step3FormProps {
  register: UseFormRegister<NutritionFormInputs>;
  errors: FieldErrors<NutritionFormInputs>;
  control: Control<NutritionFormInputs>;
}

const Step3Form: React.FC<Step3FormProps> = ({ register, errors, control }) => {
  const getDietaryPreference = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue < 0.5) return "Carb-leaning";
    if (numValue > 0.5) return "Fat-leaning";
    return "Balanced";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="preference"
          className="block text-sm font-medium text-gray-200"
        >
          Dietary Preference
        </label>
        <Controller
          name="preference"
          control={control}
          render={({ field }) => (
            <>
              <input
                type="range"
                id="preference"
                min="0.4"
                max="1"
                step="0.01"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-sm text-gray-300 mt-1">
                {field.value && <>{getDietaryPreference(field.value)}</>}
              </div>
            </>
          )}
        />
        {/* <div className="flex justify-between text-xs text-gray-400">
          <span>Carb-heavy</span>
          <span>Balanced</span>
          <span>Fat-heavy</span>
        </div> */}
      </div>
      {errors.preference && (
        <p className="text-red-500 text-xs mt-1">{errors.preference.message}</p>
      )}
      <div>
        <label
          htmlFor="exercise_hours"
          className="block text-sm font-medium text-gray-200"
        >
          Weekly Exercise Hours
        </label>
        <input
          id="exercise_hours"
          type="number"
          {...register("exercise_hours", { valueAsNumber: true })}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Hours per week"
        />
        {errors.exercise_hours && (
          <p className="text-red-500 text-xs mt-1">
            {errors.exercise_hours.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Step3Form;
