import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}

interface CreateCard {
  card_number: string;
  card_name: string;
  valid_thru: string;
  type: string;
  primary_account: string;
  cvv: string;
}

export const CardApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    generateCardNumberDetails: builder.mutation<Response, void>({
      query: () => ({
        url: "/card/create-card/generate-number",
        method: "POST",
      }),
    }),

    getUserCards: builder.query<Response, void>({
      query: () => ({
        url: "/card/create-card",
        method: "GET",
      }),
    }),

    createNewCard: builder.mutation<Response, CreateCard>({
      query: (data) => ({
        url: "/card/create-card",
        body: data,
        method: "POST",
      }),
    }),
  }),
});

export const { useGenerateCardNumberDetailsMutation, useCreateNewCardMutation, useGetUserCardsQuery } = CardApiSlice;
