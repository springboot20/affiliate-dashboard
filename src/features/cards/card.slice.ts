import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}

export const CardApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    generateCardNumberDetails: builder.mutation<Response, void>({
      query: () => ({
        url: "/card/create-card/generate-number",
        method: "POST",
      }),
    }),
  }),
});

export const { useGenerateCardNumberDetailsMutation } = CardApiSlice;
