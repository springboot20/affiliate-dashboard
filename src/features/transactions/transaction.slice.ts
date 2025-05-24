import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  success: boolean;
  message: string;
  statusCode: number;
}

interface RequestQuery {
  [key: string]: any;
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

    getAllTransactions: build.query<Response, void>({
      query: () => ({
        url: "/transactions",
      }),
    }),

    userTransactions: build.query<Response, RequestQuery>({
      query: ({ limit = 10, page = 1, search = "" }) => {
        return {
          url: `/transactions/user?limit=${limit}&page=${page}&search=${search}`,
        };
      },
    }),
  }),
});

export const {
  useSendTransactionMutation,
  useValidateTransactionPinMutation,
  useGetAllTransactionsQuery,
  useUserTransactionsQuery,
} = TransactionApiSlice;
