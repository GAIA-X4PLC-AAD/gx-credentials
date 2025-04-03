"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { login } from "@/lib/actions/auth";
import { payloadBytesFromString } from "@/lib/payload";
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-types";

const LoginButton = () => {
  const { connect, account: activeAccount, dAppClient } = useWallet();

  const handleLogin = async (): Promise<void> => {
    try {
      let activeAddress;
      let activePk;
      if (activeAccount) {
        console.log("Already connected:", activeAccount.address);
        activeAddress = activeAccount.address;
        activePk = activeAccount.publicKey;
      } else {
        const permissions = await connect();
        if (!permissions) {
          throw Error("No permissions granted");
        }
        console.log("New connection:", permissions.address);
        activeAddress = permissions.address as string;
        activePk = permissions.publicKey as string;
      }

      // refer to https://tezostaquito.io/docs/signing/#generating-a-signature-with-beacon-sdk
      const dappUrl = "gx-credentials.example.com";
      const ISO8601formatedTimestamp = new Date().toISOString();
      const input = "GX Credentials Login";
      const formattedInput: string = [
        "Tezos Signed Message:",
        dappUrl,
        ISO8601formatedTimestamp,
        input,
      ].join(" ");

      const payloadBytes = payloadBytesFromString(formattedInput);
      const payload: RequestSignPayloadInput = {
        signingType: SigningType.MICHELINE,
        payload: payloadBytes,
        sourceAddress: activeAddress,
      };
      const { signature } = await dAppClient!.requestSignPayload(payload);
      if (!signature) {
        throw Error("No login signature");
      }

      await login({
        activeAddress,
        activePk,
        formattedInput,
        signature,
      });
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
      className="relative inline-flex h-12 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 focus:ring-offset-slate-50 w-32"
      onClick={handleLogin}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-slate-950 px-3 py-1 text-lg font-medium text-white backdrop-blur-3xl hover:bg-primary duration-500 transition-colors">
        Login
      </span>
    </Button>
  );
};

export default LoginButton;
