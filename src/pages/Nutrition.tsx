import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getTokenFromSecureStorage } from "../utils/storage";
import { supabase } from "../../supabaseClient";
import Step1Form from "../components/NutritionForm/Step1";
import Step2Form from "../components/NutritionForm/Step2";
import Step3Form from "../components/NutritionForm/Step3";
import {
  NutritionSchema,
  convertFormData,
} from "../components/NutritionForm/FormSchema";

export type NutritionFormInputs = z.infer<typeof NutritionSchema>;

const NutritionForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<NutritionFormInputs>({
    resolver: zodResolver(NutritionSchema),
    mode: "onChange",
    defaultValues: {
      preference: "0.5",
    },
  });

  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;
  const [loading, setLoading] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
  );

  const onSubmit = async (data: NutritionFormInputs) => {
    const convertedData = convertFormData(data);
    setLoading(true);
    setSubmissionSuccess(null);

    try {
      const token = await getTokenFromSecureStorage();

      if (token) {
        const { error } = await supabase.from("nutrition_intake").insert([
          {
            user_id: token,
            ...convertedData,
          },
        ]);

        if (error) {
          throw new Error("Failed to submit form.");
        }

        setSubmissionSuccess(true);
      } else {
        throw new Error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmissionSuccess(false);
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

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Nutrition Profile
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Step {step} of {totalSteps}
          </p>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-500 bg-green-200">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-green-500">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {step === 1 && (
            <Step1Form register={register} control={control} errors={errors} />
          )}
          {step === 2 && <Step2Form register={register} errors={errors} />}
          {step === 3 && (
            <Step3Form register={register} errors={errors} control={control} />
          )}

          <div className="flex items-center justify-between space-x-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Previous
              </button>
            )}
            {step < totalSteps && (
              <button
                type="button"
                onClick={handleNextStep}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Next
              </button>
            )}
            {step === totalSteps && (
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>

        {submissionSuccess === true && (
          <p className="mt-4 text-green-500 text-center">
            Form submitted successfully!
          </p>
        )}
        {submissionSuccess === false && (
          <p className="mt-4 text-red-500 text-center">
            There was an issue submitting the form. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default NutritionForm;
