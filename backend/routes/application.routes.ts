import express from "express";
import { ApplicationController } from "../controllers/application.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleware);

router.get("/", ApplicationController.getAll);
router.get("/:pkh", ApplicationController.getByPkh);
router.post("/", ApplicationController.create);
router.put("/:id", ApplicationController.update);
router.delete("/:id", ApplicationController.delete);

export default router;
