"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
  loadingComponent = <div className="flex justify-center p-8">Loading...</div>,
}: {
  children: ReactNode;
  loadingComponent?: ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || isRedirecting) {
    return loadingComponent;
  }

  return status === "authenticated" ? children : null;
}
