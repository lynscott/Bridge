// src/services/realtimeService.ts
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import { MealPlan, Meal } from './types/nutrition';

export class RealtimeService {
  private static instance: RealtimeService;
  private channels: Map<string, RealtimeChannel>;

  private constructor() {
    this.channels = new Map();
  }

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  subscribeMealPlan(
    mealPlanId: string,
    onUpdate: (plan: MealPlan) => void,
    onError?: (error: any) => void
  ) {
    // Clean up existing subscription if any
    this.unsubscribeMealPlan(mealPlanId);

    const channel = supabase
      .channel(`meal_plan:${mealPlanId}`)
      // Subscribe to meal plan changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_plans',
          filter: `id=eq.${mealPlanId}`
        },
        async (payload) => {
          try {
            // Fetch the complete meal plan with all related data
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
            onUpdate(data as MealPlan);
          } catch (error) {
            onError?.(error);
          }
        }
      )
      // Subscribe to meal changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meals',
          filter: `id=in.(${this.getMealPlanMealIds(mealPlanId)})`
        },
        async (payload) => {
          // Refetch meal plan when meals change
          this.refetchMealPlan(mealPlanId, onUpdate, onError);
        }
      )
      // Subscribe to ingredient changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_ingredients'
        },
        async (payload) => {
          // Refetch meal plan when ingredients change
          this.refetchMealPlan(mealPlanId, onUpdate, onError);
        }
      )
      .subscribe((status, err) => {
        if (err) {
          onError?.(err);
        }
      });

    this.channels.set(mealPlanId, channel);
  }

  private async refetchMealPlan(
    mealPlanId: string,
    onUpdate: (plan: MealPlan) => void,
    onError?: (error: any) => void
  ) {
    try {
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
      onUpdate(data as MealPlan);
    } catch (error) {
      onError?.(error);
    }
  }

  private async getMealPlanMealIds(mealPlanId: string): Promise<string> {
    const { data } = await supabase
      .from('meal_plan_meals')
      .select('meal_id')
      .eq('meal_plan_id', mealPlanId);
    
    return data?.map(row => row.meal_id).join(',') || '';
  }

  unsubscribeMealPlan(mealPlanId: string) {
    const channel = this.channels.get(mealPlanId);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(mealPlanId);
    }
  }

  unsubscribeAll() {
    this.channels.forEach(channel => channel.unsubscribe());
    this.channels.clear();
  }
}
