"use client";

import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";

import { SessionContext } from "@/context/SessionContext";
import { User } from "@/types/session";

const backendURL = import.meta.env.VITE_DIRECT_BACKEND_URL;

const SessionProvider = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const getUser = async () => {
    if (user) return user;
    fetch(backendURL + "/auth/user", {
      credentials: "include",
      mode: "cors",
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(e => console.error(e));
  };

  // we assume performance is not an issue and just get session state from the api whenever
  useEffect(() => {
    if (!user)
      fetch(backendURL + "/auth/user", {
        credentials: "include",
        mode: "cors",
      })
        .then(res => res.json())
        .then(data => setUser(data.user))
        .catch(e => console.error(e));
  });

  const logout = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      await fetch(backendURL + "/auth/logout", {
        method: "POST",
        credentials: "include",
        mode: "cors",
      }).then(res => res.json());
      setUser(undefined);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  return (
    <SessionContext.Provider value={{ user, getUser, logout }}>
      <Outlet />
    </SessionContext.Provider>
  );
};

export default SessionProvider;
