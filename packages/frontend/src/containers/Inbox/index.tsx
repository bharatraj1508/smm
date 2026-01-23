"use client";

import { useSearchParams } from "next/navigation";

import TablePagination from "@/components/Common/Pagination";
import { useEmailSyncCount, useGmailMessages } from "@/services/gmail";

import { columns } from "./Column";
import { DataTable } from "./DataTable";

const pageSize = 25;

export default function Inbox() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const { data: emails, isFetching: fetchingEmail } = useGmailMessages({
    page: page ? parseInt(page, 10) : 1,
    maxResults: pageSize,
  });

  const { data: sync, isFetched: synced } = useEmailSyncCount();

  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4 md:px-6 lg:px-8">
      {synced && (
        <div className="flex items-center gap-2 w-fit self-end">
          <p className="text-xs font-bold text-gray-600 whitespace-nowrap">
            {page ? page : 1} of {sync?.count}
          </p>
          <TablePagination
            page={page ? parseInt(page, 10) : 1}
            count={sync?.count || 1}
            maxResults={pageSize}
          />
        </div>
      )}
      <div className="w-full">
        {fetchingEmail ? (
          <div className="w-full flex justify-center py-20">
            <div className="text-lg font-medium animate-pulse">Loading...</div>
          </div>
        ) : emails ? (
          <div className="flex flex-col gap-3 w-full">
            <DataTable columns={columns} data={emails.data} />
          </div>
        ) : (
          <div className="w-full flex justify-center py-20">
            <div className="text-lg font-medium text-gray-500">
              No emails found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
