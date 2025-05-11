# GX Credentials

![build workflow](https://github.com/GAIA-X4PLC-AAD/gx-credentials/actions/workflows/node.js.yml/badge.svg)

This application explores an approach for issuing Verifiable Credentials to companies and their employees in a Gaia-X ecosystem. Employees could then use these credentials to authenticate with different services in the ecosystem. A key feature is that the signature process necessary for issuance is done on personal devices of administrative staff. That way, no keys are ever in the system.

The operator of this web application hosts it as a trust anchor to enable identity management among a dataspace or consortium. The operator only directly certifies company identities. This application supports companies in employee credential issuance, but that could be done entirely inside each company with custom software.

## Architecture Components

| Component               | Generic Role   | Explanation                                                                                             |
| ----------------------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| React Website           | Frontend       | Website provides a basic user interface.                                                                |
| Express API Server      | Backend        | Provides an API for authentication and database operations. Also supports OID4VCI to issue credentials. |
| MongoDB                 | Database       | Stores applications for credentials and the credentials themselves.                                     |
| Registry Smart Contract | Smart Contract | Securely administrates issuer keys for the trust anchor.                                                |

<!-- prettier-ignore -->
> [!NOTE]
> The backend is designed to be as versatile as possible.
> While most organizations will want to build a custom frontend,
> the intention is to have them develop and maintain the backend collaboratively.

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
7. **Trust Anchor** reviews new transaction request to log the company credential issuance to the blockchain (as a trusted issuer directory for employee credentials) and confirms
8. **Trust Anchor** sees confirmation of issuance on the website and logs out

**Company** returns to receive credential:

1. **Company** navigates to the website and uses their wallet to log in
2. **Company** sees their credential was issued and clicks to take out the credential via OID4VCI protocol
3. **Company** scans the QR code and confirms the credential preview on the wallet
4. **Company** has the company credential in the wallet
5. **Company** logs out

### An Employee Obtains an Employee Credential

This use case parallels the previous one. Now, an **Employee** applies through the website. The **Company** issues him a credential, which he can download.

## Limitations, Warnings, and Considerations

This software is experimental. Anyone attempting to use it in production should have good technical understanding and be willing to open issues and PRs if necessary.

### Data Fields

The data fields used for application forms and subsequent credential creation are just placeholder data. Since they are written to the database as JSON, frontends can just choose different ones (except for `name`).

### Verifiable Credential Format

The verifiable credential format used is `jwt`, more specifically `jwt_vc_json`, but `jwt_vc_json-ld` should be possible with no changes (assuming the JSON-LD does not need to be validated). The frontend dictates how the application data is transformed into a credential, keeping the backend generic.

### Verifiable Credential Revocation

This version has no built-in revocation mechanism.

### Role Restrictions

The API enforces a maximum of one company credential per public key. Registrars are not allowed to have companies on the same key.

### Gaia-X Compatibility

Currently, the issued credentials are not compatible with the Gaia-X Digital Clearing House, because that demands a signature performed with a `did:web`.

## Development Setup

Since the project consists of two different subprojects, using docker for development is easiest.

### Prerequisites

Install a tunneling tool like [ngrok](https://ngrok.com). You will need it to easily use a smartphone wallet with the application or to demo the application to someone outside your local network.

Install a wallet software that supports Tezos and the Beacon protocol. For the best experience, we currently recommend using [Altme](https://altme.io). Be aware that you can choose a wallet that is not an SSI wallet here.

Install an SSI wallet software that supports the OID4VCI protocol, if your previous wallet choice does not support it already.

This project uses the Tezos blockchain to provide secure timestamped consensus on valid issuers. The registry smart contract in the `tezos` directory needs to be deployed on your preferred testnet. For quick deployment, refer to the `README.md` file in the same directory.

An environment file `.env` is required. Copy `.env.example` and fill it in according to the comments.

### Starting the Development Server

First, run the tunnel to get a globally accessible URL for the development server:

```bash
ngrok http 8080
```

Enter the resulting URL into the `.env` file where stated.

Then, run the docker-compose file to start the development server:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you would like to use hot-reloading, press `w` in the running docker compose process to activate watch mode. Or run it with the corresponding argument initially (assuming you already built using `docker compose build`):

`docker compose watch`
