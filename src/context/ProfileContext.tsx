import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../app/hook';
import { useGetProfileQuery } from '@/features/profile/profile.slice';

type ProfileContextProps = {
  preferred_view: 'app' | 'dashboard';
  updatePreferredView: (view: 'app' | 'dashboard') => void;
  isLoading: boolean;
  refetchProfile: () => void;
};

type ProfileContextProviderProps = {
  children: React.ReactNode;
};

const ProfileContext = createContext<ProfileContextProps>({
  preferred_view: 'app',
  updatePreferredView: () => {},
  isLoading: false,
  refetchProfile: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<ProfileContextProviderProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [preferredView, setPreferredView] = useState<'app' | 'dashboard'>('app');

  const {
    data: profileData,
    refetch,
    isLoading,
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (profileData?.data?.profile?.preferred_view) {
      setPreferredView(profileData.data.profile.preferred_view as 'app' | 'dashboard');
    }
  }, [profileData]);

  const updatePreferredView = (view: 'app' | 'dashboard') => {
    setPreferredView(view);
  };

  const value = {
    preferred_view: preferredView,
    updatePreferredView,
    isLoading,
    refetchProfile: refetch,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
