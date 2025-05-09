"use client";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

const LoginButton = () => {
  const { connect, account: activeAccount, sign } = useWallet();
  const navigate = useNavigate();

  const handleLogin = async (): Promise<void> => {
    try {
      if (!activeAccount) {
        const permissions = await connect();
        if (!permissions) {
          throw Error("No permissions granted");
        }
        console.log("New connection:", permissions.address);
      }

      if (!activeAccount?.address.startsWith("tz1")) {
        throw new Error(
          "Only tz1 addresses and their signatures are supported."
        );
      }

      const backendURL = import.meta.env.VITE_DIRECT_BACKEND_URL;
      const response = await fetch(backendURL + "/auth/challenge", {
        mode: "cors",
      }).then(res => res.json());

      // while we could take the encoded challenge from the response, encoding it ourselves ensures it is equivalent to the actual challenge
      const challenge = response.challenge;
      const signature = await sign(challenge);
      if (!signature) {
        throw Error("No login signature");
      }

      await fetch(backendURL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({
          pk: activeAccount?.publicKey,
          pkh: activeAccount?.address,
          challenge,
          signature,
        }),
      });

      //session will be automatically sset from the user endpoint
      navigate("/home");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      if (error.message !== "NEXT_REDIRECT") {
        toast({
          title: "Error",
          description: "An error occurred while logging in.",
          duration: 5000,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      size="lg"
      className="relative inline-flex h-12 w-32 overflow-hidden rounded-md p-[1px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 focus:ring-offset-slate-50 focus:outline-none"
      onClick={handleLogin}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="hover:bg-primary inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-lg font-medium text-white backdrop-blur-3xl transition-colors duration-500">
        Login
      </span>
    </Button>
  );
};

export default LoginButton;
