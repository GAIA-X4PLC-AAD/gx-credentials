import {
  completeIssueCredential,
  JWKFromTezos,
  prepareIssueCredential,
  verifyCredential,
} from "@spruceid/didkit-wasm";
import type {
  CompanyApplication,
  EmployeeApplication,
} from "../types/CompanyApplication";
import { dAppClient } from "../config/wallet";
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk";
import { setAddressRoleInDb } from "./database";
import { ADDRESS_ROLES } from "@/constants/constants";

export const credentialOutputDescriptor = {
  id: "Gaia-X Participant Credential",
  schema: "Gaia-X Credentials",
  display: {
    title: {
      path: [],
      schema: {
        type: "string",
      },
      fallback: "GX Participant",
    },
    subtitle: {
      path: ["$.credentialSubject['gx:legalName']"],
      schema: {
        type: "string",
      },
      fallback: "Name Unknown",
    },
    description: {
      path: [],
      schema: {
        type: "string",
      },
      fallback:
        "This VC identifies a Gaia-X participant. It can be used to access federation services.",
    },
    properties: [
      {
        path: ["$.credentialSubject.id"],
        schema: {
          type: "string",
        },
        fallback: "Unknown",
        label: "Participant DID",
      },
    ],
  },
};

export const issueCompanyCredential = async (
  companyApplication: CompanyApplication,
) => {
  const account = await dAppClient!.getActiveAccount();
  const did = `did:pkh:tz:` + account!.address;
  const rawCredential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      // TODO why can't didkit resolve external contexts?
      //"https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
    ],
    type: ["VerifiableCredential", "Company Credential"],
    id: "urn:uuid:" + crypto.randomUUID(),
    issuer: did,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: `did:pkh:tz:` + companyApplication.address,
      type: "gx:LegalParticipant",
      "gx:legalName": companyApplication.name,
      "gx:legalRegistrationNumber": {
        "gx:vatID": companyApplication.gx_id,
      },
      "gx:headquarterAddress": {
        "gx:countrySubdivisionCode": "DE-BY",
      },
      "gx:legalAddress": {
        "gx:countrySubdivisionCode": "DE-BY",
      },
      "gx-terms-and-conditions:gaiaxTermsAndConditions":
        "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
    },
  };
  try {
    const credential = await issueCredential(rawCredential);
    await setAddressRoleInDb(
      companyApplication.address,
      ADDRESS_ROLES.COMPANY_APPROVED,
    );
    console.log(credential);
    return credential;
  } catch (error) {
    throw error;
  }
};

export const issueEmployeeCredential = async (
  employeeApplication: EmployeeApplication,
) => {
  const account = await dAppClient!.getActiveAccount();
  const did = `did:pkh:tz:` + account!.address;
  const rawCredential = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      // TODO why can't didkit resolve external contexts?
      //"https://registry.lab.gaia-x.eu/development/api/trusted-shape-registry/v1/shapes/jsonld/trustframework#",
    ],
    type: ["VerifiableCredential", "Employee Credential"],
    id: "urn:uuid:" + crypto.randomUUID(),
    issuer: did,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: `did:pkh:tz:` + employeeApplication.address,
      type: "gx:LegalParticipant",
      "gx:legalName": employeeApplication.name,
      "gx:legalRegistrationNumber": {
        "gx:vatID": employeeApplication.employeeId,
      },
      "gx:issuerCompanyName": employeeApplication.companyName,
      "gx:issuerCompanyID": employeeApplication.companyId,
      "gx-terms-and-conditions:gaiaxTermsAndConditions":
        "70c1d713215f95191a11d38fe2341faed27d19e083917bc8732ca4fea4976700",
    },
  };
  try {
    const credential = await issueCredential(rawCredential);
    await setAddressRoleInDb(
      employeeApplication.address,
      ADDRESS_ROLES.EMPLOYEE_APPROVED,
    );
    console.log(credential);
    return credential;
  } catch (error) {
    throw error;
  }
};

const issueCredential = async (rawCredential: any) => {
  let rawCredentialString = JSON.stringify(rawCredential);
  const account = await dAppClient!.getActiveAccount();
  const proofOptions = {
    verificationMethod: `did:pkh:tz:${account!.address}#TezosMethod2021`,
    proofPurpose: "assertionMethod",
  };

  //public key of the issuer
  const publicKeyJwkString = await JWKFromTezos(account!.publicKey);
  let prepStr = await prepareIssueCredential(
    rawCredentialString,
    JSON.stringify(proofOptions),
    publicKeyJwkString,
  );

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
      sourceAddress: account!.address,
    };
    const { signature } = await dAppClient!.requestSignPayload(payload);
    credentialString = await completeIssueCredential(
      rawCredentialString,
      prepStr,
      signature,
    );
  } catch (error) {
    console.log("Error generating credential. ", error);
  }

  const verifyOptionsString = "{}";
  const verifyResult = JSON.parse(
    await verifyCredential(credentialString, verifyOptionsString),
  );
  if (verifyResult.errors.length > 0) {
    console.log("Error verifying new credential: ", verifyResult.errors);
    throw new Error("Error verifying new credential");
  }

  return JSON.parse(credentialString);
};
