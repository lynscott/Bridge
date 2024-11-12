// src/hooks/useMealPlanRealtime.ts
import { useState, useEffect } from 'react';
import { MealPlan } from '../types/nutrition';
import { RealtimeService } from '../realtimeService';
import { supabase } from '../lib/supabaseClient';

export function useMealPlanRealtime(mealPlanId: string) {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const realtimeService = RealtimeService.getInstance();
    let isSubscribed = true;
    console.log(mealPlanId, "mealPlanId");

    const loadMealPlan = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('meal_plans')
          .select(`
            *,
            meals:meal_plan_meals (
              meal:meals (
                *,
                ingredients:meal_ingredients (
                  ingredient:ingredients (*)
                )
              )
            )
          `)
          .eq('id', mealPlanId)
          .single();

        if (error) throw error;
        if (isSubscribed) {
          setMealPlan(data as MealPlan);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err : new Error('Failed to load meal plan'));
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadMealPlan();

    // Set up real-time subscription
    realtimeService.subscribeMealPlan(
      mealPlanId,
      (updatedPlan) => {
        if (isSubscribed) {
          setMealPlan(updatedPlan);
        }
      },
      (err) => {
        if (isSubscribed) {
          setError(err instanceof Error ? err : new Error('Subscription error'));
        }
      }
    );

    return () => {
      isSubscribed = false;
      realtimeService.unsubscribeMealPlan(mealPlanId);
    };
  }, [mealPlanId]);

  return { mealPlan, loading, error };
}
