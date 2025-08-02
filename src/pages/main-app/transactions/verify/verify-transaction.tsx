import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hook";
import { TransactionApiSlice } from "@/features/transactions/transaction.slice";

export default function VerifyPaystackPayment() {
  const [data, setData] = useState<Record<string, any>>({});

  const dispatch = useAppDispatch();

  const verifyPaystackPayment = useCallback(
    async (trxref: string, reference: string) => {
      try {
        const api = await dispatch(
          TransactionApiSlice.endpoints.verifyPayment.initiate({ trxref, reference })
        ).unwrap();

        const response = api.data;

        console.log(response)

        if (response.status) {
          setData(response.data);
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

  return <div className=""></div>;
}
