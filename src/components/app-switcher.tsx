import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';

export const AppSwitcher: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.data.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // You can customize this logic based on user preferences or roles
  // For example, you might store the user's preferred view in user settings
  // Or direct admin users to dashboard and regular users to main app
  
  // Simple example: Check if user has a specific role or preference
  const userPreference = user?.preferredView || 'app';
  
  if (userPreference === 'dashboard') {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/app/overview" replace />;
  }
};