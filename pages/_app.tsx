import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useProtected } from "@/hooks/useProtected";
import { ThemeProvider } from "@material-tailwind/react";

function Header() {
  const handleSignout = useProtected();
  const { data: session } = useSession();
  const router = useRouter();

  return session && router.pathname !== "/" ? (
    <div className="flex items-center justify-end md:m-2">
      <h3 className="md:m-4">
        Hello <b className="text-blue-500">{session.user.pkh}</b> !
      </h3>
      <button onClick={handleSignout} className="md:m-4 m-2">
        Logout
      </button>
    </div>
  ) : null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
