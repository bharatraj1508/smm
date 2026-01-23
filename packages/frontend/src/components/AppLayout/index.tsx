"use client";

import { Fragment, PropsWithChildren } from "react";

import axios from "axios";
import { usePathname } from "next/navigation";

import { useRoutesWithoutRootLayout } from "@/hooks/useRoutesWithoutRootLayout";
import { useSetupAxios } from "@/store/hooks/useSetupAxios";

import { AppSidebar } from "../Common/AppSideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "../ui/sonner";

export default function AppLayout({ children }: PropsWithChildren) {
  useSetupAxios(axios);
  const routesWithoutRootLayout = useRoutesWithoutRootLayout();

  const pathname = usePathname();

  const isRouteWithRootLayout =
    routesWithoutRootLayout.some((route) => pathname.startsWith(route)) ||
    pathname === "/" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms";

  return (
    <Fragment>
      <Toaster />
      {isRouteWithRootLayout ? (
        <main>{children}</main>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SidebarTrigger />
            {children}
          </SidebarInset>
        </SidebarProvider>
      )}
    </Fragment>
  );
}
