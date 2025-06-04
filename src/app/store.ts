import { authReducer } from "@/features/auth/auth.slice";
import { configureStore } from "@reduxjs/toolkit";
import { ApiService } from "./service/api.service";
import { notificationReducer } from "@/features/messaging/notification.reducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    [ApiService.reducerPath]: ApiService.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ApiService.middleware),
  devTools: !import.meta.env.PROD,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
