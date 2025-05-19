import { useAppSelector } from '@/app/hook';
import { useGetProfileQuery } from '@/features/profile/profile.slice';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type PreferenceWatcherProps = {
  children: React.ReactNode;
};

export const PreferenceWatcher: React.FC<PreferenceWatcherProps> = ({ children }) => {
  const FETCH_TIMER = 30000;
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: profileData, refetch } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: FETCH_TIMER,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      refetch();
    }, FETCH_TIMER);

    return () => clearInterval(intervalId);
  }, [refetch, isAuthenticated]);

  useEffect(() => {
    if (!profileData || !profileData.data) {
      const preferredView = profileData?.data.preferred_view || 'app';
      const currentPath = location.pathname;

      const inAppView = currentPath.startsWith('/app');
      const inDashboard = currentPath.startsWith('/dashboard');

      if (preferredView === 'dashboard' && inAppView) {
        navigate('/dashboard/overview', { replace: true });
      } else if (preferredView === 'app' && inDashboard) {
        navigate('/app/overview', { replace: true });
      }
    }
  }, [location.pathname, navigate, profileData]);

  return <>{children}</>;
};
