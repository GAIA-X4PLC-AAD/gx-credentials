/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      pkh: string;
    };
  }
}
