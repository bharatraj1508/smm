"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useLogin } from "@/store/hooks/auth";

export default function CallbackReceiver() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const user = searchParams.get("user");

  const parsedUser = JSON.parse(user || "");

  const login = useLogin();
  useEffect(() => {
    if (!token) {
      return router.push("/auth/login");
    }
    login({
      accessToken: token,
      name: parsedUser.name,
      email: parsedUser.email,
      userId: parsedUser.userId,
    });
    router.push("/dashboard");
  }, [token, router, login]);

  return null;
}
