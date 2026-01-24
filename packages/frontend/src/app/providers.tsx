"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/components/store-provider";
import { SocketManager } from "@/components/Common/SocketManager";
import { QueryProvider } from "@/lib/query-client-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SocketManager />
          {children}
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
