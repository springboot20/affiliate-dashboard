import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

// This component can be added to both AppLayout.tsx and MainLayout.tsx
export const AppSwitcherButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  // const user = useAppSelector((state) => state.auth.data.user);

  if (!isAuthenticated) {
    return null;
  }

  const isDashboard = location.pathname.startsWith('/dashboard');

  const handleSwitchApp = () => {
    if (isDashboard) {
      navigate('/app/overview');
    } else {
      navigate('/dashboard/overview');
    }
  };

  return (
    <button
      onClick={handleSwitchApp}
      className='flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium truncate overflow-hidden rounded transition-colors'>
      <ArrowsRightLeftIcon className="shrink-0 size-6" />
      <span>Switch to {isDashboard ? 'Banking App' : 'Dashboard'}</span>
    </button>
  );
};
