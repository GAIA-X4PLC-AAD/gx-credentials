import type { NextApiRequest, NextApiResponse } from "next";
import { credentialOutputDescriptor } from "../../lib/credentials";

// TODO change this endpoint to already request a specific credential urn in the URL
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  // No traditional login session possible
  try {
    const { method } = req;
    if (method === "GET") {
      console.log("API GET");
      console.log(req.body);
      // For security reasons, just always continue the process here and don't check if the credential actually exists
      res.status(200).json({
        type: "CredentialOffer",
        expires: "2100-09-01T19:29:39Z", //TODO is this somehow security critical?
        credentialPreview: {
          credentialSubject: {
            "gx:headquarterAddress": { "gx:countrySubdivisionCode": "DE-BY" },
            "gx-terms-and-conditions:gaiaxTermsAndConditions":
              "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
            "gx:legalRegistrationNumber": { "gx:vatID": "" },
            "gx:legalAddress": { "gx:countrySubdivisionCode": "DE-BY" },
            id: "did:pkh:tz:",
            type: "gx:LegalParticipant",
            "gx:legalName": "",
          },
          issuanceDate: "",
          id: "urn:uuid:",
          type: ["VerifiableCredential"],
          "@context": ["https://www.w3.org/2018/credentials/v1"],
          issuer: "did:pkh:tz:",
        },
        credential_manifest: {
          output_descriptors: [credentialOutputDescriptor],
          presentation_definition: {
            input_descriptors: [
              {
                constraints: {
                  fields: [
                    {
                      filter: {
                        pattern: "TezosAssociatedAddress",
                        type: "string",
                      },
                      path: ["$.type"],
                    },
                  ],
                },
                id: "f2a7402b-f649-11ed-834e-0a1628958560",
                purpose: "Select a Tezos address",
              },
            ],
          },
        },
      });
    } else if (method === "POST") {
      console.log("API POST");
      console.log(req.body);
      res.status(200).json({
        credentialSubject: {
          "gx:headquarterAddress": { "gx:countrySubdivisionCode": "DE-BY" },
          "gx-terms-and-conditions:gaiaxTermsAndConditions":
            "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
          "gx:legalRegistrationNumber": { "gx:vatID": "1" },
          "gx:legalAddress": { "gx:countrySubdivisionCode": "DE-BY" },
          id: "did:pkh:tz:tz1PY5hffnv6AYCNkAwyF4xa4gV7uAXQL4Nh",
          type: "gx:LegalParticipant",
          "gx:legalName": "Test Company",
        },
        issuanceDate: "2023-05-19T11:49:48.056Z",
        id: "urn:uuid:69a343dd-a6c3-41b6-9219-f46cd0a89812",
        proof: {
          proofValue:
            "edsigu6KwLW8tmZFELRAc7fJsZ37hEnaBou6F7kKW4Svv4Rt6tg1oMatYtn4t3rjJVfsBL4BSwbcJmHnqUAvhUkV8THeHCB8c2D",
          created: "2023-05-19T11:49:48.057Z",
          publicKeyJwk: {
            kty: "OKP",
            crv: "Ed25519",
            x: "E5TVqrxrbIOyWyopNGwJss16Ha55tVNx-MckXHbGS60",
            alg: "EdBlake2b",
          },
          proofPurpose: "assertionMethod",
          type: "TezosSignature2021",
          verificationMethod:
            "did:pkh:tz:tz1YeiPapCiHfpwVcEUjMaSC3TDh9iMzkAKr#TezosMethod2021",
          "@context": {
            TezosMethod2021: "https://w3id.org/security#TezosMethod2021",
            TezosSignature2021: {
              "@id": "https://w3id.org/security#TezosSignature2021",
              "@context": {
                expires: {
                  "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                  "@id": "https://w3id.org/security#expiration",
                },
                proofValue: "https://w3id.org/security#proofValue",
                created: {
                  "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
                  "@id": "http://purl.org/dc/terms/created",
                },
                publicKeyJwk: {
                  "@type": "@json",
                  "@id": "https://w3id.org/security#publicKeyJwk",
                },
                type: "@type",
                nonce: "https://w3id.org/security#nonce",
                domain: "https://w3id.org/security#domain",
                "@protected": true,
                "@version": 1.1,
                challenge: "https://w3id.org/security#challenge",
                proofPurpose: {
                  "@type": "@vocab",
                  "@id": "https://w3id.org/security#proofPurpose",
                  "@context": {
                    assertionMethod: {
                      "@type": "@id",
                      "@id": "https://w3id.org/security#assertionMethod",
                      "@container": "@set",
                    },
                    "@protected": true,
                    "@version": 1.1,
                    id: "@id",
                    type: "@type",
                    authentication: {
                      "@type": "@id",
                      "@id": "https://w3id.org/security#authenticationMethod",
                      "@container": "@set",
                    },
                  },
                },
                id: "@id",
                verificationMethod: {
                  "@type": "@id",
                  "@id": "https://w3id.org/security#verificationMethod",
                },
              },
            },
          },
        },
        type: ["VerifiableCredential"],
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        issuer: "did:pkh:tz:tz1YeiPapCiHfpwVcEUjMaSC3TDh9iMzkAKr",
      });
    } else {
      res.status(500);
    }
  } catch (e) {
    res.status(500);
  }
  res.end();
}

export const config = { api: { bodyParser: false } };
