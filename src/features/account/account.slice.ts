import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  success: boolean;
  message: string;
  statusCode: number;
}

export const AccountApiSlice = ApiService.injectEndpoints({
  endpoints(build) {
    return {
      createNewAccount: build.mutation<Response, { [key: string]: any }>({
        query: (data) => ({
          url: "/accounts/create",
          method: "POST",
          body: data,
        }),
      }),

      closeUserAccount: build.mutation<Response, { accountId: string }>({
        query: ({ accountId }) => ({
          url: `/accounts/user-accounts/close/${accountId}`,
          method: "PATCH",
        }),
      }),

      updateAccountStatus: build.mutation<
        Response,
        { accountId: string; type: string; status: string; currency: string }
      >({
        query: ({ accountId, ...rest }) => {
          return {
            url: `/accounts/user-accounts/${accountId}`,
            method: "PATCH",
            body: { ...rest },
          };
        },
      }),

      getUserAccounts: build.query<Response, void>({
        query: () => "/accounts/user-accounts",
      }),

      validateAccountNumber: build.mutation<Response, string>({
        query: (accountNumber) => ({
          url: "/accounts/validate-account",
          body: { accountNumber },
          method: "POST",
        }),
      }),

      getAccountDetails: build.query<Response, { accountId: string }>({
        query: ({ accountId }) => {
          return {
            url: `/accounts/user-accounts/${accountId}`,
            method: "GET",
          };
        },
        providesTags: () => ["Account"],
      }),

      getAccountByNumber: build.query<Response, { account_number: string }>({
        query: ({ account_number }) => {
          const params = new URLSearchParams({
            account_number: account_number.toString(),
          });

          return {
            url: `/accounts/user-accounts/by-number?${params.toString()}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useGetUserAccountsQuery,
  useCloseUserAccountMutation,
  useUpdateAccountStatusMutation,
  useCreateNewAccountMutation,
  useValidateAccountNumberMutation,
  useGetAccountDetailsQuery,
  useGetAccountByNumberQuery,
} = AccountApiSlice;
