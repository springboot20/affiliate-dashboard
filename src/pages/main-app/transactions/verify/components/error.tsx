import { BellAlertIcon } from "@heroicons/react/24/outline";

interface ComponentProps {
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  canRetry?: boolean;
  reference?: string | null;
}

export const ErrorState = ({ onRetry, canRetry, reference }: ComponentProps) => {
  console.log(canRetry);

  return (
    <div className="text-center">
      <div className="mb-6">
        <BellAlertIcon className="w-16 h-16 text-orange-500 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-orange-800 mb-4">Verification Error</h2>
      <p className="text-gray-600 mb-6">
        We encountered an error while verifying your transaction.
      </p>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
        <div className="text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction Reference:</span>
            <span className="font-mono text-sm font-medium">{reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="text-orange-600 font-medium">Under Review</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <BellAlertIcon className="w-8 h-8 text-blue-600 mr-3 mt-0.5" />
          <div className="text-left">
            <p className="text-blue-800 font-medium mb-1">What happens next?</p>
            <p className="text-blue-700 text-sm">
              Don't worry! We're investigating this transaction. If payment was deducted from your
              account, it will be processed or refunded within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={!canRetry ? onRetry : undefined}
          className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          Check Again
        </button>
        <button className="w-full text-orange-600 py-2 px-6 rounded-lg font-medium hover:bg-orange-50 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};
