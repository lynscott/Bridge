// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  verifyToken,
  refreshToken,
  logout,
  getCurrentUser,
} from "./lib/supabaseClient";

interface AuthContextType {
  user: User | undefined;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const isValid = await verifyToken();
      if (isValid) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Implement login logic
  };

  const refreshUser = async () => {
    const refreshedUser = await refreshToken();
    setUser(refreshedUser);
  };

  const value = {
    user,
    loading,
    login,
    logout: async () => {
      await logout();
      setUser(undefined);
    },
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
