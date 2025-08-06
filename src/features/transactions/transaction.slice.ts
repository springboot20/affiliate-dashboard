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
    getAllAccounts: build.query<Response, RequestQuery>({
      query: ({ limit = 10, page = 1 }) => ({
        url: `/accounts/?limit=${limit}&page=${page}`,
      }),
    }),

    sendTransaction: build.mutation<Response, Record<string, any>>({
      query: (data) => {
        return {
          url: "/transactions/paystack/transfer",
          method: "POST",
          body: { ...data },
        };
      },
    }),

    depositTransaction: build.mutation<Response, Record<string, any>>({
      query: (data) => {
        return {
          url: "/transactions/paystack/deposit",
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

    getTransactionDetails: build.query<Response, string>({
      query: (transactionId) => ({
        url: `/transactions/details?transactionId=${transactionId}`,
      }),
    }),

    deleteTransaction: build.mutation<Response, string>({
      query: (transactionId) => ({
        url: `/transactions/delete?transactionId=${transactionId}`,
        method: "DELETE",
      }),
    }),

    userTransactions: build.query<Response, RequestQuery>({
      query: ({ limit = 10, page = 1, search = "", type = "", accountId }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append("search", search);
        if (type) params.append("type", type);
        if (accountId) params.append("accountId",accountId);

        return {
          url: `/transactions/user?${params.toString()}`,
        };
      },
    }),

    downloadReceipt: build.mutation<any, string>({
      query: (transactionId) => ({
        url: `/transactions/receipt/download/${transactionId}`,
        method: "GET",
      }),
    }),

    getReceiptData: build.query<Response, string>({
      query: (transactionId) => `/transactions/receipt/share/${transactionId}`,
    }),

    verifyPayment: build.query<Response, RequestQuery>({
      query: ({ trxref, reference }) => {
        const params = new URLSearchParams({
          trxef: trxref?.toString(),
          reference: reference?.toString(),
        });

        return {
          url: `/transactions/paystack/verify-callback?${params.toString()}`,
        };
      },
    }),
  }),
});

export const {
  useSendTransactionMutation,
  useValidateTransactionPinMutation,
  useGetAllTransactionsQuery,
  useGetTransactionDetailsQuery,
  useUserTransactionsQuery,
  useGetAllAccountsQuery,
  useDepositTransactionMutation,
  useVerifyPaymentQuery,
  useDeleteTransactionMutation,
  useDownloadReceiptMutation,
  useGetReceiptDataQuery,
} = TransactionApiSlice;
