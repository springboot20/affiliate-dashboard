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
      createNewAccount: build.mutation<Response, { [key: string]: any }>({
        query: (data) => ({
          url: '/accounts/create',
          method: 'POST',
          body: data,
        }),
      }),

      getUserAccounts: build.query<Response, void>({
        query: () => '/accounts/user-accounts',
      }),
    };
  },
});

export const { useGetUserAccountsQuery, useCreateNewAccountMutation } = AccountApiSlice;
