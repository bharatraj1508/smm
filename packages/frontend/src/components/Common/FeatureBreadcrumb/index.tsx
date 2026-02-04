"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useStoreSelector from "@/store/hooks/useStoreSelector";

export function FeatureBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbLabels = useStoreSelector((state) => state.breadcrumb.labels);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((path, index) => {
          if (path === "dashboard") return null;

          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join("/")}`;

          // Check if there is a custom label in the store for this path segment
          const customLabel = breadcrumbLabels[path];

          // Decodes URL components to handle spaces/special chars, then formats
          const defaultLabel = decodeURIComponent(path)
            .replace(/-/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());

          const label = customLabel || defaultLabel;

          return (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
