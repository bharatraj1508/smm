"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/store/hooks/auth";
import { useRouter } from "next/navigation";

function DashBoard() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <span>DashBoard</span>
      <Button onClick={() => router.push("/auth/logout")} variant="outline">
        Logout
      </Button>
    </div>
  );
}

export default DashBoard;
