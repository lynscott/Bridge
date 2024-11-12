import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Nutrition from "./pages/Nutrition";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import MealPlanView from "./components/MealPlanView";
import ProtectedRoute from "./components/ProtectedRoute";
import Mobility from "./pages/Mobility";
import { AuthProvider, useAuth } from "./AuthContext";
import { supabase } from "./lib/supabaseClient";

// import { ScrollRestoration } from "react-router-dom";
import "./App.css";

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 50 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[calc(100vh-64px)] pt-16">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const { loading, user } = useAuth();

  useEffect(() => {
    // Enable realtime functionality
    supabase
      .channel("custom-all-channel")
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        console.log("Change received!", payload);
      })
      .subscribe();

    return () => {
      supabase.channel("custom-all-channel").unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="safe-area-content"
            >
              <SplashScreen />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="safe-area-content"
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="safe-area-content"
              >
                <Home />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutrition"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="safe-area-content"
            >
              <Nutrition />
            </motion.div>
          }
        >
          <Route index element={null} />
          <Route
            path="meal-plan"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <MealPlanView />
              </motion.div>
            }
          />
        </Route>

        <Route
          path="/mobility"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="safe-area-content"
            >
              <Mobility />
            </motion.div>
          }
        />

        <Route
          path="/settings"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="safe-area-content"
            >
              <Settings />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        {/* <ScrollRestoration /> TODO decide on data router or TanStack */}
        <div className="flex flex-col h-screen bg-gray-900 text-white safe-area-container">
          <Navbar />
          <main className="flex-grow overflow-auto safe-area-main">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
