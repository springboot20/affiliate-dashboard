import AppLayout from "@/layout/AppLayout";
import { createBrowserRouter } from "react-router-dom";

import { Forgot } from "@/pages/forgot-password/Forgot";
import { Accounts } from "@/pages/account/Accounts";
import { CreditCards } from "@/pages/credit-cards/CreditCards";
import { OverView } from "@/pages/dashboard/OverView";
import { Investments } from "@/pages/investments/Investments";
import { Login } from "@/pages/login/login";
import { Register } from "@/pages/register/register";
import { Transactions } from "@/pages/transactions/Transactions";
import { SendEmail } from "@/pages/verify/SendMail";
import { ProtectedRoute } from "@/components/Protected";
import { PublicRoute } from "@/components/Public";
import { EmailVerification } from "@/pages/verify/EmailVerification";
import { EmailSentMessage } from "@/pages/verify/EmailSent";
import { Settings } from "@/pages/settings/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <OverView />,
      },

      {
        path: "/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },

      {
        path: "/accounts",
        element: (
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        ),
      },

      {
        path: "/investments",
        element: (
          <ProtectedRoute>
            <Investments />
          </ProtectedRoute>
        ),
      },

      {
        path: "/credit-cards",
        element: (
          <ProtectedRoute>
            <CreditCards />
          </ProtectedRoute>
        ),
      },

      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },

  {
    path: "/auth",
    children: [
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },

      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "email",
        children: [
          {
            path: "send-email",
            element: <SendEmail />,
          },
          {
            path: "verify-email",
            element: <EmailVerification />,
          },
        ],
      },
      {
        path: "email-sent-message",
        element: (
          <PublicRoute>
            <EmailSentMessage />
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute>
            <Forgot />
          </PublicRoute>
        ),
      },
    ],
  },
]);
