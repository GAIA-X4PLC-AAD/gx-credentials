import express from "express";
const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).send("GX Credentials API Server");
});

export default router;
