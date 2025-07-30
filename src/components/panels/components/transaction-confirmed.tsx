import { CreditCardIcon } from "@/components/icons/Icons";
import { classNames, formatMoney } from "@/utils";
import { ArrowRightIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

interface TransactionDetail {
  gateway: string;
  receiverAccountNumber: string;
  senderAccountNumber: string;
  _id: string;
}

interface TransactionConfirmedProps {
  authorizationUrl: string;
  transaction: {
    amount: number;
    currency: string;
    description: string;
    reference: string;
    status: string;
    type: string;
    detail: TransactionDetail;
    createdAt: string;
  };
}

export const TransactionConfirmed = ({
  authorizationUrl,
  transaction,
  handleClose,
}: TransactionConfirmedProps & { handleClose: () => void }) => {
  const [counter, setCounter] = useState(5);
  const [redirected, setRedirected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const openPaystack = useCallback(() => {
    const popup = window.open(authorizationUrl, "_blank", "width=600,height=700");

    if (!popup) {
      console.warn("Popup blocked. User can click manually.");
    }

    setRedirected(true);

    // Delay closing UI by 2 seconds
    setTimeout(() => {
      handleClose();
    }, 5000);
  }, [authorizationUrl, handleClose]);

  useEffect(() => {
    if (counter === 0 && !redirected) {
      openPaystack();
    }

    const timer = setInterval(() => {
      setCounter((prev) => {
        return Math.max(prev - 1, 0);
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [counter, openPaystack, redirected]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "text-amber-600 bg-amber-50";
      case "COMPLETED":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 overflow-hidden">
      {/* Header Section */}
      <div className="relative p-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-t-2xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-pulse">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Initialized</h2>
          <p className="text-gray-600">Your payment is ready to be processed</p>
        </div>
      </div>

      {/* Amount Display */}
      <div className="px-4 mt-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Amount</p>
            <p className="text-3xl font-bold text-gray-800">
              {formatMoney(transaction?.amount, "NGN", "ngn")}
            </p>
            <p className="text-sm text-gray-600 mt-1">{transaction?.description}</p>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="px-4 pb-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 space-y-4 border border-white/30">
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reference</span>
              <span className="font-mono text-gray-800 text-xs bg-gray-100 px-2 py-1 rounded">
                {transaction?.reference}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Type</span>
              <span className="capitalize text-gray-800 font-medium">{transaction?.type}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  transaction?.status
                )}`}
              >
                {transaction?.status.replace("_", " ")}
              </span>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From</span>
                <span className="font-mono text-xs text-gray-800">
                  {transaction?.detail.senderAccountNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">To</span>
                <span className="font-mono text-xs text-gray-800">
                  {transaction?.detail.receiverAccountNumber}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Created</span>
              <span className="text-xs text-gray-800">
                {new Date(transaction?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="px-8 pb-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center border border-blue-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ClockIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Auto-redirect in</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {counter > 0 ? `${counter}s` : "Redirecting..."}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-8 pb-8">
        <button
          onClick={() => {
            window.open(authorizationUrl, "_blank", "width=600,height=700");
            handleClose();
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={classNames(
            `w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center justify-center gap-3 group`,

            isHovered ? "scale-105" : "scale-100"
          )}
        >
          <CreditCardIcon className="w-5 h-5" />
          <span>Complete Payment Now</span>
          <ArrowRightIcon
            className={classNames(
              `w-5 h-5 transition-transform duration-200`,
              isHovered ? "translate-x-1" : "translate-x-0"
            )}
          />
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Secured by Paystack • Your payment information is encrypted
        </p>
      </div>
    </div>
  );
};
