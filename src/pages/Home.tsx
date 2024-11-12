import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { getCurrentUser, getNutritionProfile } from "../lib/supabaseClient";
import { FiActivity, FiAward, FiFlag } from "react-icons/fi";
import { IoFitnessOutline, IoNutritionOutline } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface UserData {
  name: string;
  todaysFocus: string;
  stats: {
    workoutsCompleted: number;
    caloriesBurned: number;
    streakDays: number;
  };
  nutrition: {
    calories: number | null;
    protein: number | null;
    fats: number | null;
    carbs: number | null;
  };
}

interface SetupTask {
  title: string;
  description: string;
  completed: boolean;
  action: string;
  route: string;
}

const Home: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setupTasks: SetupTask[] = [
    {
      title: "Nutrition Profile",
      description: "Complete your nutrition assessment",
      completed: userData?.nutrition.calories !== null,
      action: "Complete Assessment",
      route: "/nutrition",
    },
    {
      title: "Meal Preferences",
      description: "Set your dietary preferences and restrictions",
      completed: false,
      action: "Set Preferences",
      route: "/meal-preferences",
    },
    {
      title: "Mobility Assessment",
      description: "Define your fitness objectives",
      completed: false,
      action: "Set Goals",
      route: "/goals",
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const nutritionProfile = await getNutritionProfile(user.id);
        console.log(nutritionProfile);
        if (nutritionProfile) {
          setUserData({
            name: user.user_metadata.full_name || "User",
            todaysFocus: "Stay hydrated and eat balanced meals",
            stats: {
              workoutsCompleted: 5,
              caloriesBurned: 2000,
              streakDays: 3,
            },
            nutrition: {
              calories: nutritionProfile.target_calories || 0,
              protein: nutritionProfile.target_protein || 0,
              fats: nutritionProfile.target_fats || 0,
              carbs: nutritionProfile.target_carbs || 0,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getCompletionPercentage = () => {
    const completed = setupTasks.filter((task) => task.completed).length;
    return (completed / setupTasks.length) * 100;
  };

  return (
    <PageWrapper loading={loading}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          {!userData ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                  <div className="mb-6">
                    <CircularProgressbar
                      value={getCompletionPercentage()}
                      text={`${Math.round(getCompletionPercentage())}%`}
                      styles={buildStyles({
                        pathColor: "#3B82F6",
                        textColor: "#FFFFFF",
                        trailColor: "#1F2937",
                      })}
                      className="w-32 h-32 mx-auto mb-6"
                    />
                    <h2 className="text-3xl font-bold text-white text-center">
                      Complete Your Profile
                    </h2>
                    <p className="text-gray-400 text-center mt-2">
                      Let's personalize your experience
                    </p>
                  </div>

                  <div className="space-y-4">
                    {setupTasks.map((task, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 rounded-xl p-4 transition-all hover:bg-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">
                              {task.title}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {task.description}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(task.route)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            {task.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-bold text-white">
                  Welcome back, {userData.name}!
                </h2>
                <div className="flex items-center space-x-2">
                  <FiAward className="text-yellow-400 w-6 h-6" />
                  <span className="text-white font-medium">Level 1</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <IoFitnessOutline className="w-8 h-8 text-white opacity-80" />
                    <span className="text-xs font-medium text-blue-100">
                      Today
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-1">
                    Workouts
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {userData.stats.workoutsCompleted}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <FiActivity className="w-8 h-8 text-white opacity-80" />
                    <span className="text-xs font-medium text-purple-100">
                      Total
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-1">
                    Calories Burned
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {userData.stats.caloriesBurned}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <FiFlag className="w-8 h-8 text-white opacity-80" />
                    <span className="text-xs font-medium text-green-100">
                      Current
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-1">
                    Streak
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {userData.stats.streakDays} days
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <IoNutritionOutline className="w-8 h-8 text-white opacity-80" />
                    <span className="text-xs font-medium text-orange-100">
                      Daily Target
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-3">
                    Nutrition
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-100">Calories</span>
                      <span className="text-white font-medium">
                        {userData.nutrition.calories}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-100">Protein</span>
                      <span className="text-white font-medium">
                        {userData.nutrition.protein}g
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Today's Focus
                </h3>
                <p className="text-gray-300">{userData.todaysFocus}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
