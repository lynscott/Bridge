import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestLLM from "../components/TestLLM";

interface UserData {
  name: string;
  todaysFocus: string;
  stats: {
    workoutsCompleted: number;
    caloriesBurned: number;
    streakDays: number;
  };
}

const Home: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      // For demonstration, we're setting userData to null to show the empty state
      setUserData(null);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to AI-Powered Fitness
        </h1>

        <TestLLM />

        <div className="bg-white text-black font-bold shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="mb-4">
            Complete these steps to personalize your experience:
          </p>
          <ol className="list-decimal list-inside text-left mb-6">
            <li>Set up your profile</li>
            <li>Take the nutrition assessment</li>
            <li>Define your goals</li>
          </ol>
          <button
            onClick={() => navigate("/nutrition")}
            className="bg-black-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Begin Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">
        Welcome back, {userData.name}!
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6">
        <h2 className="text-2xl font-semibold mb-2">Today's Focus</h2>
        <p>{userData.todaysFocus}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Workouts Completed</h3>
          <p className="text-4xl font-bold">
            {userData.stats.workoutsCompleted}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Calories Burned</h3>
          <p className="text-4xl font-bold">{userData.stats.caloriesBurned}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Streak Days</h3>
          <p className="text-4xl font-bold">{userData.stats.streakDays}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
