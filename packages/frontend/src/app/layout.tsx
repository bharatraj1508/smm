"use client";

import "./globals.css";
import { QueryProvider } from "@/lib/query-client-provider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
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
            <QueryProvider>{children}</QueryProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
