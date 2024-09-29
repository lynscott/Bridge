import { z } from "zod";

export const NutritionSchema = z.object({
  current_weight: z.number().min(1).max(1000).describe("Current Weight (lbs)"),
  build: z
    .enum(["slim", "average", "large", "muscular"])
    .describe("How would you describe your build?"),
  goal: z
    .enum(["weight_gain", "weight_loss", "healthy_eating"])
    .describe("Nutritional Health Goal"),
  previous_training: z
    .enum(["new", "intermediate", "advanced"])
    .describe("Previous Training Experience"),
  neat: z
    .enum(["very_low", "low", "moderate", "high"])
    .describe("Activity Level (Non-exercise)"),
  preference: z
    .string()
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0.4 && num <= 1;
      },
      { message: "Preference must be a number between 0.4 and 1" }
    )
    .describe("Is your typical diet more fat or carb heavy?"),
  exercise_hours: z
    .number()
    .int()
    .min(0)
    .max(168)
    .describe("How many hours per week do you typically exercise?"),
});

export type NutritionFormInputs = z.infer<typeof NutritionSchema>;

// Helper function to convert form data to the correct types
export const convertFormData = (data: NutritionFormInputs) => ({
  ...data,
  preference: parseFloat(data.preference),
});
