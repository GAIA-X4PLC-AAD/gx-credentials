import { generateJWT } from "@/lib/utils";
import { Role } from "@/types/rbac";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    jwt: true,
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.pkh = token.id as string;
      session.user.role = token.role as Role;

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.pkh;
        token.pkh = user.pkh;
        token.role = user.role;
      }
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
