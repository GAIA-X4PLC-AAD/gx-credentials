import { generateJWT } from "@/lib/utils";
import { Role } from "@/types/rbac";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async session({ session, token }) {
      session.user.jwt = token.jwt as string;
      session.user.id = token.sub as string;
      session.user.pkh = token.sub as string;
      session.user.role = (token.role as Role) ?? Role.BASIC;

      return session;
    },
    async jwt({ token }) {
      token.jwt = await generateJWT({
        id: token.sub,
        pkh: token.sub,
        role: token.role,
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
