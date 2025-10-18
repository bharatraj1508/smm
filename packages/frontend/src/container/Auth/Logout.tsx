"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLogout } from "@/store/hooks/auth";

export default function Logout() {
  const logout = useLogout();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear();
    logout();
    router.replace("/auth/login");
  }, [logout, queryClient, router]);
  return null;
}
