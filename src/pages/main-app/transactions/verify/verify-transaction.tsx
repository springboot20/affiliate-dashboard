import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/app/hook";
import { TransactionApiSlice } from "@/features/transactions/transaction.slice";
import { SuccessState } from "./components/success";
import { PendingState } from "./components/pending";
import { FailedState } from "./components/failed";
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

    switch (statusValue?.toLowerCase()) {
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

      try {
        const api = await dispatch(
          TransactionApiSlice.endpoints.verifyPayment.initiate({ trxref, reference })
        ).unwrap();

        const response = api.data;

        console.log(response);

        if (api.success) {
          const normalizedStatus = handleNormalizeStatus(response?.data?.transaction);

          setData((prev) => ({ ...prev, ...response?.data?.transaction }));
          setStatus(normalizedStatus);

          retryCountRef.current = 0;
        }
      } catch (error: any) {
        const errorMessage = error?.data?.message || error?.message;
        setError(errorMessage);

        if (retryCountRef.current < maxRetries && !error?.data?.status) {
          retryCountRef.current += 1;

          setTimeout(() => {
            verifyPaystackPayment(trxref, reference, true);
          }, Math.pow(2, retryCountRef.current) * 1000);
        } else {
          setStatus("FAILED");
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [dispatch, handleNormalizeStatus, isVerifying]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trxref = urlParams.get("trxref");
    const reference = urlParams.get("reference");

    if (trxref && reference) {
      verifyPaystackPayment(trxref, reference);
    }
  }, [verifyPaystackPayment]);

  console.log(data);

  const handleRetry = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const trxref = urlParams.get("trxref");
    const reference = urlParams.get("reference");

    if (trxref && reference) {
      retryCountRef.current = 0; // Reset retry count for manual retry
      setStatus("IN_PROGRESS");
      setError(null);
      verifyPaystackPayment(trxref, reference, true);
    }
  }, [verifyPaystackPayment]);

  const renderTransactionStatus = () => {
    const commonProps = {
      transaction: data,
      isLoading: isVerifying,
      error,
      onRetry: handleRetry,
      canRetry: retryCountRef.current < maxRetries,
    };

    switch (status) {
      case "COMPLETED":
      case "success":
        return <SuccessState {...commonProps} />;

      case "IN_PROGRESS":
        return <PendingState {...commonProps} />;

      case "FAILED":
        return <FailedState {...commonProps} />;

      default:
        return <PendingState {...commonProps} />;
    }
  };

  return (
    <section className="py-24 lg:py-[8rem]">
      <div className="max-w-xl mx-auto px-4 2xl:px-0">{renderTransactionStatus()}</div>
    </section>
  );
}
