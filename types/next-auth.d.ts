import "next-auth";

declare module "next-auth" {
  interface User {
    pkh: string;
  }

  interface Session {
    user: User;
  }
}
