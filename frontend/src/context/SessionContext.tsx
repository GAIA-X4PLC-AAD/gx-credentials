"use client";

import { createContext } from "react";

import { SessionContextValue } from "@/types/session";

const DEFAULT_CONTEXT: SessionContextValue = {
  user: undefined,
  logout: async () => {
    console.log("not loaded");
  },
  getUser: async () => {
    console.log("not loaded");
    return undefined;
  },
};

export const SessionContext =
  createContext<SessionContextValue>(DEFAULT_CONTEXT);
