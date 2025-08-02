import { TransactionProps } from "@/types/account";
import { formatMoney } from "@/utils";
import { ArrowLeftIcon, BellAlertIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const FailedState = ({ transaction }: TransactionProps) => (
  <div className="text-center">
    <div className="mb-6">
      <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />
    </div>
    <h2 className="text-2xl font-bold text-red-800 mb-4">Payment Failed</h2>
    <p className="text-gray-600 mb-6">Unfortunately, your payment could not be processed.</p>
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Transaction Reference:</span>
          <span className="font-mono text-sm font-medium">{transaction?.reference}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-bold">
            {formatMoney(
              transaction?.amount,
              transaction?.currency === "USD" ? "USD" : "NGN",
              transaction?.currency === "USD" ? "en-US" : "en-NG"
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className="text-red-600 font-medium">Failed</span>
        </div>
      </div>
    </div>
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <BellAlertIcon className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
        <div className="text-left">
          <p className="text-yellow-800 font-medium mb-1">Common reasons for payment failure:</p>
          <ul className="text-yellow-700 text-sm space-y-1 list-disc">
            <li> Insufficient funds in your account</li>
            <li> Network connectivity issues</li>
            <li> Card expired or blocked</li>
            <li> Transaction limit exceeded</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      <button
        // onClick={handleRetry}
        className="w-full bg-[#A1E96F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#A1E96F]/90 transition-colors"
      >
        Try Again
      </button>
      <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
        <ArrowLeftIcon className="w-4 h-4 inline mr-2" />
        Back to Checkout
      </button>
    </div>
  </div>
);
