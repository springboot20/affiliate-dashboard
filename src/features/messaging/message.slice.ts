import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}

export const MessagingApiSlice = ApiService.injectEndpoints({
  endpoints: (build) => {
    return {
      sendRequesMessage: build.mutation<Response, { action: string; message: string }>({
        query: ({ action, message }) => {
          return {
            url: "/messagings/admin-requests-message",
            body: { action, message },
            method: "POST",
          };
        },
      }),

      getUserPendingRequesMessage: build.query<Response, void>({
        query: () => {
          return {
            url: "/messagings/admin-requests-message/user-pending",
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useSendRequesMessageMutation, useGetUserPendingRequesMessageQuery } =
  MessagingApiSlice;
