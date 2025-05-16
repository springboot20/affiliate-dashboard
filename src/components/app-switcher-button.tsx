import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';

// This component can be added to both AppLayout.tsx and MainLayout.tsx
export const AppSwitcherButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  const isDashboard = location.pathname.startsWith('/dashboard');

  const handleSwitchApp = () => {
    if (isDashboard) {
      navigate('/app/overview');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <button
      onClick={handleSwitchApp}
      className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'>
      Switch to {isDashboard ? 'Banking App' : 'Dashboard'}
    </button>
  );
};
