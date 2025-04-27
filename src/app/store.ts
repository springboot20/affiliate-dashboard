import { authReducer } from "@/features/auth/auth.slice";
import { configureStore } from "@reduxjs/toolkit";
import { ApiService } from "./service/api.service";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [ApiService.reducerPath]: ApiService.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ApiService.middleware),
  devTools: !import.meta.env.PROD,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
