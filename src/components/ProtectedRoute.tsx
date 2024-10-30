import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Make sure to import useAuth
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth(); // Use the AuthContext
  //   window.alert(user);
  if (loading) {
    return null; // Return null instead of a loading spinner
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
