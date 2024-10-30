// MacroDescriptions.tsx
import React from "react";
import { MacroInfo } from "./MacroInfoCard";

interface MacroDescriptionsProps {
  generated_macros: {
    saturated_fats: number;
    sodium: number;
    potassium?: number;
    phosphorus?: number;
  };
}

export const MacroDescriptions: React.FC<MacroDescriptionsProps> = ({
  generated_macros,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <MacroInfo
      title="Calories"
      description="Calories are units of energy. Your daily calorie intake directly affects your weight management. Consuming fewer calories than you burn leads to weight loss, while consuming more leads to weight gain."
    />
    <MacroInfo
      title="Protein"
      description="Protein is essential for building and repairing tissues, including muscles. It also helps you feel full and can boost metabolism. Aim to include a protein source in each meal."
    />
    <MacroInfo
      title="Fats"
      description="Fats are important for hormone production and nutrient absorption. They also provide energy and help you feel satiated. Focus on healthy fats from sources like avocados, nuts, and olive oil."
    />
    <MacroInfo
      title="Carbohydrates"
      description="Carbs are your body's main source of energy. They fuel your brain and muscles. Choose complex carbs like whole grains, fruits, and vegetables for sustained energy and better health."
    />
    <MacroInfo
      title="Saturated Fats"
      description={`Limit saturated fats to ${generated_macros.saturated_fats.toFixed(
        1
      )}g per day. These are found in animal products and some tropical oils. Excessive intake can increase cholesterol levels.`}
    />
    <MacroInfo
      title="Sodium"
      description={`Aim for max of ${generated_macros.sodium}mg of sodium per day. While necessary for bodily functions, too much sodium can lead to high blood pressure. Be mindful of hidden sodium in processed foods.`}
    />
    {generated_macros.potassium && (
      <MacroInfo
        title="Potassium"
        description={`Include ${generated_macros.potassium}mg of potassium in your diet. It's crucial for heart health and muscle function. Good sources include bananas, potatoes, and leafy greens.`}
      />
    )}
    {generated_macros.phosphorus && (
      <MacroInfo
        title="Phosphorus"
        description={`Aim for a max ${generated_macros.phosphorus}mg of phosphorus daily. It's important for bone health and energy production. It's found in dairy products, meat, and whole grains.`}
      />
    )}
  </div>
);
