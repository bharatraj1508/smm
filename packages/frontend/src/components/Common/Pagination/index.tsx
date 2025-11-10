"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { JSX } from "react";

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

  const generatePages = () => {
    const pages: (number | JSX.Element)[] = [];

    if (numOfPages <= 5) {
      for (let i = 1; i <= numOfPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(
          1,
          2,
          3,
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>,
          numOfPages
        );
      } else if (page >= numOfPages - 2) {
        pages.push(
          1,
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>,
          numOfPages - 2,
          numOfPages - 1,
          numOfPages
        );
      } else {
        pages.push(
          1,
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>,
          page - 1,
          page,
          page + 1,
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>,
          numOfPages
        );
      }
    }

    return pages;
  };

  const visiblePages = generatePages();

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
              page <= 1 ? "pointer-events-none opacity-50" : undefined
            )}
          />
        </PaginationItem>

        {/* // Page Numbers
        {visiblePages.map((pageNumber, index) => (
          <PaginationItem
            key={index}
            className="flex items-center justify-center"
          >
            {typeof pageNumber === "number" ? (
              <PaginationLink
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  pageChange(pageNumber);
                }}
                isActive={page === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            ) : (
              <span className="px-3">...</span> // Ellipses
            )}
          </PaginationItem>
        ))} */}

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
              page == numOfPages ? "pointer-events-none opacity-50" : undefined
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
