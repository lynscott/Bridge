import React from "react";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { FaChild, FaMale, FaWeight, FaDumbbell } from "react-icons/fa";
import { NutritionFormInputs } from "./FormSchema";

const buildOptions = [
  { name: "Slim & Trim", value: "slim", icon: FaChild },
  { name: "Average Savage", value: "average", icon: FaMale },
  { name: "Large & in Charge", value: "large", icon: FaWeight },
  { name: "The Mass", value: "muscular", icon: FaDumbbell },
];

interface Step1FormProps {
  register: UseFormRegister<NutritionFormInputs>;
  control: Control<NutritionFormInputs>;
  errors: FieldErrors<NutritionFormInputs>;
}

const Step1Form: React.FC<Step1FormProps> = ({ register, control, errors }) => {
  return (
    <>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="current_weight" className="sr-only">
            Current Weight (lbs)
          </label>
          <input
            id="current_weight"
            type="number"
            {...register("current_weight", { valueAsNumber: true })}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
            placeholder="Current Weight (lbs)"
          />
        </div>
        <div className="p-4 bg-gray-800 rounded-b-md">
          <label className="text-white text-sm font-medium mb-2 block">
            How would you describe your build?
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="build"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  {buildOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={option.value}
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={option.value}
                        className={`flex flex-col items-center justify-center p-4 w-full h-24 bg-gray-700 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                          value === option.value ? "ring-2 ring-green-500" : ""
                        }`}
                      >
                        <option.icon className="text-3xl text-green-500 mb-2" />
                        <span className="text-sm text-white">
                          {option.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
        </div>
      </div>
      {errors.current_weight && (
        <p className="text-red-500 text-xs italic">
          {errors.current_weight.message}
        </p>
      )}
      {errors.build && (
        <p className="text-red-500 text-xs italic">{errors.build.message}</p>
      )}
    </>
  );
};

export default Step1Form;
