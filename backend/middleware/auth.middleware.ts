import { NextFunction, Request, Response } from "express";
import { importJWK, jwtVerify } from "jose";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET as string;
    const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
    const { payload } = await jwtVerify(token, jwk);

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
