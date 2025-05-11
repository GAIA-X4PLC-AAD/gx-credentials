import express from "express";
import { TakeoutController } from "../controllers/takeout.controller";

const router = express.Router();

router.get(
  "/:id/.well-known/openid-credential-issuer",
  TakeoutController.wellKnownIssuer
);
router.get(
  "/:id/.well-known/oauth-authorization-server",
  TakeoutController.authorization
);
router.post("/:id/token", TakeoutController.token);
router.post("/:id/credential", TakeoutController.download);

export default router;
