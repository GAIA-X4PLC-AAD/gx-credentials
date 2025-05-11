import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { SebisLogo } from "./sebis-logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t py-6 md:py-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} <SebisLogo />
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/GAIA-X4PLC-AAD/gx-credentials/tree/development"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitHubLogoIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
