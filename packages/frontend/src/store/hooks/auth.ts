import { useDispatch } from "react-redux";

import { actions } from "../slices/auth";
import { AuthState } from "../types/auth";

import useStoreSelector from "./useStoreSelector";
import { persistor } from "@/store";
import axios from "axios";

export function useLogin() {
  const dispatch = useDispatch();
  return (payload: AuthState) => dispatch(actions.login(payload));
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
      }
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    dispatch(actions.logout());
    persistor.purge();
  };
}

export function useAccessToken() {
  return useStoreSelector(({ auth }) => auth.accessToken);
}
