"use client";

import { Fragment, PropsWithChildren } from "react";

import axios from "axios";

import { useSetupAxios } from "@/store/hooks/useSetupAxios";

import { Toaster } from "../ui/sonner";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../Common/AppSideBar";
import { useRoutesWithoutRootLayout } from "@/hooks/useRoutesWithoutRootLayout";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }: PropsWithChildren) {
  useSetupAxios(axios);
  const routesWithoutRootLayout = useRoutesWithoutRootLayout();

  const pathname = usePathname();

  const isRouteWithRootLayout = routesWithoutRootLayout.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <Fragment>
      <Toaster />
      {isRouteWithRootLayout ? (
        <main>{children}</main>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            <div className="lg:pl-[3rem]">{children}</div>
          </main>
        </SidebarProvider>
      )}
    </Fragment>
  );
}
