import express from "express";
import { CredentialController } from "../controllers/credential.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleware);

router.post("/", CredentialController.create);
router.get("/", CredentialController.getAll);
router.get("/:pkh", CredentialController.getByPkh);
router.put("/:id", CredentialController.update);
router.delete("/:id", CredentialController.delete);

export default router;
