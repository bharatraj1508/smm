"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { QueryProvider } from "@/lib/query-client-provider";
import store, { persistor } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <QueryProvider>{children}</QueryProvider>
      </PersistGate>
    </Provider>
  );
}
