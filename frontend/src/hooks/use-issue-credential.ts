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

const tezosNetworkId = import.meta.env.VITE_CAIP2_TEZOS_NETWORK;

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
      if (!account || !account.publicKey) {
        throw new Error("No account connected");
      }
      const pk = account.publicKey;
      const did = `did:pkh:tezos:${tezosNetworkId}:${account?.address}`;
      const rawCredential = await constructPayload(application, type, did, pk);
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
    did: string,
    pk: string
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
          type:
            type == "company" ? "gx:LegalParticipant" : "gx:NaturalParticipant",
          "gx:legalName": application.metadata?.legalName,
        },
      },
      iss: did,
      iat: iat,
      nbf: iat,
      sub: `did:pkh:tezos:${tezosNetworkId}:${application?.pkh}`,
      jti: `urn:uuid:${crypto.randomUUID()}`,
    };
    let additionalPayload;
    if (type == "company") {
      additionalPayload = {
        "gx:registrationNumber": application.metadata?.registrationNumber,
        "gx:headquarterAddress": application.metadata?.headquarterAddress,
        "gx:legalAddress": application.metadata?.legalAddress,
        "gx:parentOrganization": application.metadata?.parentOrganization,
        "gx:subOrganization": application.metadata?.subOrganization,
      };
    } else {
      additionalPayload = {
        "gx:email": application.metadata?.email,
      };
    }
    payload.vc.credentialSubject = {
      ...payload.vc.credentialSubject,
      ...additionalPayload,
    };
    const jwtHeader = {
      alg: "EdDSA",
      typ: "JWT",
      // not using the did here because otherwise a verifier would have no guaranteed way of getting the pk
      kid: pk,
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
