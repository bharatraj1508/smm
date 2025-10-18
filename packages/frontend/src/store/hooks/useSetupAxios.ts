import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StatusCode from "status-code-enum";

import store from "@/store";
import { useLogout } from "@/store/hooks/auth";
import { toast } from "sonner";

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
        (err: AxiosError) => Promise.reject(err)
      );

      instance.interceptors.response.use(
        (value) => value,
        (error: AxiosError<{ message: string }>) => {
          const response = error.response;
          if (
            response?.status === StatusCode.ClientErrorForbidden &&
            response?.data?.message === "Session expired"
          ) {
            toast.error("Session expired. Please log in.");
            return logout();
          }

          if (
            response?.status === StatusCode.ClientErrorUnauthorized &&
            response?.data?.message === "jwt expired"
          ) {
            toast.error("Session expired. Please log in.");
            logout();
            router.push("/auth/login");
          }

          return Promise.reject(error);
        }
      );

      return () => {
        instance.interceptors.request.clear();
        instance.interceptors.response.clear();
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}
