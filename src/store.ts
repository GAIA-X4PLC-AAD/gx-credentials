import {
  BeaconEvent,
  NetworkType,
  SigningType,
  type RequestSignPayloadInput,
} from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { Tzip16Module } from '@taquito/tzip16';
import { encodeKey } from '@taquito/utils';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { Company } from './Interface';
import { v4 as uuid } from 'uuid';
import {
  completeIssueCredential,
  JWKFromTezos,
  prepareIssueCredential,
  verifyCredential,
} from 'didkit-wasm';
// const didkit = require('didkit-wasm-node');

import { InMemorySigner } from '@taquito/signer';

const rpcUrl = 'https://ghostnet.ecadinfra.com';

// Global variables used in the store with the writable API
// The end user's wallet
export const wallet: Writable<BeaconWallet> = writable<BeaconWallet>(null);

//Network type
export const network: Writable<NetworkType> = writable<NetworkType>(
  NetworkType.GHOSTNET
);

// UserData from a beacon wallet
export const userData = writable(null);

let localWallet: BeaconWallet;
wallet.subscribe((x) => {
  localWallet = x;
});

wallet.subscribe((w) => {
  if (w) {
    w.client.subscribeToEvent(
      BeaconEvent.PERMISSION_REQUEST_SUCCESS,
      async (data) => {
        const pk = data.account.publicKey;
        const pkh = data.account.address;
        if (!pk.includes('pk')) {
          const prefix = { tz1: '00', tz2: '01', tz3: '02' };
          data.account.publicKey = encodeKey(prefix[pkh.substring(0, 3)] + pk);
        }
        userData.set(data);
      }
    );
  }
});

export const initWallet = async () => {
  const options = {
    name: 'Company Credential',
    iconUrl: 'https://tezostaquito.io/img/favicon.png',
    preferredNetwork: NetworkType.GHOSTNET,
  };

  const requestPermissionsInput = {
    network: {
      type: NetworkType.GHOSTNET,
      rpcUrl: rpcUrl,
    },
  };
  let Tezos: TezosToolkit;
  let newWallet: BeaconWallet = new BeaconWallet(options);
  try {
    wallet.set(newWallet);
    await newWallet.requestPermissions(requestPermissionsInput);
    const Tezos = new TezosToolkit(rpcUrl);
    Tezos.addExtension(new Tzip16Module());
    Tezos.setWalletProvider(newWallet);
  } catch (e) {
    wallet.set(null);
    throw e;
  }
};

export const disconnectWallet = async () => {
  wallet.set(null);
  userData.set(null);
};

export const genrateSignature = async (userData, company: Company) => {
  const did = `did:pkh:tz:` + userData.account.address;
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
  const publicKeyJwkString = await JWKFromTezos(userData.account.publicKey);

  let prepStr = await prepareIssueCredential(
    credentialString,
    JSON.stringify(proofOptions),
    publicKeyJwkString
  );

  const preparation = JSON.parse(prepStr);
  const { signingInput } = preparation;
  const micheline = signingInput && signingInput.micheline;
  if (!micheline) {
    throw new Error('Expected micheline signing input');
  }

  return { micheline, credentialString, prepStr };
};

export const generateCredential = async (userData, company: Company) => {
  try {
    const { micheline, credentialString, prepStr } = await genrateSignature(
      userData,
      company
    );

    const payload: RequestSignPayloadInput = {
      signingType: SigningType.MICHELINE,
      payload: micheline,
      sourceAddress: userData.account.address,
    };
    const signer = new InMemorySigner(
      'edskRhNtSa3b3hQVZG9FVRoF8QFBK8qXpWo26FrXAgAytXTMmUfCfuvbwTwpUMi8kW9FaPJLeoRKS6Jp8tri2r5WWmLxRS6yWF'
    );
    const bytes = micheline;
    const { prefixSig } = await signer.sign(bytes);
    let vcStr = await completeIssueCredential(
      credentialString,
      prepStr,
      prefixSig
    );

    const verifyOptionsString = '{}';
    const verifyResult = JSON.parse(
      await verifyCredential(vcStr, verifyOptionsString)
    );
    if (verifyResult.errors.length > 0) {
      console.log('Error in verifying Credential', verifyResult.errors);
    } else {
      console.log('Credential verified. VC:', vcStr);
    }
  } catch (error) {
    console.log('Error in generating Credential', error);
  }
};
