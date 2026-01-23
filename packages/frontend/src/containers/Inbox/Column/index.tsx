"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { EmailData } from "@/store/types/gmail";

const formatFrom = (input: string): string => {
  return input.match(/^(.*?)</)?.[1].trim() || input;
};

const formatDate = (date: Date) => {
  if (!date) return "";

  const now = new Date();
  const dateObj = new Date(date);

  // Clear out time for pure date comparison
  const getDayStart = (d: Date) => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const startOfToday = getDayStart(now);
  const startOfDate = getDayStart(dateObj);

  // Compute diff in days
  const msPerDay = 24 * 60 * 60 * 1000;
  const dayDiff = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / msPerDay
  );

  // Format time part
  const timeStr = format(dateObj, "h:mm a");

  if (dayDiff === 0) {
    return `Today, ${timeStr}`;
  } else if (dayDiff === 1) {
    return `Yesterday, ${timeStr}`;
  } else if (dayDiff > 1 && dayDiff <= 5) {
    return `${dayDiff} days ago, ${timeStr}`;
  }

  // Default: Show original "MMM d, yyyy, h:mm a"
  return format(dateObj, "MMM d, yyyy, h:mm a");
};

export const columns: ColumnDef<EmailData>[] = [
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      const value = row.getValue<string>("from");
      return (
        <div className="max-w-xs truncate text-muted-foreground">
          {formatFrom(value)}
        </div>
      );
    },
  },
  {
    accessorKey: "snippet",
    header: "Snippet",
    cell: ({ row }) => (
      <div className="max-w-lg truncate text-muted-foreground">
        {row.getValue("snippet")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Received On",
    cell: ({ row }) => {
      const value = row.getValue<string>("date");
      return <span>{formatDate(new Date(value))}</span>;
    },
  },
  {
    accessorKey: "lastSyncedAt",
    header: "Last Synced On",
    cell: ({ row }) => {
      const value = row.getValue<string>("lastSyncedAt");
      return <span>{formatDate(new Date(value))}</span>;
    },
  },
];
