import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
import { InitialState, Token, User } from "@/types/auth/auth";
import { forgot, login, logout, register, sendMail } from "../thunks/auth.thunk";
import { LocalStorage } from "@/utils";

const initialState: InitialState = {
  loading: "idle",
  data: {
    tokens: LocalStorage.get("tokens") ?? ({} as Token),
    user: LocalStorage.get("user") ?? ({} as User),
  },
  requestedId: undefined,
  isAuthenticated: LocalStorage.get("authentified") as boolean,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (_, action) => {
      const { user } = action.payload;

      LocalStorage.set("user", user);
    },
    setUserEmail: (state, { payload }) => {
      state.data.user = payload;
    },
  },
  extraReducers: (builder) => {
    /**
     * Register builder casing
     */
    builder
      .addCase(register.pending, (state, { meta }) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.requestedId = meta.requestId;
        }
      })
      .addCase(register.fulfilled, (state, { meta }) => {
        if (state.loading === "pending" && state.requestedId === meta.requestId) {
          state.loading = "succeeded";
          state.requestedId = undefined;
        }
      })
      .addCase(register.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload as any;
        } else {
          state.error = action.error as any;
        }
      });

    /**
     * Login builder casing
     */
    builder
      .addCase(login.pending, (state, { meta }) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.requestedId = meta.requestId;
        }
      })
      .addCase(login.fulfilled, (state, { payload, meta }) => {
        const { data } = payload;

        if (state.loading === "pending" && state.requestedId === meta.requestId) {
          state.loading = "succeeded";
          state.requestedId = undefined;
          state.error = null;
        }

        state.isAuthenticated = true;
        state.data.user = data.user;
        state.data.tokens = data.tokens;

        LocalStorage.set("user", data.user);
        LocalStorage.set("authentified", state.isAuthenticated);
        LocalStorage.set("tokens", data.tokens);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = "failed";
        state.isAuthenticated = false;

        if (action.payload) {
          state.error = action.payload as any;
        } else {
          state.error = action.error as any;
        }
      });

    /**
     * logout builder casing
     */
    builder
      .addCase(logout.pending, (state, { meta }) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.requestedId = meta.requestId;
        }
      })
      .addCase(logout.fulfilled, (state, { meta }) => {
        if (state.loading === "pending" && state.requestedId === meta.requestId) {
          state.loading = "succeeded";
        }

        state.data.user = null!;
        state.isAuthenticated = false;
        state.data.tokens = null!;

        LocalStorage.remove("user");
        LocalStorage.remove("tokens");
        LocalStorage.remove("authentified");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = "failed";
        if (action.payload) {
          state.error = action.payload as any;
        } else {
          state.error = action.error as any;
        }
      });

    /**
     * Forgot password builder case
     */
    builder
      .addCase(forgot.pending, (state, { meta }) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.requestedId = meta.requestId;
        }
      })
      .addCase(forgot.fulfilled, (state, { meta }) => {
        if (state.loading === "pending" && state.requestedId === meta.requestId) {
          state.loading = "succeeded";
        }
      })
      .addCase(forgot.rejected, (state) => {
        state.loading = "failed";
      });

    /**
     * Forgot password builder case
     */
    builder
      .addCase(sendMail.pending, (state, { meta }) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.requestedId = meta.requestId;
        }
      })
      .addCase(sendMail.fulfilled, (state, { meta, payload }) => {
        if (state.loading === "pending" && state.requestedId === meta.requestId) {
          state.loading = "succeeded";
        }

        const { data } = payload;
        state.data.user = data.user;
      })
      .addCase(sendMail.rejected, (state) => {
        state.loading = "failed";
      });
  },
});

export const authReducer = authSlice.reducer;
export const { setCredentials, setUserEmail } = authSlice.actions;
