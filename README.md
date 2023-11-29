# GX Credentials

**Disclaimer: This repository is in active development and not production software.**

This application explores an approach for issuing Verifiable Credentials to companies and their employees in a Gaia-X ecosystem. Employees could then use these credentials to authenticate with different services in the ecosystem.

The operator of this web application hosts it as a trust anchor to enable identity management among a dataspace or consortium. The operator only directly certifies company identities. This application supports companies in employee credential issuance, but that could be done entirely inside each company with custom software.

## Architecture Components

| Component               | Generic Role       | Explanation                                                                                                    |
| ----------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Next.js App             | Frontend & Backend | Website provides a user interface with a backend for session management and authenticated database operations. |
| Firestore               | Database           | Stores applications for credentials and the credentials themselves.                                            |
| Registry Smart Contract | Smart Contract     | Securely administrates issuer keys for the trust anchor. Logs credential issuance and enables revocation.      |

## User Stories

### Stakeholders

| Role                    | Explanation                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Operator & Trust Anchor | Operates this web application and functions as a trusted entity within an ecosystem.                               |
| Company                 | Companies apply to be certified by the trust anchor. If accepted, they receive a company credential.               |
| Employee                | Employees work at certified companies and can receive employee credentials from their company through the web app. |

### A Company Obtains a Company Credential

**Company** starts by applying for consortium membership:

1. **Company** sets up a wallet app and generates a DID
2. **Company** navigates to the website and uses their smartphone wallet app to log in
3. **Company** fills in a company application form on the website
4. **Company** logs out

**Trust Anchor** issues a company credential:

1. **Trust Anchor** has a wallet and key that is registered in the smart contract
2. **Trust Anchor** navigates to the website and uses a wallet to log in
3. **Trust Anchor** reviews list of new company applications and sees **Company**'s application
4. **Trust Anchor** contacts **Company** out of band to confirm suitability for membership, identity, and intent
5. **Trust Anchor** clicks the corresponding button on the website to approve credential issuance for the application
6. **Trust Anchor** reviews new signing request for the company credential on his wallet and confirms
7. **Trust Anchor** reviews new transaction request to log the company credential issuance to the blockchain and confirms
8. **Trust Anchor** sees confirmation of issuance on the website and logs out

**Company** returns to receive credential:

1. **Company** navigates to the website and uses their wallet to log in
2. **Company** sees their credential was issued and clicks to take out the credential via Beacon protocol
3. **Company** accepts the new signing request on the wallet to initiate the exchange
4. **Company** is shown a generic preview of the company credential on their wallet and accepts to continue
5. **Company** is prompted by the wallet to choose their Account Ownership Credential (native to Altme wallet) to authenticate with
6. **Company** sees the company credential in the wallet
7. **Company** logs out

### An Employee Obtains an Employee Credential

This use case parallels the previous one. Now, an **Employee** applies through the website. The **Company** issues him a credential, which he can download.

## Limitations, Warnings, and Considerations

This software is experimental and in active development. It is currently not suited to any form of production use.

### Database

For ease of development and coordination within development teams, this project currently uses a Firebase Cloud Firestore. In the default configuration, this cloud database is fully public to anyone possessing the URL. Thus, this web app's application and credential data would be publicly accessible.

Employee credentials could be deleted from the database after the employee has received them. However, that is different from the current behavior of the web app.

Company credentials must be accessible to be used as a trusted issuer list by future credential verifier software. This should probably happen through an unauthenticated API endpoint in the Next.js app. It still needs to be implemented.

### Data Fields

The data fields used for application forms and subsequent credential creation are just placeholder data. It needs to be finalized at a later point.

### Verifiable Credential Issuance

We use [didkit](https://github.com/spruceid/didkit) for credential issuance and verification. Almost all other libraries facilitating the issuance of credentials assume that the issuer's private key can be directly loaded by the issuing software. That philosophy is incompatible with GX Credentials. No key material should leave a user's wallet device.

There still seems to be a security(?) issue with didkit resolving external VC contexts. It leads to issuance processes for credentials with external contexts failing. Currently, GX Credentials issues simplified Gaia-X Participant credentials where the context is commented out.

It should also be noted that GX Credentials currently has no error recovery. This primarily affects the two-step issuance process. If a credential is successfully signed but logging the issuance on the smart contract fails, the system cannot automatically recover from this state.

Additionally, signing a credential will always tell the user it failed on the wallet app, even though it succeeded. The web app will show it correctly.

### Verifiable Credential Download

While downloading a raw credential file is supported, downloading via Beacon Protocol into [Altme Wallet](https://github.com/TalaoDAO/AltMe) is preferred. The download process still needs improvement to be more convenient for the user because the user needs to authenticate with the credential API endpoint separately. This creates friction as the user is struggling to choose the correct key for this credential. It also means that GX Credentials must show the wallet a generic placeholder preview to avoid leaking data to unauthenticated users.

### Verifiable Credential Revocation

While revocation is currently supported, revoking company credentials does not explicitly flag all corresponding employee credentials as revoked. However, this might be desired behavior for the future.

### User Roles

To dynamically route users through the web app's pages, they are automatically assigned a role according to their actions. For simplicity's sake, this system assumes that one user, i.e., one key, only has one role. This also currently limits a company or an employee to exactly one credential application.

## Development Setup

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

Install a tunneling tool like [ngrok](https://ngrok.com). You will need it to easily use a smartphone wallet with the application or to demo the application to someone outside your local network.

Install a wallet software that supports the Beacon protocol. For the best experience, we currently recomment using [Altme](https://altme.io). Be aware that you can choose a wallet that is not SSI compatible. Then you are excluded from any functionality using Verifiable Credentials.

This project uses the Tezos blockchain to provide secure timestamped consensus on valid issuers and certificate status. The registry smart contract in the `contracts` folder needs to be deployed on your preferred testnet. For quick delpoyment, you could use the online IDE [here](https://ide.ligolang.org/local).

We recommend using [VS Code](https://code.visualstudio.com) with [DevContainers](https://code.visualstudio.com/docs/devcontainers/containers). This project comes with configuration that ensures your Node.js environment container is setup properly. This requires [Docker](https://www.docker.com) to be installed and running. If opening the project does not immediately launch the container, execute the command "Reopen in Container".

An environment file `.env` of the following form is required:

```
NEXTAUTH_SECRET=somereallysecretsecret
JWT_SECRET=itshouldbealsoverysecret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_MY_NAMESPACE=yourNamespaceForUUIDs (eg - 1b671a64-40d5-491e-99b0-da01ff1f3341)

MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=gx-credentials

NEXT_PUBLIC_TEZOS_RPC_URL=linkToPreferredNode
NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT=deployedContract

GLOBAL_SERVER_URL=yourTunnelURL (ngrok url)
MONGODB_URI=mongodb://admin:password123@mongo:27017?retryWrites=true&w=majority

```

### Starting the Development Server

First, run the tunnel to get a globally accessible URL for the development server (this url is valid for 60 mins):

```bash
ngrok http 3000
```

Then, run the docker-compose file to start the development server:

```bash
GLOBAL_SERVER_URL="ngrok url" docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Local development with hot reloading in Docker container

If you want to develop locally with hot reloading, you can uncomment the below lines in the docker-compose.yml file:

```bash
    develop:
      watch:
        - action: sync
          path: ./
          target: /app
          ignore:
            - node_modules/
        - action: rebuild
          path: package.json
```

Then run the following command (Assuming you have already built the image using `docker-compose build`):

`docker-compose watch`
