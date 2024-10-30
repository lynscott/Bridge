// src/components/MealPlanView.tsx
import React from "react";
import { useMealPlanRealtime } from "../hooks/useMealPlan";

interface Props {
  mealPlanId: string;
}

export const MealPlanView: React.FC<Props> = ({ mealPlanId }) => {
  const { mealPlan, loading, error } = useMealPlanRealtime(mealPlanId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!mealPlan) return <div>No meal plan found</div>;

  return (
    <div>
      <h1>{mealPlan.name}</h1>
      <div>
        <h2>Total Macros:</h2>
        <pre>{JSON.stringify(mealPlan.total_macros, null, 2)}</pre>
      </div>
      {/* Render meals and other content */}
    </div>
  );
};
