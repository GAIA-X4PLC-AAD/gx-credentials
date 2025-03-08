"use client";

import LoginButton from "@/components/LoginButton";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      toast({
        title: "Redirecting...",
        description: "You are already logged in. Redirecting you to home...",
        duration: 2000,
      });
      router.push("/home");
    }
  }, [status, router]);

  return (
    <div className="items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 py-2 space-y-6 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          <div className="flex flex-col space-y-4">
            <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-primary-foreground via-purple-400 to-primary">
              GX Credentials
            </p>
            <Link
              className="text-base"
              href="https://wwwmatthes.in.tum.de/pages/t5ma0jrv6q7k/sebis-Public-Website-Home"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-medium text-base">
                by{" "}
                <Highlight className="text-black dark:text-white">
                  sebis
                </Highlight>{" "}
                @{" "}
                <span className="text-sky-700 font-extrabold hover:scale-105 transition-all duration-300">
                  TUM
                </span>
              </span>
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          >
            <LoginButton />
          </motion.div>
        </motion.h1>
      </HeroHighlight>
    </div>
  );
}
