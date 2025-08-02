import { TransactionProps } from "@/types/account";
import { classNames, formatMoney } from "@/utils";
import { ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface ComponentProps {
  transaction?: TransactionProps;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  canRetry?: boolean;
}

export const PendingState = ({ transaction, isLoading, onRetry }: ComponentProps) => {
  console.log(transaction);

  const [timeLeft, setTimeLeft] = useState(30);

  // Reset timer when verification starts
  useEffect(() => {
    if (isLoading) {
      setTimeLeft(30);
    }
  }, [isLoading]);

  // Countdown timer
  useEffect(() => {
    if (isLoading && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isLoading]);

  return (
    <div className="text-center">
      <div className="mb-6">
        <ArrowPathIcon
          className={classNames("w-16 h-16 text-[#152F00] mx-auto", isLoading && "animate-spin")}
        />
      </div>
      <h2 className="text-2xl font-bold text-[#152F00] mb-4">
        {isLoading ? "Verifying Transaction" : "Transaction Pending"}
      </h2>
      <p className="text-gray-600 mb-6">
        {isLoading
          ? "Please wait while we confirm your payment with Paystack..."
          : "Your transaction is being processed."}
      </p>
      <div className="bg-gray-50 border border-[#A1E96F] rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          <ClockIcon className="w-5 h-5 text-[#152F00] mr-2" />
          <span className="text-[#152F00] font-medium">
            {timeLeft > 0 ? `Verifying... ${timeLeft}s` : "Almost done..."}
          </span>
        </div>
        <div className="w-full bg-[#A1E96F]/20 rounded-full h-2">
          <div
            className="bg-[#A1E96F] h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(((30 - timeLeft) / 30) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      {/* Transaction details */}
      {transaction && (
        <div className="text-sm text-gray-500 space-y-1 mb-6">
          <p>Reference: {transaction.reference}</p>
          {transaction.amount && (
            <p>
              Amount:{" "}
              {formatMoney(
                transaction.amount,
                transaction.currency === "USD" ? "USD" : "NGN",
                transaction.currency === "USD" ? "en-US" : "en-NG"
              )}
            </p>
          )}
        </div>
      )}

      {/* Manual retry option when not loading */}
      {!isLoading && onRetry && (
        <button
          onClick={onRetry}
          className="w-full bg-[#A1E96F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#A1E96F]/90 transition-colors"
        >
          Check Status Again
        </button>
      )}
    </div>
  );
};
