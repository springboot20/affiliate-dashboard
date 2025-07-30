import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hook";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useUpdateProfileMutation } from "@/features/profile/profile.slice";
import { toast } from "react-toastify";
import { useProfile } from "@/context/ProfileContext";
import React from "react";
import { classNames } from "@/utils";

// This component can be added to both AppLayout.tsx and MainLayout.tsx
export const AppSwitcherButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { updatePreferredView } = useProfile();

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  if (!isAuthenticated) {
    return null;
  }

  const isDashboard = location.pathname.startsWith("/dashboard");
  const newPreferredView = isDashboard ? "app" : "dashboard";

  const handleSwitchApp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      // Call the original onClick handler if provided
      if (onClick) {
        onClick(event);
      }

      // If the event was prevented in the original handler, don't proceed
      if (event.defaultPrevented) {
        return;
      }

      // Update user preference when switching views
      await updateProfile({
        preferred_view: newPreferredView,
      }).unwrap();

      updatePreferredView(newPreferredView);

      console.log(isDashboard);

      // Navigate to the appropriate route
      if (isDashboard) {
        navigate("/app/overview");
      } else {
        navigate("/dashboard/overview");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update preference";
      toast(errorMessage, { type: "error" });
    }
  };

  return (
    <button
      {...props}
      onClick={handleSwitchApp}
      disabled={isLoading}
      ref={ref}
      className={classNames(
        "flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium truncate overflow-hidden rounded transition-colors",
        isLoading ? "pointer-events-none opacity-70" : ""
      )}
    >
      <ArrowsRightLeftIcon className="shrink-0 size-6" />
      <span>
        {isLoading ? "Switching..." : `Switch to ${isDashboard ? "Banking App" : "Dashboard"}`}
      </span>
    </button>
  );
});
