"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import AppLayout from "@/components/AppLayout";
import { QueryProvider } from "@/lib/query-client-provider";
import store, { persistor } from "@/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <QueryProvider>
              <AppLayout>{children}</AppLayout>
            </QueryProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
