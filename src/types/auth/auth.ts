export type ForgotPayloadAction = { email: string };

export type VerifyEmailPayloadAction = { token: string; userId: string };

export interface User {
  _id: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
  avatar?: {
    url: string;
    public_id: string;
  };
  updatedAt: string;
  createdAt: string;
  role: string;
  login_type: string;
  [key:string]: any
}

export interface ValidationError {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export type InitialState = {
  loading: "idle" | "pending" | "succeeded" | "failed";
  isAuthenticated:boolean
  data: {
    user: User;
    tokens: Token;
  };
  requestedId?: string;
  error: null;
};

export type RegisterPayloadAction = {
  username: string;
  password: string;
  email: string;
};

export type LoginPayloadAction = { email: string; password: string };

export type Token = {
  accessToken: string;
  refreshToken: string;
};
