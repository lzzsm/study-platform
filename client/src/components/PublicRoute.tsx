import { Navigate } from "react-router-dom";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
