import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = null;

  // Option 1: Get from cookie
  if (req.cookies["authjs.session-token"]) {
    token = req.cookies["authjs.session-token"];
  }

  // Option 2: Get from Authorization header (often needed for API calls)
  //   const authHeader = req.headers.authorization;
  //   if (authHeader && authHeader.startsWith("Bearer ")) {
  //     token = authHeader.substring(7);
  //   }

  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token using the same secret as NextAuth
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string
    ) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
