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
        invalidatesTags: ["MessageRequest"],
        onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
          try {
            await queryFulfilled;
            // Refetch notifications after sending message
            dispatch(MessagingApiSlice.util.invalidateTags(["MessageNotification"]));
          } catch (error) {
            console.error("Failed to send message:", error);
          }
        },
      }),

      getRequestMessageById: build.query<Response, string>({
        query: (messageId) => ({
          url: `messagings/${messageId}`,
        }),

        providesTags: (_, __, messageId) => [{ type: "MessageRequest", id: messageId }],
      }),

      getUserPendingRequesMessage: build.query<Response, void>({
        query: () => {
          return {
            url: "/messagings/admin-requests-message/user-pending",
            method: "GET",
          };
        },
        providesTags: ["MessageNotification"],
      }),
    };
  },
});

export const {
  useSendRequesMessageMutation,
  useGetRequestMessageByIdQuery,
  useGetUserPendingRequesMessageQuery,
} = MessagingApiSlice;
