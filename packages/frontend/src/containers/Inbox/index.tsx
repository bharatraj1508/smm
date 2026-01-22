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
    <div className="container table-auto py-10 flex flex-col w-full">
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
      <div>
        {fetchingEmail ? (
          <div className="w-[80vw]">
            <div className="w-full">Loading...</div>
          </div>
        ) : emails ? (
          <div className="flex flex-col gap-3 items-center w-full">
            <DataTable columns={columns} data={emails.data} />
          </div>
        ) : (
          <div className="w-[80vw]">
            <div>No email Found</div>
          </div>
        )}
      </div>
    </div>
  );
}
