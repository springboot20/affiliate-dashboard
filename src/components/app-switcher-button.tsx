import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hook';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { useUpdateProfileMutation } from '@/features/profile/profile.slice';
import { toast } from 'react-toastify';

// This component can be added to both AppLayout.tsx and MainLayout.tsx
export const AppSwitcherButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  if (!isAuthenticated) {
    return null;
  }

  const isDashboard = location.pathname.startsWith('/dashboard');
  const newPreferredView = isDashboard ? 'app' : 'dashboard';

  const handleSwitchApp = async () => {
    try {
      // Update user preference when switching views
      await updateProfile({
        preferred_view: newPreferredView,
      }).unwrap();

      // Navigate to the appropriate route
      if (isDashboard) {
        navigate('/app/overview');
      } else {
        navigate('/dashboard/overview');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update preference';
      toast(errorMessage, { type: 'error' });
    }
  };

  return (
    <button
      onClick={handleSwitchApp}
      disabled={isLoading}
      className='flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium truncate overflow-hidden rounded transition-colors'>
      <ArrowsRightLeftIcon className='shrink-0 size-6' />
      <span>
        {isLoading ? 'Switching...' : `Switch to ${isDashboard ? 'Banking App' : 'Dashboard'}`}
      </span>
    </button>
  );
};
