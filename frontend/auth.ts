import { getPkhfromPk, validateAddress, verifySignature } from "@taquito/utils";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
// import { getCredentialsByPkh } from "./hooks/api/credential";
import { payloadBytesFromString } from "./lib/payload";
// import { getTrustAnchors } from "./lib/registry";
import { getCredentialsByPkh } from "./hooks/api/credential";
import { getTrustAnchors } from "./lib/registry";
import { Role } from "./types/rbac";

export const { auth, handlers, signIn, signOut } = NextAuth({
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
        role: {
          label: "Role",
          type: "text",
          placeholder: "1",
        },
      },
      async authorize(credentials) {
        console.log("AUTHORIZING");
        console.log(credentials);
        if (!credentials || validateAddress(credentials.pkh as string) != 3) {
          console.log("Invalid public key hash");
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
          console.error("Invalid public key");
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
          console.log("Invalid input");
          return null;
        }

        const timeError =
          (new Date().getTime() - new Date(inputSplit[1]).getTime()) / 1000;
        if (timeError < 0 || timeError > 60) {
          console.log("Invalid time");
          return null;
        }

        // role check
        const trustAnchors = await getTrustAnchors();
        const companyCredentials = await getCredentialsByPkh(
          credentials.pkh,
          "company"
        );
        if (trustAnchors.includes(credentials.pkh as string)) {
          credentials.role = Role.TRUST_ANCHOR;
        } else if (companyCredentials.length > 0) {
          credentials.role = Role.COMPANY;
        } else {
          credentials.role = Role.BASIC;
        }

        const user: { id: string; pkh: string; role: Role } = {
          id: credentials?.pkh as string,
          pkh: credentials?.pkh as string,
          role: credentials?.role as Role,
        };

        console.log("Returning user:", user);
        return user;
      },
    }),
  ],
});
