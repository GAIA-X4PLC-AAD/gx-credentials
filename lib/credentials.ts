import {
  completeIssueCredential,
  JWKFromTezos,
  prepareIssueCredential,
} from "@spruceid/didkit-wasm";
import type { CompanyApplication } from "../types/CompanyApplication";
import { dAppClient } from "../config/wallet";
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk";

export const issueCompanyCredential = async (
  companyApplication: CompanyApplication
) => {
  const account = await dAppClient!.getActiveAccount();
  const did = `did:pkh:tz:` + account!.address;
  const rawCredential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
    ],
    type: ["VerifiableCredential"],
    id: "urn:uuid:" + crypto.randomUUID(),
    issuer: did,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      //TODO
      id: "did:web:raw.githubusercontent.com:egavard:payload-sign:master",
      type: "gx:LegalParticipant",
      "gx:legalName": "Gaia-X European Association for Data and Cloud AISBL",
      "gx:legalRegistrationNumber": {
        "gx:vatID": "FR0762747721",
      },
      "gx:headquarterAddress": {
        "gx:countrySubdivisionCode": "BE-BRU",
      },
      "gx:legalAddress": {
        "gx:countrySubdivisionCode": "BE-BRU",
      },
      "gx-terms-and-conditions:gaiaxTermsAndConditions":
        "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
    },
  };
  const credential = issueCredential(rawCredential);
  console.log(credential);
  // TODO deposit somewhere for later download
};

const issueCredential = async (rawCredential: any) => {
  let rawCredentialString = JSON.stringify(rawCredential);
  const account = await dAppClient!.getActiveAccount();
  const proofOptions = {
    verificationMethod: `did:pkh:tz:${account!.address}#TezosMethod2021`,
    proofPurpose: "assertionMethod",
  };
  const publicKeyJwkString = await JWKFromTezos(account!.publicKey);
  let prepStr = await prepareIssueCredential(
    rawCredentialString,
    JSON.stringify(proofOptions),
    publicKeyJwkString
  );

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
      sourceAddress: account!.address,
    };
    const { signature } = await dAppClient!.requestSignPayload(payload);
    let credentialString = await completeIssueCredential(
      rawCredentialString,
      prepStr,
      signature
    );
    return credentialString;
  } catch (error) {
    console.log("Error generating credential. ", error);
  }
};
