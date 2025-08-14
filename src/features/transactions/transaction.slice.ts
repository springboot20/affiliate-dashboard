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

      providesTags: (result) =>
        result?.data?.docs?.length
          ? [
              ...result.data.docs.map((account: Record<string, any>) => ({
                type: "Account" as const,
                id: account._id,
              })),
              { type: "Account", id: "ACCOUNT" },
            ]
          : [{ type: "Account", id: "ACCOUNT" }],
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
      providesTags: (result) =>
        result?.data?.docs?.length
          ? [
              ...result.data.docs.map((transaction: Record<string, any>) => ({
                type: "Transaction" as const,
                id: transaction._id,
              })),
              { type: "Transaction", id: "TRANSACTION" },
            ]
          : [{ type: "Transaction", id: "TRANSACTION" }],
    }),

    getTransactionDetails: build.query<Response, string>({
      query: (transactionId) => ({
        url: `/transactions/details?transactionId=${transactionId}`,
      }),
      providesTags: (_, __, transactionId) => [{ type: "Transaction", id: transactionId }],
    }),

    deleteTransaction: build.mutation<Response, string>({
      query: (transactionId) => ({
        url: `/transactions/delete?transactionId=${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, transactionId) => [{ type: "Transaction", id: transactionId }],
    }),

    userTransactions: build.query<Response, RequestQuery>({
      query: ({ limit = 10, page = 1, search = "", type = "", accountId }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append("search", search);
        if (type) params.append("type", type);
        if (accountId) params.append("accountId", accountId);

        return {
          url: `/transactions/user?${params.toString()}`,
        };
      },
      providesTags: (result) =>
        result?.data?.docs?.length
          ? [
              ...result.data.docs.map((transaction: Record<string, any>) => ({
                type: "Transaction" as const,
                id: transaction._id,
              })),
              { type: "Transaction", id: "USER_TRANSACTION" },
            ]
          : [{ type: "Transaction", id: "USER_TRANSACTION" }],
    }),

    downloadReceipt: build.mutation<any, string>({
      query: (transactionId) => ({
        url: `/transactions/receipt/download/${transactionId}`,
        method: "GET",
      }),

      invalidatesTags: (_, __, transactionId) => [{ type: "Transaction", id: transactionId }],
    }),

    getReceiptData: build.query<Response, string>({
      query: (transactionId) => `/transactions/receipt/share/${transactionId}`,
      providesTags: (_, __, transactionId) => [{ type: "Transaction", id: transactionId }],
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
      providesTags: () => [{ type: "Transaction" }],
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
