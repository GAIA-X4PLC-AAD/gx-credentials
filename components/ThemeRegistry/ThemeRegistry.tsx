"use client";
import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import theme from "./theme";
import { Box } from "@mui/material";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            height: "100vh", // Sets the height to full viewport height
            width: "100vw", // Sets the width to full viewport width
            overflow: "auto", // Adds scrolling if content overflows
            backgroundImage: (theme) => theme.palette.background.default,
            // display: "flex",
            paddingX: 5,
          }}
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </Box>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
