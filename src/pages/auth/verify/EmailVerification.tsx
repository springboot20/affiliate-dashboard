import { verify_email } from "@/api/axios.config";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EmailVerificationSuccessMessage } from "./messages/Success";

export const EmailVerification = () => {
  const [status, setStatus] = useState<"success" | "failed" | "">("");

  useEffect(() => {
    const url_params = new URLSearchParams(window.location.search);
    
    const userId = url_params.get("userId") as string;
    const token = url_params.get("token") as string;

    const verify = async () => {
      try {
        const { data } = await verify_email({ userId, token });

        setStatus("success");
        toast.success(data.message, { autoClose: 2000, className: "text-xs" });
      } catch (error) {
        if (status !== "success") {
          // Only show error if status is not already "success"
          setStatus("failed");
          if (error instanceof AxiosError) {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const { message } = error.response?.data;
            toast.error(message, { autoClose: 2000 });
          }
        }
      }
    };
    verify();
  }, [status]);

  if (status === "success") {
    return <EmailVerificationSuccessMessage />;
  } else return null;
};
