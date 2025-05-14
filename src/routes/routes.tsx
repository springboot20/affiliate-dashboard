import AppLayout from "@/layout/AppLayout";
import { createBrowserRouter } from "react-router-dom";

import { Forgot } from "@/pages/auth/forgot-password/Forgot";
import { Accounts } from "@/pages/dashboard/account/Accounts";
import { CreditCards } from "@/pages/dashboard/credit-cards/CreditCards";
import { OverView } from "@/pages/dashboard/OverView";
import { Investments } from "@/pages/dashboard/investments/Investments";
import { Login } from "@/pages/auth/login/login";
import { Register } from "@/pages/auth/register/register";
import { Transactions } from "@/pages/dashboard/transactions/Transactions";
import { SendEmail } from "@/pages/auth/verify/SendMail.tsx";
import { ProtectedRoute } from "@/components/Protected";
import { PublicRoute } from "@/components/Public";
import { EmailVerification } from "@/pages/auth/verify/EmailVerification";
import { EmailSentMessage } from "@/pages/auth/verify/EmailSent";
import { Settings } from "@/pages/dashboard/settings/Settings";
import { Loans } from "@/pages/dashboard/loans/Loans";
import { Services } from "@/pages/dashboard/services/Services";

import MainLayout from "@/layout/MainLayout";
import MainAppOverview from "@/pages/main-app/overview";
import MainTransactions from "@/pages/main-app/transactions/transactions";
import MainAccounts from "@/pages/main-app/accounts/accounts";
import MainCards from "@/pages/main-app/cards/cards";

export const router = createBrowserRouter([
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        path:"overiew",
        element: <MainAppOverview />,
      },
      {
        path:"accounts",
        element: <MainAccounts />,
      },
      {
        path: "transactions",
        element: <MainTransactions />,
      },
      {
        path: "cards",
        element: <MainCards />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <OverView />,
      },

      {
        path: "/dashboard/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/accounts",
        element: (
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/investments",
        element: (
          <ProtectedRoute>
            <Investments />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/credit-cards",
        element: (
          <ProtectedRoute>
            <CreditCards />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/loans",
        element: (
          <ProtectedRoute>
            <Loans />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/services",
        element: (
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        ),
      },

      {
        path: "/dashboard/settings",
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
