import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login_user,
  register_new_user,
  logout_user,
  forgot_password,
  send_email,
  verify_email,
  BankAppApiClient,
  refreshToken,
  signInWithGoogle,
} from "@/api/axios.config";
import type {
  RegisterPayloadAction,
  LoginPayloadAction,
  ForgotPayloadAction,
} from "@/types/auth/auth";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayloadAction, { rejectWithValue }) => {
    try {
      const response = await register_new_user(data);
      toast.success(response.data.message, { className: "text-sm" });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }
      return error;
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginPayloadAction, { rejectWithValue }) => {
    try {
      const response = await login_user(data);

      toast.success(response.data.message, { className: "text-sm" });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }
      return error;
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_: { token: string }, { rejectWithValue }) => {
    try {
      const response = await logout_user();

      BankAppApiClient.defaults.headers.common["Authorization"] = `Bearer ${_.token}`;

      toast.success(response.data.message, { className: "text-sm" });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }

      return error;
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh-token",
  async (data: { inComingRefreshToken: string }, { rejectWithValue }) => {
    try {
      const response = await refreshToken(data);

      toast.success(response.data.message, { className: "text-sm" });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }

      return error;
    }
  }
);

export const forgot = createAsyncThunk(
  "auth/forgot",
  async (data: ForgotPayloadAction, { rejectWithValue }) => {
    try {
      const response = await forgot_password(data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }
      return error;
    }
  }
);

export const sendMail = createAsyncThunk(
  "auth/send-mail",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await send_email(data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }
      return error;
    }
  }
);

export const verifyMail = createAsyncThunk(
  "auth/verify-mail",
  async (data: { userId: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await verify_email(data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }
      return error;
    }
  }
);

export const signWithGoogle = createAsyncThunk(
  "auth/sign-with-google",
  async (_, { rejectWithValue }) => {
    try {
      await signInWithGoogle();
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error?.response?.data?.message);
      }
      return error;
    }
  }
);
