import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Guards authenticated routes using redux user slice
const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <div />; // TODO: replace with Loader component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
