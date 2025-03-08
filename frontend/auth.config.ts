import type { NextAuthConfig } from "next-auth";
import { generateJWT } from "./lib/utils";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async session({ session, token }) {
      session.user.jwt = token.jwt as string;
      session.user.id = token.uid as string;
      session.user.pkh = token.uid as string;

      return session;
    },
    async jwt({ token }) {
      token.jwt = await generateJWT({
        id: token.sub,
        pkh: token.sub,
      });

      return token;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    newUser: "/",
  },
  providers: [],
} satisfies NextAuthConfig;
