import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (isLoginPage) return null;

  return (
    <nav className="fixed top-0 mb-20 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">Welcome!</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
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

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <AiOutlineClose size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-2"
          >
            <Link
              to="/home"
              className="block hover:text-green-500"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/nutrition"
              className="block hover:text-green-500"
              onClick={toggleMenu}
            >
              Nutrition
            </Link>
            <Link
              to="/settings"
              className="block hover:text-green-500"
              onClick={toggleMenu}
            >
              Settings
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
