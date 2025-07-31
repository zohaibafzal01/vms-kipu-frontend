import { Navigate } from "react-router-dom";
import { isTokenExpired } from "@/redux/utils/authUtils";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("authToken");

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
