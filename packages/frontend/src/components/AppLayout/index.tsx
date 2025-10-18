"use client";

import { useSetupAxios } from "@/store/hooks/useSetupAxios";
import axios from "axios";
import { Fragment, PropsWithChildren } from "react";
import { Toaster } from "sonner";

export default function AppLayout({ children }: PropsWithChildren) {
  useSetupAxios(axios);

  return (
    <Fragment>
      <main>{children}</main>
      <Toaster />
    </Fragment>
  );
}
