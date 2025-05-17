import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';
import { useGetProfileQuery } from '@/features/profile/profile.slice';
import { useState, useEffect } from 'react';

export const AppSwitcher: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: profile_data } = useGetProfileQuery();
  const [profile, setProfile] = useState<{ [key: string]: any }>({});

  if (!isAuthenticated) {
    return <Navigate to='/auth/login' replace />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (profile_data) {
      setProfile(profile_data?.data);
    }
  }, [profile_data]);

  // You can customize this logic based on user preferences or roles
  // For example, you might store the user's preferred view in user settings
  // Or direct admin users to dashboard and regular users to main app

  // Simple example: Check if user has a specific role or preference
  const userPreference = profile?.preferred_view || 'app';

  if (userPreference === 'dashboard') {
    return <Navigate to='/dashboard' replace />;
  } else {
    return <Navigate to='/app/overview' replace />;
  }
};
