"use client";

import { Highlight } from "@/components/ui/hero-highlight";
import Link from "next/link";

export const SebisLogo = () => (
  <Link
    className="text-base"
    href="https://wwwmatthes.in.tum.de/pages/t5ma0jrv6q7k/sebis-Public-Website-Home"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="font-medium text-base">
      <Highlight className="text-black dark:text-white">sebis</Highlight> @{" "}
      <span className="text-sky-700 font-extrabold hover:scale-105 transition-all duration-300">
        TUM
      </span>
    </span>
  </Link>
);
