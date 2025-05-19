import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';
import { useState, useEffect } from 'react';
import { Loader } from './Loader';
import { useProfile } from '@/context/ProfileContext';

export const AppSwitcher: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { preferred_view, isLoading } = useProfile();
  const [ready, setReady] = useState(false);

  console.log(preferred_view)

  useEffect(() => {
    if (!isLoading) {
      setReady(true);
    }
  }, [isLoading]);

  if (!isAuthenticated) {
    return <Navigate to='/auth/login' replace />;
  }

  // Show loading while fetching profile data
  if (!ready || isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  if (preferred_view === 'dashboard') {
    return <Navigate to='/dashboard/overview' replace />;
  } else {
    return <Navigate to='/app/overview' replace />;
  }
};
