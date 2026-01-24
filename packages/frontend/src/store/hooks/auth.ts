import axios from "axios";
import { useDispatch } from "react-redux";

import { persistor } from "@/store";

import useStoreSelector from "./useStoreSelector";
import { actions } from "../slices/auth";
import { AuthState } from "../types/auth";

export function useLogin() {
  const dispatch = useDispatch();
  return (payload: AuthState) => {
    if (payload.accessToken) {
      // Set cookie for middleware to access
      // Using a long max-age to match the token expiry (e.g., 7 days)
      const isProd = process.env.NODE_ENV === "production";
      document.cookie = `accessToken=${
        payload.accessToken
      }; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${
        isProd ? "; Secure" : ""
      }`;
    }
    return dispatch(actions.login(payload));
  };
}

export function useLogout() {
  const dispatch = useDispatch();
  return () => {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keysToRemove.push(key);
      }
    }

    axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );

    // Clear the accessToken cookie
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    dispatch(actions.logout());
    persistor.purge();
  };
}

export function useAccessToken() {
  return useStoreSelector(({ auth }) => auth.accessToken);
}
