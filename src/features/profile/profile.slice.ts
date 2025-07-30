import { ApiService } from "@/app/service/api.service";

interface Response {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}

type ProfileRequest = {
  username?: string;
  present_address?: string;
  permanent_address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  preferred_view?: "app" | "dashboard";
  timezone?: string;
  currency?: string;
};

export const ProfileApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<Response, ProfileRequest>({
      query: (data) => ({
        url: "/profiles",
        body: data,
        method: "PATCH",
      }),
    }),

    getProfile: builder.query<Response, void>({
      query: () => "/profiles",
    }),
  }),
});

export const { useUpdateProfileMutation, useGetProfileQuery } = ProfileApiSlice;
