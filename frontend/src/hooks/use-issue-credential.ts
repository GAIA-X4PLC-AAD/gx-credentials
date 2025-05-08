"use client";

import {
  DAppClient,
  RequestSignPayloadInput,
  SigningType,
} from "@airgap/beacon-sdk";
import { base64url } from "jose";
import { useState } from "react";

import { Application } from "@/model/application";
import { payloadBytesFromString } from "@/lib/utils";

type IssueCredential = {
  issueCredential: (
    application: Application,
    type: "employee" | "company",
    dAppClient: DAppClient
  ) => Promise<unknown>;
  isLoading: boolean;
  error: Error | null;
};

export function useIssueCredential(): IssueCredential {
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
      const did = `did:pkh:tezos:` + account?.address;
      const rawCredential = await constructPayload(application, type, did);
      return await issue(rawCredential, dAppClient);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // helper function to construct the payload of the credential to be issued
  const constructPayload = async (
    application: Application,
    type: "employee" | "company",
    did: string
  ) => {
    const date = new Date();
    const iat = Math.floor(date.getTime() / 1000);
    const payload = {
      vc: {
        type: [
          "VerifiableCredential",
          type == "company" ? "CompanyCredential" : "EmployeeCredential",
        ],
        credentialSubject: {
          type: "gx:LegalParticipant",
          "gx:legalName": application.metadata?.legalName,
          "gx-terms-and-conditions:gaiaxTermsAndConditions":
            "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
        },
      },
      iss: did,
      iat: iat,
      nbf: iat,
      sub: `did:pkh:tezos:` + application?.pkh,
      jti: "urn:uuid:" + crypto.randomUUID(),
    };
    const jwtHeader = {
      alg: "EdDSA",
      typ: "JWT",
      kid: did,
    };
    const totalPayload =
      base64url.encode(JSON.stringify(jwtHeader)) +
      "." +
      base64url.encode(JSON.stringify(payload));
    return totalPayload;
  };

  const issue = async (
    rawCredentialString: string,
    dAppClient: DAppClient
  ): Promise<unknown> => {
    let credentialString = "";
    const account = await dAppClient?.getActiveAccount();
    console.log("Generating credential...");
    console.log("account", account);
    console.log("public key", account?.publicKey);

    const formattedInput = rawCredentialString;
    console.log("Formatted input", formattedInput);

    const payloadBytes = payloadBytesFromString(formattedInput);
    console.log("Payload bytes", payloadBytes);

    const payload: RequestSignPayloadInput = {
      signingType: SigningType.MICHELINE,
      payload: payloadBytes,
      sourceAddress: account?.address,
    };
    const response = await dAppClient!.requestSignPayload(payload);

    const jwtvc = formattedInput + "." + base64url.encode(response.signature);
    console.log(response);
    console.log("jwtvc", jwtvc);

    const [header, vcPayload, signature] = jwtvc.split(".");
    credentialString = JSON.stringify({
      header: JSON.parse(
        Buffer.from(base64url.decode(header)).toString("utf-8")
      ),
      payload: JSON.parse(
        Buffer.from(base64url.decode(vcPayload)).toString("utf-8")
      ),
      signature,
    });
    console.log("JWT credential string", credentialString);

    return JSON.parse(credentialString);
  };

  return {
    issueCredential,
    isLoading,
    error,
  };
}
