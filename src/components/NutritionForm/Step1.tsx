import React from "react";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import { FaFeather, FaRunning, FaDumbbell, FaFire } from "react-icons/fa";
import { GiBiceps } from "react-icons/gi";

import { NutritionFormInputs } from "./FormSchema";

const buildOptions = [
  {
    name: "Lean Bean",
    value: "slim",
    description: "You're naturally slim or working on that sleek physique",
    icon: FaFeather,
    insights: [
      "You can eat a whole pizza and still fit in your skinny jeans",
      "People keep asking if you eat enough (yes, you do!)",
      "Your metabolism is basically a nuclear reactor",
      "You've never met a fitted shirt that was actually fitted",
    ],
  },
  {
    name: "Fit-ish",
    value: "average",
    description: "Balance is your thing - sometimes gym, sometimes pizza",
    icon: FaRunning,
    insights: [
      "You own gym clothes AND Netflix pajamas",
      "Your idea of meal prep is sometimes just ordering ahead",
      "You can do exactly 2.5 pull-ups on a good day",
      "Your Instagram has both gym selfies and food pics",
    ],
  },
  {
    name: "In My Gym Era ",
    value: "large",
    description: "You're packing some muscle but still on that growth journey",
    icon: FaDumbbell,
    insights: [
      "Your shopping cart is 50% protein supplements",
      "You flex subtly when walking past mirrors",
      "You measure food in macros, not calories",
      "Your phone gallery is full of progress pics",
    ],
  },
  {
    name: "Absolute Unit",
    value: "muscular",
    description: "You've got that powerlifter energy going on",
    icon: GiBiceps,
    insights: [
      "Regular doors are starting to feel narrow",
      "You've heard 'Do you compete?' more times than you can count",
      "Your grocery bill is higher than your car payment",
      "Sleeve shopping is an extreme sport",
    ],
  },
];

interface Step1FormProps {
  register: UseFormRegister<NutritionFormInputs>;
  control: Control<NutritionFormInputs>;
  errors: FieldErrors<NutritionFormInputs>;
}

const Step1Form: React.FC<Step1FormProps> = ({ register, control, errors }) => {
  return (
    <div className="space-y-4">
      {" "}
      {/* reduced spacing from 6 to 4 */}
      {/* Weight Input Section */}
      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-4 border border-gray-700/30">
        {" "}
        {/* reduced padding from 6 to 4 */}
        <label
          htmlFor="current_weight"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Current Weight (lbs)
        </label>
        <input
          id="current_weight"
          type="number"
          {...register("current_weight", { valueAsNumber: true })}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
          placeholder="Enter your current weight"
        />
        {errors.current_weight && (
          <p className="text-red-400 text-sm mt-2">
            {errors.current_weight.message}
          </p>
        )}
      </div>
      {/* Build Selection Section */}
      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-4 border border-gray-700/30">
        {" "}
        {/* reduced padding from 6 to 4 */}
        <label className="text-sm font-medium text-gray-300 mb-3 block">
          {" "}
          {/* reduced margin from 4 to 3 */}
          How would you best describe your current build?
        </label>
        <Controller
          name="build"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="space-y-4">
              {" "}
              {/* reduced spacing from 6 to 4 */}
              <div className="grid grid-cols-2 gap-3">
                {" "}
                {/* reduced gap from 4 to 3 */}
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
                      className={`flex flex-col items-center justify-center p-3 w-full bg-gray-700/50 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-600/50 hover:scale-[1.02] ${
                        value === option.value
                          ? "ring-2 ring-green-500/50 bg-gray-600/50"
                          : "border border-gray-600/50"
                      }`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 mb-2">
                        {" "}
                        {/* reduced size and margin */}
                        <option.icon className="text-xl text-green-400" />{" "}
                        {/* reduced icon size */}
                      </div>
                      <span className="text-sm font-medium text-gray-200">
                        {option.name}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              {/* Selected Build Description */}
              {value && (
                <div className="mt-4 animate-fadeIn">
                  {" "}
                  {/* reduced margin from 6 to 4 */}
                  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                    {" "}
                    {/* reduced padding from 5 to 4 */}
                    <h3 className="text-lg font-medium text-green-400 mb-2">
                      {" "}
                      {/* reduced margin from 3 to 2 */}
                      {buildOptions.find((opt) => opt.value === value)?.name}
                    </h3>
                    <p className="text-gray-300 mb-3">
                      {" "}
                      {/* reduced margin from 4 to 3 */}
                      {
                        buildOptions.find((opt) => opt.value === value)
                          ?.description
                      }
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">
                        This might be you if...
                      </h4>
                      <ul className="space-y-1">
                        {" "}
                        {/* reduced spacing from 2 to 1 */}
                        {buildOptions
                          .find((opt) => opt.value === value)
                          ?.insights.map((insight, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm text-gray-300"
                            >
                              <span className="text-green-400 mr-2">•</span>
                              {insight}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        />
        {errors.build && (
          <p className="text-red-400 text-sm mt-2">{errors.build.message}</p>
        )}
      </div>
    </div>
  );
};

export default Step1Form;
