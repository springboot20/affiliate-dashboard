import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hook";
import { useState, useEffect } from "react";
import { Loader } from "./Loader";
import { useProfile } from "@/context/ProfileContext";

export const AppSwitcher: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { preferred_view, isLoading, location } = useProfile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setReady(true);
    }
  }, [isLoading]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  console.log(preferred_view);
  console.log(location);

  // Show loading while fetching profile data
  if (!ready || isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return <Navigate to={location || `/${preferred_view}`} replace />;
};
