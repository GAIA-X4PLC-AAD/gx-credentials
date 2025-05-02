import {
  SelectCompanyCredential,
  SelectEmployeeCredential,
} from "../db/schema";

type SelectCredential = SelectEmployeeCredential | SelectCompanyCredential;

export default function addOffer<R extends SelectCredential>(credential: R) {
  const credentialOffer = {
    credential_issuer:
      process.env.GLOBAL_SERVER_URL + "/api/vci/" + credential.id,
    credential_configuration_ids: [credential.credential.payload.vc.type[1]],
    grants: {
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
        "pre-authorized_code": credential.id,
      },
    },
  };

  const encodedOffer =
    "openid-credential-offer://?credential_offer=" +
    encodeURIComponent(JSON.stringify(credentialOffer));

  return { offer: encodedOffer, ...credential };
}
