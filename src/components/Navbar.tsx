import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { IoNutritionOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  if (isLoginPage) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-gray-800 text-white p-4 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link to="/">Bridge_alpha</Link>
          </div>
          <div className="flex space-x-8">
            <Link to="/home" className="hover:text-green-500">
              Home
            </Link>
            <Link to="/nutrition" className="hover:text-green-500">
              Nutrition
            </Link>
            <Link to="/settings" className="hover:text-green-500">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom App Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white z-50 px-4 py-2 border-t border-gray-700">
        <div className="flex justify-around items-center w-full max-w-md mx-auto">
          <Link
            to="/home"
            className={`flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 ${
              isActive("/home") ? "text-teal-400" : "text-gray-400"
            }`}
          >
            <motion.div
              className="flex flex-col items-center justify-center w-full"
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center w-6 h-6">
                <AiOutlineHome
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive("/home")
                      ? "text-teal-400 filter drop-shadow-[0_0_2px_rgba(96,165,250,0.6)]"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-1 font-medium text-center transition-all duration-300 ${
                  isActive("/home")
                    ? "text-teal-400 filter drop-shadow-[0_0_2px_rgba(96,165,250,0.6)]"
                    : "text-gray-400"
                }`}
              >
                Home
              </span>
            </motion.div>
          </Link>

          <Link
            to="/nutrition"
            className={`flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 ${
              isActive("/nutrition") ? "text-teal-400" : "text-gray-400"
            }`}
          >
            <motion.div
              className="flex flex-col items-center justify-center w-full"
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center w-6 h-6">
                <IoNutritionOutline
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive("/nutrition")
                      ? "text-teal-400 filter drop-shadow-[0_0_2px_rgba(96,165,250,0.6)]"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-1 font-medium text-center transition-all duration-300 ${
                  isActive("/nutrition")
                    ? "text-teal-400 filter drop-shadow-[0_0_2px_rgba(96,165,250,0.6)]"
                    : "text-gray-400"
                }`}
              >
                Nutrition
              </span>
            </motion.div>
          </Link>

          <Link
            to="/settings"
            className={`flex-1 flex flex-col items-center justify-center p-2 transition-all duration-300 ${
              isActive("/settings") ? "text-teal-400" : "text-gray-400"
            }`}
          >
            <motion.div
              className="flex flex-col items-center justify-center w-full"
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center w-6 h-6">
                <AiOutlineSetting
                  size={24}
                  className={`transition-all duration-300 ${
                    isActive("/settings")
                      ? "text-teal-400 filter drop-shadow-[0_0_2px_rgba(96,165,250,0.6)]"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-xs mt-1 font-medium text-center transition-all duration-300 ${
                  isActive("/settings")
                    ? "text-teal-400 filter drop-shadow-[0_0_2px_rgba(96,165,250,0.6)]"
                    : "text-gray-400"
                }`}
              >
                Settings
              </span>
            </motion.div>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
