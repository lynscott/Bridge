import React, { useState, useEffect } from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";
import { NutritionFormInputs } from "./FormSchema";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";

interface Step3FormProps {
  register: UseFormRegister<NutritionFormInputs>;
  errors: FieldErrors<NutritionFormInputs>;
  control: Control<NutritionFormInputs>;
}

const allergy_restrictions = [
  "Dairy",
  "Egg",
  "Gluten",
  "Grain",
  "Peanut",
  "Seafood",
  "Sesame",
  "Shellfish",
  "Soy",
  "Sulfite",
  "Tree Nut",
  "Wheat",
].map((item) => ({ value: item.toLowerCase(), label: item }));

const diet_preferences = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30",
].map((item) => ({ value: item.toLowerCase(), label: item }));

const cuisine_preferences = [
  "American",
  "Chinese",
  "French",
  "Indian",
  "Italian",
  "Japanese",
  "Mediterranean",
  "Mexican",
  "Thai",
  "African",
  "British",
  "Cajun",
  "Caribbean",
  "German",
  "Greek",
  "Irish",
  "Korean",
  "Nordic",
  "Southern",
  "Spanish",
  "Vietnamese",
  "Middle Eastern",
  "Latin American",
  "Jewish",
].map((item) => ({ value: item.toLowerCase(), label: item }));

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    background: "rgba(55, 65, 81, 0.5)",
    borderColor: "rgba(75, 85, 99, 0.5)",
    borderRadius: "0.75rem",
    padding: "0.25rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "rgba(34, 197, 94, 0.5)",
    },
  }),
  menu: (base: any) => ({
    ...base,
    background: "rgba(31, 41, 55, 0.95)",
    backdropFilter: "blur(4px)",
    borderRadius: "0.75rem",
    padding: "0.5rem",
    zIndex: 999, // Added z-index
    position: "absolute", // Ensure absolute positioning
    width: "100%", // Match container width
    marginTop: "4px", // Add some spacing from the control
  }),
  menuList: (base: any) => ({
    ...base,
    padding: "4px",
    maxHeight: "250px", // Limit max height
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(31, 41, 55, 0.5)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(75, 85, 99, 0.5)",
      borderRadius: "4px",
      "&:hover": {
        background: "rgba(75, 85, 99, 0.7)",
      },
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? "rgba(55, 65, 81, 0.5)" : "transparent",
    color: "white", // Added explicit text color
    padding: "8px 12px",
    borderRadius: "0.5rem",
    cursor: "pointer",
    "&:active": {
      background: "rgba(34, 197, 94, 0.2)",
    },
  }),
  multiValue: (base: any) => ({
    ...base,
    background: "rgba(34, 197, 94, 0.2)",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "white",
    padding: "2px 6px",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "white",
    borderRadius: "0 0.5rem 0.5rem 0",
    "&:hover": {
      background: "rgba(239, 68, 68, 0.5)",
      color: "white",
    },
  }),
  input: (base: any) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "rgba(156, 163, 175, 0.8)",
  }),
  container: (base: any) => ({
    ...base,
    zIndex: 100, // Added z-index to container
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "2px 8px",
  }),
};

interface MobileMultiSelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  options: { value: string; label: string }[];
  value: { value: string; label: string }[];
  onChange: (value: any) => void;
  title: string;
}

