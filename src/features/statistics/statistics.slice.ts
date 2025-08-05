import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  success: boolean;
  statudsCodes: number;
  mesage: string;
}

export const StatiticsApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllStats: builder.query<
      Response,
      { timeframe?: string; startDate?: string; endDate?: string }
    >({
      query: ({ timeframe = "7d", startDate, endDate }) => {
        console.log({ timeframe, startDate, endDate });
        const params = new URLSearchParams({
          timeframe,
        });

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return {
          url: `/statistics/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Statistics"],
    }),
  }),
});

export const { useGetAllStatsQuery } = StatiticsApiSlice;
