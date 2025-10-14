import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Map your backend role values here if needed
const defaultRouteForRole = (role) => {
  if (role === 'USER') return '/student-dashboard';
  if (role === 'INSTRUCTOR') return '/instructor-dashboard';
  return '/';
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Optionally render a loader/spinner

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={defaultRouteForRole(user?.role)} replace />;
  }

  return children;
}

export function GuestOnlyRoute({ children }) {
  const { isLoggedIn, user, loading } = useAuth();
  if (loading) return null; // Optionally render a loader/spinner

  if (isLoggedIn) {
    return <Navigate to={defaultRouteForRole(user?.role)} replace />;
  }

  return children;
}
