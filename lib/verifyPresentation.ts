import { verifyCredential, verifyPresentation } from "@spruceid/didkit-wasm";
import { getCredentialStatus } from "./registryInteraction";

export const verifyPresentationUtil = async (VP: any) => {
    console.log("Verification endpoint triggered");
    try {
      let status = "reject";
      const VC_TYPE = "VerifiableCredential";
      const VP_TYPE = "VerifiablePresentation";
      // Check type of the credential (VC or VP)
      if (VP?.type?.includes(VP_TYPE)) {
        // Check the data type of the VerifiableCredential field
        if (VP?.verifiableCredential) {
          const VC = VP.verifiableCredential.type?.includes(VC_TYPE);
          if (VC) {
            status = await verifyPresentationHelper(VC, VP);
          } else {
            const errorMessage =
              "Unable to find a CompanyCredential or EmployeeCredential VC in the VP";
            console.error(errorMessage);
          }
        } else {
          // No VCs in VP
          const errorMessage =
            "Unable to detect verifiable credentials in the VP";
          console.error(errorMessage);
        }
      }else {
        const errorMessage = "Unable to determine the type of the credential.";
        console.error(errorMessage);
      }
        return status;
    } catch (error) {
        console.error(error);
        return "reject";
    }
}


const verifyPresentationHelper = async (VC: any, VP: any) => {
    // Check if the subject is the holder of the VP
    await getCredentialStatus("")
    if (VP?.holder === VC?.credentialSubject?.id) {
      // Check if log exists
    //   const log = await getVCStatusByDID(VC?.credentialSubject?.id);
    //   if (
    //     log &&
    //     log?.message === "Credentials have been published to the blockchain"
    //   ) {
    //     // Verify the issuer's identity
    //     const issuer = VC?.issuer;
    //     const isIssuerTrusted = await getIssuerStatusByDID(issuer);
    //     if (isIssuerTrusted) {
    //       // Verify the signature on the VC
    //       const verifyOptionsString = "{}";
    //       const verifyResult = JSON.parse(
    //         await verifyCredential(JSON.stringify(VC), verifyOptionsString)
    //       );
    //       // If credential verification is successful, verify the presentation
    //       if (verifyResult?.errors?.length === 0) {
    //         const res = JSON.parse(
    //           await verifyPresentation(JSON.stringify(VP), verifyOptionsString)
    //         );
    //         // If verification is successful
    //         if (res.errors.length === 0) {
    //           return "accept";
    //         } else {
    //           const errorMessage = `Unable to verify presentation: ${res.errors.join(
    //             ", "
    //           )}`;
    //           console.error(errorMessage);
    //         }
    //       } else {
    //         const errorMessage = `Unable to verify credential: ${verifyResult.errors.join(
    //           ", "
    //         )}`;
    //         console.error(errorMessage);
    //       }
    //     } else {
    //       const errorMessage =
    //         "Unable to find the issuer in the trusted issuers registry.";
    //       console.error(errorMessage);
    //     }
    //   } else {
    //     const errorMessage = "Unable to detect a log about the credential.";
    //     console.error(errorMessage);
    //   }
    } else {
      const errorMessage = "The credential subject does not match the VP holder.";
      console.error(errorMessage);
    }

    return "reject";
  };