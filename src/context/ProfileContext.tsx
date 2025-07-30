import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useAppSelector } from "../app/hook";
import { useGetProfileQuery } from "@/features/profile/profile.slice";

type ProfileContextProps = {
  preferred_view: "app" | "dashboard";
  updatePreferredView: (view: "app" | "dashboard") => void;
  isLoading: boolean;
  location: string;
  refetchProfile: () => void;
  setLocation: (location: string) => void;
};

type ProfileContextProviderProps = {
  children: React.ReactNode;
};

const ProfileContext = createContext<ProfileContextProps>({
  preferred_view: "app",
  location: "",
  updatePreferredView: () => {},
  isLoading: false,
  refetchProfile: () => {},
  setLocation: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<ProfileContextProviderProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [preferredView, setPreferredView] = useState<"app" | "dashboard">(
    (localStorage.getItem("preferred_view") as "app" | "dashboard") || "app"
  );
  const [location, setLocation] = useState<string>("");

  const {
    data: profileData,
    refetch,
    isLoading,
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  console.log(profileData?.data);

  const handleSetLocation = useCallback((loc: string) => {
    setLocation(loc);
  }, []);

  useEffect(() => {
    if (profileData?.data?.profile?.preferred_view) {
      setPreferredView(profileData.data.profile.preferred_view as "app" | "dashboard");
      localStorage.setItem("preferred_view", profileData.data.profile.preferred_view);
    }
  }, [profileData]);

  const updatePreferredView = useCallback((view: "app" | "dashboard") => {
    setPreferredView(view);
  }, []);

  const value = useMemo(
    () => ({
      preferred_view: preferredView,
      updatePreferredView,
      isLoading,
      refetchProfile: refetch,
      location,
      setLocation: handleSetLocation,
    }),
    [preferredView, updatePreferredView, isLoading, refetch, location, handleSetLocation]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
