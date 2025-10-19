"use client";

import { Fragment, PropsWithChildren } from "react";

import axios from "axios";
import { Toaster } from "sonner";

import { useSetupAxios } from "@/store/hooks/useSetupAxios";

export default function AppLayout({ children }: PropsWithChildren) {
  useSetupAxios(axios);

  return (
    <Fragment>
      <main>{children}</main>
      <Toaster />
    </Fragment>
  );
}
