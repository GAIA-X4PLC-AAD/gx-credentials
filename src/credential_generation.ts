import type { Company } from './Interface';
import { v4 as uuid } from 'uuid';
import { JWKFromTezos } from 'didkit-wasm';

export const genrateSignature = async (company: Company) => {
  const did = `did:pkh:tz:${userData.account.address}`;
  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        alias: 'https://schema.org/name',
        description: 'https://schema.org/description',
        website: 'https://schema.org/url',
        logo: 'https://schema.org/logo',
        BasicProfile: 'https://tzprofiles.com/BasicProfile',
      },
    ],
    id: 'urn:uuid:' + uuid(),
    issuer: 'did:pkh:tz:tz1ZDSnwGrvRWDYG2sGt5vzHGQFfVAq3VxJc',
    issuanceDate: new Date().toISOString(),
    type: ['VerifiableCredential', 'Company Credential'],
    credentialSubject: {
      id: did,
      name: company.name,
      description: company.description,
      url: company.url,
    },
  };

  let credentialString = JSON.stringify(credential);
  const proofOptions = {
    verificationMethod:
      //did + '#TezosMethod2021',
      'did:pkh:tz:tz1ZDSnwGrvRWDYG2sGt5vzHGQFfVAq3VxJc#TezosMethod2021',
    proofPurpose: 'assertionMethod',
  };
  const publicKeyJwkString = await JWKFromTezos(
    'edpkuL1QwpLYvnxdcSdNX8sgeainqRcuk93btMiD2xjQhBQmmd2xiS'
  );
};
