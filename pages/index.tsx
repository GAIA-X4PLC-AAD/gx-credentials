/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { signIn } from "next-auth/react";
import { requestRequiredPermissions, dAppClient } from "../config/wallet";
import { useEffect, useState } from "react";
import {
  AnalyticsInterface,
  BeaconEvent,
  NetworkType,
  P2PPairingRequest,
  PostMessagePairingRequest,
  RequestSignPayloadInput,
  SigningType,
  WalletConnectPairingRequest,
  defaultEventCallbacks,
} from "@airgap/beacon-sdk";
import { payloadBytesFromString } from "../lib/payload";
import { Box, Button, Icon, Stack, Typography } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function Home(props: any) {
  useEffect(() => {
    const initialize = async () => {
      // If dAppClient exists and clearActiveAccount is available, await it
      if (dAppClient) {
        await dAppClient.clearActiveAccount();
      }
    };

    // Call the async function
    initialize();
  }, []);

  if (props.error) {
    console.log("Error connecting to database: ", props.error);
    return <h3>Error connecting to database</h3>;
  }

  const handleLogin = async () => {
    try {
      const handlePermissionRequestError = (error: any) => {
        console.log("Signing request error:", error);
      };

      const callbackUrl = "/apply";
      let activeAddress, activePk;
      const activeAccount = await dAppClient?.getActiveAccount();
      if (activeAccount) {
        console.log("Already connected:", activeAccount.address);
        activeAddress = activeAccount.address;
        activePk = activeAccount.publicKey;
      } else {
        const permissions = await requestRequiredPermissions();
        console.log("New connection:", permissions.address);
        activeAddress = permissions.address;
        activePk = permissions.publicKey;
      }

      // refer to https://tezostaquito.io/docs/signing/#generating-a-signature-with-beacon-sdk
      const dappUrl = "gx-credentials.example.com";
      const ISO8601formatedTimestamp = new Date().toISOString();
      const input = "GX Credentials Login";
      const formattedInput: string = [
        "Tezos Signed Message:",
        dappUrl,
        ISO8601formatedTimestamp,
        input,
      ].join(" ");

      const payloadBytes = payloadBytesFromString(formattedInput);

      const payload: RequestSignPayloadInput = {
        signingType: SigningType.MICHELINE,
        payload: payloadBytes,
        sourceAddress: activeAddress,
      };
      const response = await dAppClient!.requestSignPayload(payload);

      signIn("credentials", {
        pkh: activeAddress,
        pk: activePk,
        formattedInput,
        signature: response.signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "80%",
      }}
    >
      {/* <Stack direction="row" justifyContent="space-around" alignItems="center"> */}
      <Box
        sx={{
          width: "80%",
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: 15,
            color: "white",
          }}
        >
          This is experimental software. Use with caution!
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: 15,
            color: "white",
            "&:hover a": {
              // Target the <a> tag on hover of the Typography component
              textDecoration: "underline",
              textDecorationColor: "white",
              boxShadow: "0px 2px white",
            },
            border: "1px solid white",
            padding: "8px", // Add some padding inside the box
            borderRadius: "4px", // Optional: if you want rounded corners
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <a
            href="https://wwwmatthes.in.tum.de/pages/t5ma0jrv6q7k/sebis-Public-Website-Home"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            By sebis @ TUM
          </a>
        </Typography>
      </Box>

      <Box
        sx={{
          marginTop: "100px",
        }}
      >
        {/* typography for the below text */}
        <Typography
          variant="h2"
          sx={{
            marginTop: "30px",
            color: "white",
            fontWeight: 700, // Bold font for better visibility
            textShadow: "4px 4px 6px rgba(0, 0, 0, 0.5)", // Text shadow for better contrast
            // Additional styling options
            letterSpacing: "0.1rem", // Adjust letter spacing for aesthetic preference
          }}
        >
          GX-Credentials
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleLogin}
            variant="contained"
            startIcon={<AccountBalanceWalletIcon />}
            size="large"
            sx={{
              marginTop: 5,
              width: { xs: "60%", md: "50%" }, // Set the width as desired, e.g., 50% for half of the parent container's width
              background: "linear-gradient(45deg, #0f9b0f 30%, #006400 90%)", // Example of a green metallic gradient
              ":hover": {
                background: "linear-gradient(45deg, #088808 30%, #004d00 90%)", // Slightly different gradient for hover state
                transform: "scale(1.05)", // Add a slight scale on hover
              },
              color: "white", // Set text color to white for better visibility
              padding: "8px", // Add some padding inside the box
              boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.5)", // Add a white shadow to the box
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 18, textTransform: "none" }}
            >
              {"Connect Wallet"}
            </Typography>
          </Button>
        </Box>
      </Box>

      <div>
        {/*TODO add some more informative content here later on*/}
        &nbsp;
      </div>
    </Box>
  );
}
