"use client";

import { Fragment, PropsWithChildren } from "react";

import axios from "axios";
import { usePathname } from "next/navigation";

import { useRoutesWithoutRootLayout } from "@/hooks/useRoutesWithoutRootLayout";
import { useSetupAxios } from "@/store/hooks/useSetupAxios";

import { AppSidebar } from "../Common/AppSideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Toaster } from "../ui/sonner";
import { ModeToggle } from "../ui/mode-toggle";
import { SocketIndicator } from "../ui/socket-indicator";

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
      <Toaster position="top-right" />
      {isRouteWithRootLayout ? (
        <main>{children}</main>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="ml-auto flex items-center gap-2">
                <SocketIndicator />
                <ModeToggle />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </Fragment>
  );
}
