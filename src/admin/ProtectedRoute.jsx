import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function ProtectedRoute() {
  const { auth } = useAdminData();

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
