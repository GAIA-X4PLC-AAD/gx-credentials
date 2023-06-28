/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import NextAuth, { AuthOptions } from "next-auth";
import { getPkhfromPk, validateAddress, verifySignature } from "@taquito/utils";
import CredentialsProvider from "next-auth/providers/credentials";
import { payloadBytesFromString } from "../../../lib/payload";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
        if (validateAddress(credentials?.pkh!) != 3) {
          return null;
        }

        // @ts-ignore
        const isVerified = verifySignature(
          payloadBytesFromString(credentials?.formattedInput!),
          credentials?.pk!,
          credentials?.signature!,
        );

        if (!isVerified) {
          console.log("Invalid signature");
          return null;
        }

        if (getPkhfromPk(credentials?.pk!) !== credentials?.pkh) {
          return null;
        }

        const dappUrl = "gx-credentials.example.com";
        const input = "GX Credentials Login";
        const inputSplit = credentials!
          .formattedInput!.substring(22)
          .split(" ");

        if (
          dappUrl !== inputSplit[0] ||
          input !== [inputSplit[2], inputSplit[3], inputSplit[4]].join(" ")
        ) {
          return null;
        }

        var timeError =
          (new Date().getTime() - new Date(inputSplit[1]).getTime()) / 1000;
        if (timeError < 0 || timeError > 60) {
          return null;
        }

        return {
          id: credentials?.pkh as string, // not sure why this is required
          pkh: credentials?.pkh as string,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      session.user.pkh = token.sub as string;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    newUser: "/",
  },
};

export default NextAuth(authOptions);
