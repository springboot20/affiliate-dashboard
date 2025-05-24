import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  success: boolean;
  message: string;
  statusCode: number;
}

export const TransactionApiSlice = ApiService.injectEndpoints({
  endpoints: (build) => ({
    sendTransaction: build.mutation<Response, Record<string, any>>({
      query: (data) => {
        console.log(data);
        return {
          url: "/transactions/paystack/send-transaction",
          method: "POST",
          body: { ...data },
        };
      },
    }),

    validateTransactionPin: build.mutation<Response, Record<string, any>>({
      query: (data) => {
        return {
          url: "/transactions/paystack/validate-pin",
          method: "POST",
          body: { ...data },
        };
      },
    }),
  }),
});

export const { useSendTransactionMutation, useValidateTransactionPinMutation } =
  TransactionApiSlice;
