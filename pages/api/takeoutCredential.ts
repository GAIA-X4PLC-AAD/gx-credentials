import type { NextApiRequest, NextApiResponse } from "next";
import { credentialOutputDescriptor } from "../../lib/credentials";
import { getCredentialsFromDb } from "../../lib/database";
import multer from "multer";
import { verifyPresentationUtil } from "@/lib/verifyPresentation";
import { COLLECTIONS } from "@/constants/constants";

// Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const upload = multer();

// This array will contain the middleware functions for each form field
let uploadMiddleware = upload.fields([
  { name: "subject_id", maxCount: 1 },
  { name: "presentation", maxCount: 1 },
]);

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
      return new Promise(async (resolve, reject) => {
        uploadMiddleware(req, res, async (err: Error | null) => {
          if (err) {
            // An error occurred when uploading
            console.log(err);
            reject(err);
            return;
          }

          // Parse the JSON string into a JavaScript object
          const presentation = JSON.parse(req.body.presentation);
          console.log("Presentation: ", presentation);

          // Verify the presentation and the status of the credential
          if (await verifyPresentationUtil(presentation)) {
            console.log("Presentation verified");
          } else {
            console.log("Presentation invalid");
            res.status(500);
            res.end();
            return;
          }

          // Get the address of the user
          const address =
            presentation["verifiableCredential"]["credentialSubject"][
              "associatedAddress"
            ];

          // Get the credentials from the database
          const credentials = await getCredentialsFromDb(
            COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS,
            address,
          );
          res.status(200).json(credentials[0].credential);
          resolve();
        });
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
