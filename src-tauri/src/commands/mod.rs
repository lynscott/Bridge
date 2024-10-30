use serde::{Deserialize, Serialize};
use std::option::Option;

const DEFAULT_SODIUM: i32 = 2000;
const FAT_CALORIE_DIVISOR: f64 = 9.0;

#[derive(Serialize, Deserialize, Debug)]
pub struct NutrientAnalysisOutput {
    tbw: i32,
    calories: i32,
    protein: i32,
    fats: i32,
    saturated_fats: f64,
    carbohydrates: i32,
    sodium: i32,
    potassium: Option<i32>,
    phosphorus: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BMRIntakeArgsSchema<'a> {
    current_weight: i32,
    goal: &'a str,
    previous_training: &'a str,
    build: &'a str,
    neat: &'a str,
    exercise_hours: i32,
    preference: f32,
    additional_info: Option<&'a str>,
}

fn calculate_bmr(args: BMRIntakeArgsSchema) -> (i32, i32) {
    let current_weight = args.current_weight;
    let goal = args.goal;
    let previous_training = args.previous_training;
    let build = args.build;
    let neat = args.neat;
    let exercise_hours = args.exercise_hours;

    if goal == "weight_loss" {
        let monthly_loss = match build {
            "slim" | "muscular" => (current_weight as f64 * 0.005) * 4.0,
            "large" => (current_weight as f64 * 0.01) * 4.0,
            "average" => (current_weight as f64 * 0.0075) * 4.0,
            _ => 0.0,
        } as i32;
        let tbw: i32 = current_weight - (monthly_loss * 3);
        return (
            tbw * (neat_modifier(neat, goal, build) + exercise_hours),
            tbw,
        );
    }

    if goal == "weight_gain" {
        let tbw = match previous_training {
            "new" => current_weight + 6,
            "intermediate" => current_weight + 3,
            "advanced" => current_weight + 1,
            _ => current_weight,
        };
        return (
            tbw * (neat_modifier(neat, goal, build) + exercise_hours),
            tbw,
        );
    }

    // Maintain goal case
    let tbw = current_weight;
    let result = (
        tbw * (neat_modifier(neat, goal, build) + exercise_hours),
        tbw,
    );
    result
}

fn neat_modifier(neat: &str, goal: &str, build: &str) -> i32 {
    match (neat, goal, build) {
        ("very_low", "weight_loss", "large") => 9,
        ("moderate", "weight_gain", _) | ("moderate", "maintain", _) => 12,
        ("high", "weight_gain", _) | ("high", "maintain", _) => 15,
        _ => 10,
    }
}

fn create_macros(
    current_weight: i32,
    goal: &str,
    previous_training: &str,
    build: &str,
    neat: &str,
    exercise_hours: i32,
    preference: f32,
    additional_info: Option<&str>,
) -> NutrientAnalysisOutput {
    let input_args = BMRIntakeArgsSchema {
        current_weight,
        goal,
        previous_training,
        build,
        neat,
        exercise_hours,
        preference,
        additional_info,
    };

    let (bmr, tbw) = calculate_bmr(input_args);

    let protein = if goal == "maintain" || (build != "slim" && build != "muscular") {
        tbw as f64 * 0.8
    } else {
        tbw as f64
    };

    let fats = ((bmr as f64 * preference as f64) / FAT_CALORIE_DIVISOR).round() as i32;
    let carbohydrates =
        ((bmr as f64 - (protein * 4.0) - (fats as f64 * FAT_CALORIE_DIVISOR)) / 4.0).round() as i32;

    let sodium = DEFAULT_SODIUM;
    let saturated_fats = (bmr as f64 * 0.10) / FAT_CALORIE_DIVISOR;

    NutrientAnalysisOutput {
        tbw,
        calories: bmr,
        protein: protein as i32,
        fats,
        saturated_fats,
        carbohydrates,
        sodium,
        potassium: None,
        phosphorus: None,
    }
}

#[tauri::command]
pub fn generate_macros(
    current_weight: i32,
    goal: String,
    previous_training: String,
    build: String,
    neat: String,
    exercise_hours: i32,
    preference: f32,
    additional_info: Option<String>,
) -> Result<NutrientAnalysisOutput, String> {
    if current_weight <= 0 {
        return Err("Current weight must be greater than 0.".into());
    }

    Ok(create_macros(
        current_weight,
        &goal,
        &previous_training,
        &build,
        &neat,
        exercise_hours,
        preference,
        additional_info.as_deref(),
    ))
}
