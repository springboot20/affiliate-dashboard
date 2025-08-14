import { LocalStorage } from "@/utils";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ErrorRedirect() {
  const env = import.meta.env;
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);
  const [isRetrying, setIsRetrying] = useState(false);
  const url = env.MODE === "production" ? env?.["VITE_DEPLOYED_URL"] : env?.["VITE_LOCAL_BASE_URL"];

  const [searchParams] = useSearchParams();
  const errorReason = searchParams.get("reason");
  const errorMessage = searchParams.get("message");

  const getErrorMessage = () => {
    switch (errorReason) {
      case "server-error":
        return errorMessage || "Something went wrong on our end. Please try again in a moment.";
      case "auth-failed":
        return "Google authentication failed. Please try again.";
      case "wrong-login-method":
        return errorMessage;
      case "no-email":
        return "Google didn't provide an email address. Please ensure your Google account has an email.";
      case "user-not-found":
        return "User account could not be created or found.";
      default:
        return errorMessage || "An unexpected error occurred during login.";
    }
  };

  const handleRetry = () => {
    if (isRetrying) return;

    // Adjust based on your backend route
    const googleLoginUrl = `${url}/auth/google`;
    setIsRetrying(true);

    // Open Google login in a centered popup window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    LocalStorage.remove("accessToken");
    LocalStorage.remove("refreshToken");

    setTimeout(async () => await Promise.resolve(), 1000);

    window.open(
      googleLoginUrl,
      "googleAuth",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
  };

  const handleGoToLogin = () => {
    navigate("/auth/login");
  };

  useEffect(() => {
    if (counter <= 0) {
      handleRetry();
    }
    const timer = setInterval(() => {
      setCounter((prev) => {
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  useEffect(() => {
    return () => {
      setCounter(0); // This will stop the timer
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <ExclamationTriangleIcon className="text-red-500 w-14 h-14" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Login Failed</h1>
        <p className="mt-2 text-gray-600">{getErrorMessage()}</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full transition-all"
          >
            <ArrowPathIcon className="w-4 h-4" /> Try Google Again
          </button>
          <button
            onClick={handleGoToLogin}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg w-full transition-all"
          >
            <LockClosedIcon className="w-4 h-4" /> Use Another Method
          </button>
        </div>

        {!isRetrying && (
          <div className="mt-4 text-sm text-gray-500">
            Auto-retrying in <span className="font-semibold text-red-500">{counter}</span>{" "}
            seconds...
            <button
              onClick={() => setCounter(0)}
              className="ml-2 text-blue-500 hover:text-blue-600 underline"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400">Error Code: {errorReason}</div>
      </div>
    </div>
  );
}
