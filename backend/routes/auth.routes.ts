import express from "express";
import passport from "passport";
import { generateChallenge, payloadBytesFromString } from "../lib/challenge";
const router = express.Router();

router.get("/challenge", (_req, res) => {
  const challenge = generateChallenge();
  const encodedChallenge = payloadBytesFromString(challenge);
  res.status(200).json({ challenge, encodedChallenge });
});

router.post("/login", passport.authenticate("custom", {}), (_req, res) => {
  res.status(200).json({ message: "Login successful" });
});

export default router;
