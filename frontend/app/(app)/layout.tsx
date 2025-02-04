import { Header } from "@/components/header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto block max-w-[calc(80rem_+_2rem)] px-[1rem]">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
