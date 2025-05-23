import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  success: boolean;
  message: string;
  statusCodes: number;
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

      deleteUserAccount: build.mutation<Response, { accountId: string }>({
        query: ({ accountId }) => ({
          url: `/accounts/user-account/${accountId}`,
          method: "DELETE",
        }),
      }),

      updateAccountStatus: build.mutation<
        Response,
        { accountId: string; type: string; status: string; currency: string }
      >({
        query: ({ accountId, ...rest }) => {
          console.log(rest);
          return {
            url: `/accounts/user-account/${accountId}`,
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
        query: ({ accountId }) => `/accounts/user-account/${accountId}`,
      }),
    };
  },
});

export const {
  useGetUserAccountsQuery,
  useDeleteUserAccountMutation,
  useUpdateAccountStatusMutation,
  useCreateNewAccountMutation,
  useValidateAccountNumberMutation,
  useGetAccountDetailsQuery,
} = AccountApiSlice;
