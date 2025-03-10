/*
 * Copyright (C) 2025, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
import { Role } from "./rbac";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      pkh: string;
      jwt: string;
      role: Role;
    };
  }

  interface User {
    id: string;
    pkh?: string;
    jwt?: string;
    role?: Role;
  }
}
