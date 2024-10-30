// src/types/nutrition.ts
export interface Nutrient {
  phosphorus?: number;
  potassium?: number;
  sodium?: number;
  fats?: number;
  protein?: number;
  carbohydrates?: number;
  saturated_fats?: number;
}

export interface MacroTotals {
  protein: number;
  fats: number;
  carbohydrates: number;
  calories: number;
  sodium: number;
  saturated_fats: number;
}

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  fdcId: number;
  nutrients: Nutrient;
  amount: number;
  unit: string;
  calories: number;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description?: string;
  instructions: string[];
  cooking_time: number;
  image_url?: string;
  total_macros: MacroTotals;
  ingredients: Ingredient[];
}

export interface MealPlan {
  id: string;
  user_id: string;
  intake_result_id: string;
  name: string;
  description?: string;
  total_macros: MacroTotals;
  meals: Meal[];
}
