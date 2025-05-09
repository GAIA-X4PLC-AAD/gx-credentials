'use client';

import { Link } from 'react-router';

import { Highlight } from '@/components/ui/hero-highlight';

export const SebisLogo = () => (
  <Link
    className="text-base"
    to="https://wwwmatthes.in.tum.de/pages/t5ma0jrv6q7k/sebis-Public-Website-Home"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="text-base font-medium">
      <Highlight className="text-black dark:text-white">sebis</Highlight> @{' '}
      <span className="font-extrabold text-sky-700 transition-all duration-300 hover:scale-105">
        TUM
      </span>
    </span>
  </Link>
);
