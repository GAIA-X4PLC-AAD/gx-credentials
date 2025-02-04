import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { getPkhfromPk, validateAddress, verifySignature } from "@taquito/utils";
import { payloadBytesFromString } from "./lib/payload";

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || "secret",
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        pkh: {
          label: "Public Key Hash",
          type: "text",
          placeholder: "0x0",
        },
        pk: {
          label: "Public Key",
          type: "text",
          placeholder: "0x0",
        },
        formattedInput: {
          label: "Formatted Login Challenge String",
          type: "text",
          placeholder: "challenge",
        },
        signature: {
          label: "Signature of the Challenge",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        console.log("AUTHORIZING");
        console.log(credentials);
        if (!credentials || validateAddress(credentials.pkh as string) != 3) {
          return null;
        }

        const isVerified = verifySignature(
          payloadBytesFromString(credentials.formattedInput as string),
          credentials.pk as string,
          credentials.signature as string
        );

        if (!isVerified) {
          console.log("Invalid signature");
          return null;
        }

        if (getPkhfromPk(credentials.pk as string) !== credentials.pkh) {
          return null;
        }

        const dappUrl = "gx-credentials.example.com";
        const input = "GX Credentials Login";
        const inputSplit = (credentials.formattedInput as string)
          .substring(22)
          .split(" ");

        if (
          dappUrl !== inputSplit[0] ||
          input !== [inputSplit[2], inputSplit[3], inputSplit[4]].join(" ")
        ) {
          return null;
        }

        const timeError =
          (new Date().getTime() - new Date(inputSplit[1]).getTime()) / 1000;
        if (timeError < 0 || timeError > 60) {
          return null;
        }

        const user = {
          id: credentials?.pkh as string,
          pkh: credentials?.pkh as string,
        };

        console.log("Returning user:", user);
        return user;
      },
    }),
  ],
});
