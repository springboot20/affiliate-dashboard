import AppLayout from "@/layout/AppLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";

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
import MainTransactionDetails from "@/pages/main-app/transactions/transaction-details";
import MainAccounts from "@/pages/main-app/accounts/accounts";
import MainAccountsForm from "@/pages/main-app/accounts/components/account-forms";
import EditAccount from "@/pages/main-app/accounts/components/edit-account";
import MainCards from "@/pages/main-app/cards/cards";
import { AppSwitcher } from "@/components/app-switcher";
import { ViewRedirector } from "@/components/view-redirector";
import Notifications from "@/pages/main-app/notifications/notifications";
import NotificationDetails from "@/pages/main-app/notifications/details/notification-details";
import TestNotification from "@/pages/main-app/notifications/TestNotification";
import VerifyPaystackPayment from "@/pages/main-app/transactions/verify/verify-transaction";

export const router = createBrowserRouter([
  {
    // Root path redirects to app switcher or login based on auth status
    path: "/",
    element: <AppSwitcher />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <ViewRedirector>
          <MainLayout />
        </ViewRedirector>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "test",
        element: <TestNotification />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "notifications/:notificationId",
        element: <NotificationDetails />,
      },

      {
        path: "overview",
        element: <MainAppOverview />,
      },
      {
        path: "accounts",
        children: [
          {
            index: true,
            element: <MainAccounts />,
          },
          {
            path: "new-account",
            element: <MainAccountsForm />,
          },
          {
            path: "edit-account/:accountId",
            element: (
              <ProtectedRoute>
                <EditAccount />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "transactions",
        children: [
          {
            index: true,
            element: <MainTransactions />,
          },
          {
            path: "detail/:transactionId",
            element: <MainTransactionDetails />,
          },
          {
            path: "verify",
            element: <VerifyPaystackPayment />,
          },
        ],
      },
      {
        path: "cards",
        element: <MainCards />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ViewRedirector>
        <AppLayout />
      </ViewRedirector>
    ),
    children: [
      {
        path: "overview",
        element: <OverView />,
      },
      {
        path: "transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "accounts",
        element: (
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        ),
      },

      {
        path: "investments",
        element: (
          <ProtectedRoute>
            <Investments />
          </ProtectedRoute>
        ),
      },

      {
        path: "credit-cards",
        element: (
          <ProtectedRoute>
            <CreditCards />
          </ProtectedRoute>
        ),
      },

      {
        path: "loans",
        element: (
          <ProtectedRoute>
            <Loans />
          </ProtectedRoute>
        ),
      },

      {
        path: "services",
        element: (
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        ),
      },

      {
        path: "settings",
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
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
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
  {
    // Catch-all route for 404 errors
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
