import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { initResponsive } from "./lib/responsive.ts";
import AppRouter from "./AppRouter.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

import { ThemeProvider } from "@/components/providers/theme-provider";
import WalletProvider from "@/components/providers/wallet-provider.tsx";
import "./index.css";

initResponsive();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <WalletProvider>
          <AppRouter />
          <Toaster />
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
