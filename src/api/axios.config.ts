import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios";
import { toast } from "react-toastify";

export const BankAppApiClient: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCAL_BASE_URL
      : import.meta.env.VITE_DEPLOYED_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface BankAppServiceProps extends AxiosRequestConfig {
  showSuccessNotification?: boolean;
}

export const BankAppService = async ({
  showSuccessNotification = true,
  ...options
}: BankAppServiceProps) => {
  BankAppApiClient.interceptors.response.use(
    (config: AxiosResponse) => {
      if (config.status.toString().startsWith("2")) {
        showSuccessNotification ? toast.success(config.data.message, { className: "text-sm" }) : "";
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return BankAppApiClient({ ...options });
};

export const register_new_user = (data: { username: string; password: string; email: string }) =>
  BankAppApiClient.post("/users/register", data);

export const login_user = (data: { password: string; email: string }) =>
  BankAppApiClient.post("/users/login", data);

export const logout_user = () => BankAppApiClient.post("/users/logout");

export const forgot_password = (data: { email: string }) =>
  BankAppApiClient.post("/users/forgot-password", data);

export const refreshToken = (data: { inComingRefreshToken: string }) =>
  BankAppApiClient.post("/users/refresh-token", data);

export const verify_email = (data: { userId: string; token: string }) => {
  const { userId, token } = data;

  console.log(data);

  return BankAppApiClient.post(
    `/users/verify-email`,
    {},
    {
      params: {
        userId,
        token,
      },
    }
  );
};

export const send_email = (data: { email: string }) =>
  BankAppApiClient.post(`/users/send-email`, data);
