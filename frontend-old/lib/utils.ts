import { clsx, type ClassValue } from "clsx";
import { JWTPayload, SignJWT, importJWK } from "jose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenHash = (hash: string): string =>
  hash ? hash.slice(0, 5) + "..." + hash.slice(-5) : "";

export const formatTokenAmount = (
  amount: number,
  decimals?: number,
): number => {
  if (decimals) {
    return amount ? +amount.toFixed(decimals) / 1 : 0;
  } else {
    return amount ? +amount.toFixed(5) / 1 : 0;
  }
};

export const capitalize = (s: string): string => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Generates a JWT for the separate backend.
 */
export const generateJWT = async (payload?: JWTPayload) => {
  const secret = process.env.NEXTAUTH_SECRET;
  const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(jwk);

  return jwt;
};
