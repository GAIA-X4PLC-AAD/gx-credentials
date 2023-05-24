This project provides a proof of concept for a Gaia-X identity provider. It can roll out Self-Sovereign Identities to represent companies and employees. The operator of this application hosts it as a trust anchor to enable identity managment among a dataspace or consortium. The operator only directly certifies company identities. This application supports companies in employee credential issuance, but that could always be done fully inside each company with custom software.

## Stakeholders



## User Stories




## Development Setup

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

Install a tunneling tool like [ngrok](https://ngrok.com). You will need it to easily use a smartphone wallet with the application or to demo the application to someone outside your local network.

Install a wallet software that supports the Beacon protocol. For the best experience, we currently recomment using [Altme](https://altme.io). Be aware that you can choose a wallet that is not SSI compatible. Then you are excluded from any functionality using Verifiable Credentials.

A Firebase Firestore is used to provide traditional database storage. It needs the following (initially empty) collections:
- CompanyApplications
- EmployeeApplications
- TrustedIssuerCredentials

This project uses the Tezos blockchain to provide secure timestamped consensus on valid issuers and certificate status. The registry smart contract in the ```contracts``` folder needs to be deployed on your preferred testnet. For quick delpoyment, you could use the online IDE [here](https://ide.ligolang.org/local).

We recommend using [VS Code](https://code.visualstudio.com) with [DevContainers](https://code.visualstudio.com/docs/devcontainers/containers). This project comes with configuration that ensures your Node.js environment container is setup properly. This requires [Docker](https://www.docker.com) to be installed and running. If opening the project does not immediately launch the container, execute the command "Reopen in Container".

An environment file ```.env``` of the following form is required:
```
NEXTAUTH_SECRET=somereallysecretsecret
JWT_SECRET=itshouldbealsoverysecret
NEXTAUTH_URL=http://localhost:3000

FIREBASE_API_KEY=yourAPIkey
FIREBASE_MESSAGING_SENDER_ID=yourSenderID
FIREBASE_APP_ID=yourAppID

TEZOS_RPC_URL=linkToPreferredNode
TEZOS_REGISTRY_CONTRACT=deployedContract

GLOBAL_SERVER_URL=yourTunnelURL
```

Initialize dependencies by executing:
```bash
npm install
```

### Starting the Development Server

First, run the tunnel to get a globally accessible URL for the development server:

```bash
ngrok http 3000
```

In the environment file ```.env``` make sure that the ```GLOBAL_SERVER_URL``` corresponds to your current tunnel URL.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

