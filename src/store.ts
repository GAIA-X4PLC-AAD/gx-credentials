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
import type { Company, Employee } from './Interface';
import { v4 as uuid } from 'uuid';
import {
  completeIssueCredential,
  JWKFromTezos,
  prepareIssueCredential,
  verifyCredential,
} from '@spruceid/didkit-wasm';
import { InMemorySigner } from '@taquito/signer';
import { db } from './Firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore/lite';

const rpcUrl = 'https://ghostnet.ecadinfra.com';
const Tezos = new TezosToolkit(rpcUrl);
Tezos.addExtension(new Tzip16Module());

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

let localUserData;
userData.subscribe((x) => {
  localUserData = x;
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
  let newWallet: BeaconWallet = new BeaconWallet(options);
  try {
    wallet.set(newWallet);
    await newWallet.requestPermissions(requestPermissionsInput);
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

export const generateCompanySignature = async (userData, company: Company) => {
  const did = `did:pkh:tz:` + userData.address;
  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        name: 'https://schema.org/name',
        description: 'https://schema.org/description',
        gxId: 'https://schema.org/gxId',
      },
    ],
    id: 'urn:uuid:' + uuid(),
    issuer: 'did:pkh:tz:' + localUserData.account.address,
    issuanceDate: new Date().toISOString(),
    type: ['VerifiableCredential', 'Company Credential'],
    credentialSubject: {
      id: did,
      name: company.name,
      description: company.description,
      gxId: company.gxId,
    },
  };
  let credentialString = JSON.stringify(credential);
  const proofOptions = {
    verificationMethod: `did:pkh:tz:${localUserData.account.address}#TezosMethod2021`,
    proofPurpose: 'assertionMethod',
  };
  //public key of the issuer
  const publicKeyJwkString = await JWKFromTezos(
    import.meta.env.VITE_ISSUER_PUBLIC_KEY
  );
  console.log(userData.publicKey);
  console.log(publicKeyJwkString);
  console.log(credentialString);
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

export const generateCompanyCredential = async (company: Company) => {
  console.log('localuserdata: ', localUserData);
  const userData2 = {
    address: company.address,
    publicKey: company.publicKey,
  };
  try {
    const { micheline, credentialString, prepStr } =
      await generateCompanySignature(userData2, company);

    // private key of the issuer of the credential
    // const signer = new InMemorySigner(import.meta.env.VITE_ISSUER_PRIVATE_KEY);
    // const bytes = micheline;
    // const { prefixSig } = await signer.sign(bytes);
    const payload: RequestSignPayloadInput = {
      signingType: SigningType.MICHELINE,
      payload: micheline,
      sourceAddress: localUserData.account.address,
    };

    const { signature } = await localWallet.client.requestSignPayload(payload);
    let vcStr = await completeIssueCredential(
      credentialString,
      prepStr,
      signature
    );

    console.log('Credential verified. VC:', vcStr);
    const verifyOptionsString = '{}';
    const verifyResult = JSON.parse(
      await verifyCredential(vcStr, verifyOptionsString)
    );
    if (verifyResult.errors.length > 0) {
      console.log('Error in verifying Credential', verifyResult.errors);
      throw new Error('Error in verifying Credential');
    }

    const data = JSON.parse(vcStr);
    console.log(data);
    await addCompanyDataAndTrustedIssuer(data.id, userData2.address);
    setDoc(doc(db, 'CompanyVC', userData2.address), { ...data })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    //public key of the holder and subject
    // const publicKey1 = userData.account.publicKey;
    // const publicKeyJwkString1 = await JWKFromTezos(publicKey1);
    // const publicKeyJwkString1 = await JWKFromTezos(
    //   'edpkuGHxcJDq9gutfaizFBQuFncLEhiLXKzPKVp5r1cwRpKnftDoD6'
    // );

    // let vpprep, vp;
    // const did = `did:pkh:tz:${userData.account.address}`;
    // const proofOptions1 = {
    //   proofPurpose: 'assertionMethod',
    // };

    // const unsignedPresentation = {
    //   '@context': ['https://www.w3.org/2018/credentials/v1'],
    //   id: 'https://www.w3.org/2018/credentials/v1',
    //   type: ['VerifiablePresentation'],
    //   holder: did,
    //   verifiableCredential: [JSON.parse(vcStr)],
    // };
    // //client as the holder of the credential
    // const signer2 = new InMemorySigner(
    //   'edskS2yjd6nzuYrX6AnHX3Sd5anGxYFRqcMKkcaNXyxcBW9W4rvmfh8EJdSAgj9GKzFPa7cRRgEPBRJXP2LSXvkD7dU2ykDZRh'
    // );

    // try {
    //   vpprep = await prepareIssuePresentation(
    //     JSON.stringify(unsignedPresentation),
    //     JSON.stringify(proofOptions1),
    //     publicKeyJwkString1
    //   );

    //   const preparation = JSON.parse(vpprep);
    //   const { signingInput } = preparation;
    //   const micheline = signingInput && signingInput.micheline;

    //   const payload: RequestSignPayloadInput = {
    //     signingType: SigningType.MICHELINE,
    //     payload: micheline,
    //     sourceAddress: userData.account.address,
    //   };

    //   const { signature } = await localWallet.client.requestSignPayload(
    //     payload
    //   );

    //   vp = await completeIssuePresentation(
    //     JSON.stringify(unsignedPresentation),
    //     vpprep,
    //     signature
    //   );
    // } catch (error) {
    //   console.log('ERROR: ', error);
    // }

    // console.log('VP:', vp);
  } catch (error) {
    console.log('Error in generating Credential. ', error);
  }
};

export const downloadCompanyVC = (user) => {
  const docRef = doc(db, 'CompanyVC', user);
  getDoc(docRef).then((doc) => {
    const data = JSON.stringify(doc.data());
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'CompanyVC.json';
    link.click();
  });
};

export const downloadEmployeeVC = (user) => {
  const docRef = doc(db, 'EmployeeVC', user);
  getDoc(docRef).then((doc) => {
    const data = JSON.stringify(doc.data());
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'EmployeeVC.json';
    link.click();
  });
};

export const addCompanyDataAndTrustedIssuer = async (
  vcId: string,
  did: string
) => {
  Tezos.setWalletProvider(localWallet);
  const contract = await Tezos.wallet.at(import.meta.env.VITE_CONTRACT_ADDRESS);

  const batch = await Tezos.wallet
    .batch()
    .withContractCall(contract.methods.addCompanyCredential(vcId, did))
    .withContractCall(contract.methods.addIssuer(did));

  const op = await batch.send();
  const hash = await op.confirmation(1);
  console.log('Hash of the confirmed transaction ', hash);
};

export const addEmployeeData = async (vcId: string, did: string) => {
  Tezos.setWalletProvider(localWallet);
  Tezos.wallet
    .at(import.meta.env.VITE_CONTRACT_ADDRESS)
    .then((contract) => {
      return contract.methods.addEmployeeCredential(vcId, did).send();
    })
    .then((op: any) => {
      console.log('op: ', op);
      console.log(`Waiting for ${op.hash} to be confirmed...`);
      return op.confirmation(1).then(() => op.hash);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getTrustedIssuers = async (): Promise<string[]> => {
  console.log('userdata', userData);
  const companyCol = collection(db, 'CompanyCredentials');
  const companySnapshot = await getDocs(companyCol);
  const companyCredentials = companySnapshot.docs.map((doc) => doc.data());
  console.log('ss', companyCredentials);

  let retVal = [];
  companyCredentials.forEach((credential) => {
    if (credential.status === 'Approved')
      retVal.push({
        companyName: credential.name,
        companyAddress: credential.address,
      });
  });

  return Promise.resolve(retVal);
};

// Employee

export const generateEmployeeSignature = async (
  userData,
  employee: Employee,
  issuerPk: string
) => {
  console.log('HERE', employee);
  const did = `did:pkh:tz:` + userData.address;
  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        name: 'https://schema.org/name',
        company: 'https://schema.org/description',
      },
    ],
    id: 'urn:uuid:' + uuid(),
    issuer: `did:pkh:tz:${employee.company}`,
    issuanceDate: new Date().toISOString(),
    type: ['VerifiableCredential', 'Employee Credential'],
    credentialSubject: {
      id: did,
      name: employee.name,
      company: employee.company,
    },
  };

  let credentialString = JSON.stringify(credential);
  //address of the issuer
  const proofOptions = {
    verificationMethod: 'did:pkh:tz:' + employee.company + '#TezosMethod2021',
    proofPurpose: 'assertionMethod',
  };
  //public key of the issuer
  const publicKeyJwkString = await JWKFromTezos(issuerPk);
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

export const generateEmployeeCredential = async (
  employee: Employee,
  issuerPk: string
) => {
  const userData = {
    address: employee.address,
    publicKey: employee.publicKey,
  };
  try {
    const { micheline, credentialString, prepStr } =
      await generateEmployeeSignature(userData, employee, issuerPk);

    // private key of the issuer of the credential
    // const signer = new InMemorySigner(import.meta.env.VITE_ISSUER_PRIVATE_KEY);
    // const bytes = micheline;
    // const { prefixSig } = await signer.sign(bytes);
    const payload: RequestSignPayloadInput = {
      signingType: SigningType.MICHELINE,
      payload: micheline,
      sourceAddress: employee.company,
    };

    const { signature } = await localWallet.client.requestSignPayload(payload);
    let vcStr = await completeIssueCredential(
      credentialString,
      prepStr,
      signature
    );

    console.log('Credential verified. VC:', vcStr);
    const verifyOptionsString = '{}';
    const verifyResult = JSON.parse(
      await verifyCredential(vcStr, verifyOptionsString)
    );
    if (verifyResult.errors.length > 0) {
      console.log('Error in verifying Credential', verifyResult.errors);
      throw new Error('Error in verifying Credential');
    }

    const data = JSON.parse(vcStr);
    console.log(data);
    await addEmployeeData(data.id, userData.address);
    setDoc(doc(db, 'EmployeeVC', userData.address), { ...data })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  } catch (error) {
    console.log('Error in generating Credential. ', error);
  }
};
