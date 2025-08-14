import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LocalStorage } from "@/utils";
import { Token } from "@/types/auth/auth";

const env = import.meta.env;

export const ApiService = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: env.MODE === "development" ? env.VITE_LOCAL_BASE_URL : env.VITE_DEPLOYED_URL,
    prepareHeaders: (headers) => {
      const tokens = LocalStorage.get("tokens") as Token;
      const isAuthenticated = LocalStorage.get("authentified") as boolean;

      headers.set("Accept", "application/pdf");

      if (tokens && isAuthenticated) {
        headers.set("Authorization", `Bearer ${tokens?.accessToken}`);
      }

      return headers;
    },
    responseHandler: (response) => {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/pdf")) {
        return response.blob(); // ✅ this tells RTK to handle blob
      }
      return response.json();
    },
  }),
  tagTypes: [
    "Auth",
    "Profile",
    "Account",
    "Card",
    "MessageRequest",
    "MessageNotification",
    "UnreadCount",
    "Statistics",
    "Transaction",
  ],
  endpoints: () => ({}),
});
