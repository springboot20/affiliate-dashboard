7 import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ErrorRedirect() {
  const env = import.meta.env;

  const [counter, setCounter] = useState(10);

  const url = env.MODE === "production" ? env?.["VITE_DEPLOYED_URL"] : env?.["VITE_LOCAL_BASE_URL"];

  const [searchParams] = useSearchParams();
  const errorReason = searchParams.get("error") || searchParams.get("reason");

  const errorMessages: Record<string, string> = {
    "wrong-login-method":
      "You have previously registered using another login method. Please use that method to access your account.",
    GOOGLE_REGISTERED: "This Google account is already registered. Please log in instead.",
    default: "Something went wrong while logging in with Google. Please try again.",
  };

  const message = errorMessages[errorReason!];

  const handleRetry = () => {
    // Adjust based on your backend route
    const googleLoginUrl = `${url}/auth/google`;

    // Open Google login in a centered popup window
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      googleLoginUrl,
      "googleAuth",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
  };

  const handleGoToLogin = () => {
    window.location.href = "/auth/login"; // Adjust based on your login route
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          handleRetry();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <ExclamationTriangleIcon className="text-red-500 w-14 h-14" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Login Failed</h1>
        <p className="mt-2 text-gray-600">{message}</p>

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

        <div className="mt-4 text-sm text-gray-500">
          Redirecting to login in <span className="font-semibold">{counter}</span> seconds...
        </div>

        <div className="mt-4 text-xs text-gray-400">Error Code: {errorReason || "unknown"}</div>
      </div>
    </div>
  );
}
