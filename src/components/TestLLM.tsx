// import { invoke } from "@tauri-apps/api/core";
import React, { useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@tauri-apps/plugin-shell";
import { set } from "zod";

import { RemoteRunnable } from "@langchain/core/runnables/remote";

// import { createQueryGraph } from "./naas/createQueries";
// import { testMacros } from "./naas/utils";

const testPrompt = `
    For the given macros, cuisine and diet preferences, create 5 dish templates that include:
    - The target macro-nutrients for each dish to adhere to
    - An inviting and delightful name that describes the meal without overselling it
    - Some ingredients that would be typical in the dish, these should be USDA ingredients
    - A breakfast, lunch, dinner, dish, and two snack dishes

    Ideally the sum of macro-nutrients for the meal adds up to the total macro-nutrients given.
    Return your results as a a list of JSON objects

    Values:
    Calories ${1895} kcal
    Protein ${50}g
    Fats ${75}g
    Carbs ${200}g
    Max Saturated Fats ${25}g
    Max Sodium ${2000}mg


    Preferences:
    - Dairy free
    - Cajun, American, & Chinese are preferred cuisine types.
    - Difficulty level: intermediate
    - Max Cooking time: 30 minutes

    Return your answer as a list of JSON objects.
    {dishes: [ {} } }
`;

const LLMComponent: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      // invoke("generate_text", { prompt }).then((res) =>
      //   setResponse(res as string)
      // );
      const chain = new RemoteRunnable({
        url: `http://localhost:8000/chat/`,
      });
      const result = await chain.invoke(testPrompt);
      const parsed = JSON.parse((result as any).content);
      console.log(parsed);
      setResponse(parsed.dishes[0].name);
    } catch (error) {
      console.error("Error querying LLM:", error);
      setResponse("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Query the LLM</h1>
      <div className="mb-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
          placeholder="Enter your question..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
      </div>
      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        onClick={handleQuery}
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          "Submit"
        )}
      </button>
      {response && (
        <div className="mt-6 bg-white p-4 rounded-md shadow">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Response:
          </h2>
          <p className="text-gray-600 whitespace-pre-wrap break-words">
            {response}
          </p>
        </div>
      )}
    </div>
  );
};

export default LLMComponent;
