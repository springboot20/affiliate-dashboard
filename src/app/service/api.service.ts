import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LocalStorage } from "@/utils";
import { Token } from "@/types/auth/auth";

const env = import.meta.env;

console.log(env);

export const ApiService = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: env.MODE === "development" ? env.VITE_LOCAL_BASE_URL : env.VITE_DEPLOYED_URL,
    prepareHeaders: (headers) => {
      const tokens = LocalStorage.get("tokens") as Token;
      if (tokens) {
        headers.set("Authorization", `Bearer ${tokens?.accessToken}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Profile", "Account", "Card"],
  endpoints: () => ({}),
});
