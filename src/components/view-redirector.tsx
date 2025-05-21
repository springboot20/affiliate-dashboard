import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';
import { useEffect } from 'react';

/**
 * ViewRedirector component to ensure the user is in the correct view
 * based on their preferred view setting.
 * Place this near the top level of your application.
 */
export const ViewRedirector: React.FC<{children: React.ReactNode}> = ({children}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { preferred_view } = useProfile();

  useEffect(() => {
    // Skip redirects for auth and special routes
    if (location.pathname.startsWith('/auth') || location.pathname === '/') {
      return;
    }

    const inDashboard = location.pathname.startsWith('/dashboard');
    const inAppView = location.pathname.startsWith('/app');

    // Only redirect if user is in the wrong view type
    if (preferred_view === 'dashboard' && inAppView) {
      // Map the app route to corresponding dashboard route
      const dashboardPath = location.pathname.replace('/app', '/dashboard');
      navigate(dashboardPath, {
        replace: true,
        state: {
          from: location,
        },
      });
    } else if (preferred_view === 'app' && inDashboard) {
      // Map the dashboard route to corresponding app route
      const appPath = location.pathname.replace('/dashboard', '/app');
      navigate(appPath, {
        replace: true,
        state: {
          from: location,
        },
      });
    }
  }, [location.pathname, preferred_view, navigate, location]);

  // This component doesn't render anything
  return <>{children}</>;
};
