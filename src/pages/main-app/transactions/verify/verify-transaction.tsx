import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/app/hook";
import { TransactionApiSlice } from "@/features/transactions/transaction.slice";
import { SuccessState } from "./components/success";
import { PendingState } from "./components/pending";
import { FailedState } from "./components/failed";
import { ErrorState } from "./components/error";
import { TransactionProps } from "@/types/account";

type TransactionStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED" | "success";

export default function VerifyPaystackPayment() {
  const [data, setData] = useState<TransactionProps>({} as TransactionProps);
  const [status, setStatus] = useState("IN_PROGRESS");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [isVerifying, setIsVerifying] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const handleNormalizeStatus = useCallback((response: TransactionProps): TransactionStatus => {
    const statusValue = response?.status || response?.transactionStatus;
    const normalized = statusValue?.toLowerCase();

    switch (normalized) {
      case "completed":
      case "success":
        return "COMPLETED";

      case "failed":
        return "FAILED";

      case "in_progress":
        return "IN_PROGRESS";

      default:
        return (statusValue as TransactionStatus) || "IN_PROGRESS";
    }
  }, []);

  const verifyPaystackPayment = useCallback(
    async (trxref: string, reference: string, isRetry = false) => {
      if (isVerifying && !isRetry) return;

      setIsVerifying(true);
      setError(null);

      console.log("re-rendering");

      try {
        const api = await dispatch(
          TransactionApiSlice.endpoints.verifyPayment.initiate({ trxref, reference })
        ).unwrap();

        const response = api.data;

        if (api.success !== false) {
          const normalizedStatus = handleNormalizeStatus(response?.transaction);

          setData((prev) => ({ ...prev, ...response?.transaction }));
          setStatus(normalizedStatus);

          retryCountRef.current = 0;
        } else {
          throw new Error(response.message || "Verification failed");
        }
      } catch (err: any) {
        const errData = err?.data?.data?.transaction || {};
        const errMsg = err?.data?.message || err?.message || "Verification failed";

        setError(errMsg);
        setData(errData);
        setStatus(handleNormalizeStatus(errData));

        // Retry with exponential backoff
        if (retryCountRef.current < maxRetries && !err?.data?.status) {
          retryCountRef.current += 1;
          console.log(`Retrying verification (${retryCountRef.current}/${maxRetries})`);
          const delay = Math.pow(2, retryCountRef.current) * 1000;

          console.log(delay);

          setTimeout(() => {
            verifyPaystackPayment(trxref, reference, true);
          }, delay);
        } else {
          setStatus("ERROR");
        }
      }
    },
    [dispatch, handleNormalizeStatus, isVerifying]
  );

  const extractTransactionParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      trxref: params.get("trxref"),
      reference: params.get("reference"),
    };
  };

  useEffect(() => {
    const { trxref, reference } = extractTransactionParams();

    if (trxref && reference) {
      verifyPaystackPayment(trxref, reference, false);
    } else {
      // Handle missing parameters
      setStatus("ERROR");
      setError("Missing transaction parameters");
    }
  }, [verifyPaystackPayment]);

  const handleRetry = useCallback(() => {
    const { trxref, reference } = extractTransactionParams();

    if (trxref && reference) {
      retryCountRef.current = 0; // Reset retry count for manual retry
      setStatus("IN_PROGRESS");
      setError(null);
      verifyPaystackPayment(trxref, reference, true);
    }
  }, [verifyPaystackPayment]);

  const renderTransactionStatus = () => {
    const { reference } = extractTransactionParams();

    const props = {
      transaction: data,
      isLoading: isVerifying,
      reference,
      error,
      onRetry: handleRetry,
      canRetry: retryCountRef.current < maxRetries,
    };

    switch (status) {
      case "COMPLETED":
        return <SuccessState {...props} />;

      case "FAILED":
        return <FailedState {...props} />;

      case "ERROR":
        return <ErrorState {...props} />;

      case "IN_PROGRESS":
        return <PendingState {...props} />;

      default:
        return <PendingState {...props} />;
    }
  };

  return (
    <section className="py-24 lg:py-[8rem]">
      <div className="max-w-xl mx-auto px-4 2xl:px-0">{renderTransactionStatus()}</div>
    </section>
  );
}
