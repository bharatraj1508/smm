"use client";

import { useGmailLabels } from "@/services/gmail";
import store from "@/store";

function DashBoard() {
  // const { data: labels } = useGmailLabels();
  // console.log("labelss", labels);

  const {
    auth: { name },
  } = store.getState();

  return (
    <div className="flex items-center gap-4">
      <span>Welcome! {name}</span>
    </div>
  );
}

export default DashBoard;
