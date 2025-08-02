import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hook";
import { TransactionApiSlice } from "@/features/transactions/transaction.slice";
import { SuccessState } from "./components/success";
import { PendingState } from "./components/pending";
import { FailedState } from "./components/failed";

export default function VerifyPaystackPayment() {
  const [data, setData] = useState<Record<string, any>>({});
  const [status, setStatus] = useState("IN_PROGRESS");
  const dispatch = useAppDispatch();

  const verifyPaystackPayment = useCallback(
    async (trxref: string, reference: string) => {
      try {
        const api = await dispatch(
          TransactionApiSlice.endpoints.verifyPayment.initiate({ trxref, reference })
        ).unwrap();

        const response = api.data;

        console.log(response);

        if (response.status) {
          setData(response.data);
          setStatus(response.data?.status ?? response.data?.transactionStatus);
        }
      } catch (error: any) {
        console.log(error);
      }
    },
    [dispatch]
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

  const renderTransactionStatus = () => {
    switch (status) {
      case "COMPLETED":
      case "success":
        return <SuccessState transaction={data?.transaction} />;
      case "IN_PROGRESS":
        return <PendingState transaction={data?.transaction} />;
      case "FAILED":
        return <FailedState transaction={data?.transaction} />;
    }
  };

  return (
    <section className="py-24 lg:py-[8rem]">
      <div className="max-w-xl mx-auto px-4 2xl:px-0">{renderTransactionStatus()}</div>
    </section>
  );
}
