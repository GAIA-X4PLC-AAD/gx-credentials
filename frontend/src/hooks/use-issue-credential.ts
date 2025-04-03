"use client";

import { payloadBytesFromString } from "@/lib/payload";
import { Application } from "@/model/application";
import { CredentialFormat } from "@/model/credential";
import {
  DAppClient,
  RequestSignPayloadInput,
  SigningType,
} from "@airgap/beacon-sdk";
import { JWKFromTezos } from "@spruceid/didkit-wasm";
import base64url from "base64url";
import * as jose from "jose";
import { useState } from "react";

type IssueCredential = {
  issueCredential: (
    application: Application,
    type: "employee" | "company",
    format: CredentialFormat,
    dAppClient: DAppClient,
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
    format: CredentialFormat,
    dAppClient: DAppClient,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const account = await dAppClient?.getActiveAccount();
      const did = `did:pkh:tz:` + account?.address;
      const rawCredential = await constructPayload(
        application,
        format,
        type,
        did,
      );
      return await issue(rawCredential, dAppClient, format);
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
    format: CredentialFormat,
    type: "employee" | "company",
    did: string,
  ) => {
    let rawCredentialString: string = "";
    const payload =
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
                "gx:countrySubdivisionCode": application.metadata?.legalAddress,
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
    if (format === CredentialFormat.JWT) {
      const jwtHeader = {
        alg: "EdDSA",
        typ: "JWT",
        kid: "did:example:abfe13f712120431c276e12ecab#keys-1",
      };

      const jwtPayload = {
        sub: "did:example:ebfeb1f712ebc6f1c276e12ec21",
        jti: "http://example.edu/credentials/3732",
        iss: "https://example.com/keys/foo.jwk",
        nbf: 1541493724,
        iat: 1541493724,
        exp: 1573029723,
        nonce: "660!6345FSer",
        vc: {
          ...payload,
        },
      };
      rawCredentialString =
        base64url(JSON.stringify(jwtHeader)) +
        "." +
        base64url(JSON.stringify(jwtPayload));
    } else rawCredentialString = JSON.stringify(payload);
    return rawCredentialString;
  };

  const issue = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawCredentialString: string,
    dAppClient: DAppClient,
    format: CredentialFormat,
  ): Promise<unknown> => {
    let credentialString = "";
    const account = await dAppClient?.getActiveAccount();
    console.log("Generating credential...");
    console.log("account", account);
    console.log("public key", account?.publicKey);

    if (format === CredentialFormat.LD) {
      const proofOptions = {
        verificationMethod: `did:pkh:tz:${account?.address}#TezosMethod2021`,
        proofPurpose: "assertionMethod",
      };

      const didkit = await import("@spruceid/didkit-wasm");

      const publicKeyJwkString = await didkit.JWKFromTezos(
        account?.publicKey + "",
      );
      const publicKeyJwk = JSON.parse(publicKeyJwkString);
      console.log("Public key JWK: ", publicKeyJwk);

      const prepStr = await didkit.prepareIssueCredential(
        rawCredentialString,
        JSON.stringify(proofOptions),
        publicKeyJwkString,
      );
      console.log("Preparation string: ", prepStr);

      const preparation = JSON.parse(prepStr);
      const { signingInput } = preparation;
      const micheline = signingInput && signingInput.micheline;
      if (!micheline) {
        throw new Error("Expected micheline signing input");
      }
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
          signature,
        );
      } catch (error) {
        console.log("Error generating credential. ", error);
        throw error;
      }

      const verifyOptionsString = "{}";
      const verifyResult = JSON.parse(
        await didkit.verifyCredential(credentialString, verifyOptionsString),
      );
      if (verifyResult.errors.length > 0) {
        console.log("Error verifying new credential: ", verifyResult.errors);
        throw new Error("Error verifying new credential");
      }
    } else {
      // JWT VC
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

      const jwtvc = formattedInput + "." + base64url(response.signature);
      console.log(response);
      console.log("jwtvc", jwtvc);

      const alg = "EdDSA";
      const jwk = JSON.parse(await JWKFromTezos(account?.publicKey as string));
      jwk.alg = alg;
      console.log("Parsed JWK", jwk);

      // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#browser_compatibility
      const publicKey = await jose.importJWK(jwk, alg);
      console.log("Public key in JWT VC issuance process", publicKey);

      // TODO: why is signature verification failing?
      // const verifyResult = await jose.jwtVerify(jwtvc, publicKey);
      // console.log("JWT VC verification result", verifyResult);

      const [header, vcPayload, signature] = jwtvc.split(".");
      credentialString = JSON.stringify({
        ...JSON.parse(base64url.decode(header)),
        ...JSON.parse(base64url.decode(vcPayload)),
        signature: base64url.decode(signature),
      });
      console.log("JWT credential string", credentialString);
    }

    return JSON.parse(credentialString);
  };

  return {
    issueCredential,
    isLoading,
    error,
  };
}
