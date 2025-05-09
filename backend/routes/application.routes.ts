import express from "express";
import { ApplicationController } from "../controllers/application.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleware);

router.get("/applicant/:pkh", ApplicationController.getByApplicant);
router.get("/issuer/:pkh", ApplicationController.getByIssuer);
router.post("/", ApplicationController.create);
router.put("/:id", ApplicationController.update);

export default router;
