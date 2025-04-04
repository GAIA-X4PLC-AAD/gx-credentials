import express from "express";
import passport from "passport";
import { generateChallenge } from "../lib/challenge";
const router = express.Router();

router.get("/challenge", (_req, res) => {
  const challenge = generateChallenge();
  res.status(200).json({ challenge });
});

router.post("/login", passport.authenticate("custom", {}), (_req, res) => {
  res.status(200).json({ message: "Login successful" });
});

router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401);
  }
});

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "logged out" });
  });
});

export default router;
