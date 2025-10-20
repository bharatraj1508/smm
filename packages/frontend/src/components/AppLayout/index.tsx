"use client";

import { Fragment, PropsWithChildren } from "react";

import axios from "axios";

import { useSetupAxios } from "@/store/hooks/useSetupAxios";
import { Toaster } from "../ui/sonner";

export default function AppLayout({ children }: PropsWithChildren) {
  useSetupAxios(axios);

  return (
    <Fragment>
      <Toaster />
      <main>{children}</main>
    </Fragment>
  );
}
