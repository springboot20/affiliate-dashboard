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
      getUserAccounts: build.query<Response, void>({
        query: () => "/accounts/user-accounts",
      }),
    };
  },
});

export const { useGetUserAccountsQuery } = AccountApiSlice;
