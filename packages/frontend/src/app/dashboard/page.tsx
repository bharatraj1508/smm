"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGmailLabels } from "@/services/gmail";
import { useLogout } from "@/store/hooks/auth";

function DashBoard() {
  const router = useRouter();
  const logout = useLogout();
  const queryClient = useQueryClient();

  const { data: labels } = useGmailLabels();
  console.log("labelss", labels);

  const handlelogout = () => {
    queryClient.clear();
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center gap-4">
      <span>DashBoard</span>
      <Button onClick={() => handlelogout()} variant="outline">
        Logout
      </Button>
    </div>
  );
}

export default DashBoard;
