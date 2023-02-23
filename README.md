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


