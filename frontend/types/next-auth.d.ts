/*
 * Copyright (C) 2025, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      pkh: string;
      exp: number;
      // role: string;
    };
  }

  interface User {
    pkh?: string;
    // role?: string;
  }
}
