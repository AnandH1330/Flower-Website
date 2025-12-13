
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/signin" replace />;

  if (requireAdmin && !user?.is_admin)
    return <Navigate to="/user/dashboard" replace />;

  return children;
};

export default ProtectedRoute;

