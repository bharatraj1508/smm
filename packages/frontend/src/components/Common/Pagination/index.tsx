"use client";

import { useRouter } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export default function TablePagination({
  page,
  count,
  maxResults,
}: {
  page: number;
  count: number;
  maxResults: number;
}) {
  const numOfPages = Math.ceil(count / maxResults);
  const router = useRouter();

  const pageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page > 1) pageChange(page - 1);
            }}
            aria-disabled={page <= 1}
            className={cn(
              page <= 1 ? "pointer-events-none opacity-50" : undefined,
            )}
          />
        </PaginationItem>

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page < numOfPages) pageChange(page + 1);
            }}
            aria-disabled={page == numOfPages}
            className={cn(
              page == numOfPages ? "pointer-events-none opacity-50" : undefined,
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
