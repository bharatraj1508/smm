"use client";

import { useLogin } from "@/store/hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
