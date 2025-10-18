import { useDispatch } from "react-redux";

import { actions } from "../slices/auth";
import { AuthState } from "../types/auth";

import useStoreSelector from "./useStoreSelector";

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

    dispatch(actions.logout());
  };
}

export function useAccessToken() {
  return useStoreSelector(({ auth }) => auth.accessToken);
}
