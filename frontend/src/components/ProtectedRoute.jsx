import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still checking session — show nothing yet
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Not logged in — redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
