import { TransactionProps } from "@/types/account";
import { formatMoney } from "@/utils";
import { ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";

export const PendingState = ({
  timeLeft = 10,
  transaction,
}: TransactionProps & { timeLeft?: number }) => (
  <div className="text-center">
    <div className="mb-6">
      <ArrowPathIcon className="w-16 h-16 text-[#152F00] mx-auto animate-spin" />
    </div>
    <h2 className="text-2xl font-bold text-[#152F00] mb-4">Verifying Transaction</h2>
    <p className="text-gray-600 mb-6">Please wait while we confirm your payment with Paystack...</p>
    <div className="bg-gray-50 border border-[#A1E96F] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-center mb-2">
        <ClockIcon className="w-5 h-5 text-[#152F00] mr-2" />
        <span className="text-[#152F00] font-medium">Time remaining: {timeLeft}s</span>
      </div>
      <div className="w-full bg-[#A1E96F]/20 rounded-full h-2">
        <div
          className="bg-[#A1E96F] h-2 rounded-full transition-all duration-1000"
          style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
        ></div>
      </div>
    </div>
    <div className="text-sm text-gray-500">
      <p>Reference: {transaction?.reference}</p>
      <p>
        Amount:{" "}
        {formatMoney(
          transaction?.amount,
          transaction?.currency === "USD" ? "USD" : "NGN",
          transaction?.currency === "USD" ? "en-US" : "en-NG"
        )}
      </p>
    </div>
  </div>
);
