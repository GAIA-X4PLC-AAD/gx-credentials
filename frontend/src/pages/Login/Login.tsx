'use client';

import { motion } from 'framer-motion';

import LoginButton from '@/components/LoginButton';
import { SebisLogo } from '@/components/sebis-logo';
import { HeroHighlight } from '@/components/ui/hero-highlight';

export default function Home() {
  //TODO: forward user if he has a session already

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
          className="mx-auto max-w-4xl space-y-6 px-4 py-2 text-center text-2xl leading-relaxed font-bold text-neutral-700 md:text-4xl lg:text-5xl lg:leading-snug dark:text-white"
        >
          <div className="flex flex-col space-y-4">
            <p className="from-primary-foreground to-primary relative z-20 bg-gradient-to-b via-purple-400 bg-clip-text text-4xl font-bold text-transparent sm:text-7xl">
              GX Credentials
            </p>
            <SebisLogo />
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
