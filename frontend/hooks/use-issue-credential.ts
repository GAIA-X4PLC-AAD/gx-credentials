"use client";

import { Application } from "@/model/application";
import {
  DAppClient,
  RequestSignPayloadInput,
  SigningType,
} from "@airgap/beacon-sdk";
import { useState } from "react";

export function useIssueCredential() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const issueCredential = async (
    application: Application,
    type: "employee" | "company",
    dAppClient: DAppClient
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const account = await dAppClient?.getActiveAccount();
      const did = `did:pkh:tz:` + account?.address;
      const rawCredential =
        type === "company"
          ? {
              "@context": ["https://www.w3.org/2018/credentials/v1"],
              type: ["VerifiableCredential", "Company Credential"],
              id: "urn:uuid:" + crypto.randomUUID(),
              issuer: did,
              issuanceDate: new Date().toISOString(),
              credentialSubject: {
                id: `did:pkh:tz:` + application?.pkh,
                type: "gx:LegalParticipant",
                "gx:legalName": application.metadata?.legalName,
                "gx:legalRegistrationNumber": {
                  "gx:vatID": application.metadata?.registrationNumber,
                },
                "gx:headquarterAddress": {
                  "gx:countrySubdivisionCode":
                    application.metadata?.headquarterAddress,
                },
                "gx:legalAddress": {
                  "gx:countrySubdivisionCode":
                    application.metadata?.legalAddress,
                },
                "gx-terms-and-conditions:gaiaxTermsAndConditions":
                  "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
              },
            }
          : {
              "@context": ["https://www.w3.org/2018/credentials/v1"],
              type: ["VerifiableCredential", "Employee Credential"],
              id: "urn:uuid:" + crypto.randomUUID(),
              issuer: did,
              issuanceDate: new Date().toISOString(),
              credentialSubject: {
                id: `did:pkh:tz:` + application?.pkh,
                type: "gx:LegalParticipant",
                "gx:legalName": application.metadata?.legalName,
                "gx-terms-and-conditions:gaiaxTermsAndConditions":
                  "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
              },
            };
      return await issue(rawCredential, dAppClient);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const issue = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawCredential: any,
    dAppClient: DAppClient
  ): Promise<unknown> => {
    const rawCredentialString = JSON.stringify(rawCredential);
    const account = await dAppClient?.getActiveAccount();
    const proofOptions = {
      verificationMethod: `did:pkh:tz:${account?.address}#TezosMethod2021`,
      proofPurpose: "assertionMethod",
    };

    console.log(proofOptions);

    // https://zenn.dev/hid3/articles/8cf5ed69ba75ee
    const didkit = await import("@spruceid/didkit-wasm");

    console.log("Generating credential...");
    console.log("account", account);
    console.log("public key", account?.publicKey);

    const publicKeyJwkString = await didkit.JWKFromTezos(
      account?.publicKey + ""
    );
    const publicKeyJwk = JSON.parse(publicKeyJwkString);
    console.log("Public key JWK: ", publicKeyJwk);

    const prepStr = await didkit.prepareIssueCredential(
      rawCredentialString,
      JSON.stringify(proofOptions),
      publicKeyJwkString
    );
    console.log("Preparation string: ", prepStr);

    const preparation = JSON.parse(prepStr);
    const { signingInput } = preparation;
    const micheline = signingInput && signingInput.micheline;
    if (!micheline) {
      throw new Error("Expected micheline signing input");
    }

    let credentialString;
    try {
      const payload: RequestSignPayloadInput = {
        signingType: SigningType.MICHELINE,
        payload: micheline,
        sourceAddress: account?.address,
      };
      if (!dAppClient) throw new Error("No dAppClient");
      const { signature } = await dAppClient.requestSignPayload(payload);
      credentialString = await didkit.completeIssueCredential(
        rawCredentialString,
        prepStr,
        signature
      );
    } catch (error) {
      console.log("Error generating credential. ", error);
      throw error;
    }

    const verifyOptionsString = "{}";
    const verifyResult = JSON.parse(
      await didkit.verifyCredential(credentialString, verifyOptionsString)
    );
    if (verifyResult.errors.length > 0) {
      console.log("Error verifying new credential: ", verifyResult.errors);
      throw new Error("Error verifying new credential");
    }

    return JSON.parse(credentialString);
  };

  return {
    issueCredential,
    isLoading,
    error,
  };
}
