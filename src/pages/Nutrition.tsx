import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../lib/supabaseClient";
import Step1Form from "../components/NutritionForm/Step1";
import Step2Form from "../components/NutritionForm/Step2";
import Step3Form from "../components/NutritionForm/Step3";
import {
  NutritionSchema,
  convertFormData,
} from "../components/NutritionForm/FormSchema";
import { invoke } from "@tauri-apps/api/core";
import IntakeResults from "../components/NutritionForm/IntakeResults";
import { MealPlanView } from "../components/MealPlanView";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

export type NutritionFormInputs = z.infer<typeof NutritionSchema>;

const ProgressBridge = ({ progress }: { progress: number }) => (
  <div className="relative w-full h-12 mb-6">
    <div className="absolute inset-0 flex items-center justify-between px-2">
      {[1, 2, 3].map((step) => (
        <motion.div key={step} className="relative z-10" initial={false}>
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= progress / 33.33
                ? "bg-gradient-to-r from-green-400 to-green-500"
                : "bg-gray-700"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-white text-sm font-medium">{step}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
    <div className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2">
      <div className="relative w-full h-full bg-gray-700 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  </div>
);

const NutritionForm: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mealsProcessing, setMealsProcessing] = useState<boolean>(false);
  const location = useLocation();
  const showNutritionContent = location.pathname === "/nutrition";

  useEffect(() => {
    // Check if meals are being processed
    const submitSuccessCheck = localStorage.getItem("mealsProcessing");
    // const storedMealPlanId = localStorage.getItem("mealPlanId");

    if (submitSuccessCheck === "true") {
      setMealsProcessing(true);
    } else {
      fetchLatestNutritionData();
    }
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<NutritionFormInputs>({
    resolver: zodResolver(NutritionSchema),
    mode: "onChange",
    defaultValues: {
      preference: "0.5",
    },
  });

  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;

  const stepTitles = {
    1: "Basic Information",
    2: "Goals & History",
    3: "Preferences",
  };

  useEffect(() => {
    fetchLatestNutritionData();
  }, []);

  const fetchLatestNutritionData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User is not authenticated.");
      }

      const { data, error } = await supabase
        .from("nutrition_intake")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setShowForm(true);
        } else {
          throw error;
        }
      } else {
        setNutritionData(data);
      }
    } catch (error) {
      console.error("Error fetching latest nutrition data:", error);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NutritionFormInputs) => {
    try {
      setLoading(true);
      const convertedData = convertFormData(data);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User is not authenticated.");
      }

      const macros = await invoke("generate_macros", {
        currentWeight: convertedData.current_weight,
        goal: convertedData.goal,
        previousTraining: convertedData.previous_training,
        build: convertedData.build,
        neat: convertedData.neat,
        exerciseHours: convertedData.exercise_hours,
        preference: convertedData.preference,
        additionalInfo: convertedData.additional_info,
      });

      const { data: insertedData, error: supabaseError } = await supabase
        .from("nutrition_intake")
        .insert([
          {
            user_id: user.id,
            ...convertedData,
            generated_macros: macros,
          },
        ])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      if (insertedData) {
        setNutritionData(insertedData);
        setShowForm(false);
        reset(); // Reset form after successful submission
      }
    } catch (error) {
      console.error("Submission Error:", error);
      // Optionally add error state handling here
      // setSubmissionError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    const fieldsToValidate = {
      1: ["current_weight", "build"],
      2: ["goal", "previous_training", "neat"],
      3: ["preference", "exercise_hours"],
    }[step] as (keyof NutritionFormInputs)[];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const progress = (step / totalSteps) * 100;

  const handleNewForm = () => {
    setShowForm(true);
    setStep(1);
    reset();
  };

  return (
    <PageWrapper loading={loading}>
      <Outlet />
      {showNutritionContent && (
        <div className="flex items-center justify-center min-h-full px-0 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl space-y-4 backdrop-blur-lg bg-gray-800/40 rounded-2xl border border-gray-700/30 shadow-2xl p-4"
          >
            {mealsProcessing ? (
              <MealPlanView />
            ) : !showForm && nutritionData ? (
              <IntakeResults
                nutritionData={nutritionData}
                startOver={handleNewForm}
              />
            ) : (
              <>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {stepTitles[step as keyof typeof stepTitles]}
                  </h2>
                </motion.div>

                <ProgressBridge progress={progress} />

                <AnimatePresence mode="wait">
                  <motion.form
                    key={step}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full">
                      {step === 1 && (
                        <Step1Form
                          register={register}
                          control={control}
                          errors={errors}
                        />
                      )}
                      {step === 2 && (
                        <Step2Form register={register} errors={errors} />
                      )}
                      {step === 3 && (
                        <Step3Form
                          register={register}
                          errors={errors}
                          control={control}
                        />
                      )}
                    </div>

                    <motion.div
                      className="flex items-center justify-between space-x-3 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {step > 1 && (
                        <motion.button
                          type="button"
                          onClick={handlePreviousStep}
                          className="flex-1 py-2.5 px-4 border border-gray-600 text-sm font-medium rounded-xl text-white bg-transparent hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Previous
                        </motion.button>
                      )}
                      {step < totalSteps && (
                        <motion.button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Next
                        </motion.button>
                      )}
                      {step === totalSteps && (
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2" />
                              Processing...
                            </div>
                          ) : (
                            "Submit"
                          )}
                        </motion.button>
                      )}
                    </motion.div>
                  </motion.form>
                </AnimatePresence>
              </>
            )}

            {!loading && showForm && (
              <>
                {Object.keys(errors).length > 0 && (
                  <motion.p
                    className="mt-2 text-red-500 text-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Please fill in all required fields correctly.
                    {JSON.stringify(errors)}
                  </motion.p>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </PageWrapper>
  );
};

export default NutritionForm;
