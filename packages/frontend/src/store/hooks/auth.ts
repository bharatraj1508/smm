import { useDispatch } from "react-redux";

import { actions } from "../slices/auth";
import { AuthState } from "../types/auth";

import useStoreSelector from "./useStoreSelector";
import { persistor } from "@/store";

export function useLogin() {
  const dispatch = useDispatch();
  return (payload: AuthState) => dispatch(actions.login(payload));
}

export function useLogout() {
  const dispatch = useDispatch();
  return () => {
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    // Dynamically remove all cookies
    // Only set the expires time for the accessToken cookie; don't try to remove all cookies
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

    // Clear Redux + persist store
    dispatch(actions.logout());
    persistor.purge();

    dispatch(actions.logout());
  };
}

export function useAccessToken() {
  return useStoreSelector(({ auth }) => auth.accessToken);
}
