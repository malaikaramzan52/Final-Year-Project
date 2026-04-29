import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { Loader2 } from "lucide-react";

// Guards admin-only routes
const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  // Show loader while fetching user session
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#D98C00]" size={40} />
      </div>
    );
  }

  // After loading, if not authenticated, go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not an admin, go to home
  // Only check Redux user.role (source of truth), not stale localStorage
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

