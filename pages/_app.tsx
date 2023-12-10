/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useProtected } from "@/hooks/useProtected";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Box, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout"; // Importing an icon for the logout button

function Header() {
  const handleSignout = useProtected();
  const { data: session } = useSession();
  const router = useRouter();

  return session && router.pathname !== "/" ? (
    <Box
      sx={{
        display: { xs: "flexReverse", md: "flex" },
        justifyContent: "flex-end",
        alignItems: "center",
        m: 2,
      }}
    >
      <Typography variant="h6" sx={{ mr: 4, color: "white" }}>
        Hello <b style={{ color: "white" }}>{session.user.pkh}</b> !
      </Typography>
      <Button
        onClick={handleSignout}
        variant="contained"
        startIcon={<LogoutIcon />}
        size="large"
        sx={{
          mt: 1,
          width: { xs: "60%", md: "auto" },
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          ":hover": {
            background: "linear-gradient(45deg, #FF4176 30%, #FF7350 90%)",
            transform: "scale(1.05)",
          },
          color: "white",
          boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="caption" sx={{ textTransform: "none" }}>
          Logout
        </Typography>
      </Button>
    </Box>
  ) : null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeRegistry>
      <SessionProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeRegistry>
  );
}
