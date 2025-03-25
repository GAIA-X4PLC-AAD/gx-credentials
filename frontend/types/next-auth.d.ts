/*
 * Copyright (C) 2025, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import type { Role } from "./rbac";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      pkh: string;
      role: Role;
    };
    jwt: string;
  }

  interface User {
    id: string;
    pkh: string;
    role: Role;
  }
}
