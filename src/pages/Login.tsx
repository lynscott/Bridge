import React, { useState } from "react";
import { supabase } from "../../supabaseClient.ts";
import { motion } from "framer-motion";
import { saveTokenToSecureStorage } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { AnimatedBackground } from "../components/AnimatedBackground";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      if (data?.session?.access_token) {
        await saveTokenToSecureStorage(data.session.access_token);
        navigate("/home");
      } else if (isSignUp) {
        setError("Please check your email to confirm your account.");
      }
    } catch (error) {
      console.error(error);
      setError(
        isSignUp
          ? "Sign-up failed. Please try again."
          : "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <motion.div
        className="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth(isSignUp);
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white text-black bg-opacity-50 border border-white border-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-60 transition duration-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white text-black bg-opacity-50 border border-white border-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:bg-opacity-60 transition duration-200"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-800 p-3 rounded-lg hover:bg-opacity-90 transition duration-200 flex items-center justify-center font-semibold"
          >
            {loading ? (
              <motion.div
                className="w-6 h-6 border-t-2 border-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-teal-300 mt-4 text-center hover:underline"
        >
          {isSignUp
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </motion.div>
    </AnimatedBackground>
  );
};

export default Login;
