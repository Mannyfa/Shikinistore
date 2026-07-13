import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, loading } = useAuth();

  // 1. While Firebase is checking the keys, show a luxury loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-white">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. If nobody is logged in, silently redirect them to the Auth page
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // 3. (Optional but recommended) Strict Admin Check
  // If this route requires admin privileges, verify their email.
  // Replace 'admin@shikini.com' with whatever email you used to register!
  if (requireAdmin && currentUser.email !== 'test@shikini.com') {
    return <Navigate to="/archives" replace />; 
  }

  // 4. If they pass all checks, open the vault doors
  return children;
}