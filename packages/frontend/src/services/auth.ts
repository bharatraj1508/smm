import useShowAPIErrorMessage from "@/hooks/api/ShowAPIErrorMessage";
import { useLogin } from "@/store/hooks/auth";

import { LoginFields, RegisterPayload } from "@/store/types/auth";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

const baseURL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth`;

export function useAuthLogin() {
  const router = useRouter();
  const login = useLogin();
  const showAPIErrorMessage = useShowAPIErrorMessage();
  return useMutation({
    mutationFn(payload: LoginFields) {
      return axios.post("/login", payload, { baseURL, withCredentials: true });
    },
    onSuccess(res: AxiosResponse<{ accessToken: string }>) {
      login({ accessToken: res?.data?.accessToken });
      router.push("/dashboard");
    },
    onError: showAPIErrorMessage,
  });
}

export function useAuthRegister() {
  const router = useRouter();
  const login = useLogin();
  const showAPIErrorMessage = useShowAPIErrorMessage();
  return useMutation({
    mutationFn(payload: RegisterPayload) {
      return axios.post("/register", payload, {
        baseURL,
        withCredentials: true,
      });
    },
    onSuccess(res: AxiosResponse<{ accessToken: string }>) {
      login({ accessToken: res?.data?.accessToken });
      router.push("/dashboard");
    },
    onError: showAPIErrorMessage,
  });
}
