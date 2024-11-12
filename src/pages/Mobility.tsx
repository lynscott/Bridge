import React from "react";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";
import { FiAward, FiClock, FiHeart, FiTrendingUp } from "react-icons/fi";
import { GiMuscleUp, GiNightSleep } from "react-icons/gi";
import { invoke } from "@tauri-apps/api/core";
// import { startRecording, stopRecording } from 'tauri-plugin-record-video-api';
// import { startRecording } from "tauri-plugin-record-video-api";

const BenefitCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 p-6 rounded-2xl shadow-xl"
  >
    <div className="flex items-center mb-4">
      <div className="text-blue-400 text-2xl">{icon}</div>
      <h3 className="ml-3 text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const Mobility: React.FC = () => {
  const benefits = [
    {
      icon: <GiMuscleUp />,
      title: "Improved Performance",
      description:
        "Enhanced range of motion leads to better form and increased strength in all your lifts.",
    },
    {
      icon: <FiHeart />,
      title: "Injury Prevention",
      description:
        "Regular mobility work reduces injury risk by maintaining joint health and muscle flexibility.",
    },
    {
      icon: <GiNightSleep />,
      title: "Better Recovery",
      description:
        "Proper mobility promotes better sleep quality and faster recovery between workouts.",
    },
    {
      icon: <FiTrendingUp />,
      title: "Progressive Gains",
      description:
        "Break through plateaus by addressing mobility limitations that hold back your progress.",
    },
  ];

  async function startRecordingMobile() {
    try {
      const response = await invoke("plugin:record-video|start_recording");
      // startRecording();
      console.log(response); // Should print "Recording started"
    } catch (error) {
      console.error("Error starting recording: ", error);
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Unlock Your Full Potential
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Mobility is the foundation of every movement. It's not just about
              flexibility; it's about moving better, feeling better, and
              performing at your best.
            </motion.p>
          </div>

          {/* Recording Test Button */}
          <motion.button
            onClick={startRecordingMobile}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg mb-16"
          >
            Test Recording
          </motion.button>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BenefitCard {...benefit} />
              </motion.div>
            ))}
          </div>

          {/* Getting Started Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Getting Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiClock className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">
                    10 Minutes Daily
                  </h3>
                  <p className="mt-2 text-gray-300">
                    That's all it takes to start seeing improvements in your
                    mobility.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiAward className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">
                    Guided Programs
                  </h3>
                  <p className="mt-2 text-gray-300">
                    Follow our structured mobility routines designed for your
                    needs.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <GiMuscleUp className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">
                    Track Progress
                  </h3>
                  <p className="mt-2 text-gray-300">
                    Monitor your mobility improvements over time.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Mobility;
