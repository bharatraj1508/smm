"use client";

import { SocketManager } from "@/components/Common/SocketManager";
import { StoreProvider } from "@/components/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
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
