"use client";

import { useGmailLabels } from "@/services/gmail";

function DashBoard() {
  const { data: labels } = useGmailLabels();
  console.log("labelss", labels);

  return (
    <div className="flex items-center gap-4">
      <span>DashBoard</span>
    </div>
  );
}

export default DashBoard;
