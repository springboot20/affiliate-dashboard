import { TransactionProps } from "@/types/account";
import { formatMoney } from "@/utils";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface ComponentProps {
  transaction?: TransactionProps;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  canRetry?: boolean;
}

export const SuccessState = ({ transaction }: ComponentProps) => {
  const navigate = useNavigate();

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "—";
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
      </div>

      <h2 className="text-2xl font-bold text-green-800 mb-4">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">Your transaction has been completed successfully.</p>

      {transaction && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transaction Reference:</span>
            <span className="font-mono font-medium">{transaction.reference}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-bold text-green-600">
              {formatMoney(
                transaction.amount,
                transaction.currency === "USD" ? "USD" : "NGN",
                transaction.currency === "USD" ? "en-US" : "en-NG"
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">{formatDate(transaction.createdAt)}</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => navigate("/app/transactions")}
          className="w-full bg-[#A1E96F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#A1E96F]/90 transition-colors"
        >
          Continue to Transactions
        </button>

        <button
          type="button"
          className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};
