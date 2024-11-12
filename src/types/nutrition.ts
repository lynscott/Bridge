// src/types/nutrition.ts

export interface MacroTotals {
  protein: number;
  fats: number;
  carbohydrates: number;
  calories: number;
  sodium: number;
  saturated_fats: number;
}


export interface Nutrients {
  phosphorus: number;
  potassium: number;
  sodium: number;
  fats: number;
  protein: number;
  carbohydrates: number;
  calories: number;
}

export interface Ingredient {
  name: string;
  description?: string;
  fdc_id: string;
  amount: string;
  unit: string;
  nutrients: Nutrients;
}

export interface Recipe {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  flavor_profile: string;
  description: string;
  instructions: string[];
  cooking_time: number;
  image_url: string;
  total_macros: Nutrients;
  ingredients: Ingredient[];
}

export interface MealPlan {
  name: string;
  description: string;
  total_macros: Nutrients;
  meals: Recipe[];
}