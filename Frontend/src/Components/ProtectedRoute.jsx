import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  isLoggedIn,
  isAuthResolved,
  userRole,
  requiredRole
}) => {

  if (!isAuthResolved) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;

};

export default ProtectedRoute;