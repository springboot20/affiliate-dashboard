import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios";
import { toast } from "react-toastify";
import { UseAppSelector } from "@/app/hook";

const { accessToken } = UseAppSelector((state) => state.auth.tokens);

export const BankAppApiClient: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production" ? "" : import.meta.env.VITE_BANK_API,
  timeout: 12000,
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
        showSuccessNotification ? toast.success(config.data.message) : "";
      }

      BankAppApiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      return config;
    },
    (error) => {
      if (axios.isAxiosError(error)) {
        const errorMsg = (error.response?.data as { error?: string })?.error;
        const errorWithMsg = (error.response?.data as { message?: string })
          ?.message;

        if (errorMsg) {
          toast.error(errorMsg);
        } else if (errorWithMsg) {
          toast.error(errorWithMsg);
        }
      } else if (error.response.status === 401) {
        window.location.href = "/login";
      } else {
        toast.error(error.message);
      }

      return Promise.reject(error);
    },
  );

  return BankAppApiClient({ ...options });
};

export const register_new_user = (data: {
  username: string;
  password: string;
  email: string;
}) => BankAppApiClient.post("/users/register", data);

export const login_user = (data: { password: string; email: string }) =>
  BankAppApiClient.post("/users/login", data);

export const logout_user = () => BankAppApiClient.post("/users/logout");

export const forgot_password = (data: { email: string }) =>
  BankAppApiClient.post("/user/forgot-password", data);

export const verify_email = (data: { userId: string; token: string }) =>
  BankAppApiClient.get(`/users/verify-email/${data.userId}/${data.token}`);
