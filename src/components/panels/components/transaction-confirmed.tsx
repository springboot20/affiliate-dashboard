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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-green-600 mb-4">Transaction Initialized</h2>

      <div className="text-sm text-gray-700 space-y-2">
        <p>
          <span className="font-semibold">Reference:</span> {transaction?.reference}
        </p>
        <p>
          <span className="font-semibold">Amount:</span> ₦{transaction?.amount.toLocaleString()}{" "}
          {transaction?.currency}
        </p>
        <p>
          <span className="font-semibold">Type:</span> {transaction?.type}
        </p>
        <p>
          <span className="font-semibold">Description:</span> {transaction?.description}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`font-medium ${
              transaction?.status === "IN_PROGRESS" ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {transaction?.status.replace("_", " ")}
          </span>
        </p>
        <p>
          <span className="font-semibold">Sender Account:</span>{" "}
          {transaction?.detail.senderAccountNumber}
        </p>
        <p>
          <span className="font-semibold">Receiver Account:</span>{" "}
          {transaction?.detail.receiverAccountNumber}
        </p>
        <p>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(transaction?.createdAt).toLocaleString()}
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-500 text-center">
        Redirecting to Paystack in <span className="font-semibold text-black">{counter}</span>{" "}
        seconds...
      </p>

      <a
        onClick={() => {
          window.open(authorizationUrl, "_blank", "width=600,height=700");
          handleClose();
        }}
        className="block text-center mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded cursor-pointer"
      >
        Click Here to Pay Now
      </a>
    </div>
  );
};
