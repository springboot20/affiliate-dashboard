import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "@/context/ProfileContext";
import { useEffect } from "react";

/**
 * ViewRedirector component to ensure the user is in the correct view
 * based on their preferred view setting.
 * Place this near the top level of your application.
 */
export const ViewRedirector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { preferred_view, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading) return;

    // Skip redirects for auth and special routes
    if (location.pathname.startsWith("/auth") || location.pathname === "/") {
      return;
    }

    const shouldBeIn = preferred_view;
    const inDashboard = location.pathname.startsWith("/dashboard");
    const inAppView = location.pathname.startsWith("/app");

    if (shouldBeIn === "app" && !inAppView) {
      const newPath = location.pathname.replace(/^\/dashboard/, "/app");
      if (newPath === location.pathname) {
        // fallback redirect if replacement didn't work
        navigate("/dasboard/overview");
      } else {
        navigate(newPath);
      }
    }
    // Only redirect if user is in the wrong view
    else if (shouldBeIn === "dashboard" && !inDashboard) {
      const newPath = location.pathname.replace(/^\/app/, "/dashboard");
      if (newPath === location.pathname) {
        // fallback redirect if replacement didn't work
        navigate("/app/overview");
      } else {
        navigate(newPath);
      }
    }
  }, [isLoading, location, navigate, preferred_view]);

  // This component doesn't render anything
  return <>{children}</>;
};
