import { useDeleteRequestMessageMutation } from '@/features/messaging/message.slice';
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

      getUserMessageNotificatons: build.query<
        Response,
        {
          page?: number;
          limit?: number;
          status?: string;
        }
      >({
        query: ({ page = 1, limit = 10, status }) => {
          // Create URLSearchParams for query parameters
          const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          });

          if (status) params.append("status", status);

          return {
            url: `/messagings/admin-requests-message/user-requests?${params.toString()}`,
            method: "GET",
          };
        },

        providesTags: ["MessageNotification"],
        keepUnusedDataFor: 30, // Keep cache for 30 seconds
      }),

      getRequestMessageById: build.query<Response, string>({
        query: (messageId) => ({
          url: `messagings/${messageId}`,
        }),

        providesTags: (_, __, messageId) => [{ type: "MessageRequest", id: messageId }],
      }),

      deleteRequestMessage: build.mutation<Response, string>({
        query: (messageId) => ({
          url: `messagings/${messageId}`,
          method: "DELETE",
        }),

        invalidatesTags: (_, __, messageId) => [{ type: "MessageRequest", id: messageId }],
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
  useGetUserMessageNotificatonsQuery,
  useDeleteRequestMessageMutation
} = MessagingApiSlice;
