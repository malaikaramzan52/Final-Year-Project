import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Guards admin-only routes
const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <div />; // TODO: replace with Loader component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
