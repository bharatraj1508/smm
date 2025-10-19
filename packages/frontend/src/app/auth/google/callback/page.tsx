"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useLogin } from "@/store/hooks/auth";

export default function CallbackReceiver() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const login = useLogin();
  useEffect(() => {
    if (!token) {
      return router.push("/auth/login");
    }
    login({ accessToken: token });
    router.push("/dashboard");
  }, [token, router, login]);

  return null;
}
