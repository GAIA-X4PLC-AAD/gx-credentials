import NextAuth, { AuthOptions } from "next-auth";
import { validateAddress } from "@taquito/utils";
import CredentialsProvider from "next-auth/providers/credentials";

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
      },
      async authorize(credentials) {
        if (validateAddress(credentials?.pkh!) != 3) {
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
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      session.user.pkh = token.sub as string;
      return session;
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
