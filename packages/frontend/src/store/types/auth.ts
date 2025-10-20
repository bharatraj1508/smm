import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  accessToken?: string;
};

type AuthCaseReducer<T = void> = CaseReducer<AuthState, PayloadAction<T>>;

export type AuthCaseReducers = {
  login: AuthCaseReducer<AuthState>;
  logout: AuthCaseReducer;
};

export type LoginFields = {
  email: string;
  password: string;
};

export type RegisterFormFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterPayload = Pick<RegisterFormFields, "email" | "password"> & {
  name: string;
};
