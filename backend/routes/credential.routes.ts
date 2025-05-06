import express from "express";
import { CredentialController } from "../controllers/credential.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleware);

router.post("/", CredentialController.create);
router.get("/:id", CredentialController.get);
router.get("/all/companies", CredentialController.getAllCompanies);
router.get("/holder/:pkh", CredentialController.getByHolder);
router.put("/:id", CredentialController.update);

export default router;
