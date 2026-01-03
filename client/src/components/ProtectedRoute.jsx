// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // allow SUPER_ADMIN as ADMIN
  if (role === "ADMIN" && !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  if (role === "USER" && user.role !== "USER") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
