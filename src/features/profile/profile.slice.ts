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

interface UploadAvatarRequest {
  [key: string]: any;
}

export const ProfileApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<Response, ProfileRequest>({
      query: (data) => ({
        url: "/profiles",
        body: data,
        method: "PATCH",
      }),

      invalidatesTags: () => [{ type: "Profile" }],
    }),

    uploadAvatar: builder.mutation<Response, UploadAvatarRequest>({
      query: (data) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
          if (data[key]) {
            formData.append(key, data[key]);
          }
        });

        return {
          url: "/auth/upload-avatar",
          body: formData,
          method: "PATCH",
        };
      },
      invalidatesTags: () => [{ type: "Profile" }],
    }),

    getProfile: builder.query<Response, void>({
      query: () => "/profiles",
      providesTags: () => [{ type: "Profile" }],
    }),
  }),
});

export const { useUpdateProfileMutation, useGetProfileQuery, useUploadAvatarMutation } =
  ProfileApiSlice;
