import { useEffect } from "react";

import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StatusCode from "status-code-enum";

import store from "@/store";
import { useLogout } from "@/store/hooks/auth";

interface ExtendedAxiosResponse<T = Record<string, unknown>>
  extends Omit<AxiosResponse<T>, "data"> {
  data: T & { error?: string };
}

const AUTH_FAILED_ERRORS = [
  "Invalid or expired token",
  "Token required",
  "Invalid user",
  "Authentication failed",
];

export function useSetupAxios(instance: AxiosInstance) {
  const router = useRouter();
  const logout = useLogout();

  useEffect(
    () => {
      instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          const {
            auth: { accessToken },
          } = store.getState();

          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }

          return config;
        },
        (err: AxiosError) => Promise.reject(err),
      );

      instance.interceptors.response.use(
        (value) => value,
        async (error: AxiosError<{ message: string }>) => {
          const response = error.response as ExtendedAxiosResponse<{
            message?: string;
          }>;

          const authError = response?.data?.error || "";
          const isAuthFailed = AUTH_FAILED_ERRORS.includes(authError);

          if (
            response?.status === StatusCode.ClientErrorForbidden &&
            response?.data?.message === "Session expired"
          ) {
            toast.error("Session expired. Please log in.");
            return logout();
          }

          if (
            response?.status === StatusCode.ClientErrorUnauthorized &&
            isAuthFailed
          ) {
            let msg;
            if (authError === "Invalid or expired token") {
              msg = "Session Expired. Please login to proceed";
            }

            authError === "Invalid or expired token"
              ? (msg = "Session Expired. Please login to proceed")
              : (msg = "Please login to proceed");

            toast.info(msg);
            logout();
            router.push("/auth/login");
          }

          return Promise.reject(error);
        },
      );

      return () => {
        instance.interceptors.request.clear();
        instance.interceptors.response.clear();
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}
