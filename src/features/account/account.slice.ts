import { ApiService } from '@/app/service/api.service';

interface Response {
  data: any;
  success: boolean;
  message: string;
  statusCodes: number;
}

export const AccountApiSlice = ApiService.injectEndpoints({
  endpoints(build) {
    return {
      getUserAccounts: build.query<Response, void>({
        query: () => '/accounts/user-accounts',
      }),

      generateAccountNumber: build.mutation<Response, void>({
        query: () => ({
          url: '/accounts/user-account/generate-account-number',
          method: 'POST',
          body: {},
        }),
      }),
    };
  },
});

export const { useGetUserAccountsQuery, useGenerateAccountNumberMutation } = AccountApiSlice;