const MobileMultiSelectDrawer: React.FC<MobileMultiSelectDrawerProps> = ({
  isOpen,
  onClose,
  options,
  value,
  onChange,
  title,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(value.map((v) => v.value))
  );

  // Prevent keyboard from showing up
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleToggle = (optionValue: string, optionLabel: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(optionValue)) {
      newSelected.delete(optionValue);
    } else {
      newSelected.add(optionValue);
    }
    setSelectedItems(newSelected);

    const newValue = Array.from(newSelected).map((v) => ({
      value: v,
      label: options.find((opt) => opt.value === v)?.label || "",
    }));
    onChange(newValue);
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            duration: 0.4,
          }}
          className="fixed inset-0 z-[9999] bg-gray-900/95 backdrop-blur-xl safe-area-view"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      handleButtonClick(e);
                      handleToggle(option.value, option.label);
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedItems.has(option.value)
                        ? "bg-green-500/20 border-green-500/50"
                        : "bg-gray-800/40 border-gray-700/30"
                    } border backdrop-blur-sm`}
                    // Prevent focus and keyboard
                    tabIndex={-1}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{option.label}</span>
                      {selectedItems.has(option.value) && (
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-700/30">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                // Prevent focus and keyboard
                tabIndex={-1}
              >
                Done ({selectedItems.size} selected)
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const ResponsiveMultiSelect: React.FC<any> = ({
  field,
  options,
  title,
  placeholder,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsDrawerOpen(true);
          }}
          type="button"
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-left text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
          tabIndex={-1}
        >
          {field.value?.length
            ? `${field.value.length} selected: ${field.value
                .map((v: any) => v.label)
                .join(", ")}`
            : placeholder}
        </button>
        <MobileMultiSelectDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          options={options}
          value={field.value || []}
          onChange={field.onChange}
          title={title}
        />
      </>
    );
  }

  return (
    <Select
      {...field}
      isMulti
      options={options}
      styles={customSelectStyles}
      placeholder={placeholder}
      className="text-white"
      menuPosition="fixed"
      menuPlacement="auto"
      maxMenuHeight={250}
    />
  );
};

const Step3Form: React.FC<Step3FormProps> = ({ register, errors, control }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Fat vs Carbohydrate preference. <br />
            We recommend a balanced setting for most people.
          </label>
          <Controller
            name="preference"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                <input
                  type="range"
                  id="preference"
                  min="0.5"
                  max="0.9"
                  step="0.2"
                  defaultValue={"0.7"}
                  list="tickmarks"
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    // Snap to nearest valid value
                    const validValues = [0.5, 0.7, 0.9];
                    const closest = validValues.reduce((prev, curr) => {
                      return Math.abs(curr - value) < Math.abs(prev - value)
                        ? curr
                        : prev;
                    });
                    field.onChange(closest.toString());
                  }}
                  className="w-full h-2 bg-gray-600/50 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <datalist id="tickmarks">
                  <option value="0.5"></option>
                  <option value="0.7"></option>
                  <option value="0.9"></option>
                </datalist>
                <div className="text-sm text-gray-300 flex justify-between">
                  <span>Carb-leaning</span>
                  <span>Balanced</span>
                  <span>Fat-leaning</span>
                </div>
                <div className="text-sm text-gray-300 flex justify-center"></div>
              </div>
            )}
          />
        </div>
      </div>

      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Diet Preferences
        </label>
        <Controller
          name="diet_preferences"
          control={control}
          render={({ field }) => (
            <ResponsiveMultiSelect
              field={{
                ...field,
                value:
                  field.value?.map((value: string | undefined) => {
                    if (!value) return { value: "", label: "" }; // Handle undefined case
                    return {
                      value,
                      label:
                        diet_preferences.find((opt) => opt.value === value)
                          ?.label || value,
                    };
                  }) || [],
                onChange: (newValue: any) => {
                  // Convert the selected options to string array
                  const stringArray = newValue
                    ? newValue.map((item: any) => item.value)
                    : [];
                  field.onChange(stringArray);
                },
              }}
              options={diet_preferences}
              title="Diet Preferences"
              placeholder="Select diet preferences..."
            />
          )}
        />
      </div>

      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Allergies & Restrictions
        </label>
        <Controller
          name="allergies"
          control={control}
          render={({ field }) => (
            <ResponsiveMultiSelect
              field={{
                ...field,
                value:
                  field.value?.map((value: string | undefined) => {
                    if (!value) return { value: "", label: "" }; // Handle undefined case
                    return {
                      value,
                      label:
                        allergy_restrictions.find((opt) => opt.value === value)
                          ?.label || value,
                    };
                  }) || [],
                onChange: (newValue: any) => {
                  // Convert the selected options to string array
                  const stringArray = newValue
                    ? newValue.map((item: any) => item.value)
                    : [];
                  field.onChange(stringArray);
                },
              }}
              options={allergy_restrictions}
              title="Allergy Restrictions"
              placeholder="Select allergy restrictions..."
            />
          )}
        />
      </div>

      <div className="backdrop-blur-xl bg-gray-800/40 rounded-2xl p-6 border border-gray-700/30">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Cuisine Preferences
        </label>
        <Controller
          name="cuisines"
          control={control}
          render={({ field }) => (
            <ResponsiveMultiSelect
              field={{
                ...field,
                value:
                  field.value?.map((value: string | undefined) => {
                    if (!value) return { value: "", label: "" }; // Handle undefined case
                    return {
                      value,
                      label:
                        allergy_restrictions.find((opt) => opt.value === value)
                          ?.label || value,
                    };
                  }) || [],
                onChange: (newValue: any) => {
                  // Convert the selected options to string array
                  const stringArray = newValue
                    ? newValue.map((item: any) => item.value)
                    : [];
                  field.onChange(stringArray);
                },
              }}
              options={cuisine_preferences}
              title="Cuisine Preferences"
              placeholder="Select cuisine preferences..."
            />
          )}
        />
      </div>
    </div>
  );
};

export default Step3Form;
