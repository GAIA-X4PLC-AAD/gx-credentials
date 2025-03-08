"use client";

import { Header } from "@/components/header";
import ProtectedRoute from "@/components/protected-route";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto block max-w-[calc(80rem_+_2rem)] px-[1rem]">
      <ProtectedRoute>
        <Header />
        {children}
      </ProtectedRoute>
    </div>
  );
};

export default ProtectedLayout;
