# Use Cases

A company admin applies to a Company Credential in the first use case (UC1). This credential is then reviewed and issued by the ASCS admin. Companies require this credential to become a trusted issuer (recorded on the smart contract). In the second use case, a company employee applies for an Employee Credential. This credential's reviewer and issuer is the respective company admin (not ASCS).
 
For both types of credentials, a record is placed on the smart contract to indicate the status (active or revoked). While a company credential only has a DID and status, an employee credential also has an issuer DID. When a company issues an employee credential, the company DID is automatically (i.e., DID taken from the caller address) assigned to the issuer DID field (this way, we prevent a company from issuing an employee credential with another company’s DID as the issuer DID.). A similar check is also done for credential revoking.
 
An employee credential can only be placed on the contract by the companies in the trusted issuers list (remember that a company gets into the list when ASCS issues them a company credential). This is required to prevent any random account from adding employee credentials to the contract. Moreover, a company credential can only be added to the contract by the ASCS admin account or any other allowed callers.
 
## UC1
 
1. Company admin applies for a credential
- *Admin connects Temple wallet*
- *Applies to the relevant credential*
2. ASCS admin monitors applications
- *Admin connects Temple wallet*
3. ASCS admin accepts/rejects an application
- *Signs the credential to generate a proof*
- *Issues a transaction to update the contract (add trusted issuer, add company credential)*
- *The contract storage gets updated (companyCreds, trusted_issuers)*
4. Company admin downloads the issued credential JSON file
 
## UC2
 
1. Company employee applies for a credential
- *BMW employee connects Temple wallet*
- *Applies to the relevant credential*
2. Company admin monitors/accepts/rejects employee applications
- *BMW admin connects Temple wallet*
- *Signs the credential to generate a proof*
- *Issues a transaction to update the contract (add employee credential)*
- *The contract storage gets updated (employeeCreds)*
3. Company employee downloads the issued credential JSON file
 
## Some notes
 
- We use Tezos address (public key hash) as the default DID
- We use Firebase to store the full credentials for now. Users can download their credentials and use them freely. Remember that having a copy a credential doesn’t mean that any can present it. Only the holder of keys associated with the credential’s DID can generate a valid signature. Nonetheless, we believe employee credentials should not be stored like this in the future due to GDPR issues.
- The issued credentials are verified by our verifier backend in the EDC-Interface. This component checks whether a presented credential has a trusted issuer and its status is not revoked.
- Smart Contract Deployed Instance [Better Call Dev](https://better-call.dev/ghostnet/KT1AgNNsgQRigNTmLcQrhGPZafvdmvnLXXAZ/storage)

# Generate Verifiable Credentials

## Build and Running instructions

### Replace the Firebase.js file:
Create a Firebase project 'gaiax-ssi' and get the configuration file from `project settings -> general -> add App`

Create a .env file with the following fields:

```
ISSUER_PRIVATE_KEY=
ISSUER_PUBLIC_KEY=
```

Install Dependencies:
`npm install`

List of dependencies:
```
 "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^1.0.8",
    "@tsconfig/svelte": "^3.0.0",
    "autoprefixer": "^10.4.13",
    "svelte": "^3.50.1",
    "svelte-check": "^2.9.1",
    "svelte-preprocess": "^4.10.7",
    "tailwindcss": "^3.2.4",
    "tslib": "^2.4.0",
    "typescript": "^4.8.4",
    "vite": "^3.1.4"
  },
  "dependencies": {
    "@airgap/beacon-sdk": "^3.3.2",
    "@spruceid/didkit-wasm": "^0.2.1",
    "@spruceid/didkit-wasm-node": "^0.2.1",
    "@taquito/beacon-wallet": "^15.1.0",
    "@taquito/signer": "^15.1.0",
    "@taquito/taquito": "^15.1.0",
    "@taquito/tzip16": "^15.1.0",
    "@taquito/utils": "^15.1.0",
    "buffer": "^6.0.3",
    "events": "^3.3.0",
    "firebase": "^9.17.1",
    "svelte-navigator": "^3.2.2",
    "uuid": "^9.0.0",
    "vite-compatible-readable-stream": "^3.6.1",
    "vite-plugin-wasm": "^3.1.1"
  }
```

Start the application:
`npm run dev`

Usage:
- Connect Tezos by clicking on "Connect Wallet" on homescreen.
- apply for Coonpany/Employee Credentials
- Go to route '/admin' to see the list of applications. You can Approve/Reject.
- After approving, the subject can download the VC after logging in.

## Firebase Tables
- **Admins**: List of tezos addresses with admin rights.
- **CompanyCredentials**: Stores the application for a company credentials and updates the status when it is approved/rejected.
- **CompanyVC**: Stores the Verifiable Credential after it is approved by the admin.
- **EmployeeCredentials**: Stores the application for a employee credentials and updates the status when it is approved/rejected.
- **EmployeeVC**: Stores the Verifiable Credential for an employee after it is approved by the company.


