import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';
import { useGetProfileQuery } from '@/features/profile/profile.slice';
import { useState, useEffect } from 'react';
import { Loader } from './Loader';

export const AppSwitcher: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: profileData, isLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (profileData && profileData.data) {
      const userPreference = profileData.data?.preferred_view || 'app';

      if (userPreference === 'dashboard') {
        setRedirectPath('/dashboard');
      } else {
        setRedirectPath('/app/overview');
      }
    }
  }, [profileData]);

  if (!isAuthenticated) {
    return <Navigate to='/auth/login' replace />;
  }

  // You can customize this logic based on user preferences or roles
  // For example, you might store the user's preferred view in user settings
  // Or direct admin users to dashboard and regular users to main app

  // Simple example: Check if user has a specific role or preference

  // Show loading while fetching profile data
  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  // Redirect once we have determined the path
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback loading state
  return (
    <div className='h-screen flex justify-center items-center'>
      <Loader />
    </div>
  );
};
